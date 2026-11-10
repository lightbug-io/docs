import { layoutPdfText, pdfImageWidth } from './PdfLayout'
const doc = { getTextWidth: (text: string) => text.length, getLineHeight: () => 10,
    getFont: () => ({ fontName: 'helvetica', fontStyle: 'normal' }), setFont: jest.fn(),
}
const textLines = (value: unknown, width = 20) => layoutPdfText(doc, value, width).lines.map(line => line.map(run => run.text).join(''))

describe('PDF layout', () => {
    test('preserves explicit nested-spec line breaks and single spaces', () => {
        expect(textLines('Voltage: 3.7<br>Capacity: 6600')).toEqual(['Voltage: 3.7', 'Capacity: 6600'])
        expect(textLines('one two three')).toEqual(['one two three'])
    })
    test('measures displayed labels without adding hidden link URLs', () => {
        const result = layoutPdfText(doc, '<a href="https://example.com/long/path">GNSS</a> module', 20)
        expect(result.lines).toHaveLength(1)
        expect(result.lines[0][0]).toEqual({ text: 'GNSS', x: 0, url: 'https://example.com/long/path' })
        expect(result.height).toBeCloseTo(3.52778)
    })
    test('wraps long URLs within the value column and retains click targets', () => {
        const url = 'https://example.com/averylongpath'
        const result = layoutPdfText(doc, `<a href="${url}">${url}</a>`, 12)
        expect(result.lines.length).toBeGreaterThan(1)
        expect(result.lines.every(line => line.every(run => run.x + run.text.length <= 12 && run.url === url))).toBe(true)
        expect(result.lines.flat().map(run => run.text).join('')).toBe(url)
    })
    test('supports scalar values from YAML and Unicode', () => {
        expect(textLines(3)).toEqual(['3'])
        expect(textLines(false)).toEqual(['false'])
        expect(textLines('±2g, 78.8°C')).toEqual(['±2g, 78.8°C'])
    })
    test('preserves PR3 symbols, measures the Symbol fallback and restores the text font', () => {
        let font = { fontName: 'helvetica', fontStyle: 'bold' }
        const metrics = { ...doc,
            getFont: () => font,
            setFont: (fontName: string, fontStyle: string) => { font = { fontName, fontStyle } },
            getTextWidth: (text: string) => text.length * (font.fontName === 'symbol' ? 2 : 1),
        }
        const result = layoutPdfText(metrics, '<a href="/spec">Φ 65.0*18.0</a><br>Wi‑Fi 6, 1μs', 20)
        expect(result.lines[0][0]).toEqual({ text: 'Φ', pdfText: 'F', font: 'symbol', x: 0, url: '/spec' })
        expect(result.lines[0][1].x).toBe(2)
        expect(result.lines[1].map(run => run.text).join('')).toBe('Wi‑Fi 6, 1μs')
        expect(result.lines[1]).toContainEqual(expect.objectContaining({ text: '‑', pdfText: '-' }))
        expect(result.lines[1]).toContainEqual(expect.objectContaining({ text: 'μ', pdfText: 'm', font: 'symbol' }))
        expect(font).toEqual({ fontName: 'helvetica', fontStyle: 'bold' })
    })
    test('four Pro3 images fit inside A4 margins; older three-image layouts stay unchanged', () => {
        expect(pdfImageWidth(4, 210) * 4 + 3 * 5).toBe(190)
        expect(pdfImageWidth(3, 210)).toBe(50)
    })
})
