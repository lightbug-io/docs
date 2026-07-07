<template>
    <div class="byte-row-wrapper">
        <button
            v-if="canTruncate"
            type="button"
            class="byte-row-toggle"
            @click="expanded = !expanded"
        >
            {{ expanded ? 'Show less' : `Show ${bytes.length - previewLimit} more…` }}
        </button>
        <div class="byte-row">
            <span
                v-for="(byte, byteIndex) in visibleBytes"
                :key="byteIndex"
                class="byte"
                :class="[
                    getByteColorClass(colorIndex),
                    { 'byte-highlight': shouldHighlight(byteIndex), 'byte-prefix': byteIndex < prefixCount }
                ]"
                @mouseenter="$emit('mouseenter', byteIndex)"
                @mouseleave="$emit('mouseleave', byteIndex)"
            >
                {{ formatByte(byte) }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';

export default defineComponent({
    name: 'Bytes',
    props: {
        bytes: {
            type: Array as PropType<string[]>,
            required: true
        },
        colorIndex: {
            type: Number,
            default: 0
        },
        highlightedIndices: {
            type: Array as PropType<number[]>,
            default: () => []
        },
        displayType: {
            type: String as PropType<'ints' | 'hex' | 'hex0x' | 'printf'>,
            default: 'ints'
        },
        upperCase: {
            type: Boolean,
            default: true
        },
        prefixCount: {
            type: Number,
            default: 0
        }
    },
    emits: ['mouseenter', 'mouseleave'],
    setup(props) {
        const previewLimit = 64;
        const expanded = ref(false);

        const canTruncate = computed(() => props.bytes.length > previewLimit);

        const visibleBytes = computed(() => {
            if (!canTruncate.value || expanded.value) {
                return props.bytes;
            }
            return props.bytes.slice(0, previewLimit);
        });

        const formatByte = (byte: string): string => {
            let formattedByte = '';
            if (props.displayType === 'hex') {
                formattedByte = parseInt(byte).toString(16).padStart(2, '0');
            } else if (props.displayType === 'hex0x') {
                formattedByte = '0x' + parseInt(byte).toString(16).padStart(2, '0');
            } else {
                formattedByte = byte;
            }
            return props.upperCase ? formattedByte.toUpperCase() : formattedByte.toLowerCase();
        };

        const getByteColorClass = (index: number): string => {
            const colors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
            return colors[index % colors.length];
        };

        const shouldHighlight = (byteIndex: number): boolean => {
            return props.highlightedIndices.includes(byteIndex);
        };

        return {
            previewLimit,
            expanded,
            canTruncate,
            visibleBytes,
            formatByte,
            getByteColorClass,
            shouldHighlight
        };
    }
});
</script>

<style scoped>
.byte-row-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    min-width: 0;
    max-width: 100%;
}

.byte-row {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    max-width: 100%;
}

.byte-row-toggle {
    background: none;
    border: none;
    padding: 0;
    color: #3eaf7c;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
}

.byte-row-toggle:hover {
    text-decoration: underline;
}

.dark .byte-row-toggle {
    color: #4dd390;
}

.byte {
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 3px 5px;
    display: inline-block;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.2;
    cursor: pointer;
    transition: all 0.2s ease;
}

.dark .byte {
    border: 1px solid #555;
    color: white;
}

.byte-highlight {
    border-color: #3eaf7c !important;
    box-shadow: 0 0 0 2px rgba(62, 175, 124, 0.3);
    transform: scale(1.05);
    z-index: 10;
    position: relative;
}

.byte-prefix {
    border-style: dashed;
}

.color-0 {
    background-color: #f0f8ff;
}

.color-1 {
    background-color: #f5dbee;
}

.color-2 {
    background-color: #f5f5dc;
}

.color-3 {
    background-color: #fafad2;
}

.color-4 {
    background-color: #ffe4e1;
}

.color-5 {
    background-color: #e0ffff;
}

.dark .color-0 {
    background-color: #2f4f4f;
}

.dark .color-1 {
    background-color: #556b2f;
}

.dark .color-2 {
    background-color: #8b4513;
}

.dark .color-3 {
    background-color: #483d8b;
}

.dark .color-4 {
    background-color: #2e8b57;
}

.dark .color-5 {
    background-color: #4682b4;
}
</style>
