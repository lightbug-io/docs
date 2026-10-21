import { measurePdfTableRow, setPdfTableFont } from './PdfTableLayout'

class FakePdfDocument {
  fontSize = 12
  fontStyle = 'normal'

  setFontSize(size: number) {
    this.fontSize = size
  }

  setFont(_fontName: string, style: string) {
    this.fontStyle = style
  }

  getLineHeight() {
    return this.fontSize * 1.2
  }

  getTextWidth(text: string) {
    const weight = this.fontStyle === 'bold' ? 1.12 : 1
    return text.length * this.fontSize * 0.25 * weight
  }

  splitTextToSize(text: string, maxWidth: number) {
    const words = text.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let line = ''
    words.forEach(word => {
      const candidate = line ? `${line} ${word}` : word
      if (line && this.getTextWidth(candidate) > maxWidth) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    })
    if (line) lines.push(line)
    return lines
  }
}

describe('PDF table row layout', () => {
  it('measures wrapped labels in bold and values in normal table text', () => {
    const doc = new FakePdfDocument()
    const longValue = [{ text: 'A detailed specification value with several words that wraps within its cell.' }]

    const layout = measurePdfTableRow(doc, 'Module Size And Mass', longValue, 50, 65, 9, 2)

    expect(layout.labelLines.length).toBeGreaterThan(1)
    expect(layout.valueLines.length).toBeGreaterThan(1)
    expect(doc.fontSize).toBe(9)
    expect(doc.fontStyle).toBe('normal')
    expect(layout.rowHeight).toBe(
      Math.max(layout.labelLines.length, layout.valueLines.length) * layout.lineHeight + 4
    )
  })

  it('restores table sizing after a continued section heading before measuring its first row', () => {
    const doc = new FakePdfDocument()
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')

    setPdfTableFont(doc, 9)
    const layout = measurePdfTableRow(doc, 'Maximum Output Power', [{ text: 'Up to 22 dBm sub-GHz.' }], 46, 126, 9, 2)

    expect(doc.fontSize).toBe(9)
    expect(doc.fontStyle).toBe('normal')
    expect(layout.lineHeight).toBeCloseTo(9 * 1.2 * 0.352778)
    expect(layout.rowHeight).toBeGreaterThan(layout.lineHeight + 4)
  })
})
