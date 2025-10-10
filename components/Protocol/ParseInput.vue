<template>
    <div class="parse-input-container">
        <!-- Input Field -->
        <v-textarea
            v-model="inputByteString"
            label="Enter byte string (any format: ints, hex, 0x11, comma/space separated)"
            @input="handleInputChange"
            density="compact"
            variant="outlined"
            clearable
            rows="4"
            auto-grow
        >
            <template #append>
                <v-icon
                    v-if="inputByteString"
                    @click="clearInput"
                    style="cursor: pointer;"
                >
                    mdi-close-circle
                </v-icon>
            </template>
        </v-textarea>

        <!-- Statistics -->
        <div v-if="processedBytes.length > 0" class="parse-stats">
            <span class="stat-item">
                <strong>{{ byteStatistics.totalBytes }}</strong> bytes total
            </span>
            <span v-if="foundMessages.length > 0" class="stat-item stat-success">
                <strong>{{ foundMessages.length }}</strong> {{ foundMessages.length === 1 ? 'message' : 'messages' }} found
            </span>
            <span v-else class="stat-item stat-warning">
                No valid messages found
            </span>
            <span v-if="foundMessages.length > 0" class="stat-item">
                <strong>{{ byteStatistics.usedBytes }}</strong> message bytes
            </span>
            <span v-if="foundMessages.length > 0 && byteStatistics.ignoredBytes > 0" class="stat-item stat-muted">
                <strong>{{ byteStatistics.ignoredBytes }}</strong> bytes ignored
            </span>
        </div>

        <!-- Byte Visualization with Highlights -->
        <div v-if="processedBytes.length > 0" class="byte-stream-container">
            <div class="byte-stream-header">
                <span class="byte-stream-title">Byte Stream</span>
                <div class="byte-stream-controls">
                    <div class="control-group">
                        <v-btn
                            size="x-small"
                            variant="text"
                            @click="byteDisplayFormat = 'ints'"
                            :class="{ active: byteDisplayFormat === 'ints' }"
                        >
                            INT
                        </v-btn>
                        <v-btn
                            size="x-small"
                            variant="text"
                            @click="byteDisplayFormat = 'hex'"
                            :class="{ active: byteDisplayFormat === 'hex' }"
                        >
                            HEX
                        </v-btn>
                        <v-btn
                            size="x-small"
                            variant="text"
                            @click="byteDisplayFormat = 'hex0x'"
                            :class="{ active: byteDisplayFormat === 'hex0x' }"
                        >
                            0x
                        </v-btn>
                        <v-btn
                            size="x-small"
                            variant="text"
                            @click="byteDisplayFormat = 'printf'"
                            :class="{ active: byteDisplayFormat === 'printf' }"
                        >
                            PRINTF
                        </v-btn>
                    </div>
                    <div class="control-divider"></div>
                    <div class="control-group">
                        <v-btn
                            size="x-small"
                            variant="text"
                            @click="toggleStreamCopySpaces"
                            :class="{ active: streamCopySpaces }"
                            title="Include spaces between bytes"
                        >
                            SPACE
                        </v-btn>
                        <v-btn
                            size="x-small"
                            variant="text"
                            @click="toggleStreamCopyCommas"
                            :class="{ active: streamCopyCommas }"
                            title="Include commas between bytes"
                        >
                            COMMA
                        </v-btn>
                    </div>
                    <div class="control-divider"></div>
                    <v-btn
                        size="x-small"
                        variant="text"
                        icon
                        @click="copyByteStream"
                        title="Copy Byte Stream"
                    >
                        <v-icon size="small">mdi-content-copy</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="byte-stream">
                <template v-if="byteDisplayFormat === 'printf'">
                    <span class="byte-item-printf">{{ processedBytesForDisplay.join('') }}</span>
                </template>
                <template v-else>
                    <template v-for="(byte, index) in processedBytesForDisplay" :key="index">
                        <span
                            class="byte-item"
                            :class="getByteClass(index)"
                            @mouseenter="hoveredByteIndex = index"
                            @mouseleave="hoveredByteIndex = null"
                        >{{ byte }}</span><span
                            v-if="streamCopyCommas && index < processedBytesForDisplay.length - 1"
                            class="byte-separator-comma"
                        >,</span><span
                            v-if="streamCopySpaces && index < processedBytesForDisplay.length - 1"
                            class="byte-separator-space"
                        > </span>
                    </template>
                </template>
            </div>
        </div>

        <!-- Found Messages -->
        <div v-if="foundMessages.length > 0" class="found-messages">
            <h2 id="found-messages">Found Messages</h2>
            <div
                v-for="(msg, index) in foundMessages"
                :key="index"
                class="message-wrapper"
                @mouseenter="hoveredMessageIndex = index"
                @mouseleave="hoveredMessageIndex = null"
            >
                <div class="message-header-bar">
                    <span class="message-position">
                        <span class="message-number">Message {{ index + 1 }} of {{ foundMessages.length }}</span>
                        <span v-if="msg.messageTypeName" class="message-type-name">{{ msg.messageTypeName }}</span>
                        <span v-if="msg.messageType !== undefined" class="message-type-id">({{ msg.messageType }})</span>
                        <span class="message-range">bytes {{ msg.startIndex }} - {{ msg.endIndex }}</span>
                    </span>
                </div>
                <Message
                    :byteString="msg.byteString"
                    :yamlData="yamlData"
                    :showValidation="true"
                    :showGeneratorLink="true"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import Message from './Message.vue';
