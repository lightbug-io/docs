<template>
    <div class="fancy-bytes-container">
        <div class="fancy-bytes">
            <div class="byte-container">
                <span
                    v-for="(group, index) in groupedByteArray"
                    :key="index"
                    class="byte-group"
                    @mouseover="setHoveredByte(group.start)"
                    @mouseleave="clearHoveredByte"
                >
                    <span
                        v-for="(byte, byteIndex) in group.bytes"
                        :key="byteIndex"
                        class="byte"
                        :class="['byte-color-' + (index % 6)]"
                        :style="{ fontWeight: isBoldByte(group.start + byteIndex) ? 'bold' : 'normal' }"
                    >
                        {{ byte }}<span v-if="byteIndex < group.bytes.length - 1" class="no-width">&nbsp;</span>
                    </span>
                    <span v-if="index < groupedByteArray.length - 1" class="no-width">&nbsp;</span>
                </span>
            </div>
            <table class="byte-definitions">
                <thead>
                    <tr>
                        <th title="Section of the message">Section</th>
                        <th>Element</th>
                        <th title="Bytes represented in a human understandable way">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(byteDef, index) in byteDefinition"
                        :key="index"
                        :style="{
                            fontWeight: hoveredByte !== null && isByteInRange(hoveredByte, byteDef) ? 'bold' : 'normal',
                            backgroundColor: getRowColor(byteDef.name, index)
                        }"
                    >
                        <td>{{ byteDef.name }}</td>
                        <td>{{ byteDef.desc }}</td>
                        <td :style="{ fontWeight: byteDef.bold ? 'bold' : 'normal' }">{{ byteDef.value !== undefined ? byteDef.value : '' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

interface ByteDefinition {
    pos: number;
    len: number;
    name?: string;
    desc: string;
    type: string;
    value: string;
    bold?: boolean;
}

interface ByteGroup {
    start: number;
    bytes: string[];
}

export default defineComponent({
    name: 'FancyBytes',
    props: {
        byteString: {
            type: String,
            required: true
        },
        byteDefinition: {
            type: Array as PropType<ByteDefinition[]>,
            required: true
        }
    },
    setup() {
        const hoveredByte = ref<number | null>(null);
        const lastName = ref<string | null>(null);
        const lastColor = ref<string>('#fff');

        const setHoveredByte = (index: number) => {
            hoveredByte.value = index;
        };

        const clearHoveredByte = () => {
            hoveredByte.value = null;
        };

        const getRowColor = (name: string, index: number): string => {
            if (index === 0) {
                lastColor.value = '#fff';
            } else if (name !== lastName.value) {
                lastName.value = name;
                lastColor.value = lastColor.value === ('#fff') ? ('#f2f2f2') : ('#fff');
            }
            return lastColor.value;
        };

        return {
            hoveredByte,
            setHoveredByte,
            clearHoveredByte,
            getRowColor
        };
    },
    computed: {
        byteArray(): string[] {
            return this.byteString.split(' ');
        },
        groupedByteArray(): ByteGroup[] {
            const groups: ByteGroup[] = [];
            let currentIndex = 0;

            while (currentIndex < this.byteArray.length) {
                const byteDef = this.byteDefinition.find(def => currentIndex >= def.pos && currentIndex < def.pos + def.len);
                if (byteDef) {
                    const bytes = this.byteArray.slice(byteDef.pos, byteDef.pos + byteDef.len);
                    groups.push({ start: byteDef.pos, bytes });
                    currentIndex = byteDef.pos + byteDef.len;
                } else {
                    groups.push({ start: currentIndex, bytes: [this.byteArray[currentIndex]] });
                    currentIndex++;
                }
            }

            return groups;
        }
    },
    methods: {
        getByteDescription(index: number): string {
            const byteDef = this.byteDefinition.find(def => index >= def.pos && index < def.pos + def.len);
            return byteDef ? `${byteDef.desc} (${byteDef.type})${byteDef.value !== undefined ? `: ${byteDef.value}` : ''}` : '';
        },
        isBoldByte(index: number): boolean {
            const byteDef = this.byteDefinition.find(def => index >= def.pos && index < def.pos + def.len);
            return byteDef ? !!byteDef.bold : false;
        },
        isByteInRange(index: number, byteDef: ByteDefinition): boolean {
            return index >= byteDef.pos && index < byteDef.pos + byteDef.len;
        }
    }
});
</script>

<style scoped>
.fancy-bytes-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
}

.fancy-bytes {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.byte-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.byte {
    margin-right: 2px;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 2px 4px;
    display: inline-block;
}

.dark .byte {
    border: 1px solid #555;
    color: white;
}

.byte-color-0 {
    background-color: #f0f8ff;
}

.byte-color-1 {
    background-color: #e6e6fa;
}

.byte-color-2 {
    background-color: #f5f5dc;
}

.byte-color-3 {
    background-color: #fafad2;
}

.byte-color-4 {
    background-color: #ffe4e1;
}

.byte-color-5 {
    background-color: #e0ffff;
}

.dark .byte-color-0 {
    background-color: #2f4f4f;
}

.dark .byte-color-1 {
    background-color: #556b2f;
}

.dark .byte-color-2 {
    background-color: #8b4513;
}

.dark .byte-color-3 {
    background-color: #483d8b;
}

.dark .byte-color-4 {
    background-color: #2e8b57;
}

.dark .byte-color-5 {
    background-color: #4682b4;
}

.no-width {
    display: inline-block;
    width: 0;
    height: 0;
}

.byte-description {
    margin-top: 8px;
    font-style: italic;
    color: #555;
}

.byte-definitions {
    margin-top: 8px;
    font-style: italic;
    color: #555;
    width: 100%;
    border-collapse: collapse;
}

.byte-definitions th,
.byte-definitions td {
    border: 1px solid #ddd;
    padding: 2px;
    padding-left: 4px;
    padding-right: 4px;
}

.dark .byte-definitions th,
.dark .byte-definitions td {
    border: 1px solid #555;
}

.byte-definitions th {
    background-color: #f2f2f2;
    text-align: left;
}

.dark .byte-definitions th {
    background-color: #444;
}

.byte-definition {
    margin-bottom: 4px;
}
</style>
