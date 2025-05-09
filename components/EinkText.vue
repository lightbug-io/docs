<template>
  <canvas ref="canvas"
          :width="250"
          :height="140"
          class="eink-canvas">
  </canvas>
</template>

<script>
export default {
  name: 'EinkText',

  props: {
    title: {
      type: String,
      default: ''
    },
    line1: {
      type: String,
      default: ''
    },
    line2: {
      type: String,
      default: ''
    },
    line3: {
      type: String,
      default: ''
    },
    line4: {
      type: String,
      default: ''
    },
    line5: {
      type: String,
      default: ''
    }
  },

  mounted() {
    this.renderCanvas();
  },

  updated() {
    this.renderCanvas();
  },

  methods: {
    renderCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      // Clear canvas with white background (e-ink)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = '#000000';

      // Draw title in bold with tighter letter spacing
      ctx.font = 'bold 12px Arial';
      let spacing = 1.5;
      this.drawTextWithSpacing(ctx, this.title, 10, 20, spacing+1);

      // Draw regular text lines with tighter letter spacing
      ctx.font = '10px Arial';
      if (this.line1) this.drawTextWithSpacing(ctx, this.line1, 10, 50, spacing);
      if (this.line2) this.drawTextWithSpacing(ctx, this.line2, 10, 70, spacing);
      if (this.line3) this.drawTextWithSpacing(ctx, this.line3, 10, 90, spacing);
      if (this.line4) this.drawTextWithSpacing(ctx, this.line4, 10, 110, spacing);
      if (this.line5) this.drawTextWithSpacing(ctx, this.line5, 10, 130, spacing);
    },

    drawTextWithSpacing(ctx, text, x, y, spacing) {
      let currentX = x;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        ctx.fillText(char, currentX, y);

        // Calculate the width of the current character
        const charWidth = ctx.measureText(char).width;
        currentX += charWidth + spacing;
      }
    }
  }
}
</script>

<style scoped>
.eink-canvas {
  border: 1px solid #ddd;
  display: block;
}
</style>