import { parseRawMessage, calculateCRC16XMODEM } from '../../src/protocol/base.gen';

interface FoundMessage {
    startIndex: number;
    endIndex: number;
    bytes: number[];
    byteString: string;
    messageType?: number;
    messageTypeName?: string;
}

export default defineComponent({
    name: 'ParseInput',
    components: {
        Message
    },
    props: {
        initialBytes: {
            type: String,
            default: ''
        },
        yamlData: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const inputByteString = ref('');
        const hoveredByteIndex = ref<number | null>(null);
        const hoveredMessageIndex = ref<number | null>(null);
        const byteDisplayFormat = ref<'ints' | 'hex' | 'hex0x' | 'printf'>('ints');

        // Byte stream copy settings
        const streamCopySpaces = ref(true);
        const streamCopyCommas = ref(false);

        // Parse input and convert to normalized byte array
        const processedBytes = computed(() => {
            if (!inputByteString.value.trim()) {
                return [];
            }

            let input = inputByteString.value
                .replace(/0x/gi, ' ') // Remove 0x prefix
                .replace(/,/g, ' ')   // Replace commas with spaces
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim();

            if (input === '') {
                return [];
            }

            // Check if input contains hex characters
            const hasHex = /[a-fA-F]/.test(input);

            if (hasHex) {
                // Remove all spaces and parse as continuous hex
                input = input.replace(/\s/g, '');
                const bytes: number[] = [];
                for (let i = 0; i < input.length; i += 2) {
                    const byteStr = input.substring(i, i + 2);
                    if (byteStr.length === 2) {
                        const parsed = parseInt(byteStr, 16);
                        if (!isNaN(parsed)) {
                            bytes.push(parsed);
                        }
                    }
                }
                return bytes;
            } else {
                // Parse as space-separated integers
                return input.split(' ')
                    .map(part => parseInt(part, 10))
                    .filter(byte => !isNaN(byte) && byte >= 0 && byte <= 255);
            }
        });

        // Format bytes for display based on selected format
        const processedBytesForDisplay = computed(() => {
            if (byteDisplayFormat.value === 'printf') {
                // Printf format doesn't use separators
                return processedBytes.value.map(byte =>
                    `'\\x${byte.toString(16).padStart(2, '0').toUpperCase()}'`
                );
            }

            const formattedBytes = processedBytes.value.map(byte => {
                switch (byteDisplayFormat.value) {
                    case 'hex':
                        return byte.toString(16).padStart(2, '0').toUpperCase();
                    case 'hex0x':
                        return '0x' + byte.toString(16).padStart(2, '0').toUpperCase();
                    default:
                        return byte.toString();
                }
            });

            return formattedBytes;
        });

        // Hunt for valid messages in the byte stream
        const foundMessages = computed(() => {
            const bytes = processedBytes.value;
            const messages: FoundMessage[] = [];

            if (bytes.length < 10) {
                return messages; // Minimum message size
            }

            // Try to find messages at each position
            for (let i = 0; i < bytes.length - 9; i++) {
                try {
                    // Check for optional LB prefix
                    let startOffset = 0;
                    if (i + 1 < bytes.length && bytes[i] === 0x4c && bytes[i + 1] === 0x42) {
                        startOffset = 2;
                    }

                    const msgStartIndex = i + startOffset;

                    // Need at least: version(1) + length(2) + msg type(2) + header count(2) + payload count(2) + crc(2) = 11 bytes
                    if (msgStartIndex + 11 > bytes.length) {
                        continue;
                    }

                    // Check protocol version (should be 3)
                    if (bytes[msgStartIndex] !== 3) {
                        continue;
                    }

                    // Read length
                    const length = bytes[msgStartIndex + 1] | (bytes[msgStartIndex + 2] << 8);

                    // Validate length is reasonable
                    if (length < 11 || length > 1000) {
                        continue;
                    }

                    // Check if we have enough bytes
                    if (msgStartIndex + length > bytes.length) {
                        continue;
                    }

                    // Extract the full message
                    const messageBytes = bytes.slice(msgStartIndex, msgStartIndex + length);

                    // Validate CRC
                    const dataForCRC = messageBytes.slice(0, -2);
                    const expectedCRC = calculateCRC16XMODEM(dataForCRC);
                    const actualCRC = messageBytes[messageBytes.length - 2] |
                                     (messageBytes[messageBytes.length - 1] << 8);

                    if (expectedCRC !== actualCRC) {
                        continue; // Invalid CRC, not a valid message
                    }

                    // Try to parse the message structure
                    try {
                        const parsedMessage = parseRawMessage(messageBytes);

                        // Get message type name from yaml data
                        const messageTypeName = props.yamlData?.messages?.[parsedMessage.messageType]?.name;

                        // If we got here, it's a valid message!
                        messages.push({
                            startIndex: i,
                            endIndex: i + startOffset + length - 1,
                            bytes: bytes.slice(i, i + startOffset + length),
                            byteString: bytes.slice(i, i + startOffset + length).join(' '),
                            messageType: parsedMessage.messageType,
                            messageTypeName: messageTypeName
                        });

                        // Skip past this message to avoid overlapping detections
                        i += startOffset + length - 1;
                    } catch (parseError) {
                        // Not a valid message structure
                        continue;
                    }
                } catch (error) {
                    // Skip this position
                    continue;
                }
            }

            return messages;
        });

        // Calculate statistics about bytes used vs ignored
        const byteStatistics = computed(() => {
            const totalBytes = processedBytes.value.length;
            let usedBytes = 0;

            foundMessages.value.forEach(msg => {
                usedBytes += msg.bytes.length;
            });

            const ignoredBytes = totalBytes - usedBytes;
            const usagePercentage = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(1) : 0;

            return {
                totalBytes,
                usedBytes,
                ignoredBytes,
                usagePercentage
            };
        });

        // Determine the class for each byte in the stream
        const getByteClass = (index: number): string => {
            const classes: string[] = [];

            // Check if this byte is part of a found message
            const messageIndex = foundMessages.value.findIndex(
                msg => index >= msg.startIndex && index <= msg.endIndex
            );

            if (messageIndex >= 0) {
                classes.push('byte-in-message');
                classes.push(`byte-message-${messageIndex % 6}`);

                // Highlight if hovering over this message
                if (hoveredMessageIndex.value === messageIndex) {
                    classes.push('byte-message-hover');
                }
            }

            // Highlight if hovering over this byte
            if (hoveredByteIndex.value === index) {
                classes.push('byte-hover');
            }

            return classes.join(' ');
        };

        const handleInputChange = () => {
            updateUrl();
        };

        const clearInput = () => {
            inputByteString.value = '';
            updateUrl();
        };

        const copyMessageBytes = (bytes: number[]) => {
            const text = bytes.join(' ');
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied message bytes to clipboard');
            });
        };

        const toggleStreamCopySpaces = () => {
            streamCopySpaces.value = !streamCopySpaces.value;
        };

        const toggleStreamCopyCommas = () => {
            streamCopyCommas.value = !streamCopyCommas.value;
        };

        const copyByteStream = () => {
            const formatByte = (byte: number): string => {
                switch (byteDisplayFormat.value) {
                    case 'hex':
                        return byte.toString(16).padStart(2, '0').toUpperCase();
                    case 'hex0x':
                        return '0x' + byte.toString(16).padStart(2, '0').toUpperCase();
                    case 'printf':
                        return `'\\x${byte.toString(16).padStart(2, '0')}'`;
                    default:
                        return byte.toString();
                }
            };

            let text: string;

            if (byteDisplayFormat.value === 'printf') {
                // Printf format: continuous string of '\xHH' format
                text = processedBytes.value.map(byte => formatByte(byte)).join('');
            } else {
                // Other formats: apply separators
                text = processedBytes.value.map(byte => formatByte(byte)).join('');

                if (streamCopySpaces.value && streamCopyCommas.value) {
                    // Both: "1, 2, 3"
                    text = processedBytes.value.map(byte => formatByte(byte)).join(', ');
                } else if (streamCopyCommas.value) {
                    // Comma only: "1,2,3"
                    text = processedBytes.value.map(byte => formatByte(byte)).join(',');
                } else if (streamCopySpaces.value) {
                    // Space only: "1 2 3"
                    text = processedBytes.value.map(byte => formatByte(byte)).join(' ');
                } else {
                    // Neither: "123"
                    text = processedBytes.value.map(byte => formatByte(byte)).join('');
                }
            }

            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied byte stream to clipboard:', text);
            });
        };

        // URL handling
        const updateUrl = () => {
            if (typeof window === 'undefined') return;

            const url = new URL(window.location.href);
            if (inputByteString.value.trim()) {
                url.searchParams.set('bytes', inputByteString.value.trim());
            } else {
                url.searchParams.delete('bytes');
            }
            window.history.replaceState({}, '', url);
        };

        const loadFromUrl = () => {
            if (typeof window === 'undefined') return;

            const urlParams = new URLSearchParams(window.location.search);
            const bytesParam = urlParams.get('bytes');
            if (bytesParam) {
                inputByteString.value = bytesParam;
            }
        };

        onMounted(() => {
            if (props.initialBytes) {
                inputByteString.value = props.initialBytes;
            } else {
                loadFromUrl();
            }

            // Listen for popstate events (browser back/forward)
            window.addEventListener('popstate', loadFromUrl);
        });

        // Watch for changes to update URL
        watch(inputByteString, () => {
            updateUrl();
        });

        return {
            inputByteString,
            processedBytes,
            processedBytesForDisplay,
            foundMessages,
            byteStatistics,
            hoveredByteIndex,
            hoveredMessageIndex,
            byteDisplayFormat,
            streamCopySpaces,
            streamCopyCommas,
            getByteClass,
            handleInputChange,
            clearInput,
            copyMessageBytes,
            toggleStreamCopySpaces,
            toggleStreamCopyCommas,
            copyByteStream
        };
    }
});
</script>

