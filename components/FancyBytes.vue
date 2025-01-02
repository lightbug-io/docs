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
                        :style="{ backgroundColor: getByteColor(group.start + byteIndex), fontWeight: isBoldByte(group.start + byteIndex) ? 'bold' : 'normal' }"
                    >
                        {{ byte }}<span v-if="byteIndex < group.bytes.length - 1" class="no-width">&nbsp;</span>
                    </span>
                    <span v-if="index < groupedByteArray.length - 1" class="no-width">&nbsp;</span>
                </span>
            </div>
            <div class="byte-description">
                {{ hoveredByte !== null ? getByteDescription(hoveredByte) : 'Hover over a byte to see a description...' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

interface ByteDefinition {
    pos: number;
    len: number;
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

        const setHoveredByte = (index: number) => {
            hoveredByte.value = index;
        };

        const clearHoveredByte = () => {
            hoveredByte.value = null;
        };

        return {
            hoveredByte,
            setHoveredByte,
            clearHoveredByte
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
        getGroupColor(index: number): string {
            const colors = ['#f0f8ff', '#e6e6fa', '#f5f5dc', '#fafad2', '#ffe4e1', '#e0ffff'];
            return colors[index % colors.length];
        },
        getByteColor(index: number): string {
            const byteDef = this.byteDefinition.find(def => index >= def.pos && index < def.pos + def.len);
            return byteDef ? this.getGroupColor(byteDef.pos) : '#d3d3d3'; // grey color for bytes not covered by byteDefinition
        },
        isBoldByte(index: number): boolean {
            const byteDef = this.byteDefinition.find(def => index >= def.pos && index < def.pos + def.len);
            return byteDef ? !!byteDef.bold : false;
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
</style>
