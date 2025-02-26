<template>
    <div>
        <div class="controls-import">
            <h4>Import</h4>
            <span>Import your own C array here onto the canvas below.</span>
            <v-textarea v-model="cArrayInput" label="C array" placeholder="Paste C array here" outlined density="compact"></v-textarea>
            <div style="display: flex; gap: 10px;">
                <v-text-field v-model.number="importWidth" label="Width" type="number" density="compact"></v-text-field>
                <v-text-field v-model.number="importHeight" label="Height" type="number" density="compact"></v-text-field>
            </div>
            <span>Presets:&nbsp;</span>
            <v-btn @click="loadPreset('lightbug2020')" density="compact">Lightbug 20x20</v-btn>&nbsp;
            <v-btn @click="loadPreset('lightbug3030')" density="compact">Lightbug 30x30</v-btn>&nbsp;
            <v-btn @click="loadPreset('lightbug4040')" density="compact">Lightbug 40x40</v-btn>
            <hr>
        </div>
        <div class="controls-import">
            <div style="display: flex; gap: 10px;">
                <v-text-field v-model.number="importX" label="X Position" type="number" density="compact"></v-text-field>
                <v-text-field v-model.number="importY" label="Y Position" type="number" density="compact"></v-text-field>
            </div>
            <div style="display: flex; gap: 10px;">
                <v-btn @click="importFromText" density="compact">Render</v-btn>
                <v-checkbox v-model="clearBeforeRender" label="Clear before render" density="compact"></v-checkbox>
            </div>
        </div>
        <h4>Canvas</h4>
        <span>Canvas for importing onto, or drawing on.</span>
        <canvas ref="pixelCanvas"></canvas>
        <div class="controls-bottom">
            <p><v-btn @click="clearCanvas" density="compact">Clear</v-btn></p>
            <v-slider v-model="brushSize" label="Brush Size" min="5" max="500" density="compact"></v-slider>
        </div>
        <h4>Export</h4>
        <p>Takes the rendering in the canvas above, and outputs it as one or more C arrays</p>
        <div style="display: flex; gap: 10px;">
        <v-btn @click="exportBitmap" density="compact">Export Bitmap</v-btn>
        <v-checkbox v-model="splitForExport" label="Split for messaging (max 255 bytes)" density="compact"></v-checkbox>
        </div>
        <div v-for="(box, index) in exportBoxes" :key="index">
            <div style="display: flex; gap: 10px;">
                <v-text-field v-model.number="box.exportPositionX" label="X Position" type="number" density="compact" readonly></v-text-field>
                <v-text-field v-model.number="box.exportPositionY" label="Y Position" type="number" density="compact" readonly></v-text-field>
                <v-text-field v-model.number="box.exportSizeX" label="X Size" type="number" density="compact" readonly></v-text-field>
                <v-text-field v-model.number="box.exportSizeY" label="Y Size" type="number" density="compact" readonly></v-text-field>
                <v-text-field v-model.number="box.bytes" label="Bytes" type="number" density="compact" readonly></v-text-field>
                <v-text-field v-model.number="box.pixels" label="Pixels" type="number" density="compact" readonly></v-text-field>
            </div>
            <v-textarea v-model="box.cArrayOutput" label="C array" outlined density="compact" readonly></v-textarea>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            SCREEN_WIDTH: 250,
            SCREEN_HEIGHT: 122,
            PIXEL_SIZE: 3,
            brushSize: 5,
            isDrawing: false,
            ctx: null,
            cArrayInput: `A Lightbug logo 40 by 40... 0X00,0X00,0X00,0X00,0X00,0X03,0XFF,0XFF,0XFF,0XC0,0X0F,0XFF,0XFF,0XFF,0XF0,0X1F,0XFF,0XFF,0XFF,0XF8,0X3F,0XFF,0XFF,0XFF,0XFC,0X7F,0XFF,0XFF,0XFF,0XFC,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0X00,0XFF,0XFE,0X7F,0XFC,0X00,0X3F,0XFE,0X7F,0XFC,0X00,0X3F,0XFE,0X7F,0XFF,0XE7,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X3F,0XFF,0XFF,0XFF,0XFC,0X3F,0XFF,0XFF,0XFF,0XFC,0X1F,0XFF,0XFF,0XFF,0XF8,0X0F,0XFF,0XFF,0XFF,0XF0,0X03,0XFF,0XFF,0XFF,0XC0,0X00,0X00,0X00,0X00,0X00`,
            importWidth: 40,
            importHeight: 40,
            importX: 0,
            importY: 0,
            clearBeforeRender: true,
            splitForExport: true,
            exportSizeX: 0,
            exportSizeY: 0,
            exportPositionX: 0,
            exportPositionY: 0,
            cArrayOutput: '',
            exportBoxes: [],
            presets: {
                lightbug2020: `0X0F,0XFF,0X00,0X3F,0XFF,0XC0,0X7F,0XFF,0XE0,0X7F,0XFF,0XE0,0XFF,0X0F,0XF0,0XFE,
                0X07,0XF0,0XFF,0XFF,0XF0,0XFE,0X07,0XF0,0XFE,0X07,0XF0,0XFE,0X07,0XF0,0XFE,0X07,
                0XF0,0XFE,0X07,0XF0,0XFE,0X07,0XF0,0XFE,0X07,0XF0,0XFE,0X07,0XF0,0XFE,0X07,0XF0,
                0X7F,0XFF,0XE0,0X7F,0XFF,0XE0,0X3F,0XFF,0XC0,0X0F,0XFF,0X00`,
                lightbug3030: `0X00,0X00,0X00,0X00,0X0F,0XFF,0XFF,0XC0,0X3F,0XFF,0XFF,0XF0,0X3F,0XFF,0XFF,0XF0,0X7F,0XFF,0XFF,0XF8,0X7F,0XFF,0XFF,0XF8,0X7F,0XFF,0XFF,0XF8,0X7F,0XE0,0X1F,0XF8,0X7F,0XC0,0X0F,0XF8,0X7F,0XFC,0XFF,0XF8,0X7F,0XFF,0XFF,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XC3,0X0F,0XF8,0X7F,0XFF,0XFF,0XF8,0X7F,0XFF,0XFF,0XF8,0X7F,0XFF,0XFF,0XF8,0X3F,0XFF,0XFF,0XF0,0X3F,0XFF,0XFF,0XF0,0X0F,0XFF,0XFF,0XC0,0X00,0X00,0X00,0X00`,
                lightbug4040: `0X00,0X00,0X00,0X00,0X00,0X03,0XFF,0XFF,0XFF,0XC0,0X0F,0XFF,0XFF,0XFF,0XF0,0X1F,
                0XFF,0XFF,0XFF,0XF8,0X3F,0XFF,0XFF,0XFF,0XFC,0X7F,0XFF,0XFF,0XFF,0XFC,0X7F,0XFF,
                0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0X00,
                0XFF,0XFE,0X7F,0XFC,0X00,0X3F,0XFE,0X7F,0XFC,0X00,0X3F,0XFE,0X7F,0XFF,0XE7,0XFF,
                0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,
                0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,
                0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,
                0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFC,0X18,
                0X3F,0XFE,0X7F,0XFC,0X18,0X3F,0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X7F,0XFF,0XFF,0XFF,
                0XFE,0X7F,0XFF,0XFF,0XFF,0XFE,0X3F,0XFF,0XFF,0XFF,0XFC,0X3F,0XFF,0XFF,0XFF,0XFC,
                0X1F,0XFF,0XFF,0XFF,0XF8,0X0F,0XFF,0XFF,0XFF,0XF0,0X03,0XFF,0XFF,0XFF,0XC0,0X00,
                0X00,0X00,0X00,0X00`
            }
        };
    },
    mounted() {
        const canvas = this.$refs.pixelCanvas;
        this.ctx = canvas.getContext("2d");
        canvas.width = this.SCREEN_WIDTH * this.PIXEL_SIZE;
        canvas.height = this.SCREEN_HEIGHT * this.PIXEL_SIZE;
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        canvas.addEventListener("mousedown", () => (this.isDrawing = true));
        canvas.addEventListener("mouseup", () => (this.isDrawing = false));
        canvas.addEventListener("mousemove", this.handleMouseMove);
        canvas.addEventListener("click", this.fillPixel);
    },
    methods: {
        getMousePos(event) {
            const rect = this.$refs.pixelCanvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.PIXEL_SIZE);
            const y = Math.floor((event.clientY - rect.top) / this.PIXEL_SIZE);
            return { x, y };
        },
        fillPixel(event) {
            const { x, y } = this.getMousePos(event);
            this.ctx.fillStyle = "#000";
            this.ctx.fillRect(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, this.brushSize, this.brushSize);
        },
        clearCanvas() {
            this.ctx.fillStyle = "#FFF";
            this.ctx.fillRect(0, 0, this.$refs.pixelCanvas.width, this.$refs.pixelCanvas.height);
        },
        importBitmap(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const bitmapData = this.parseCArray(content);
                this.renderBitmap(bitmapData, this.importWidth, this.importHeight, this.importX, this.importY);
            };
            reader.readAsText(file);
        },
        importFromText() {
            const bitmapData = this.parseCArray(this.cArrayInput);
            this.renderBitmap(bitmapData, this.importWidth, this.importHeight, this.importX, this.importY);
        },
        parseCArray(content) {
            const regex = /(0(x|X)[0-9a-fA-F]{2},\s*)+/;
            const matches = content.match(regex);
            const bitmapData = matches[0].split(/,\s*/).map(byte => parseInt(byte, 16));
            return bitmapData;
        },
        async renderBitmap(bitmapData, width, height, offsetX, offsetY) {
            if (this.clearBeforeRender) {
                this.clearCanvas();
            }
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < Math.ceil(width / 8); x++) {
                    const byte = bitmapData[y * Math.ceil(width / 8) + x];
                    for (let bit = 0; bit < 8; bit++) {
                        if (x * 8 + bit >= width) break;
                        const isBlack = byte & (1 << (7 - bit));
                        if (isBlack) {
                            this.ctx.fillStyle = "#000";
                            this.ctx.fillRect((x * 8 + bit + offsetX) * this.PIXEL_SIZE, (y + offsetY) * this.PIXEL_SIZE, this.PIXEL_SIZE, this.PIXEL_SIZE);
                        }
                    }
                }
            }
        },
        loadPreset(preset) {
            this.cArrayInput = this.presets[preset];
            if (preset === 'lightbug2020') {
                this.importWidth = 20;
                this.importHeight = 20;
            } else if (preset === 'lightbug3030') {
                this.importWidth = 30;
                this.importHeight = 30;
            } else if (preset === 'lightbug4040') {
                this.importWidth = 40;
                this.importHeight = 40;
            }
        },
        handleMouseMove(event) {
            if (this.isDrawing) {
                this.fillPixel(event);
            }
        },
        exportBitmap() {
            const canvas = this.$refs.pixelCanvas;
            const ctx = this.ctx;
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            // Determine bounding box in canvas (physical pixel) coordinates.
            let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    // Assuming drawn pixels are pure black and background is white.
                    if (r < 128 && g < 128 && b < 128) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            // If no black pixel found, clear export fields.
            if (maxX === -1) {
                this.exportBoxes = [];
                return;
            }

            // Convert canvas coordinates to grid coordinates.
            const gridX = Math.floor(minX / this.PIXEL_SIZE);
            const gridY = Math.floor(minY / this.PIXEL_SIZE);
            const gridMaxX = Math.floor(maxX / this.PIXEL_SIZE);
            const gridMaxY = Math.floor(maxY / this.PIXEL_SIZE);
            const gridWidth = gridMaxX - gridX + 1;
            const gridHeight = gridMaxY - gridY + 1;

            // Build a binary grid representing filled cells.
            const binaryGrid = [];
            for (let row = 0; row < gridHeight; row++) {
                binaryGrid[row] = [];
                for (let col = 0; col < gridWidth; col++) {
                    // Calculate the cell's top-left canvas coordinate.
                    const cellX = (gridX + col) * this.PIXEL_SIZE;
                    const cellY = (gridY + row) * this.PIXEL_SIZE;
                    let isBlackCell = false;
                    // Check every pixel in the cell.
                    for (let j = 0; j < this.PIXEL_SIZE; j++) {
                        for (let i = 0; i < this.PIXEL_SIZE; i++) {
                            const cx = cellX + i;
                            const cy = cellY + j;
                            if (cx >= canvas.width || cy >= canvas.height) continue;
                            const idx = (cy * canvas.width + cx) * 4;
                            const r = data[idx];
                            const g = data[idx + 1];
                            const b = data[idx + 2];
                            if (r < 128 && g < 128 && b < 128) {
                                isBlackCell = true;
                                break;
                            }
                        }
                        if (isBlackCell) break;
                    }
                    binaryGrid[row][col] = isBlackCell ? 1 : 0;
                }
            }

            // Function to pack binary grid into bytes and generate C array.
            const packBinaryGrid = (startRow, endRow) => {
                const cArray = [];
                const bytesPerRow = Math.ceil(gridWidth / 8);
                for (let row = startRow; row <= endRow; row++) {
                    for (let byteIndex = 0; byteIndex < bytesPerRow; byteIndex++) {
                        let byte = 0;
                        for (let bit = 0; bit < 8; bit++) {
                            const col = byteIndex * 8 + bit;
                            const bitValue = col < gridWidth ? binaryGrid[row][col] : 0;
                            byte |= (bitValue << (7 - bit));
                        }
                        // Format byte as hex (e.g., 0X3F)
                        cArray.push('0X' + byte.toString(16).padStart(2, '0').toUpperCase());
                    }
                }
                return cArray;
            };

            // Split into bounding boxes if necessary.
            const maxBytes = 255;
            const bytesPerRow = Math.ceil(gridWidth / 8);
            const maxRowsPerBox = Math.floor(maxBytes / bytesPerRow);
            let startRow = 0;

            this.exportBoxes = [];

            if (this.splitForExport) {
                while (startRow < gridHeight) {
                    const endRow = Math.min(startRow + maxRowsPerBox - 1, gridHeight - 1);
                    const cArray = packBinaryGrid(startRow, endRow);
                    this.exportBoxes.push({
                        exportPositionX: gridX,
                        exportPositionY: gridY + startRow,
                        exportSizeX: gridWidth,
                        exportSizeY: endRow - startRow + 1,
                        bytes: cArray.length,
                        pixels: (endRow - startRow + 1) * gridWidth,
                        cArrayOutput: cArray.join(',')
                    });
                    startRow = endRow + 1;
                }
            } else {
                const cArray = packBinaryGrid(0, gridHeight - 1);
                this.exportBoxes.push({
                    exportPositionX: gridX,
                    exportPositionY: gridY,
                    exportSizeX: gridWidth,
                    exportSizeY: gridHeight,
                    bytes: cArray.length,
                    pixels: gridWidth * gridHeight,
                    cArrayOutput: cArray.join(',')
                });
            }
        }
    }
};
</script>

<style scoped>
body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #333;
}
canvas {
    image-rendering: pixelated;
    border: 2px solid black;
    cursor: crosshair;
}
.controls {
    margin-bottom: 10px;
}
textarea {
    width: 100%;
    height: 100px;
    margin-top: 10px;
}
input[type="number"] {
    width: 50px;
    margin: 5px;
}
</style>