<style scoped>
.parse-input-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px 0;
}

.parse-stats {
    display: flex;
    gap: 16px;
    padding: 12px 16px;
    background-color: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.dark .parse-stats {
    background-color: #2a2a2a;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat-success {
    color: #28a745;
}

.dark .stat-success {
    color: #4ade80;
}

.stat-warning {
    color: #ffc107;
}

.dark .stat-warning {
    color: #fbbf24;
}

.stat-muted {
    color: #999;
}

.dark .stat-muted {
    color: #666;
}

.stat-percentage {
    font-size: 0.9em;
    opacity: 0.8;
}

.byte-stream-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.dark .byte-stream-container {
    border-color: #444;
}

.byte-stream-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
}

.dark .byte-stream-header {
    background-color: #2a2a2a;
    border-bottom-color: #444;
}

.byte-stream-title {
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    color: #666;
    letter-spacing: 0.5px;
}

.dark .byte-stream-title {
    color: #aaa;
}

.byte-stream-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.control-group {
    display: flex;
    gap: 2px;
}

.control-divider {
    width: 1px;
    height: 20px;
    background-color: #ddd;
    margin: 0 4px;
}

.dark .control-divider {
    background-color: #555;
}

.byte-stream-controls .v-btn.active {
    background-color: #3eaf7c;
    color: white;
}

