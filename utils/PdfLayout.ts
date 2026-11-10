import { parseHtmlForPdfLinks, PdfTextSegment } from './PdfText'

type TextMetrics = {
    getTextWidth(text: string): number
    getLineHeight(): number
    getFont(): { fontName: string; fontStyle: string }
    setFont(name: string, style: string): unknown
}
export type PdfTextRun = { text: string; x: number; url?: string; pdfText?: string; font?: 'symbol' }

// Standard PDF fonts use legacy encodings. Keep the original Unicode text
// separately so the renderer can preserve it with PDF's ActualText metadata.
const specialCharacters = new Map<string, { pdfText: string; font?: 'symbol' }>([
    ['Φ', { pdfText: 'F', font: 'symbol' }],
    ['μ', { pdfText: 'm', font: 'symbol' }],
    ['‑', { pdfText: '-' }],
])
const splitCharacters = (text: string) => text.split(/([Φμ‑])/).filter(Boolean)

/** Measure the exact runs that will be drawn, retaining HTML line breaks and link destinations. */
export function layoutPdfText(doc: TextMetrics, value: unknown, maxWidth: number) {
    const lines: PdfTextRun[][] = [[]]
    let x = 0
    const newline = () => { lines.push([]); x = 0 }
    const width = (text: string): number => splitCharacters(text).reduce((total, part) => {
        const replacement = specialCharacters.get(part)
        if (!replacement) return total + doc.getTextWidth(part)
        const font = doc.getFont()
        if (replacement.font) doc.setFont(replacement.font, 'normal')
        const result = doc.getTextWidth(replacement.pdfText)
        if (replacement.font) doc.setFont(font.fontName, font.fontStyle)
        return total + result
    }, 0)
    for (const segment of parseHtmlForPdfLinks(value)) {
        for (const token of segment.text.split(/(\n|[^\S\n]+|[^\s]+)/).filter(Boolean)) {
            if (token === '\n') { newline(); continue }
            const space = /^\s+$/.test(token)
            const text = space ? ' ' : token
            if (space && x === 0) continue
            if (x + width(text) > maxWidth && x > 0) newline()
            if (space && x === 0) continue
            // Long URLs cannot be wrapped only at spaces.
            let chunk = ''
            for (const char of text) {
                if (x + width(chunk + char) > maxWidth && chunk) {
                    addRun(chunk, segment)
                    newline()
                    chunk = ''
                }
                chunk += char
            }
            if (chunk) addRun(chunk, segment)
        }
    }
    function addRun(text: string, segment: PdfTextSegment) {
        for (const part of splitCharacters(text)) {
            lines[lines.length - 1].push({ text: part, x,
                ...specialCharacters.get(part),
                ...(segment.isLink ? { url: segment.url } : {}),
            })
            x += width(part)
        }
    }
    const lineHeight = doc.getLineHeight() * 0.352778
    return { lines, lineHeight, height: lines.length * lineHeight }
}

export function pdfImageWidth(count: number, pageWidth: number, margin = 10, spacing = 5) {
    return count > 0 ? Math.min(50, (pageWidth - 2 * margin - (count - 1) * spacing) / count) : 0
}
