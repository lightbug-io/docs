<template>
  <div class="pdf-btn-wrapper">
    <button @click="downloadPdf" class="pdf-download-btn">PDF Download</button>
  </div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue';
let jsPDFLoaded = false;

const titleSize = 20;
const textSize = 11;
const bottomMargin = 20;
const cellPadding = 2.5; // px
const rowHeight = 8; // px
const headerBg = [245, 245, 245]; // #f5f5f5
const borderColor = [221, 221, 221]; // #ddd
const subsectionBg = [224, 231, 239]; // #e0e7ef

const props = defineProps({
  getPdfData: Function
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src='${src}']`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  if (!jsPDFLoaded) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    jsPDFLoaded = true;
  }
});

async function downloadPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const data = props.getPdfData ? props.getPdfData() : null;
  let y = 20;
  if (!data) return;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add Lightbug logo to top right
  let logoUrl = 'https://lightbug.io/images/logo-orange_hudcdce2ead9cbe2715b5cf652e648439f_53864_100x200_fit_q100_h2_box_2.webp';
  if (logoUrl.startsWith('https://lightbug.io/')) {
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
  doc.text('Lightbug ' + data.title || 'Device', 10, y);
  y += 10;
  // Description
  if (data.description) {
    doc.setFontSize(textSize);
    doc.setTextColor(60, 60, 60);
    doc.text(doc.splitTextToSize(data.description, 180), 10, y);
    y += 10 + 5 * (doc.splitTextToSize(data.description, 180).length - 1);
    doc.setTextColor(0, 0, 0);
  }

  // Images
  if (data.imageUrl) {
    let imgSrc = data.imageUrl;
    if (imgSrc.startsWith('https://lightbug.io/')) {
      imgSrc = `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(imgSrc)}`;
    }
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSrc;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const maxWidth = 50;
    const aspect = img.naturalHeight / img.naturalWidth;
    const width = maxWidth;
    const height = width * aspect;
    doc.addImage(img, 'PNG', 10, y, width, height);
    y += height + 10;
  }

  // Main Table
  if (data.mainTable) {
    // Calculate total height needed for main table
    let mainTableHeight = rowHeight; // header
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);
        const valLines = doc.splitTextToSize(val, 130 - 2 * cellPadding);
        const lineCount = Math.max(attrLines.length, valLines.length);
        mainTableHeight += rowHeight * lineCount;
      }
    }
    if (y + mainTableHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = 0;
    }
    // Header row
    doc.setFillColor(...headerBg);
    doc.setDrawColor(...borderColor);
    doc.rect(10, y, 50, rowHeight, 'F');
    doc.rect(60, y, 130, rowHeight, 'F');
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Specification', 12, y + rowHeight - cellPadding);
    doc.setFont(undefined, 'normal');
    y += rowHeight;
    doc.setFontSize(11);
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);
        const valLines = doc.splitTextToSize(val, 130 - 2 * cellPadding);
        const lineCount = Math.max(attrLines.length, valLines.length);
        const thisRowHeight = rowHeight * lineCount;
        // Draw cell backgrounds and borders
        doc.setFillColor(255,255,255);
        doc.setDrawColor(...borderColor);
        doc.rect(10, y, 50, thisRowHeight, 'F');
        doc.rect(60, y, 130, thisRowHeight, 'F');
        // Text
        doc.setFont(undefined, 'bold');
        doc.text(attrLines, 12, y + rowHeight - cellPadding, { maxWidth: 50 - 2 * cellPadding });
        doc.setFont(undefined, 'normal');
        doc.text(valLines, 62, y + rowHeight - cellPadding, { maxWidth: 130 - 2 * cellPadding });
        y += thisRowHeight;
      }
    }
  }

  // Sections
  if (data.sections) {
    for (const section of data.sections) {
      // Calculate total height needed for this section's table
      let sectionTableHeight = rowHeight; // section title
      for (const subsection of section.subsections) {
        sectionTableHeight += rowHeight; // subsection title
        for (const row of subsection.rows) {
          const attrLines = doc.splitTextToSize(`${row.label}:`, 50 - 2 * cellPadding);
          const valText = String(row.value).replace(/<br\s*\/??\s*>/gi, '\n');
          const valLines = doc.splitTextToSize(valText, 130 - 2 * cellPadding);
          const lineCount = Math.max(attrLines.length, valLines.length);
          sectionTableHeight += rowHeight * lineCount;
        }
      }
      if (y + sectionTableHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = 0
      }
      // Section title as table header
      doc.setFillColor(...headerBg);
      doc.setDrawColor(...borderColor);
      doc.rect(10, y, 180, rowHeight, 'F');
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(section.title, 12, y + rowHeight - cellPadding);
      doc.setFont(undefined, 'normal');
      y += rowHeight;
      doc.setFontSize(11);
      for (const subsection of section.subsections) {
        // Subsection heading row
        doc.setFillColor(...subsectionBg);
        doc.setDrawColor(...borderColor);
        doc.rect(10, y, 180, rowHeight, 'F');
        doc.setFont(undefined, 'bold');
        doc.text(subsection.title, 12, y + rowHeight - cellPadding);
        doc.setFont(undefined, 'normal');
        y += rowHeight;
        for (const row of subsection.rows) {
          const attrLines = doc.splitTextToSize(`${row.label}:`, 50 - 2 * cellPadding);
          const valText = String(row.value).replace(/<br\s*\/??\s*>/gi, '\n');
          const valLines = doc.splitTextToSize(valText, 130 - 2 * cellPadding);
          const lineCount = Math.max(attrLines.length, valLines.length);
          const thisRowHeight = rowHeight * lineCount;
          // Draw cell backgrounds and borders
          doc.setFillColor(255,255,255);
          doc.setDrawColor(...borderColor);
          doc.rect(10, y, 50, thisRowHeight, 'F');
          doc.rect(60, y, 130, thisRowHeight, 'F');
          // Text
          doc.setFont(undefined, 'bold');
          doc.text(attrLines, 12, y + rowHeight - cellPadding, { maxWidth: 50 - 2 * cellPadding });
          doc.setFont(undefined, 'normal');
          doc.text(valLines, 62, y + rowHeight - cellPadding, { maxWidth: 130 - 2 * cellPadding });
          y += thisRowHeight;
        }
      }
    }
  }

  // Footer
  const url = window.location.href;
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 255);
  const urlWidth = doc.getTextWidth(url);
  doc.textWithLink(url, 10, pageHeight - 10, { url });
  doc.setTextColor(0, 0, 0);
  doc.text(` | Generated: ${date}`, 10 + urlWidth, pageHeight - 10);
  // Open PDF in new tab instead of downloading
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
}
</script>

<style scoped>
.pdf-btn-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 16px 0 24px 0;
}
.pdf-download-btn {
  background: var(--vp-c-bg-alt, #f5f7fa);
  color: var(--vp-c-text-1, #222);
  border: 1px solid var(--vp-c-divider, #d1d5db);
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.pdf-download-btn:hover {
  background: var(--vp-c-bg, #e6eaf1);
  border-color: var(--vp-c-brand, #409eff);
  color: var(--vp-c-brand, #409eff);
}
</style>
