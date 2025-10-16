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
            <span v-if="parserTimedOut" class="stat-item stat-error">
                <v-icon size="small" color="error">mdi-alert-circle</v-icon>
                Parser timeout - results may be incomplete
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
            <h2 id="found-messages" tabindex="-1">
                Messages
                <a class="header-anchor" href="#found-messages" aria-label="Permalink to &quot;Messages&quot;">​</a>
            </h2>
            <div
                v-for="(msg, index) in foundMessages"
                :key="index"
                class="message-wrapper"
                :class="{ 'message-partial': msg.isPartial }"
                @mouseenter="hoveredMessageIndex = index"
                @mouseleave="hoveredMessageIndex = null"
            >
                <div class="message-header-bar">
                    <span class="message-position">
                        <span class="message-number">Message {{ index + 1 }} of {{ foundMessages.length }}</span>
                        <span v-if="msg.messageTypeName" class="message-type-name">{{ msg.messageTypeName }}</span>
                        <span v-if="msg.messageType !== undefined" class="message-type-id">({{ msg.messageType }})</span>
                        <span class="message-range">bytes {{ msg.startIndex }} - {{ msg.endIndex }}</span>
                        <span v-if="msg.isPartial" class="message-partial-badge">
                            <v-icon size="small" color="warning">mdi-alert-circle</v-icon>
                            PARTIAL
                        </span>
                    </span>
                </div>
                <div v-if="msg.isPartial" class="message-warning">
                    <v-icon size="small" color="warning">mdi-alert</v-icon>
                    <span class="warning-text">{{ msg.partialReason }}</span>
                    <span v-if="msg.checksumError && msg.expectedChecksum !== undefined" class="checksum-details">
                        Expected: 0x{{ msg.expectedChecksum.toString(16).padStart(4, '0').toUpperCase() }},
                        Got: 0x{{ msg.actualChecksum?.toString(16).padStart(4, '0').toUpperCase() }}
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
import { parseByteString, formatBytes, type ByteDisplayFormat } from '../../utils/ByteStringParser';

// Declare gtag function for TypeScript
declare global {
    interface Window {
        gtag: (command: string, targetId: string, config?: any) => void;
    }
}

interface FoundMessage {
    startIndex: number;
    endIndex: number;
    bytes: number[];
    byteString: string;
    messageType?: number;
    messageTypeName?: string;
    isPartial?: boolean;
    partialReason?: string;
    checksumError?: boolean;
    expectedChecksum?: number;
    actualChecksum?: number;
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
        const byteDisplayFormat = ref<ByteDisplayFormat>('ints');
        const parserTimedOut = ref(false);

        // Byte stream copy settings
        const streamCopySpaces = ref(true);
        const streamCopyCommas = ref(false);

