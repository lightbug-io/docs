<template>
  <div class="pdf-btn-wrapper">
    <button @click="downloadPdf" class="pdf-download-btn">PDF Download</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
let jsPDFLoaded = false;
let html2canvasLoaded = false;

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
  if (!html2canvasLoaded) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    html2canvasLoaded = true;
  }
});

async function downloadPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  // Get device name
  const name = document.querySelector('h1, #device-title')?.innerText || 'Device';
  doc.setFontSize(22);
  doc.text("Lightbug " + name, 10, 20);
  // Get image
  const imgContainer = document.getElementById('device-image');
  let imgEl = imgContainer;
  if (imgContainer && imgContainer.tagName !== 'IMG') {
    imgEl = imgContainer.querySelector('img') || imgContainer;
  }
  if (imgEl && imgEl.tagName === 'IMG') {
    // Wait for image to load if not already
    if (!imgEl.complete) {
      await new Promise((resolve, reject) => {
        imgEl.onload = resolve;
        imgEl.onerror = reject;
      });
    }
    // Use CORS proxy for PDF export
    let imgSrc = imgEl.src;
    if (imgSrc.startsWith('https://lightbug.io/')) {
      imgSrc = `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(imgSrc)}`;
    }
    try {
      if (imgSrc && imgEl.naturalWidth > 0) {
        // Calculate aspect ratio and fit width to 50mm
        const maxWidth = 50;
        const aspect = imgEl.naturalHeight / imgEl.naturalWidth;
        const width = maxWidth;
        const height = width * aspect;
        doc.addImage(imgSrc, 'PNG', 10, 30, width, height);
        // Move table start Y below image
        var tableStartY = 30 + height + 10;
      } else {
        throw new Error('Image src not usable');
      }
    } catch (e) {
      const canvas = await window.html2canvas(imgEl, { backgroundColor: null });
      const imgData = canvas.toDataURL('image/png');
      // Calculate aspect ratio and fit width to 50mm
      const maxWidth = 50;
      const aspect = canvas.height / canvas.width;
      const width = maxWidth;
      const height = width * aspect;
      doc.addImage(imgData, 'PNG', 10, 30, width, height);
      var tableStartY = 30 + height + 10;
    }
  }
  // Get specification table and render as concise text
  const table = document.querySelector('table');
  if (table) {
    let y = typeof tableStartY !== 'undefined' ? tableStartY : 90;
    doc.setFontSize(14);
    doc.text('Specification', 10, y);
    y += 8;
    doc.setFontSize(11);
    for (const row of table.querySelectorAll('tr')) {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 2) {
        const attr = cells[0].innerText.trim();
        const val = cells[1].innerText.trim();
        if (attr && val) {
          doc.text(`${attr}:`, 12, y, { maxWidth: 50 });
          doc.text(val, 60, y, { maxWidth: 130 });
          y += 7;
        }
      }
    }
  }
// Add URL and date at the bottom BEFORE saving
const pageHeight = doc.internal.pageSize.getHeight();
const url = window.location.href;
const date = new Date().toLocaleDateString();
doc.setFontSize(10);
doc.setTextColor(0, 0, 255);
const urlWidth = doc.getTextWidth(url);
doc.textWithLink(url, 10, pageHeight - 10, { url });
doc.setTextColor(0, 0, 0);
doc.text(` | Generated: ${date}`, 10 + urlWidth, pageHeight - 10);
const cleanName = name.trim().replace(/\s+/g, '').replace(/[^\w\-]/g, '');
doc.save(`Lightbug ${cleanName} spec.pdf`);
}
</script>

<style scoped>
.pdf-btn-wrapper {
  display: flex;
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
