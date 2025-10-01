<template>
  <div class="pdf-btn-wrapper">
    <button @click="downloadPdf" class="pdf-download-btn">{{ props.label }}</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
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

/**
 * Parse HTML text and extract links for PDF rendering with clickable links.
 * @param {string} html - HTML string that may contain anchor tags
 * @returns {Array} Array of text segments with link information
 */
function parseHtmlForPdfLinks(html) {
  if (!html || typeof html !== 'string') return [{ text: html || '', isLink: false }];

  const segments = [];
  const anchorRe = /<a\s+[^>]*href=(?:"|')([^"']*)(?:"|')[^>]*>(.*?)<\/a>/gi;
  let lastIndex = 0;
  let match;

  while ((match = anchorRe.exec(html)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      const beforeText = html.substring(lastIndex, match.index);
      const cleanBefore = beforeText.replace(/<[^>]+>/g, '');
      if (cleanBefore) {
        segments.push({ text: cleanBefore, isLink: false });
      }
    }

    // Add the link
    const href = match[1];
    const linkText = match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    segments.push({ text: linkText, isLink: true, url: href });

    lastIndex = anchorRe.lastIndex;
  }

  // Add remaining text after last link
  if (lastIndex < html.length) {
    const remainingText = html.substring(lastIndex);
    const cleanRemaining = remainingText.replace(/<[^>]+>/g, '');
    if (cleanRemaining) {
      segments.push({ text: cleanRemaining, isLink: false });
    }
  }

  // If no links found, return the cleaned HTML
  if (segments.length === 0) {
    const cleanText = html.replace(/<[^>]+>/g, '');
    return [{ text: cleanText, isLink: false }];
  }

  return segments;
}

/**
 * Render text with clickable links in PDF
 * @param {object} doc - jsPDF document
 * @param {Array} segments - Array of text segments from parseHtmlForPdfLinks
 * @param {number} x - Starting x position
 * @param {number} y - Y position
 * @param {number} maxWidth - Maximum width for text wrapping
 * @returns {number} Height used by the rendered text
 */
function renderTextWithLinks(doc, segments, x, y, maxWidth) {
  let currentX = x;
  let currentY = y;
  const lineHeight = doc.getLineHeight() * 0.352778; // convert pt to mm
  let usedHeight = lineHeight;

  for (const segment of segments) {
    if (!segment.text) continue;

    // Split text into words for proper wrapping
    const words = segment.text.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordWidth = doc.getTextWidth(word + ' ');

      // Check if we need to wrap to next line
      if (currentX + wordWidth > x + maxWidth && currentX > x) {
        currentX = x;
        currentY += lineHeight;
        usedHeight += lineHeight;
      }

      // Render the word
      if (segment.isLink) {
        // Make absolute URLs for relative links
        let fullUrl = segment.url;
        if (fullUrl.startsWith('/')) {
          fullUrl = window.location.origin + fullUrl;
        }
        doc.textWithLink(word, currentX, currentY, { url: fullUrl });
      } else {
        doc.text(word, currentX, currentY);
      }

      currentX += wordWidth;

      // Add space after word (except for last word)
      if (i < words.length - 1) {
        const spaceWidth = doc.getTextWidth(' ');
        currentX += spaceWidth;
      }
    }
  }

  return usedHeight;
}

/**
 * Convert HTML anchor tags to plain text "label (href)" and strip other HTML tags.
 * @param {string} html - HTML string that may contain anchor tags
 * @returns {string} Plain text with links converted to "text (href)" format
 */
function htmlAnchorsToPlainText(html) {
  if (!html || typeof html !== 'string') return html;

  // Replace anchor tags with 'text (href)'
  const anchorRe = /<a\s+[^>]*href=(?:"|')([^"']*)(?:"|')[^>]*>(.*?)<\/a>/gi;
  let out = html.replace(anchorRe, (match, href, text) => {
    // Clean up the text content and decode basic HTML entities
    const cleanText = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return `${cleanText} (${href})`;
  });

  // Strip any remaining HTML tags
  out = out.replace(/<[^>]+>/g, '');

  return out;
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
  await loadFontScript('/fonts/Raleway-VariableFont_wght-normal.js');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('Raleway-VariableFont_wgh');
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
  doc.text('Lightbug ' + data.title || 'Device', textSize, y);
  y += 10;
  // Description
  if (data.description) {
    doc.setFontSize(textSize);
    doc.setTextColor(60, 60, 60);

    // Parse description for links and render with clickable links
    const descSegments = parseHtmlForPdfLinks(data.description);
    const descHeight = renderTextWithLinks(doc, descSegments, textSize, y, 180);
    y += descHeight + 10;

    doc.setTextColor(0, 0, 0);
  }

  // Images (row, cropped if params present)
  if (data.images && data.images.length) {
    const maxWidth = 50; // mm per image
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
    let mainTableHeight = rowHeight; // header
    for (const [attr, val] of Object.entries(data.mainTable)) {
      if (val) {
        const attrLines = doc.splitTextToSize(`${attr}:`, 50 - 2 * cellPadding);
        const valLines = doc.splitTextToSize(val, 130 - 2 * cellPadding);
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
        const valSegments = parseHtmlForPdfLinks(String(val));

        // For now, estimate height using plain text method for layout
        const cleanVal = typeof val === 'string' ? htmlAnchorsToPlainText(val) : String(val);
        const valLines = doc.splitTextToSize(cleanVal, 130 - 2 * cellPadding);
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
      // Section title as table header
      if (y + rowHeight > pageHeight - bottomMargin) {
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
        if (y + rowHeight > pageHeight - bottomMargin) {
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

          // Convert HTML links and preserve line breaks, then parse for links
          const valRaw = String(row.value).replace(/<br\s*\/?\s*>/gi, '\n');
          const valSegments = parseHtmlForPdfLinks(valRaw);

          // For layout estimation, use plain text
          const cleanVal = htmlAnchorsToPlainText(valRaw);
          const valLines = doc.splitTextToSize(cleanVal, 130 - 2 * cellPadding);
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
  // Open PDF in new tab instead of downloading
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
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