        // Parse input and convert to normalized byte array
        const processedBytes = computed<number[]>(() => {
            const parsed = parseByteString(inputByteString.value);
            return parsed.bytes || [];
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
            parserTimedOut.value = false;

            if (bytes.length < 10) {
                return messages; // Minimum message size
            }

            const startTime = Date.now();
            const MAX_PARSE_TIME_MS = 3000; // 3 second timeout
            const usedByteRanges: Set<number> = new Set();

            // First pass: Find all complete, valid messages
            for (let i = 0; i < bytes.length - 9; i++) {
                if (Date.now() - startTime > MAX_PARSE_TIME_MS) {
                    console.warn('Parser timeout - stopping search');
                    parserTimedOut.value = true;
                    break;
                }

                // Skip if this byte is already part of a found message
                if (usedByteRanges.has(i)) {
                    continue;
                }

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

                    // Check if we have enough bytes for a complete message
                    if (msgStartIndex + length > bytes.length) {
                        continue; // Don't process incomplete messages in first pass
                    }

                    // Extract the full message
                    const messageBytes = bytes.slice(msgStartIndex, msgStartIndex + length);

                    // Validate CRC
                    const dataForCRC = messageBytes.slice(0, -2);
                    const expectedCRC = calculateCRC16XMODEM(dataForCRC);
                    const actualCRC = messageBytes[messageBytes.length - 2] |
                                     (messageBytes[messageBytes.length - 1] << 8);

                    if (expectedCRC !== actualCRC) {
                        continue; // Don't include invalid CRC in first pass
                    }

                    // Try to parse the message structure
                    try {
                        const parsedMessage = parseRawMessage(messageBytes);

                        // Get message type name from yaml data
                        const messageTypeName = props.yamlData?.messages?.[parsedMessage.messageType]?.name;

                        // Valid message found!
                        const messageStart = i;
                        const messageEnd = i + startOffset + length - 1;

                        messages.push({
                            startIndex: messageStart,
                            endIndex: messageEnd,
                            bytes: bytes.slice(messageStart, messageEnd + 1),
                            byteString: bytes.slice(messageStart, messageEnd + 1).join(' '),
                            messageType: parsedMessage.messageType,
                            messageTypeName: messageTypeName,
                            isPartial: false
                        });

                        // Track valid message parsing for analytics
                        if (typeof window !== 'undefined' && window.gtag) {
                            window.gtag('event', 'parse_message', {
                                event_category: 'protocol_tools',
                                event_label: `message_type_${parsedMessage.messageType}`,
                                value: parsedMessage.messageType,
                                custom_parameter_1: messageTypeName || 'unknown'
                            });
                        }

                        // Mark these bytes as used
                        for (let j = messageStart; j <= messageEnd; j++) {
                            usedByteRanges.add(j);
                        }

                        // Skip past this message
                        i = messageEnd;
                    } catch (parseError) {
                        // Not a valid message structure
                        continue;
                    }
                } catch (error) {
                    // Skip this position
                    continue;
                }
            }

            // Second pass: Look for partial messages in unused byte ranges
            for (let i = 0; i < bytes.length - 9; i++) {
                if (Date.now() - startTime > MAX_PARSE_TIME_MS) {
                    console.warn('Parser timeout - stopping partial message search');
                    parserTimedOut.value = true;
                    break;
                }

                // Skip if this byte is already part of a found message
                if (usedByteRanges.has(i)) {
                    continue;
                }

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

                    // Track partial message detection
                    let isPartial = false;
                    let partialReason = '';
                    let messageEndIndex = msgStartIndex + length;

                    // Check if we have enough bytes
                    if (msgStartIndex + length > bytes.length) {
                        isPartial = true;
                        partialReason = 'Message is truncated (incomplete)';
                        messageEndIndex = bytes.length;
                    }

                    // Extract available message bytes
                    const messageBytes = bytes.slice(msgStartIndex, messageEndIndex);

                    // Check CRC if we have the full message
                    let checksumError = false;
                    let expectedCRC: number | undefined;
                    let actualCRC: number | undefined;

                    if (!isPartial) {
                        const dataForCRC = messageBytes.slice(0, -2);
                        expectedCRC = calculateCRC16XMODEM(dataForCRC);
                        actualCRC = messageBytes[messageBytes.length - 2] |
                                   (messageBytes[messageBytes.length - 1] << 8);

                        if (expectedCRC !== actualCRC) {
                            checksumError = true;
                            isPartial = true;
                            partialReason = 'Invalid checksum';
                        }
                    }

                    // Try to parse the message structure
                    let parsedMessage: any = null;
                    let parseError = false;

                    try {
                        parsedMessage = parseRawMessage(messageBytes);
                    } catch (err) {
                        parseError = true;
                        if (!isPartial) {
                            isPartial = true;
                            partialReason = 'Message structure is malformed';
                        }
                    }

                    // Only include partial messages (we already got the valid ones)
                    if (isPartial) {
                        // Get message type name from yaml data
                        let messageTypeName: string | undefined;
                        let messageType: number | undefined;

                        if (parsedMessage) {
                            messageType = parsedMessage.messageType;
                            messageTypeName = props.yamlData?.messages?.[parsedMessage.messageType]?.name;
                        } else if (messageBytes.length >= 5) {
                            // Try to at least extract message type even if parsing failed
                            messageType = messageBytes[3] | (messageBytes[4] << 8);
                            messageTypeName = props.yamlData?.messages?.[messageType]?.name;
                        }

                        const messageStart = i;
                        const messageEnd = i + startOffset + messageEndIndex - msgStartIndex - 1;

                        messages.push({
                            startIndex: messageStart,
                            endIndex: messageEnd,
                            bytes: bytes.slice(messageStart, messageEnd + 1),
                            byteString: bytes.slice(messageStart, messageEnd + 1).join(' '),
                            messageType: messageType,
                            messageTypeName: messageTypeName,
                            isPartial: isPartial,
                            partialReason: partialReason,
                            checksumError: checksumError,
                            expectedChecksum: expectedCRC,
                            actualChecksum: actualCRC
                        });

                        // Mark these bytes as used
                        for (let j = messageStart; j <= messageEnd; j++) {
                            usedByteRanges.add(j);
                        }

                        // Skip past this partial message
                        i = messageEnd;
                    }
                } catch (error) {
                    // Skip this position
                    continue;
                }
            }

