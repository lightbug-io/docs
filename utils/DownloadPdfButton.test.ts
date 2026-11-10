import { readFileSync } from 'fs'
import { resolve } from 'path'
import { layoutPdfText, pdfImageWidth } from './PdfLayout'

function setup() {
    const source = readFileSync(resolve(__dirname, '../components/DownloadPdfButton.vue'), 'utf8')
        .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
    return new Function('ref', 'withBase', 'layoutPdfText', 'pdfImageWidth', 'defineProps', source + '\nreturn {loadScript, downloadPdf, isDownloading, downloadError, savePdfBlob};')(
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
        ;(window as any).jspdf = { jsPDF: { API: { lightbugSpecFontsLoaded: true } } }
        document.head.innerHTML = '<script src="/fonts/Lightbug-Spec.js"></script>'
        const button = setup()
        await button.loadScript('/fonts/Lightbug-Spec.js')
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
    test('registers static regular and bold fonts once', () => {
        const api = { events: [] as any[], lightbugSpecFontsLoaded: false }
        ;(window as any).jspdf = { jsPDF: { API: api } }
        const register = new Function(readFileSync(resolve(__dirname, '../public/fonts/Lightbug-Spec.js'), 'utf8'))
        register(); register()
        expect(api.events).toHaveLength(2)
        const doc = { addFileToVFS: jest.fn(), addFont: jest.fn() }
        api.events.forEach(([, callback]) => callback.call(doc))
        expect(doc.addFont.mock.calls.map(call => call.slice(1))).toEqual([['Lightbug-Spec', 'normal'], ['Lightbug-Spec', 'bold']])
        expect(doc.addFileToVFS.mock.calls.every(call => call[1].length > 10000)).toBe(true)
    })
    test('ignores repeat clicks in flight and resets state after a resource failure', async () => {
        const button = setup()
        const error = jest.spyOn(console, 'error').mockImplementation(() => {})
        const first = button.downloadPdf()
        expect(button.isDownloading.value).toBe(true)
        await button.downloadPdf()
        expect(document.head.querySelectorAll('script')).toHaveLength(1)
        document.head.querySelector('script')!.dispatchEvent(new Event('error'))
        await first
        expect(button.isDownloading.value).toBe(false)
        expect(button.downloadError.value).toContain('Please try again')
        error.mockRestore()
    })
})
