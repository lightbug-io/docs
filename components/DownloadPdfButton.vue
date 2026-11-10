<template>
  <div class="pdf-btn-wrapper">
    <button @click="downloadPdf" class="pdf-download-btn" :disabled="isDownloading">{{ isDownloading ? 'Generating PDF…' : props.label }}</button>
    <span v-if="downloadError" role="alert">{{ downloadError }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { layoutPdfText, pdfImageWidth } from '../utils/PdfLayout'

let jsPDFLoaded = false;
const isDownloading = ref(false);
const downloadError = ref('');

// Text sizes
const titleSize = 20;
const sectionTitleSize = 12;
const tableTextSize = 8;
const textSize = 10;
const footerSize = 10;

const topMargin = 10;
const bottomMargin = 10;
const cellPadding = 2;
const rowHeight = 6;
const sectionSpacing = 4;

const orange = [252, 124, 61]; // #fc7c3d
const purple = [206, 0, 39];   // #ce0027

const headerBg = orange; // Use orange for main header background
const borderColor = [221, 221, 221]; // #ddd (keep for subtle borders)
const subsectionBg = [252, 232, 220]; // light orange tint for subsections

const props = defineProps({
  getPdfData: Function,
  label: {
    type: String,
    default: 'Download PDF'
  }
});

function loadScript(src) {
  if (src.includes('jspdf') && window.jspdf) return Promise.resolve();
  const existing = document.querySelector(`script[src='${src}']`);
  if (existing?.pdfLoadPromise) return existing.pdfLoadPromise;
  const script = existing || document.createElement('script');
  const promise = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      reject(new Error(`Unable to load PDF resource: ${src}`));
    };
    if (!existing) {
      script.src = src;
      document.head.appendChild(script);
    } else if (src.includes('jspdf') && window.jspdf) {
      resolve();
    }
  });
  script.pdfLoadPromise = promise;
  return promise;
}

/**
 * Render text with clickable links in PDF
 * @param {object} doc - jsPDF document
 * @param {string} value - HTML text to lay out and render
 * @param {number} x - Starting x position
 * @param {number} y - Y position
 * @param {number} maxWidth - Maximum width for text wrapping
 * @returns {number} Height used by the rendered text
 */
function renderTextWithLinks(doc, value, x, y, maxWidth) {
  const layout = layoutPdfText(doc, value, maxWidth);
  layout.lines.forEach((line, index) => {
    for (const run of line) {
      const atY = y + index * layout.lineHeight;
      const font = doc.getFont();
      if (run.font) doc.setFont(run.font, 'normal');
      const text = run.pdfText ?? run.text;
      if (run.pdfText) {
        const unicode = [...run.text].map(char => char.charCodeAt(0).toString(16).padStart(4, '0')).join('');
        doc.internal.write(`/Span << /ActualText <FEFF${unicode}> >> BDC`);
      }
      if (run.url !== undefined) {
        const url = new URL(run.url, window.location.href).href;
        doc.textWithLink(text, x + run.x, atY, { url });
      } else {
        doc.text(text, x + run.x, atY);
      }
      if (run.pdfText) doc.internal.write('EMC');
      if (run.font) doc.setFont(font.fontName, font.fontStyle);
    }
  });
  return layout.height;
}

/**
 * Crops an image to the specified rectangle and returns a PNG data URL.
 *
 * @param {string} imgSrc - The source URL of the image to crop.
 * @param {number} cropX - The x-coordinate (in pixels) of the top-left corner of the crop rectangle within the source image.
 * @param {number} cropY - The y-coordinate (in pixels) of the top-left corner of the crop rectangle within the source image.
 * @param {number} cropWidth - The width (in pixels) of the crop rectangle.
 * @param {number} cropHeight - The height (in pixels) of the crop rectangle.
 * @returns {Promise<string>} A promise that resolves to a PNG data URL of the cropped image.
 */
async function cropImageToDataUrl(imgSrc, cropX, cropY, cropWidth, cropHeight) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
}

async function downloadPdf() {
  if (isDownloading.value) return;
  isDownloading.value = true;
  downloadError.value = '';
  try {
    await generatePdf();
  } catch (error) {
    console.error('Unable to generate PDF:', error);
    downloadError.value = 'Unable to generate PDF. Please try again.';
  } finally {
    isDownloading.value = false;
  }
}