.byte-stream {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    background-color: white;
}

.dark .byte-stream {
    background-color: #1e1e1e;
}

.byte-item {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    padding: 4px 6px;
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #fafafa;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
}

.byte-item-printf {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    padding: 8px 12px;
    background-color: #fafafa;
    border: 1px solid #ddd;
    border-radius: 3px;
    display: block;
    word-break: break-all;
}

.dark .byte-item-printf {
    border-color: #555;
    background-color: #2d2d2d;
    color: #ddd;
}

.byte-separator-comma,
.byte-separator-space {
    color: #999;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.2;
}

.dark .byte-separator-comma,
.dark .byte-separator-space {
    color: #666;
}

.dark .byte-item {
    border-color: #555;
    background-color: #2d2d2d;
    color: #ddd;
}

.byte-item:hover {
    transform: scale(1.05);
    z-index: 10;
}

.byte-hover {
    border-color: #3eaf7c !important;
    box-shadow: 0 0 0 2px rgba(62, 175, 124, 0.3);
}

.byte-in-message {
    border-width: 2px;
    font-weight: 600;
}

.byte-message-0 {
    background-color: #e3f2fd;
    border-color: #2196f3;
}

.byte-message-1 {
    background-color: #f3e5f5;
    border-color: #9c27b0;
}

