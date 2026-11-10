import { parseHtmlForPdfLinks, PdfTextSegment } from './PdfText'

type TextMetrics = { getTextWidth(text: string): number; getLineHeight(): number }
export type PdfTextRun = { text: string; x: number; url?: string }

/** Measure the exact runs that will be drawn, retaining HTML line breaks and link destinations. */
export function layoutPdfText(doc: TextMetrics, value: unknown, maxWidth: number) {
    const lines: PdfTextRun[][] = [[]]
    let x = 0
    const newline = () => { lines.push([]); x = 0 }
    for (const segment of parseHtmlForPdfLinks(value)) {
        for (const token of segment.text.split(/(\n|[^\S\n]+|[^\s]+)/).filter(Boolean)) {
            if (token === '\n') { newline(); continue }
            const space = /^\s+$/.test(token)
            const text = space ? ' ' : token
            if (space && x === 0) continue
            if (x + doc.getTextWidth(text) > maxWidth && x > 0) newline()
            if (space && x === 0) continue
            // Long URLs cannot be wrapped only at spaces.
            let chunk = ''
            for (const char of text) {
                if (x + doc.getTextWidth(chunk + char) > maxWidth && chunk) {
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
        lines[lines.length - 1].push({ text, x, ...(segment.isLink ? { url: segment.url } : {}) })
        x += doc.getTextWidth(text)
    }
    const lineHeight = doc.getLineHeight() * 0.352778
    return { lines, lineHeight, height: lines.length * lineHeight }
}

export function pdfImageWidth(count: number, pageWidth: number, margin = 10, spacing = 5) {
    return count > 0 ? Math.min(50, (pageWidth - 2 * margin - (count - 1) * spacing) / count) : 0
}