async function generatePdf() {
  if (!jsPDFLoaded) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    jsPDFLoaded = true;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  configureStandardFonts(doc);
  const data = props.getPdfData ? props.getPdfData() : null;
  let y = 20;
  if (!data) return;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add Lightbug logo to top right
  let logoUrl = 'https://lightbug.cloud/assets/logo.png';
  if (logoUrl.startsWith('https://lightbug.io/') || logoUrl.startsWith('https://lightbug.cloud/')  || logoUrl.startsWith('https://upload.r2.lb.chasm.cloud/')) {
    logoUrl = `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(logoUrl)}`;
  }
  let logoHeight = 0;
  try {
    // Fetch logo as image and convert to base64 for best compatibility
    const logoImg = new window.Image();
    logoImg.crossOrigin = 'Anonymous';
    logoImg.src = logoUrl;
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });
    // Draw logo to canvas to get PNG data
    const canvas = document.createElement('canvas');
    canvas.width = logoImg.naturalWidth;
    canvas.height = logoImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(logoImg, 0, 0);
    const logoData = canvas.toDataURL('image/png');
    // Place logo at top right, width 24mm, keep aspect ratio
    const logoWidth = 7; // mm
    const logoAspect = logoImg.naturalHeight / logoImg.naturalWidth;
    logoHeight = logoWidth * logoAspect;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(logoData, 'PNG', pageWidth - logoWidth - 10, 10, logoWidth, logoHeight);
  } catch (e) {
    console.log('Failed to load logo image:', e);
  }

  // Title
  doc.setFontSize(titleSize);
  doc.text('Lightbug ' + (data.title || 'Device'), textSize, y);
  y += 10;
  // Description
  if (data.description) {
    doc.setFontSize(textSize);
    doc.setTextColor(60, 60, 60);

    // Parse description for links and render with clickable links
    const descHeight = renderTextWithLinks(doc, data.description, textSize, y, 180);
    y += descHeight + 10;

    doc.setTextColor(0, 0, 0);
  }

  // Images (row, cropped if params present)
  if (data.images && data.images.length) {
    const maxWidth = pdfImageWidth(data.images.length, doc.internal.pageSize.getWidth());
    const spacing = 5; // mm between images
    let totalWidth = data.images.length * maxWidth + (data.images.length - 1) * spacing;
    let startX = (doc.internal.pageSize.getWidth() - totalWidth) / 2;
    let maxHeight = 0;
    // Preload and crop all images if needed
    const loadedImages = await Promise.all(data.images.map(async (imgUrl) => {
      let crop = null;
      let cropUrlToParse = imgUrl;
      // If proxied, decode the original URL for crop params
      if (imgUrl.startsWith('https://cors-proxy.lightbug.workers.dev?url=')) {
        const match = imgUrl.match(/url=([^&]+)/);
        if (match) {
          cropUrlToParse = decodeURIComponent(match[1]);
        }
      }
      try {
        const urlObj = new URL(cropUrlToParse);
        const x = urlObj.searchParams.get('x');
        const y = urlObj.searchParams.get('y');
        const w = urlObj.searchParams.get('w');
        const h = urlObj.searchParams.get('h');
        if (x && y && w && h) {
          crop = {
            x: parseInt(x, 10),
            y: parseInt(y, 10),
            w: parseInt(w, 10),
            h: parseInt(h, 10)
          };
        }
      } catch (e) {}
      let imgDataUrl;
      if (crop) {
        // Always use the proxied URL for loading, but crop using params from original
        imgDataUrl = await cropImageToDataUrl(imgUrl, crop.x, crop.y, crop.w, crop.h);
      } else {
        imgDataUrl = imgUrl;
      }
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgDataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const aspect = img.naturalHeight / img.naturalWidth;
      const width = maxWidth;
      const height = width * aspect;
      if (height > maxHeight) maxHeight = height;
      return { imgDataUrl, width, height };
    }));
    // Draw all images in a row
    let x = startX;
    for (const { imgDataUrl, width, height } of loadedImages) {
      doc.addImage(imgDataUrl, 'PNG', x, y, width, height);
      x += width + spacing;
    }
    y += maxHeight + 10;
  }

  // Main Table
  if (data.mainTable) {
    // Calculate total height needed for main table
    doc.setFontSize(tableTextSize);
    let mainTableHeight = rowHeight; // header
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);
        const valLines = layoutPdfText(doc, String(val), 130 - 2 * cellPadding).lines;
        const lineCount = Math.max(attrLines.length, valLines.length);
        // Calculate height based on font size and line count
        const lineHeightPt = doc.getLineHeight();
        const lineHeight = lineHeightPt * 0.352778; // convert pt to mm
        const thisRowHeight = lineHeight * lineCount + 2 * cellPadding;
        mainTableHeight += thisRowHeight;
      }
    }
    if (y + mainTableHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = topMargin;
    }
    // Header row (make it match section header style)
    doc.setFillColor(...orange); // Use orange for main header background
    doc.setDrawColor(...borderColor);
    doc.rect(10, y, 180, rowHeight, 'F');
    doc.setFontSize(sectionTitleSize);
    doc.setFont(undefined, 'bold'); // XXX TODO railway
    doc.setTextColor(255,255,255); // White text for contrast
    doc.text('Overview', 12, y + rowHeight - cellPadding);
    doc.setTextColor(0,0,0); // Reset to black
    doc.setFont(undefined, 'normal');
    y += rowHeight;
    doc.setFontSize(tableTextSize);
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);

        // Parse value for links
        const valSegments = String(val);

        // For now, estimate height using plain text method for layout
        const valLines = layoutPdfText(doc, String(val), 130 - 2 * cellPadding).lines;
        const lineCount = Math.max(attrLines.length, valLines.length);
        // Calculate height based on font size and line count
        const lineHeightPt = doc.getLineHeight();
        const lineHeight = lineHeightPt * 0.352778; // convert pt to mm
        const thisRowHeight = lineHeight * lineCount + 2 * cellPadding;
        // Draw cell backgrounds and borders
        doc.setFillColor(255,255,255);
        doc.setDrawColor(...borderColor);
        doc.rect(10, y, 50, thisRowHeight, 'F');
        doc.rect(60, y, 130, thisRowHeight, 'F');
        // Text
        doc.setFont(undefined, 'bold');
        doc.text(attrLines, 12, y + cellPadding + lineHeight * 0.75, { maxWidth: 50 - 2 * cellPadding });
        doc.setFont(undefined, 'normal');

        // Render value with clickable links
        renderTextWithLinks(doc, valSegments, 62, y + cellPadding + lineHeight * 0.75, 130 - 2 * cellPadding);

        y += thisRowHeight;
      }
    }
    // Add spacing after main table before sections
    y += sectionSpacing;
  }

  // Sections
  if (data.sections) {
    let isFirstSection = true;
    for (const section of data.sections) {
      if (!isFirstSection) {
        y += sectionSpacing;
      }
      isFirstSection = false;
      // Keep a heading with the first data row rather than orphaning it.
      const firstRow = section.subsections[0]?.rows[0];
      const firstRowHeight = firstRow ? measureRowHeight(doc, firstRow) : 0;
      if (y + 2 * rowHeight + firstRowHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = topMargin;
      }
      doc.setFillColor(...orange); // Use orange for section headers
      doc.setDrawColor(...borderColor);
      doc.rect(10, y, 180, rowHeight, 'F');
      doc.setFontSize(sectionTitleSize);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255,255,255); // White text for contrast
      doc.text(section.title, 12, y + rowHeight - cellPadding);
      doc.setTextColor(0,0,0); // Reset to black
      doc.setFont(undefined, 'normal');
      y += rowHeight;
      doc.setFontSize(tableTextSize);
      for (const subsection of section.subsections) {
        // Subsection heading row
        const firstRowHeight = subsection.rows[0] ? measureRowHeight(doc, subsection.rows[0]) : 0;
        if (y + rowHeight + firstRowHeight > pageHeight - bottomMargin) {
          doc.addPage();
          y = topMargin;
        }
        doc.setFillColor(...subsectionBg); // Use light orange for subsection
        doc.setDrawColor(...borderColor);
        doc.rect(10, y, 180, rowHeight, 'F');
        doc.setFont(undefined, 'bold');
        doc.text(subsection.title, 12, y + rowHeight - cellPadding);
        doc.setFont(undefined, 'normal');
        y += rowHeight;
        for (const row of subsection.rows) {
          const attrLines = doc.splitTextToSize(`${row.label}:`, 50 - 2 * cellPadding);

          // Convert the row value to PDF text and clickable links
          const valRaw = String(row.value);
          const valSegments = valRaw;

          // For layout estimation, use plain text
          const valLines = layoutPdfText(doc, valRaw, 130 - 2 * cellPadding).lines;
          const lineCount = Math.max(attrLines.length, valLines.length);
          // Calculate height based on font size and line count
          const lineHeightPt = doc.getLineHeight();
          const lineHeight = lineHeightPt * 0.352778; // convert pt to mm
          const thisRowHeight = lineHeight * lineCount + 2 * cellPadding;
          // If row doesn't fit, add a new page
          if (y + thisRowHeight > pageHeight - bottomMargin) {
            doc.addPage();
            y = topMargin;
            // Redraw subsection header on new page
            doc.setFillColor(...subsectionBg);
            doc.setDrawColor(...borderColor);
            doc.rect(10, y, 180, rowHeight, 'F');
            doc.setFont(undefined, 'bold');
            doc.text(subsection.title, 12, y + rowHeight - cellPadding);
            doc.setFont(undefined, 'normal');
            y += rowHeight;
          }
          // Draw cell backgrounds and borders
          doc.setFillColor(255,255,255);
          doc.setDrawColor(...borderColor);
          doc.rect(10, y, 50, thisRowHeight, 'F'); // Change to S to see the grid
          doc.rect(60, y, 130, thisRowHeight, 'F'); // Change to S to see the grid
          // Text
          doc.setFont(undefined, 'bold');
          doc.text(attrLines, 12, y + cellPadding + lineHeight * 0.75, { maxWidth: 50 - 2 * cellPadding });
          doc.setFont(undefined, 'normal');

          // Render value with clickable links
          renderTextWithLinks(doc, valSegments, 62, y + cellPadding + lineHeight * 0.75, 130 - 2 * cellPadding);

          y += thisRowHeight;
        }
      }
    }
  }

  // Footer
  let url = window.location.href;
  // Remove anchor/hash from URL
  url = url.split('#')[0];
  // Format date as '1 May 2025'
  const dateObj = new Date();
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();
  const fullDate = `${day} ${month} ${year}`;
  doc.setFontSize(footerSize);
  doc.setTextColor(...orange); // orange for the link
  const urlWidth = doc.getTextWidth(url);
  doc.textWithLink(url, 10, pageHeight - 10, { url });
  doc.setTextColor(0, 0, 0); // reset to black for the rest
  doc.text(` | Generated: ${fullDate}`, 10 + urlWidth, pageHeight - 10);
  savePdfBlob(doc.output('blob'), data.title);
}