.byte-message-2 {
    background-color: #e8f5e9;
    border-color: #4caf50;
}

.byte-message-3 {
    background-color: #fff3e0;
    border-color: #ff9800;
}

.byte-message-4 {
    background-color: #fce4ec;
    border-color: #e91e63;
}

.byte-message-5 {
    background-color: #e0f2f1;
    border-color: #009688;
}

.dark .byte-message-0 {
    background-color: #1a237e;
    border-color: #64b5f6;
}

.dark .byte-message-1 {
    background-color: #4a148c;
    border-color: #ba68c8;
}

.dark .byte-message-2 {
    background-color: #1b5e20;
    border-color: #81c784;
}

.dark .byte-message-3 {
    background-color: #e65100;
    border-color: #ffb74d;
}

.dark .byte-message-4 {
    background-color: #880e4f;
    border-color: #f06292;
}

.dark .byte-message-5 {
    background-color: #004d40;
    border-color: #4db6ac;
}

.byte-message-hover {
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.5);
    transform: scale(1.1);
}

.found-messages {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.found-messages h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
}

.dark .found-messages h2 {
    border-bottom-color: #444;
}

.message-wrapper {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s ease;
}

.message-wrapper:hover {
    border-color: #3eaf7c;
}

.dark .message-wrapper {
    border-color: #444;
}

.dark .message-wrapper:hover {
    border-color: #3eaf7c;
}

.message-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
}

.dark .message-header-bar {
    background-color: #2a2a2a;
    border-bottom-color: #444;
}

.message-position {
    font-size: 13px;
    font-weight: 600;
    color: #666;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.dark .message-position {
    color: #aaa;
}

.message-number {
    color: #666;
}

.dark .message-number {
    color: #aaa;
}

.message-type-name {
    color: #3eaf7c;
    font-weight: 700;
}

.message-type-id {
    color: #999;
    font-weight: 400;
    font-size: 12px;
}

.dark .message-type-id {
    color: #777;
}

.message-range {
    font-size: 11px;
    font-weight: 400;
    color: #999;
}

.dark .message-range {
    color: #777;
}
</style>
