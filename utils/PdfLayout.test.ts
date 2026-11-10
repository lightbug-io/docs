import { layoutPdfText, pdfImageWidth } from './PdfLayout'
const doc = { getTextWidth: (text: string) => text.length, getLineHeight: () => 10 }
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
    test('four Pro3 images fit inside A4 margins; older three-image layouts stay unchanged', () => {
        expect(pdfImageWidth(4, 210) * 4 + 3 * 5).toBe(190)
        expect(pdfImageWidth(3, 210)).toBe(50)
    })
})