function configureStandardFonts(doc) {
  doc.setFont('symbol', 'normal');
  // jsPDF 2.5.1 omits these Symbol-encoded advances. Adobe's standard
  // Symbol metrics keep text placement and clickable-link bounds consistent.
  const widths = doc.getFont().metadata.Unicode.widths;
  widths[0x46] = 0.763 * widths.fof; // capital phi
  widths[0x6d] = 0.576 * widths.fof; // small mu
  doc.setFont('helvetica', 'normal');
}

function measureRowHeight(doc, row) {
  const labelLines = doc.splitTextToSize(`${row.label}:`, 50 - 2 * cellPadding);
  const valueLayout = layoutPdfText(doc, String(row.value), 130 - 2 * cellPadding);
  return Math.max(labelLines.length, valueLayout.lines.length) * valueLayout.lineHeight + 2 * cellPadding;
}

function savePdfBlob(blob, title) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `Lightbug-${(title || 'Device').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}-specification.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Allow the browser time to start the download before releasing the object URL.
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}
</script>

<style scoped>
.pdf-btn-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin: 12px 0 16px 0;
}
.pdf-download-btn {
  display: inline-block;
  min-width: 120px;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--vp-c-bg-alt, #f5f7fa);
  color: var(--vp-c-text-1, #222);
  border: 1px solid var(--vp-c-divider, #d1d5db);
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  text-align: center;
}
.pdf-download-btn:hover {
  background: var(--vp-c-bg, #e6eaf1);
  border-color: var(--vp-c-brand, #409eff);
  color: var(--vp-c-brand, #409eff);
}
</style>
