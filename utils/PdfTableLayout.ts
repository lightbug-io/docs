export type PdfLinkTextSegment = {
  text: string
  isLink?: boolean
  url?: string
}

type PdfLayoutDocument = {
  setFontSize: (size: number) => void
  setFont: (fontName: string, fontStyle: string) => void
  getLineHeight: () => number
  getTextWidth: (text: string) => number
  splitTextToSize: (text: string, width: number) => string[]
}

export type PdfTableRowLayout = {
  labelLines: string[]
  valueLines: PdfLinkTextSegment[][]
  lineHeight: number
  rowHeight: number
}

/** Wrap value words using the same width checks used to place linked PDF text. */
export function wrapPdfTextWithLinks(
  doc: PdfLayoutDocument,
  segments: PdfLinkTextSegment[],
  maxWidth: number
): PdfLinkTextSegment[][] {
  const words = segments.flatMap(segment =>
    (segment.text || '').trim().split(/\s+/).filter(Boolean).map(text => ({ ...segment, text }))
  )
  const lines: PdfLinkTextSegment[][] = []
  let line: PdfLinkTextSegment[] = []
  let lineWidth = 0
  const spaceWidth = doc.getTextWidth(' ')

  words.forEach((word, index) => {
    const wordWidth = doc.getTextWidth(word.text)
    const nextSpaceWidth = index < words.length - 1 ? spaceWidth : 0
    if (lineWidth + wordWidth > maxWidth && line.length > 0) {
      lines.push(line)
      line = []
      lineWidth = 0
    }
    line.push(word)
    lineWidth += wordWidth + nextSpaceWidth
  })

  if (line.length) lines.push(line)
  return lines
}

/** Measure table rows with the exact font styles used to render their cells. */
export function measurePdfTableRow(
  doc: PdfLayoutDocument,
  label: string,
  valueSegments: PdfLinkTextSegment[],
  labelWidth: number,
  valueWidth: number,
  tableTextSize: number,
  cellPadding: number
): PdfTableRowLayout {
  doc.setFontSize(tableTextSize)
  doc.setFont('helvetica', 'bold')
  const labelLines = doc.splitTextToSize(`${label}:`, labelWidth)

  doc.setFont('helvetica', 'normal')
  const valueLines = wrapPdfTextWithLinks(doc, valueSegments, valueWidth)
  const lineHeight = doc.getLineHeight() * 0.352778
  const lineCount = Math.max(labelLines.length, valueLines.length)

  return {
    labelLines,
    valueLines,
    lineHeight,
    rowHeight: lineHeight * lineCount + 2 * cellPadding
  }
}

/** Restore the normal body font after a table heading has used the larger heading style. */
export function setPdfTableFont(doc: PdfLayoutDocument, tableTextSize: number): void {
  doc.setFontSize(tableTextSize)
  doc.setFont('helvetica', 'normal')
}
