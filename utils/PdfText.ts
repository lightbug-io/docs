/// <reference lib="dom" />

export type PdfTextSegment =
    | { text: string; isLink: false }
    | { text: string; isLink: true; url: string }

/** Convert an HTML fragment to text runs for jsPDF, without inserting it into the page. */
export function parseHtmlForPdfLinks(html: unknown): PdfTextSegment[] {
    if (typeof html !== 'string' || !html) {
        return [{ text: String(html ?? ''), isLink: false }]
    }

    // Template contents stay detached and inert, including images and embedded documents.
    // Decode entities during parsing only. The resulting text is not HTML to parse again.
    const template = document.createElement('template')
    template.innerHTML = html
    const segments: PdfTextSegment[] = []

    function visit(node: Node, output: PdfTextSegment[]) {
        if (node.nodeType === Node.TEXT_NODE) {
            appendText(output, node.textContent || '')
            return
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return

        const element = node as Element
        const tag = element.localName.toLowerCase()
        if (tag === 'script' || tag === 'style' || tag === 'template') return
        if (tag === 'br') {
            appendText(output, '\n')
            return
        }

        const href = tag === 'a' ? element.getAttribute('href') : null
        if (href !== null) {
            const label: PdfTextSegment[] = []
            element.childNodes.forEach(child => visit(child, label))
            output.push({ text: label.map(segment => segment.text).join(''), isLink: true, url: href })
        } else {
            element.childNodes.forEach(child => visit(child, output))
        }
    }

    template.content.childNodes.forEach(node => visit(node, segments))
    return segments.length ? segments : [{ text: '', isLink: false }]
}

function appendText(segments: PdfTextSegment[], text: string) {
    if (!text) return
    const previous = segments[segments.length - 1]
    if (previous && !previous.isLink) {
        previous.text += text
    } else {
        segments.push({ text, isLink: false })
    }
}

/** Return the same text with link destinations included for PDF text measurement. */
export function htmlAnchorsToPlainText(html: unknown): string {
    return parseHtmlForPdfLinks(html)
        .map(segment => segment.isLink ? `${segment.text} (${segment.url})` : segment.text)
        .join('')
}