            // Sort messages by start index
            messages.sort((a, b) => a.startIndex - b.startIndex);

            return messages;
        });

        // Calculate statistics about bytes used vs ignored
        const byteStatistics = computed(() => {
            const totalBytes = processedBytes.value.length;
            const usedByteSet = new Set<number>();

            // First, mark all bytes used by valid messages
            foundMessages.value.forEach(msg => {
                if (!msg.isPartial) {
                    for (let i = msg.startIndex; i <= msg.endIndex; i++) {
                        usedByteSet.add(i);
                    }
                }
            });

            // Then, mark bytes used by partial messages (only if not already used)
            foundMessages.value.forEach(msg => {
                if (msg.isPartial) {
                    for (let i = msg.startIndex; i <= msg.endIndex; i++) {
                        usedByteSet.add(i);
                    }
                }
            });

            const usedBytes = usedByteSet.size;
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
            // Prioritize valid messages over partial ones by checking valid messages first
            let messageIndex = -1;

            // First, look for valid (non-partial) messages
            for (let i = 0; i < foundMessages.value.length; i++) {
                const msg = foundMessages.value[i];
                if (!msg.isPartial && index >= msg.startIndex && index <= msg.endIndex) {
                    messageIndex = i;
                    break;
                }
            }

            // If not in a valid message, check partial messages
            if (messageIndex === -1) {
                for (let i = 0; i < foundMessages.value.length; i++) {
                    const msg = foundMessages.value[i];
                    if (msg.isPartial && index >= msg.startIndex && index <= msg.endIndex) {
                        messageIndex = i;
                        break;
                    }
                }
            }

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
            const text = formatBytes(
                processedBytes.value,
                byteDisplayFormat.value,
                {
                    spaces: streamCopySpaces.value,
                    commas: streamCopyCommas.value
                }
            );

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

        onMounted(() => {
            // If there's a hash in the URL and bytes were loaded, scroll to it after messages are parsed
            if (typeof window !== 'undefined' && window.location.hash && inputByteString.value) {
                // Use nextTick to ensure the DOM is updated before scrolling
                setTimeout(() => {
                    const hash = window.location.hash;
                    const element = document.querySelector(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });

        // Watch for changes to initialBytes prop
        watch(() => props.initialBytes, (newBytes) => {
            if (newBytes !== inputByteString.value) {
                inputByteString.value = newBytes || '';
            }
        }, { immediate: true });

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
            parserTimedOut,
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

.stat-error {
    color: #dc3545;
}

.dark .stat-error {
    color: #f87171;
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

.message-wrapper.message-partial {
    border-color: #ffc107;
}

.message-wrapper.message-partial:hover {
    border-color: #ff9800;
}

.dark .message-wrapper {
    border-color: #444;
}

.dark .message-wrapper:hover {
    border-color: #3eaf7c;
}

.dark .message-wrapper.message-partial {
    border-color: #fbbf24;
}

.dark .message-wrapper.message-partial:hover {
    border-color: #f59e0b;
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

.message-partial-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background-color: #fff3cd;
    color: #856404;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.dark .message-partial-badge {
    background-color: #664d03;
    color: #ffc107;
}

.message-warning {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background-color: #fff3cd;
    border-bottom: 1px solid #ffc107;
    color: #856404;
    font-size: 13px;
}

.dark .message-warning {
    background-color: #664d03;
    border-bottom-color: #ffc107;
    color: #ffc107;
}

.warning-text {
    flex: 1;
    font-weight: 500;
}

.checksum-details {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    opacity: 0.9;
}
</style>
