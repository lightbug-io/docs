<template>
  <div class="download-btn-wrapper" @click="handleClick" :title="`Download ${props.label}`">
    <div class="download-card">
      <img v-if="props.previewImage" :src="props.previewImage" alt="File preview" class="preview-image" />
      <div class="overlay">{{ displayOverlay }}</div>
    </div>
    <div class="label-under">{{ props.label }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  // Function that returns PDF data for generation
  getPdfData: {
    type: Function,
    required: true
  },
  label: {
    type: String,
    default: 'Download PDF'
  },
  previewImage: {
    type: String,
    default: null
  },
  overlayText: {
    type: String,
    default: 'PDF'
  }
})

const displayOverlay = computed(() => {
  return props.overlayText || 'PDF';
});

let jsPDFLoaded = false;

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

const headerBg = orange;
const borderColor = [221, 221, 221];
const subsectionBg = [252, 232, 220];

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

function loadFontScript(src) {
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

function parseHtmlForPdfLinks(html) {
  if (!html || typeof html !== 'string') return [{ text: html || '', isLink: false }];

  const segments = [];
  const anchorRe = /<a\s+[^>]*href=(?:"|')([^"']*)(?:"|')[^>]*>(.*?)<\/a>/gi;
  let lastIndex = 0;
  let match;

  while ((match = anchorRe.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const beforeText = html.substring(lastIndex, match.index);
      const cleanBefore = beforeText.replace(/<[^>]+>/g, '');
      if (cleanBefore) {
        segments.push({ text: cleanBefore, isLink: false });
      }
    }

    const href = match[1];
    const linkText = match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    segments.push({ text: linkText, isLink: true, url: href });

    lastIndex = anchorRe.lastIndex;
  }

  if (lastIndex < html.length) {
    const remainingText = html.substring(lastIndex);
    const cleanRemaining = remainingText.replace(/<[^>]+>/g, '');
    if (cleanRemaining) {
      segments.push({ text: cleanRemaining, isLink: false });
    }
  }

  if (segments.length === 0) {
    const cleanText = html.replace(/<[^>]+>/g, '');
    return [{ text: cleanText, isLink: false }];
  }

  return segments;
}

function renderTextWithLinks(doc, segments, x, y, maxWidth) {
  let currentX = x;
  let currentY = y;
  const lineHeight = doc.getLineHeight() * 0.352778;
  let usedHeight = lineHeight;

  for (const segment of segments) {
    if (!segment.text) continue;

    const words = segment.text.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordWidth = doc.getTextWidth(word + ' ');

      if (currentX + wordWidth > x + maxWidth && currentX > x) {
        currentX = x;
        currentY += lineHeight;
        usedHeight += lineHeight;
      }

      if (segment.isLink) {
        let fullUrl = segment.url;
        if (fullUrl.startsWith('/')) {
          fullUrl = window.location.origin + fullUrl;
        }
        doc.textWithLink(word, currentX, currentY, { url: fullUrl });
      } else {
        doc.text(word, currentX, currentY);
      }

      currentX += wordWidth;

      if (i < words.length - 1) {
        const spaceWidth = doc.getTextWidth(' ');
        currentX += spaceWidth;
      }
    }
  }

  return usedHeight;
}

function htmlAnchorsToPlainText(html) {
  if (!html || typeof html !== 'string') return html;

  const anchorRe = /<a\s+[^>]*href=(?:"|')([^"']*)(?:"|')[^>]*>(.*?)<\/a>/gi;
  let out = html.replace(anchorRe, (match, href, text) => {
    const cleanText = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return `${cleanText} (${href})`;
  });

  out = out.replace(/<[^>]+>/g, '');

  return out;
}

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

