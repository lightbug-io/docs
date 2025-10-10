<template>
    <div class="protocol-bytes-container">
        <!-- Byte visualization header with controls -->
        <div class="byte-header">
            <div class="byte-visualization-wrapper">
                <div class="byte-visualization" v-if="!isBytesCollapsed">
                    <div
                        v-for="(section, sectionIndex) in byteSections"
                        :key="sectionIndex"
                        class="byte-section"
                    >
                        <div class="byte-row">
                            <span
                                v-for="(byte, byteIndex) in section.bytes"
                                :key="byteIndex"
                                class="byte"
                                :class="[
                                    getByteColorClass(sectionIndex),
                                    { 'byte-highlight': isByteHighlighted(sectionIndex, byteIndex) }
                                ]"
                                @mouseenter="setHoverByte(sectionIndex, byteIndex)"
                                @mouseleave="clearHoverByte()"
                            >
                                {{ formatByte(byte) }}
                            </span>
                        </div>
                        <div class="byte-annotation">
                            <span
                                class="annotation-label"
                                :class="{ 'annotation-highlight': isAnnotationHighlighted(sectionIndex, 'label') }"
                                @mouseenter="setHoverAnnotation(sectionIndex, 'label', -1)"
                                @mouseleave="clearHoverAnnotation()"
                            >
                                {{ section.label }}
                            </span>
                            <template v-if="section.structure && section.structure.length > 0">
                                <span
                                    class="annotation-detail"
                                    :class="{ 'annotation-highlight': isAnnotationHighlighted(sectionIndex, 'length') }"
                                    @mouseenter="setHoverAnnotation(sectionIndex, 'length', -1)"
                                    @mouseleave="clearHoverAnnotation()"
                                >
                                    Length: {{ section.structure[1].count }}
                                </span>
                                <span
                                    class="annotation-detail annotation-value-container"
                                    :class="{ 'annotation-highlight': isAnnotationHighlighted(sectionIndex, 'value') }"
                                    @mouseenter="setHoverAnnotation(sectionIndex, 'value', -1)"
                                    @mouseleave="clearHoverAnnotation()"
                                >
                                    Value: {{ section.value }}
                                    <span
                                        v-if="section.isUndefined"
                                        class="parse-selector-trigger"
                                        @click.stop="toggleParseSelector(sectionIndex)"
                                        title="Click to parse as different type"
                                    >
                                        ⚙️
                                    </span>
                                    <div
                                        v-if="section.isUndefined && activeParseSelectorIndex === sectionIndex"
                                        class="parse-selector-dropdown"
                                        @click.stop
                                    >
                                        <div
                                            v-for="type in parseTypes"
                                            :key="type"
                                            class="parse-option"
                                            :class="{ 'parse-option-selected': section.parseAs === type }"
                                            @click="changeParseType(sectionIndex, type)"
                                        >
                                            {{ type }}
                                        </div>
                                    </div>
                                </span>
                            </template>
                            <span
                                v-else-if="section.value"
                                class="annotation-value"
                            >
                                <template v-if="isCommaSeparatedList(section.value)">
                                    <span
                                        v-for="(val, valIndex) in parseCommaSeparatedList(section.value)"
                                        :key="valIndex"
                                        :class="{ 'annotation-highlight': isAnnotationHighlighted(sectionIndex, 'value', valIndex) }"
                                        @mouseenter="setHoverAnnotation(sectionIndex, 'value', valIndex)"
                                        @mouseleave="clearHoverAnnotation()"
                                    >{{ val }}</span>
                                </template>
                                <span
                                    v-else
                                    :class="{ 'annotation-highlight': isAnnotationHighlighted(sectionIndex, 'value') }"
                                    @mouseenter="setHoverAnnotation(sectionIndex, 'value', -1)"
                                    @mouseleave="clearHoverAnnotation()"
                                >{{ section.value }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else class="byte-visualization-collapsed">
                    <div
                        v-for="(section, sectionIndex) in byteSections"
                        :key="sectionIndex"
                        class="byte-section-inline"
                    >
                        <span
                            v-for="(byte, byteIndex) in section.bytes"
                            :key="byteIndex"
                            class="byte"
                            :class="getByteColorClass(sectionIndex)"
                        >
                            {{ formatByte(byte) }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="byte-controls">
                <v-icon @click="toggleBytesCollapsed" class="control-icon" :title="isBytesCollapsed ? 'Show information' : 'Hide information'">
                    {{ isBytesCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                </v-icon>
                <v-icon @click="toggleCogModal" class="control-icon" title="Copy Options">mdi-cog</v-icon>
                <v-icon v-if="showGeneratorLink" @click="navigateToGenerate" class="control-icon" title="Edit in Generator">mdi-pencil</v-icon>
                <v-icon @click="copyToClipboard" class="control-icon" title="Copy to Clipboard">mdi-content-copy</v-icon>
            </div>
        </div>

        <!-- Settings Modal -->
        <v-dialog v-model="isCogModalVisible" max-width="300px">
            <v-card>
                <v-card-title>Copy Options</v-card-title>
                <v-card-text>
                    <h1>Format</h1>
                    <v-radio-group v-model="byteDisplayType" row>
                        <v-radio label="Ints (1 7 255)" value="ints"></v-radio>
                        <v-radio label="Hex (01 07 FF)" value="hex"></v-radio>
                        <v-radio label="Hex with 0x (0x01 0x07 0xFF)" value="hex0x"></v-radio>
                        <v-radio label="Printf ('\\x01' '\\x07' '\\xFF')" value="printf" title="printf, ignores space and comma selections"></v-radio>
                    </v-radio-group>
                    <v-checkbox
                        v-model="byteUpperCase"
                        label="Uppercase"
                        density="compact"
                    ></v-checkbox>
                    <h1>Separators</h1>
                    <v-checkbox
                        v-model="byteCopySpaces"
                        label="Spaces (1 2 3)"
                        density="compact"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="byteCopyCommas"
                        label="Commas (1, 2, 3)"
                        density="compact"
                    ></v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="toggleCogModal">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <div v-if="realDeviceInfo" class="real-device-footer" :class="{ 'real-device-footer-collapsed': isBytesCollapsed }">
            📡 Real example from  {{ realDeviceInfo.generator }} <template v-if="!isBytesCollapsed"> on {{ realDeviceInfo.date }}</template>
            <span v-if="realDeviceInfo.description && !isBytesCollapsed" class="real-device-description">{{ realDeviceInfo.description }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { readTypedData } from '../src/protocol/base.gen';
import crc16 from 'crc/crc16xmodem';
import { Buffer } from 'buffer';

interface ByteSection {
    label: string;
    value?: string;
    bytes: string[];
    structure?: Array<{ label: string; count: number }>;
    isUndefined?: boolean;
    parseAs?: string;
    rawBytes?: number[];
}

export default defineComponent({
    name: 'ProtocolBytes2',
    props: {
        byteString: {
            type: String,
            required: true
        },
        yamlData: {
            type: Object as PropType<any>,
            default: () => ({})
        },
        defaultCollapsed: {
            type: Boolean,
            default: false
        },
        showGeneratorLink: {
            type: Boolean,
            default: true
        },
        showValidation: {
            type: Boolean,
            default: true
        },
        realDeviceInfo: {
            type: Object as PropType<{
                generator: string;
                date: string;
                description?: string;
            } | null>,
            default: null
        }
    },
    setup(props) {
        const isCogModalVisible = ref(false);
        const isBytesCollapsed = ref(props.defaultCollapsed);
        const byteDisplayType = ref<'ints' | 'hex' | 'hex0x' | 'printf'>('ints');
        const byteCopySpaces = ref(true);
        const byteCopyCommas = ref(false);
        const byteUpperCase = ref(true);

        // Hover state management
        const hoveredByte = ref<{ section: number; byte: number } | null>(null);
        const hoveredAnnotation = ref<{ section: number; part: string; valueIndex: number } | null>(null);

        // Parse type selector state
        const activeParseSelectorIndex = ref<number | null>(null);
        const parseTypes = ['bytes', 'ascii', 'uint8', 'uint16', 'uint32', 'int8', 'int16', 'int32', 'float32'];
        const sectionParseOverrides = ref<Record<number, string>>({});

        const byteArray = computed(() => {
            return props.byteString.trim() ? props.byteString.trim().split(' ') : [];
        });

        const allBytes = computed(() => byteArray.value);

        // Helper function to get expected byte size for a type
        const getExpectedByteSize = (type: string): number | null => {
            switch (type.toLowerCase()) {
                case 'uint8':
                case 'int8':
                    return 1;
                case 'uint16':
                case 'int16':
                    return 2;
                case 'uint32':
                case 'int32':
                case 'float32':
                    return 4;
                case 'uint64':
                case 'int64':
                case 'float64':
                    return 8;
                case 'uint':
                case 'int':
                case 'bytes':
                case 'ascii':
                case 'string':
                    return null; // Variable length
                default:
                    return null;
            }
        };

        // Create annotated byte sections for display
        const byteSections = computed(() => {
            const bytes = props.byteString.split(' ').map(s => parseInt(s, 10));
            const sections: ByteSection[] = [];
            let index = 0;

            const readUint16LE = (b1: number, b2: number): number => ((b2 << 8) | b1) >>> 0;

            // Check for LB prefix
            if (bytes.length > 2 && bytes[0] === 76 && bytes[1] === 66) {
                sections.push({
                    label: 'Prefix',
                    value: 'LB',
                    bytes: byteArray.value.slice(0, 2)
                });
                index = 2;
            }

            if (bytes.length <= index) return sections;

            // Protocol version
            sections.push({
                label: 'Protocol',
                value: String(bytes[index]),
                bytes: byteArray.value.slice(index, index + 1)
            });
            index += 1;

            // Length
            const length = readUint16LE(bytes[index], bytes[index + 1]);
            let lengthValue = `${length} bytes`;
            if (props.showValidation) {
                const expectedLength = bytes.length;
                const isValidLength = length === expectedLength;
                lengthValue = isValidLength
                    ? `${length} bytes ✅`
                    : `${length} bytes ❌ (expected ${expectedLength})`;
            }
            sections.push({
                label: 'Length',
                value: lengthValue,
                bytes: byteArray.value.slice(index, index + 2)
            });
            index += 2;

            // Message type
            const messageType = readUint16LE(bytes[index], bytes[index + 1]);
            const messageName = props.yamlData?.messages?.[messageType]?.name || 'Unknown';
            sections.push({
                label: 'Type',
                value: `${messageType} (${messageName})`,
                bytes: byteArray.value.slice(index, index + 2)
            });
            index += 2;

            // Header field count
            const numHeaderFields = readUint16LE(bytes[index], bytes[index + 1]);
            sections.push({
                label: 'Header Count',
                value: String(numHeaderFields),
                bytes: byteArray.value.slice(index, index + 2)
            });
            index += 2;

            // Header field types
            if (numHeaderFields > 0) {
                const headerTypesIndex = index;
                sections.push({
                    label: 'Header Types',
                    value: bytes.slice(index, index + numHeaderFields).join(', '),
                    bytes: byteArray.value.slice(index, index + numHeaderFields)
                });
                index += numHeaderFields;

                // Header field data
                for (let i = 0; i < numHeaderFields; i++) {
                    const headerLength = bytes[index];
                    const headerType = bytes[headerTypesIndex + i];
                    const headerName = props.yamlData?.header?.[headerType]?.name || `Header ${headerType}`;
                    const headerValueType = props.yamlData?.header?.[headerType]?.type || 'uint8';
                    const headerValue = readTypedData(bytes.slice(index + 1, index + 1 + headerLength), headerValueType);

                    // Check if there's a value mapping for this header field
                    const headerValueMapping = props.yamlData?.header?.[headerType]?.values?.[headerValue];
                    let displayValue = headerValueMapping?.name
                        ? `${headerValue} (${headerValueMapping.name})`
                        : String(headerValue);

                    // Validate byte length against expected type size
                    if (props.showValidation) {
                        const expectedSize = getExpectedByteSize(headerValueType);
                        if (expectedSize !== null && headerLength !== expectedSize) {
                            displayValue += ` ❌ (expected ${expectedSize} bytes, got ${headerLength})`;
                        } else if (expectedSize === null && headerLength > 255) {
                            // Variable-length fields have a max of 255 bytes
                            displayValue += ` ❌ (exceeds max length of 255 bytes)`;
                        }
                    }

                    sections.push({
                        label: headerName,
                        value: displayValue,
                        bytes: byteArray.value.slice(index, index + 1 + headerLength),
                        structure: [
                            { label: 'len', count: 1 },
                            { label: 'data', count: headerLength }
                        ]
                    });
                    index += 1 + headerLength;
                }
            }

            // Payload field count
            const numPayloadFields = readUint16LE(bytes[index], bytes[index + 1]);
            sections.push({
                label: 'Payload Count',
                value: String(numPayloadFields),
                bytes: byteArray.value.slice(index, index + 2)
            });
            index += 2;

            // Payload field types
            if (numPayloadFields > 0) {
                const payloadTypesIndex = index;
                sections.push({
                    label: 'Payload Types',
                    value: bytes.slice(index, index + numPayloadFields).join(', '),
                    bytes: byteArray.value.slice(index, index + numPayloadFields)
                });
                index += numPayloadFields;

                // Payload field data
                for (let i = 0; i < numPayloadFields; i++) {
                    const payloadLength = bytes[index];
                    const payloadType = bytes[payloadTypesIndex + i];
                    const payloadFieldDef = props.yamlData?.messages?.[messageType]?.data?.[payloadType];
                    const payloadName = payloadFieldDef?.name || `Field ${payloadType}`;

                    const dataBytes = bytes.slice(index + 1, index + 1 + payloadLength);
                    let displayValue: string;
                    let isUndefined = false;
                    let parseAs = 'bytes';

                    // If field is not defined in spec, allow user to choose parsing
                    if (!payloadFieldDef) {
                        isUndefined = true;
                        // Check if user has selected a parse type for this section
                        const sectionIndex = sections.length; // Will be the index after push
                        parseAs = sectionParseOverrides.value[sectionIndex] || 'bytes';

                        if (parseAs === 'bytes') {
                            displayValue = '(bytes)';
                        } else if (parseAs === 'ascii') {
                            displayValue = String.fromCharCode(...dataBytes);
                        } else {
                            try {
                                const parsedValue = readTypedData(dataBytes, parseAs);
                                displayValue = String(parsedValue);
                            } catch (e) {
                                displayValue = '(parse error)';
                            }
                        }
                    } else {
                        const payloadValueType = payloadFieldDef.type || 'uint8';
                        const payloadValue = readTypedData(dataBytes, payloadValueType);

                        // Check if there's a value mapping for this payload field
                        const payloadValueMapping = payloadFieldDef.values?.[payloadValue];
                        displayValue = payloadValueMapping?.name
                            ? `${payloadValue} (${payloadValueMapping.name})`
                            : String(payloadValue);

                        // Validate byte length against expected type size
                        if (props.showValidation) {
                            const expectedSize = getExpectedByteSize(payloadValueType);
                            if (expectedSize !== null && payloadLength !== expectedSize) {
                                displayValue += ` ❌ (expected ${expectedSize} bytes, got ${payloadLength})`;
                            } else if (expectedSize === null && payloadLength > 255) {
                                // Variable-length fields have a max of 255 bytes
                                displayValue += ` ❌ (exceeds max length of 255 bytes)`;
                            }
                        }
                    }

                    sections.push({
                        label: payloadName,
                        value: displayValue,
                        bytes: byteArray.value.slice(index, index + 1 + payloadLength),
                        structure: [
                            { label: 'len', count: 1 },
                            { label: 'data', count: payloadLength }
                        ],
                        isUndefined,
                        parseAs,
                        rawBytes: dataBytes
                    });
                    index += 1 + payloadLength;
                }
            }

            // Checksum
            const checksumStartIndex = index;
            const crc = readUint16LE(bytes[index], bytes[index + 1]);

            // Calculate expected CRC for validation
            let checksumValue = String(crc);
            if (props.showValidation) {
                const expectedCRC = crc16(Buffer.from(bytes.slice(0, checksumStartIndex)));
                const isValid = crc === expectedCRC;
                if (isValid) {
                    checksumValue = `${crc} ✅`;
                } else {
                    // Show expected CRC with individual bytes in little-endian format
                    const expectedLowByte = expectedCRC & 0xFF;
                    const expectedHighByte = (expectedCRC >> 8) & 0xFF;
                    checksumValue = `${crc} ❌ (expected ${expectedCRC} [${expectedLowByte} ${expectedHighByte}])`;
                }
            }

            sections.push({
                label: 'Checksum',
                value: checksumValue,
                bytes: byteArray.value.slice(index, index + 2)
            });

            return sections;
        });

        const toggleBytesCollapsed = () => {
            isBytesCollapsed.value = !isBytesCollapsed.value;
        };

        const toggleCogModal = () => {
            isCogModalVisible.value = !isCogModalVisible.value;
        };

        const formatByte = (byte: string): string => {
            let formattedByte = '';
            if (byteDisplayType.value === 'hex') {
                formattedByte = parseInt(byte).toString(16).padStart(2, '0');
            } else if (byteDisplayType.value === 'hex0x') {
                formattedByte = '0x' + parseInt(byte).toString(16).padStart(2, '0');
            } else {
                formattedByte = byte;
            }
            return byteUpperCase.value ? formattedByte.toUpperCase() : formattedByte.toLowerCase();
        };

        const getByteColorClass = (index: number): string => {
            const colors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
            return colors[index % colors.length];
        };

        const copyToClipboard = () => {
            let text = byteArray.value.map(byte => formatByte(byte)).join(' ');
            if (byteDisplayType.value === 'printf') {
                text = byteArray.value.map(byte => `'\\x${parseInt(byte).toString(16).padStart(2, '0')}'`).join('');
            } else {
                if (byteCopyCommas.value) {
                    text = text.replace(/ /g, ', ');
                }
                if (!byteCopySpaces.value) {
                    text = text.replace(/ /g, '');
                }
            }
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard:', text);
            });
        };

        const navigateToGenerate = (event: MouseEvent) => {
            const url = new URL(window.location.href);
            url.pathname = '/devices/api/generate';
            url.searchParams.set('bytes', props.byteString);
            if (event.ctrlKey || event.metaKey) {
                window.open(url.toString(), '_blank');
            } else {
                window.location.href = url.toString();
            }
        };

        // Hover interaction functions
        const setHoverByte = (section: number, byte: number) => {
            hoveredByte.value = { section, byte };
        };

        const clearHoverByte = () => {
            hoveredByte.value = null;
        };

        const setHoverAnnotation = (section: number, part: string, valueIndex: number = -1) => {
            hoveredAnnotation.value = { section, part, valueIndex };
        };

        const clearHoverAnnotation = () => {
            hoveredAnnotation.value = null;
        };

        // Helper functions for comma-separated lists
        const isCommaSeparatedList = (value: string): boolean => {
            return typeof value === 'string' && value.includes(',');
        };

        const parseCommaSeparatedList = (value: string): string[] => {
            return value.split(',').map((v, i, arr) => i < arr.length - 1 ? v + ',' : v);
        };

        const toggleParseSelector = (sectionIndex: number) => {
            if (activeParseSelectorIndex.value === sectionIndex) {
                activeParseSelectorIndex.value = null;
            } else {
                activeParseSelectorIndex.value = sectionIndex;
            }
        };

        const changeParseType = (sectionIndex: number, parseType: string) => {
            sectionParseOverrides.value[sectionIndex] = parseType;
            activeParseSelectorIndex.value = null;
        };

        // Close dropdown when clicking outside
        const closeParseSelector = () => {
            activeParseSelectorIndex.value = null;
        };

        // Add click listener to close dropdown when clicking outside
        if (typeof document !== 'undefined') {
            document.addEventListener('click', closeParseSelector);
        }

        const isByteHighlighted = (section: number, byte: number): boolean => {
            // Highlight if this byte is directly hovered
            if (hoveredByte.value?.section === section && hoveredByte.value?.byte === byte) {
                return true;
            }

            // Highlight if the annotation is hovered
            if (hoveredAnnotation.value?.section === section) {
                const currentSection = byteSections.value[section];
                if (!currentSection) return false;

                const part = hoveredAnnotation.value.part;
                const valueIndex = hoveredAnnotation.value.valueIndex;

                // For sections with structure (len + data)
                if (currentSection.structure && currentSection.structure.length > 0) {
                    const lengthByteCount = currentSection.structure[0].count;
                    const dataByteCount = currentSection.structure[1].count;

                    if (part === 'label') {
                        // Label = all bytes
                        return true;
                    } else if (part === 'length') {
                        // Length bytes (first lengthByteCount bytes)
                        return byte < lengthByteCount;
                    } else if (part === 'value') {
                        // Data bytes (after length bytes)
                        return byte >= lengthByteCount && byte < lengthByteCount + dataByteCount;
                    }
                }

                // For sections without structure
                if (part === 'label') {
                    // Label = all bytes
                    return true;
                } else if (part === 'value') {
                    // If hovering a specific value in a comma-separated list
                    if (valueIndex >= 0) {
                        return byte === valueIndex;
                    }
                    // Otherwise all bytes
                    return true;
                }
            }

            return false;
        };

        const isAnnotationHighlighted = (section: number, part: string, valueIndex: number = -1): boolean => {
            // Highlight if this annotation is directly hovered
            if (hoveredAnnotation.value?.section === section &&
                hoveredAnnotation.value?.part === part) {
                // For comma-separated values, check if the specific value is hovered
                if (valueIndex >= 0 && hoveredAnnotation.value.valueIndex >= 0) {
                    return hoveredAnnotation.value.valueIndex === valueIndex;
                }
                // For non-indexed or when hovering the whole thing
                if (valueIndex === -1 || hoveredAnnotation.value.valueIndex === -1) {
                    return true;
                }
            }

            // Highlight if a related byte is hovered
            if (hoveredByte.value?.section === section) {
                const currentSection = byteSections.value[section];
                if (!currentSection) return false;

                const byte = hoveredByte.value.byte;

                // For sections with structure
                if (currentSection.structure && currentSection.structure.length > 0) {
                    const lengthByteCount = currentSection.structure[0].count;
                    const dataByteCount = currentSection.structure[1].count;

                    if (part === 'label') {
                        // Label is always highlighted when any byte is hovered
                        return true;
                    } else if (part === 'length') {
                        // Highlight length when hovering length bytes
                        return byte < lengthByteCount;
                    } else if (part === 'value') {
                        // Highlight value when hovering data bytes
                        return byte >= lengthByteCount && byte < lengthByteCount + dataByteCount;
                    }
                }

                // For sections without structure
                if (part === 'label') {
                    // Label is always highlighted when any byte is hovered
                    return true;
                } else if (part === 'value') {
                    // If this is a comma-separated list, only highlight the specific value
                    if (valueIndex >= 0) {
                        return byte === valueIndex;
                    }
                    // Otherwise highlight the whole value
                    return true;
                }
            }

            return false;
        };

        return {
            byteSections,
            allBytes,
            isCogModalVisible,
            toggleCogModal,
            isBytesCollapsed,
            toggleBytesCollapsed,
            byteDisplayType,
            byteCopySpaces,
            byteCopyCommas,
            byteUpperCase,
            formatByte,
            getByteColorClass,
            copyToClipboard,
            navigateToGenerate,
            setHoverByte,
            clearHoverByte,
            setHoverAnnotation,
            clearHoverAnnotation,
            isByteHighlighted,
            isAnnotationHighlighted,
            isCommaSeparatedList,
            parseCommaSeparatedList,
            activeParseSelectorIndex,
            parseTypes,
            toggleParseSelector,
            changeParseType
        };
    }
});
</script>

<style scoped>
.protocol-bytes-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: visible;
    margin: 20px 0;
}

.dark .protocol-bytes-container {
    border-color: #444;
}

.byte-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px;
    background-color: #fafafa;
    gap: 16px;
    overflow: visible;
}

.dark .byte-header {
    background-color: #1e1e1e;
}

.byte-visualization-wrapper {
    flex: 1;
    min-width: 0;
    overflow: visible;
}

.byte-visualization {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 8px;
    overflow: visible;
}

.byte-visualization-collapsed {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.byte-section-inline {
    display: inline-flex;
    gap: 2px;
    margin-right: 4px;
}

.byte-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.byte-structure {
    display: flex;
    gap: 2px;
    margin-bottom: 2px;
}

.structure-label {
    font-size: 9px;
    text-transform: uppercase;
    font-weight: 600;
    color: #999;
    text-align: center;
    letter-spacing: 0.5px;
}

.dark .structure-label {
    color: #666;
}

.byte-row {
    display: flex;
    gap: 2px;
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

.byte-annotation {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    padding-left: 2px;
}

.annotation-label {
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: color 0.2s ease;
}

.dark .annotation-label {
    color: #999;
}

.annotation-value {
    color: #888;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    cursor: pointer;
    transition: color 0.2s ease;
}

.dark .annotation-value {
    color: #aaa;
}

.annotation-detail {
    color: #888;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 10px;
    cursor: pointer;
    transition: color 0.2s ease;
}

.dark .annotation-detail {
    color: #aaa;
}

.annotation-highlight {
    color: #3eaf7c !important;
    font-weight: 700;
}

.annotation-value-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.parse-selector-trigger {
    cursor: pointer;
    font-size: 12px;
    opacity: 0.6;
    transition: opacity 0.2s ease;
    user-select: none;
}

.parse-selector-trigger:hover {
    opacity: 1;
}

.parse-selector-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 100px;
    overflow: hidden;
}

.dark .parse-selector-dropdown {
    background: #2d2d2d;
    border-color: #555;
}

.parse-option {
    padding: 6px 12px;
    cursor: pointer;
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    transition: background-color 0.2s ease;
}

.parse-option:hover {
    background-color: #f5f5f5;
}

.dark .parse-option:hover {
    background-color: #3a3a3a;
}

.parse-option-selected {
    background-color: #3eaf7c;
    color: white;
}

.parse-option-selected:hover {
    background-color: #35946a;
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

.byte-controls {
    display: flex;
    gap: 8px;
}

.control-icon {
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
}

.control-icon:hover {
    color: #3eaf7c;
}

.dark .control-icon {
    color: #aaa;
}

.dark .control-icon:hover {
    color: #3eaf7c;
}

.annotation-value-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.parse-selector-trigger {
    cursor: pointer;
    font-size: 12px;
    opacity: 0.6;
    transition: opacity 0.2s;
    user-select: none;
}

.parse-selector-trigger:hover {
    opacity: 1;
}

.parse-selector-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 100px;
    overflow: hidden;
}

.dark .parse-selector-dropdown {
    background: #2a2a2a;
    border-color: #555;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.parse-option {
    padding: 6px 12px;
    cursor: pointer;
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    transition: background-color 0.2s;
}

.parse-option:hover {
    background-color: #f0f0f0;
}

.dark .parse-option:hover {
    background-color: #3a3a3a;
}

.parse-option-selected {
    background-color: #e8f5e9;
    font-weight: 600;
}

.dark .parse-option-selected {
    background-color: #2e4f2e;
}

.real-device-footer {
    background-color: #f0f4ff;
    border-left: 3px solid #667eea;
    border-top: 1px solid #e0e0e0;
    color: #4a5568;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 400;
    margin-top: -1px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    transition: padding 0.2s ease;
}

.real-device-footer-collapsed {
    padding: 4px 8px;
    font-size: 11px;
}

.real-device-description {
    display: block;
    margin-top: 3px;
    font-size: 11px;
    opacity: 0.85;
    font-style: italic;
}

.dark .real-device-footer {
    background-color: #1a1f2e;
    border-left-color: #8b9cf6;
    border-top-color: #444;
    color: #a0aec0;
}
</style>
