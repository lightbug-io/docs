import { readFileSync } from 'fs'
import { resolve } from 'path'
import { layoutPdfText, pdfImageWidth } from './PdfLayout'

function setup() {
    const source = readFileSync(resolve(__dirname, '../components/DownloadPdfButton.vue'), 'utf8')
        .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
    return new Function('ref', 'withBase', 'layoutPdfText', 'pdfImageWidth', 'defineProps', source + '\nreturn {loadScript, downloadPdf, isDownloading, downloadError, savePdfBlob, renderTextWithLinks, configureStandardFonts};')(
        (value: unknown) => ({ value }), (value: string) => value, layoutPdfText, pdfImageWidth, () => ({ getPdfData: () => null })
    )
}

describe('PDF resources', () => {
    beforeEach(() => { document.head.innerHTML = ''; delete (window as any).jspdf })
    test('shares in-flight requests across component instances and completed requests', async () => {
        const one = setup(); const two = setup()
        const first = one.loadScript('/test-library.js')
        expect(two.loadScript('/test-library.js')).toBe(first)
        expect(document.head.querySelectorAll('script')).toHaveLength(1)
        document.head.querySelector('script')!.dispatchEvent(new Event('load'))
        await first
        await two.loadScript('/test-library.js')
    })
    test('removes failed resources so a later click can retry', async () => {
        const button = setup()
        const first = button.loadScript('/test-library.js')
        document.head.querySelector('script')!.dispatchEvent(new Event('error'))
        await expect(first).rejects.toThrow('Unable to load PDF resource')
        expect(document.head.querySelector('script')).toBeNull()
        const second = button.loadScript('/test-library.js')
        document.head.querySelector('script')!.dispatchEvent(new Event('load'))
        await second
    })
    test('reuses already registered resources from earlier navigation', async () => {
        ;(window as any).jspdf = { jsPDF: {} }
        document.head.innerHTML = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>'
        const button = setup()
        await button.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        expect(document.head.querySelectorAll('script')).toHaveLength(1)
    })
    test('downloads a named file without opening a popup and releases its URL', () => {
        jest.useFakeTimers()
        URL.createObjectURL = jest.fn(() => 'blob:test-pdf')
        URL.revokeObjectURL = jest.fn()
        const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
            expect(this.download).toBe('Lightbug-Pro-PR3-specification.pdf')
            expect(this.href).toBe('blob:test-pdf')
            expect(document.body.contains(this)).toBe(true)
        })
        setup().savePdfBlob(new Blob(), 'Pro (PR3)')
        expect(click).toHaveBeenCalledTimes(1)
        expect(document.querySelector('a[download]')).toBeNull()
        jest.runAllTimers()
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-pdf')
        click.mockRestore()
        jest.useRealTimers()
    })
    test('renders unsupported standard-font characters without losing their Unicode or links', () => {
        let font = { fontName: 'helvetica', fontStyle: 'bold' }
        const drawn: { text: string; font: string }[] = []
        const draw = (text: string) => { drawn.push({ text, font: font.fontName }) }
        const doc = {
            getFont: () => font,
            setFont: (fontName: string, fontStyle: string) => { font = { fontName, fontStyle } },
            getTextWidth: (text: string) => text.length, getLineHeight: () => 10,
            text: jest.fn(draw), textWithLink: jest.fn(draw), internal: { write: jest.fn() },
        }
        setup().renderTextWithLinks(doc, '<a href="https://example.com/spec">Φ 65.0*18.0</a><br>Wi‑Fi 6, μs', 10, 20, 180)
        const writes = doc.internal.write.mock.calls.map(([value]) => value)
        expect(writes).toEqual([
            '/Span << /ActualText <FEFF03a6> >> BDC', 'EMC',
            '/Span << /ActualText <FEFF2011> >> BDC', 'EMC',
            '/Span << /ActualText <FEFF03bc> >> BDC', 'EMC',
        ])
        expect(doc.textWithLink).toHaveBeenCalledWith('F', 10, 20, { url: 'https://example.com/spec' })
        expect(drawn).toEqual(expect.arrayContaining([
            { text: 'F', font: 'symbol' }, { text: 'm', font: 'symbol' },
            { text: '-', font: 'helvetica' }, { text: 'Wi', font: 'helvetica' },
        ]))
        expect(font).toEqual({ fontName: 'helvetica', fontStyle: 'bold' })
    })
    test('supplies missing Symbol advances for both layout and link measurement', () => {
        const widths: Record<string, number> = { fof: 100 }
        const doc = { getFont: () => ({ metadata: { Unicode: { widths } } }), setFont: jest.fn() }
        setup().configureStandardFonts(doc)
        expect(widths[0x46]).toBeCloseTo(76.3)
        expect(widths[0x6d]).toBeCloseTo(57.6)
        expect(doc.setFont).toHaveBeenLastCalledWith('helvetica', 'normal')
    })
    test('ignores repeat clicks in flight and resets state after a resource failure', async () => {
        const button = setup()
        const error = jest.spyOn(console, 'error').mockImplementation(() => {})
        const first = button.downloadPdf()
        expect(button.isDownloading.value).toBe(true)
        const script = document.head.querySelector('script')!
        expect(script.integrity).toBe('sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfcEqDTTHgtNA==')
        expect(script.crossOrigin).toBe('anonymous')
        expect(script.referrerPolicy).toBe('no-referrer')
        await button.downloadPdf()
        expect(document.head.querySelectorAll('script')).toHaveLength(1)
        document.head.querySelector('script')!.dispatchEvent(new Event('error'))
        await first
        expect(button.isDownloading.value).toBe(false)
        expect(button.downloadError.value).toContain('Please try again')
        error.mockRestore()
    })
})