async function handleClick() {
  if (!jsPDFLoaded) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    jsPDFLoaded = true;
  }

  const data = props.getPdfData ? props.getPdfData() : null;
  console.log('PDF Data:', data); // Debug log

  if (!data) {
    console.error('No PDF data available');
    return;
  }

  await loadFontScript('/fonts/Raleway-VariableFont_wght-normal.js');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('Raleway-VariableFont_wgh');
  let y = 20;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add Lightbug logo to top right
  let logoUrl = 'https://lightbug.cloud/assets/logo.png';
  if (logoUrl.startsWith('https://lightbug.io/') || logoUrl.startsWith('https://lightbug.cloud/')  || logoUrl.startsWith('https://upload.r2.lb.chasm.cloud/')) {
    logoUrl = `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(logoUrl)}`;
  }
  let logoHeight = 0;
  try {
    const logoImg = new window.Image();
    logoImg.crossOrigin = 'Anonymous';
    logoImg.src = logoUrl;
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });
    const canvas = document.createElement('canvas');
    canvas.width = logoImg.naturalWidth;
    canvas.height = logoImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(logoImg, 0, 0);
    const logoData = canvas.toDataURL('image/png');
    const logoWidth = 7;
    const logoAspect = logoImg.naturalHeight / logoImg.naturalWidth;
    logoHeight = logoWidth * logoAspect;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(logoData, 'PNG', pageWidth - logoWidth - 10, 10, logoWidth, logoHeight);
  } catch (e) {
    console.log('Failed to load logo image:', e);
  }

  // Title
  doc.setFontSize(titleSize);
  doc.text('Lightbug ' + data.title || 'Device', textSize, y);
  y += 10;
  // Description
  if (data.description) {
    doc.setFontSize(textSize);
    doc.setTextColor(60, 60, 60);

    const descSegments = parseHtmlForPdfLinks(data.description);
    const descHeight = renderTextWithLinks(doc, descSegments, textSize, y, 180);
    y += descHeight + 10;

    doc.setTextColor(0, 0, 0);
  }

  // Images (row, cropped if params present)
  if (data.images && data.images.length) {
    const maxWidth = 50;
    const spacing = 5;
    let totalWidth = data.images.length * maxWidth + (data.images.length - 1) * spacing;
    let startX = (doc.internal.pageSize.getWidth() - totalWidth) / 2;
    let maxHeight = 0;
    const loadedImages = await Promise.all(data.images.map(async (imgUrl) => {
      let crop = null;
      let cropUrlToParse = imgUrl;
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
    let x = startX;
    for (const { imgDataUrl, width, height } of loadedImages) {
      doc.addImage(imgDataUrl, 'PNG', x, y, width, height);
      x += width + spacing;
    }
    y += maxHeight + 10;
  }

  // Main Table
  if (data.mainTable) {
    let mainTableHeight = rowHeight;
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);
        const valLines = doc.splitTextToSize(val, 130 - 2 * cellPadding);
        const lineCount = Math.max(attrLines.length, valLines.length);
        const lineHeightPt = doc.getLineHeight();
        const lineHeight = lineHeightPt * 0.352778;
        const thisRowHeight = lineHeight * lineCount + 2 * cellPadding;
        mainTableHeight += thisRowHeight;
      }
    }
    if (y + mainTableHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = topMargin;
    }
    doc.setFillColor(...orange);
    doc.setDrawColor(...borderColor);
    doc.rect(10, y, 180, rowHeight, 'F');
    doc.setFontSize(sectionTitleSize);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255,255,255);
    doc.text('Overview', 12, y + rowHeight - cellPadding);
    doc.setTextColor(0,0,0);
    doc.setFont(undefined, 'normal');
    y += rowHeight;
    doc.setFontSize(tableTextSize);
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);

        const valSegments = parseHtmlForPdfLinks(String(val));

        const cleanVal = typeof val === 'string' ? htmlAnchorsToPlainText(val) : String(val);
        const valLines = doc.splitTextToSize(cleanVal, 130 - 2 * cellPadding);
        const lineCount = Math.max(attrLines.length, valLines.length);
        const lineHeightPt = doc.getLineHeight();
        const lineHeight = lineHeightPt * 0.352778;
        const thisRowHeight = lineHeight * lineCount + 2 * cellPadding;
        doc.setFillColor(255,255,255);
        doc.setDrawColor(...borderColor);
        doc.rect(10, y, 50, thisRowHeight, 'F');
        doc.rect(60, y, 130, thisRowHeight, 'F');
        doc.setFont(undefined, 'bold');
        doc.text(attrLines, 12, y + cellPadding + lineHeight * 0.75, { maxWidth: 50 - 2 * cellPadding });
        doc.setFont(undefined, 'normal');

        renderTextWithLinks(doc, valSegments, 62, y + cellPadding + lineHeight * 0.75, 130 - 2 * cellPadding);

        y += thisRowHeight;
      }
    }
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
      if (y + rowHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = topMargin;
      }
      doc.setFillColor(...orange);
      doc.setDrawColor(...borderColor);
      doc.rect(10, y, 180, rowHeight, 'F');
      doc.setFontSize(sectionTitleSize);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255,255,255);
      doc.text(section.title, 12, y + rowHeight - cellPadding);
      doc.setTextColor(0,0,0);
      doc.setFont(undefined, 'normal');
      y += rowHeight;
      doc.setFontSize(tableTextSize);
      for (const subsection of section.subsections) {
        if (y + rowHeight > pageHeight - bottomMargin) {
          doc.addPage();
          y = topMargin;
        }
        doc.setFillColor(...subsectionBg);
        doc.setDrawColor(...borderColor);
        doc.rect(10, y, 180, rowHeight, 'F');
        doc.setFont(undefined, 'bold');
        doc.text(subsection.title, 12, y + rowHeight - cellPadding);
        doc.setFont(undefined, 'normal');
        y += rowHeight;
        for (const row of subsection.rows) {
          const attrLines = doc.splitTextToSize(`${row.label}:`, 50 - 2 * cellPadding);

          const valRaw = String(row.value).replace(/<br\s*\/?\s*>/gi, '\n');
          const valSegments = parseHtmlForPdfLinks(valRaw);

          const cleanVal = htmlAnchorsToPlainText(valRaw);
          const valLines = doc.splitTextToSize(cleanVal, 130 - 2 * cellPadding);
          const lineCount = Math.max(attrLines.length, valLines.length);
          const lineHeightPt = doc.getLineHeight();
          const lineHeight = lineHeightPt * 0.352778;
          const thisRowHeight = lineHeight * lineCount + 2 * cellPadding;
          if (y + thisRowHeight > pageHeight - bottomMargin) {
            doc.addPage();
            y = topMargin;
            doc.setFillColor(...subsectionBg);
            doc.setDrawColor(...borderColor);
            doc.rect(10, y, 180, rowHeight, 'F');
            doc.setFont(undefined, 'bold');
            doc.text(subsection.title, 12, y + rowHeight - cellPadding);
            doc.setFont(undefined, 'normal');
            y += rowHeight;
          }
          doc.setFillColor(255,255,255);
          doc.setDrawColor(...borderColor);
          doc.rect(10, y, 50, thisRowHeight, 'F');
          doc.rect(60, y, 130, thisRowHeight, 'F');
          doc.setFont(undefined, 'bold');
          doc.text(attrLines, 12, y + cellPadding + lineHeight * 0.75, { maxWidth: 50 - 2 * cellPadding });
          doc.setFont(undefined, 'normal');

          renderTextWithLinks(doc, valSegments, 62, y + cellPadding + lineHeight * 0.75, 130 - 2 * cellPadding);

          y += thisRowHeight;
        }
      }
    }
  }

  // Footer
  let url = window.location.href;
  url = url.split('#')[0];
  const dateObj = new Date();
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();
  const fullDate = `${day} ${month} ${year}`;
  doc.setFontSize(footerSize);
  doc.setTextColor(...orange);
  const urlWidth = doc.getTextWidth(url);
  doc.textWithLink(url, 10, pageHeight - 10, { url });
  doc.setTextColor(0, 0, 0);
  doc.text(` | Generated: ${fullDate}`, 10 + urlWidth, pageHeight - 10);
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
}
</script>

<style scoped>
.download-btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 8px;
  width: 148px;
  cursor: pointer;
}

.download-card {
  width: 148px;
  height: 210px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.download-btn-wrapper:hover .download-card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.label-under {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
  text-align: center;
  align-self: center;
}
</style>
