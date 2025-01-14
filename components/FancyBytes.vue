<template>
    <div class="fancy-bytes-container" >
        <v-icon @click="toggleCogModal" class="container-config" title="Options for display">mdi-cog</v-icon>
        <v-icon v-if="showGeneratorLink" @click="navigateToGenerate" class="container-config" title="Edit in Generator" @click.ctrl="navigateToGenerateNewTab">mdi-pencil</v-icon>
        <v-icon @click="copyToClipboard" class="container-config" title="Copy to Clipboard">mdi-content-copy</v-icon>
        <v-icon @click="sendBytes" :class="{ 'highlight-success': isSendSuccess }" class="container-config" title="Send Bytes">mdi-file-send</v-icon>
        <v-dialog v-model="isCogModalVisible" max-width="300px">
            <v-card>
                <v-card-title>Options</v-card-title>
                <v-card-text>
                    <h1>Display</h1>
                    <v-radio-group v-model="byteDisplayType" row>
                        <v-radio label="Ints (1 7 255)" value="ints"></v-radio>
                        <v-radio label="Hex (01 07 FF)" value="hex"></v-radio>
                        <v-radio label="Hex with 0x (0x01 0x07 0xFF)" value="hex0x"></v-radio>
                    </v-radio-group>
                    <h1>Copy & Paste</h1>
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
                    <h1>Send Byte Address</h1>
                    <v-text-field
                        v-model="sendAddress"
                        label="HTTP/HTTPS Address"
                        density="compact"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="toggleCogModal">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="fancy-bytes">
            <div class="byte-container">
                <span
                    v-for="(byteDef, defIndex) in byteDefinitionWithBytes"
                    :key="defIndex"
                >
                    <span
                        v-for="(byte, byteIndex) in byteDef.bytes"
                        :key="byteIndex"
                        class="byte"
                        :class="getByteColorClass(defIndex)"
                        @mouseover="setHoveredByte(byteDef.pos + byteIndex)"
                        @mouseleave="clearHoveredByte"
                        :style="{ fontWeight: isBoldByte(byteDef.pos + byteIndex) ? 'bold' : 'normal' }"
                    >
                        {{ formatByte(byte) }}
                    </span>
                </span>
            </div>
            <span v-if="allowCollapse" @click="toggleTable" class="expand-icon" title="Toggle Table">
                <v-icon right>
                    {{ isTableVisible ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
                <small v-if="!isTableVisible">Expand details</small>
                <small v-if="isTableVisible">Collapse details</small>
            </span>
            <v-expand-transition>
                <table v-show="isTableVisible" class="byte-definitions">
                    <thead>
                        <tr>
                            <th title="Section of the message">Section</th>
                            <th>Element</th>
                            <th title="Bytes for this element">Bytes</th>
                            <th title="Type of data in the element">Type</th>
                            <th title="Bytes parsed in a human readable way">Parsed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(byteDef, index) in byteDefinition"
                            :key="index"
                            @mouseover="setHoveredByteRange(byteDef.pos, byteDef.len)"
                            @mouseleave="clearHoveredByte"
                            :style="{
                                fontWeight: hoveredByte !== null && isByteInRange(hoveredByte, byteDef) ? 'bold' : 'normal',
                                backgroundColor: getRowColor(index)
                            }"
                        >
                            <td>{{ byteDef.name }}</td>
                            <td>{{ byteDef.desc }}</td>
                            <td :style="{ fontWeight: byteDef.bold || (hoveredByte !== null && isByteInRange(hoveredByte, byteDef)) ? 'bold' : 'normal' }">{{ byteDef.value !== undefined ? byteDef.value : '' }}</td>
                            <td>{{ byteDef.type }}</td>
                            <td>{{ byteDef.valueParsed || '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-expand-transition>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch, onMounted, onUnmounted } from 'vue';

interface ByteDefinition {
    pos: number;
    len: number;
    name?: string;
    desc: string;
    type: string;
    value: string;
    valueParsed?: string;
    bold?: boolean;
    bytes?: string[];
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
        },
        showGeneratorLink: {
            type: Boolean,
            default: true
        },
        defaultCollapsed: {
            type: Boolean,
            default: false
        },
        allowCollapse: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const hoveredByte = ref<number | null>(null);
        const hoveredByteRange = ref<{ start: number, end: number } | null>(null);
        const byteDisplayType = ref<'ints' | 'hex' | 'hex0x'>(localStorage.getItem('byteDisplayType') as 'ints' | 'hex' | 'hex0x' || 'ints');
        const byteCopySpaces = ref(localStorage.getItem('byteCopySpaces') === 'true');
        const byteCopyCommas = ref(localStorage.getItem('byteCopyCommas') === 'true');
        const sendAddress = ref(localStorage.getItem('sendAddress') || '');
        const isCogModalVisible = ref(false);
        const isTableVisible = ref(!props.defaultCollapsed);
        const isSendSuccess = ref(false);

        watch(byteDisplayType, (newValue) => {
            localStorage.setItem('byteDisplayType', newValue);
        });

        watch(byteCopySpaces, (newValue) => {
            localStorage.setItem('byteCopySpaces', newValue.toString());
        });

        watch(byteCopyCommas, (newValue) => {
            localStorage.setItem('byteCopyCommas', newValue.toString());
        });

        watch(sendAddress, (newValue) => {
            localStorage.setItem('sendAddress', newValue);
        });

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'byteDisplayType') {
                byteDisplayType.value = event.newValue as 'ints' | 'hex' | 'hex0x';
            } else if (event.key === 'byteCopySpaces') {
                byteCopySpaces.value = event.newValue === 'true';
            } else if (event.key === 'byteCopyCommas') {
                byteCopyCommas.value = event.newValue === 'true';
            } else if (event.key === 'sendAddress') {
                sendAddress.value = event.newValue || '';
            }
        };

        onMounted(() => {
            window.addEventListener('storage', handleStorageChange);
        });

        onUnmounted(() => {
            window.removeEventListener('storage', handleStorageChange);
        });

        const setHoveredByte = (index: number) => {
            hoveredByte.value = index;
        };

        const setHoveredByteRange = (start: number, len: number) => {
            hoveredByteRange.value = { start, end: start + len - 1 };
        };

        const clearHoveredByte = () => {
            hoveredByte.value = null;
            hoveredByteRange.value = null;
        };

        const toggleCogModal = () => {
            isCogModalVisible.value = !isCogModalVisible.value;
        };

        const toggleTable = () => {
            isTableVisible.value = !isTableVisible.value;
        };

        const copyToClipboard = () => {
            let text = props.byteString;
            if (byteCopyCommas.value) {
                text = text.replace(/ /g, ', ');
            }
            if (byteCopySpaces.value) {
                text = text.replace(/ /g, ' ');
            } else {
                text = text.replace(/ /g, '');
            }
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard:', text);
            });
        };

        const sendBytes = async () => {
            if (!sendAddress.value) {
                alert('Please configure the HTTP/HTTPS address in the options.');
                return;
            }
            try {
                const response = await fetch(sendAddress.value, {
                    method: 'POST',
                    body: props.byteString
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                isSendSuccess.value = true;
                setTimeout(() => {
                    isSendSuccess.value = false;
                }, 250);
            } catch (error) {
                console.error('Error sending bytes:', error);
                alert('Error sending bytes');
            }
        };

        const navigateToGenerate = (event) => {
            const url = new URL(window.location.href);
            url.pathname = '/devices/api/generate';
            url.searchParams.set('bytes', props.byteString);
            if (event.ctrlKey || event.metaKey) {
                window.open(url.toString(), '_blank');
            } else {
                window.location.href = url.toString();
            }
        };

        const navigateToGenerateNewTab = () => {
            const url = new URL(window.location.href);
            url.pathname = '/devices/api/generate';
            url.searchParams.set('bytes', props.byteString);
            window.open(url.toString(), '_blank');
        };

        const rowColors = computed(() => {
            const colors: string[] = [];
            let lastColor = '#fff';
            let lastName = '';

            props.byteDefinition.forEach((byteDef, index) => {
                if (index === 0) {
                    lastColor = '#fff';
                } else if (byteDef.name !== lastName) {
                    lastName = byteDef.name;
                    lastColor = lastColor === '#fff' ? '#f2f2f2' : '#fff';
                }
                colors.push(lastColor);
            });

            return colors;
        });

        const getRowColor = (index: number): string => {
            return rowColors.value[index];
        };

        const isByteHighlighted = (index: number): boolean => {
            return hoveredByteRange.value !== null && index >= hoveredByteRange.value.start && index <= hoveredByteRange.value.end;
        };

        const formatByte = (byte: string): string => {
            if (byteDisplayType.value === 'hex') {
                return parseInt(byte).toString(16).toUpperCase();
            } else if (byteDisplayType.value === 'hex0x') {
                return '0x' + parseInt(byte).toString(16).toUpperCase();
            } else {
                return byte;
            }
        };

        const getByteColorClass = (index: number): string => {
            const colors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
            return colors[index % colors.length];
        };

        return {
            hoveredByte,
            setHoveredByte,
            setHoveredByteRange,
            clearHoveredByte,
            getRowColor,
            isByteHighlighted,
            byteDisplayType,
            byteCopySpaces,
            byteCopyCommas,
            sendAddress,
            formatByte,
            isCogModalVisible,
            toggleCogModal,
            copyToClipboard,
            sendBytes,
            isSendSuccess,
            navigateToGenerate,
            navigateToGenerateNewTab,
            isTableVisible,
            toggleTable,
            getByteColorClass
        };
    },
    computed: {
        byteArray(): string[] {
            return this.byteString.trim() ? this.byteString.trim().split(' ') : [];
        },
        byteDefinitionWithBytes(): ByteDefinition[] {
            return this.byteDefinition.map(def => ({
                ...def,
                bytes: this.byteArray.slice(def.pos, def.pos + def.len)
            }));
        }
    },
    methods: {
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
    margin-top: 5px;
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

.invisible-text {
    display: inline-block;
    width: 0;
    height: 0;
    color: transparent;
}

.byte-description {
    margin-top: 8px;
    font-style: italic;
    color: #555;
}

.byte-definitions {
    margin-top: 4px;
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

.container-config {
    cursor: pointer;
    float: right;
}

.expand-icon {
    cursor: pointer;
    float: right;
    margin-top: 10px;
}

.highlight-success {
    color: rgb(25, 233, 25) !important;
}
</style>
