<template>
    <div class="generate-container">
        <!-- Generated Message (at top, can be pinned) -->
        <div class="selection-section" :class="{ 'pinned-section': isMessagePinned }">
            <div class="section-header">
                <h3>Generated Message</h3>
                <div class="section-actions">
                    <v-btn
                        size="small"
                        variant="text"
                        icon
                        @click="toggleMessagePin"
                        class="control-btn"
                        :title="isMessagePinned ? 'Unpin from bottom' : 'Pin to bottom'"
                    >
                        <v-icon size="small">{{ isMessagePinned ? 'mdi-pin-off' : 'mdi-pin' }}</v-icon>
                    </v-btn>
                    <v-checkbox
                        v-model="includePrefix"
                        label="Include LB Prefix"
                        density="compact"
                        hide-details
                    />
                </div>
            </div>
            <div class="selection-content">
                <Message
                    v-if="generatedBytes.length > 0"
                    :byteString="generatedBytes.join(' ')"
                    :yamlData="yamlData"
                    :customFieldTypes="customFieldTypesMap"
                    :showGeneratorLink="false"
                    showValidation
                />
                <div v-else class="empty-message">
                    Select a message type to generate bytes
                </div>
            </div>
        </div>

        <!-- Message Type Selection -->
        <div class="selection-section">
            <div class="section-header">
                <h3>Message Type</h3>
            </div>
            <div class="selection-content">
                <v-combobox
                    v-model="selectedMessageInput"
                    :items="messageOptions"
                    label="Select or enter Message Type"
                    item-title="label"
                    item-value="id"
                    density="compact"
                    variant="outlined"
                    @update:model-value="handleMessageTypeChange"
                />
            </div>
        </div>

        <!-- Header Fields -->
        <div class="selection-section" v-if="selectedMessageId">
            <div class="section-header">
                <h3>Header Fields</h3>
                <div class="section-actions">
                    <v-btn
                        size="small"
                        variant="text"
                        @click="showAllHeaders = !showAllHeaders"
                        class="control-btn"
                    >
                        {{ showAllHeaders ? 'Show Relevant' : 'Show All' }}
                    </v-btn>
                </div>
            </div>
            <div class="selection-content">
                <!-- Add Header Search -->
                <div class="add-field-search">
                    <v-combobox
                        v-model="headerToAdd"
                        :items="availableHeaderOptions"
                        label="Add Header Field (name or ID, press Enter)"
                        item-title="label"
                        item-value="id"
                        density="compact"
                        variant="outlined"
                        clearable
                        @keydown.enter="addHeaderField(headerToAdd)"
                        @update:model-value="(val) => { if (typeof val === 'object') addHeaderField(val); }"
                    >
                        <template v-slot:prepend-inner>
                            <v-icon size="small">mdi-plus</v-icon>
                        </template>
                    </v-combobox>
                </div>

                <div class="field-list">
                    <div
                        v-for="headerId in displayedHeaders"
                        :key="headerId"
                        class="field-item"
                        :class="{ 'field-relevant': isRelevantHeader(headerId), 'field-selected': selectedHeaders.includes(headerId) }"
                    >
                        <v-checkbox
                            v-model="selectedHeaders"
                            :value="headerId"
                            density="compact"
                            hide-details
                        >
                            <template v-slot:label>
                                <div class="field-label-container">
                                    <span class="field-name">{{ headers[headerId]?.name }}</span>
                                    <span class="field-id">({{ headerId }})</span>
                                    <v-chip
                                        v-if="isRelevantHeader(headerId)"
                                        size="x-small"
                                        color="primary"
                                        variant="flat"
                                        class="relevant-chip"
                                    >
                                        relevant
                                    </v-chip>
                                </div>
                            </template>
                        </v-checkbox>

                        <div v-if="selectedHeaders.includes(headerId)" class="field-input">
                            <FieldInput
                                :field="headers[headerId]"
                                :fieldId="headerId"
                                v-model="headerValues[headerId]"
                            />
                        </div>
                    </div>

                    <!-- Custom Headers -->
                    <div
                        v-for="(customHeader, index) in customHeaders"
                        :key="'custom-header-' + index"
                        class="field-item field-custom"
                        :class="{ 'field-selected': customHeader.enabled }"
                    >
                        <div class="custom-field-controls">
                            <v-checkbox
                                v-model="customHeader.enabled"
                                density="compact"
                                hide-details
                            >
                                <template v-slot:label>
                                    <span class="field-name">Custom Header #{{ index + 1 }}</span>
                                </template>
                            </v-checkbox>
                            <v-btn
                                icon="mdi-delete"
                                size="x-small"
                                variant="text"
                                color="error"
                                @click="removeCustomHeader(index)"
                            />
                        </div>

                        <div v-if="customHeader.enabled" class="field-input">
                            <v-text-field
                                v-model="customHeader.id"
                                label="Field ID (number)"
                                type="number"
                                density="compact"
                                variant="outlined"
                            />
                            <v-combobox
                                v-model="customHeader.type"
                                :items="typeOptions"
                                label="Type"
                                density="compact"
                                variant="outlined"
                            />
                            <v-text-field
                                v-model="customHeader.value"
                                label="Value"
                                density="compact"
                                variant="outlined"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payload Fields -->
        <div class="selection-section" v-if="selectedMessageId">
            <div class="section-header">
                <h3>Payload Fields</h3>
            </div>
            <div class="selection-content">
                <!-- Add Payload Search -->
                <div class="add-field-search">
                    <v-combobox
                        v-model="payloadToAdd"
                        :items="availablePayloadOptions"
                        label="Add Payload Field (name or ID, press Enter)"
                        item-title="label"
                        item-value="id"
                        density="compact"
                        variant="outlined"
                        clearable
                        @keydown.enter="addPayloadField(payloadToAdd)"
                        @update:model-value="(val) => { if (typeof val === 'object') addPayloadField(val); }"
                    >
                        <template v-slot:prepend-inner>
                            <v-icon size="small">mdi-plus</v-icon>
                        </template>
                    </v-combobox>
                </div>

                <div class="field-list">
                    <!-- Empty state hint when no spec-defined payloads -->
                    <div v-if="Object.keys(selectedMessagePayload).length === 0 && customPayloads.length === 0" class="empty-fields-hint">
                        <p>No payload fields defined in spec for this message type.</p>
                        <p>Type a custom field ID above and press Enter to add one.</p>
                    </div>

                    <div
                        v-for="fieldId in displayedPayload"
                        :key="fieldId"
                        class="field-item"
                        :class="{ 'field-selected': selectedPayload.includes(fieldId) }"
                    >
                        <v-checkbox
                            v-model="selectedPayload"
                            :value="fieldId"
                            density="compact"
                            hide-details
                        >
                            <template v-slot:label>
                                <div class="field-label-container">
                                    <span class="field-name">{{ selectedMessagePayload[fieldId]?.name }}</span>
                                    <span class="field-id">({{ fieldId }})</span>
                                </div>
                            </template>
                        </v-checkbox>

                        <div v-if="selectedPayload.includes(fieldId)" class="field-input">
                            <FieldInput
                                :field="selectedMessagePayload[fieldId]"
                                :fieldId="fieldId"
                                v-model="payloadValues[fieldId]"
                            />
                        </div>
                    </div>

                    <!-- Custom Payloads -->
                    <div
                        v-for="(customPayload, index) in customPayloads"
                        :key="'custom-payload-' + index"
                        class="field-item field-custom"
                        :class="{ 'field-selected': customPayload.enabled }"
                    >
                        <div class="custom-field-controls">
                            <v-checkbox
                                v-model="customPayload.enabled"
                                density="compact"
                                hide-details
                            >
                                <template v-slot:label>
                                    <span class="field-name">Custom Payload #{{ index + 1 }}</span>
                                </template>
                            </v-checkbox>
                            <v-btn
                                icon="mdi-delete"
                                size="x-small"
                                variant="text"
                                color="error"
                                @click="removeCustomPayload(index)"
                            />
                        </div>

                        <div v-if="customPayload.enabled" class="field-input">
                            <v-text-field
                                v-model="customPayload.id"
                                label="Field ID (number)"
                                type="number"
                                density="compact"
                                variant="outlined"
                            />
                            <v-combobox
                                v-model="customPayload.type"
                                :items="typeOptions"
                                label="Type"
                                density="compact"
                                variant="outlined"
                            />
                            <v-text-field
                                v-model="customPayload.value"
                                label="Value"
                                density="compact"
                                variant="outlined"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, nextTick, PropType } from 'vue';
import Message from './Message.vue';
import FieldInput from './FieldInput.vue';
import { writeTypedData, parseRawMessage, readTypedData } from '../../src/protocol/base.gen';

export default defineComponent({
    name: 'Generate',
    components: {
        Message,
        FieldInput
    },
    props: {
        yamlData: {
            type: Object as PropType<any>,
            required: true
        }
    },
    setup(props) {
        const selectedMessageId = ref<string | null>(null);
        const selectedMessageInput = ref<any>(null);
        const customMessageType = ref('');
        const selectedHeaders = ref<number[]>([]);
        const selectedPayload = ref<number[]>([]);
        const headerValues = ref<Record<number, any>>({});
        const payloadValues = ref<Record<number, any>>({});
        const includePrefix = ref(false);
        const showAllHeaders = ref(false);
        const urlLoaded = ref(false);
        const isLoadingFromUrl = ref(false);
        const isMessagePinned = ref(false);

        // Field search
        const headerToAdd = ref<any>(null);
        const payloadToAdd = ref<any>(null);

        // Custom fields
        const customHeaders = ref<Array<{ enabled: boolean; id: string; type: string; value: any }>>([]);
        const customPayloads = ref<Array<{ enabled: boolean; id: string; type: string; value: any }>>([]);

        // Type options for custom fields
        const typeOptions = [
            'uint8',
            'uint16',
            'uint32',
            'uint64',
            'int32',
            'float32',
            'ascii',
            'bytes',
            '[]uint8',
            'uint',
            'int'
        ];

        // Computed properties
        const headers = computed(() => props.yamlData.header || {});

        const messages = computed(() => props.yamlData.messages || {});

        const messageOptions = computed(() => {
            const options = Object.entries(messages.value).map(([id, msg]: [string, any]) => ({
                id,
                name: msg.name,
                description: msg.description?.split('\n')[0] || '',
                label: `${msg.name} (${id})`,
                group: msg.group
            }));
            return options;
        });

        const selectedMessageInfo = computed(() => {
            if (!selectedMessageId.value || selectedMessageId.value === 'custom') return null;
            return messages.value[selectedMessageId.value];
        });

        const selectedMessagePayload = computed(() => {
            if (!selectedMessageInfo.value) return {};
            return selectedMessageInfo.value.data || {};
        });

        const getGroupName = (groupId: string) => {
            return props.yamlData.groups?.[groupId]?.name || groupId;
        };

        // Always show Message ID (1), plus message-specific relevant headers
        const alwaysShownHeaders = [1]; // Message ID

        const relevantHeaders = computed(() => {
            const relevant = [...alwaysShownHeaders];
            if (selectedMessageInfo.value?.header) {
                relevant.push(...selectedMessageInfo.value.header);
            }
            return [...new Set(relevant)]; // Remove duplicates
        });

        const displayedHeaders = computed(() => {
            if (showAllHeaders.value) {
                return Object.keys(headers.value).map(Number).sort((a, b) => a - b);
            }
            // Always show relevant headers plus any that are currently selected
            const toShow = new Set([...relevantHeaders.value, ...selectedHeaders.value]);
            return Array.from(toShow).sort((a, b) => a - b);
        });

        const displayedPayload = computed(() => {
            // Always show selected payload fields
            const toShow = new Set(selectedPayload.value);
            return Array.from(toShow).sort((a, b) => a - b);
        });

        const availableHeaderOptions = computed(() => {
            return Object.entries(headers.value)
                .filter(([id]) => !selectedHeaders.value.includes(Number(id)))
                .map(([id, header]: [string, any]) => ({
                    id: Number(id),
                    label: `${header.name} (${id})`,
                    name: header.name
                }))
                .sort((a, b) => a.id - b.id);
        });

        const availablePayloadOptions = computed(() => {
            return Object.entries(selectedMessagePayload.value)
                .filter(([id]) => !selectedPayload.value.includes(Number(id)))
                .map(([id, field]: [string, any]) => ({
                    id: Number(id),
                    label: `${field?.name || `Field ${id}`} (${id})`,
                    name: field?.name || `Field ${id}`
                }))
                .sort((a, b) => a.id - b.id);
        });

        const isRelevantHeader = (headerId: number) => {
            return selectedMessageInfo.value?.header?.includes(headerId) || false;
        };

        const handleMessageTypeChange = (value: any) => {
            if (!value) {
                selectedMessageId.value = null;
                return;
            }

            // If it's an object from the list
            if (typeof value === 'object' && value.id) {
                selectedMessageId.value = value.id;
                selectedMessageInput.value = value;
            }
            // If it's a string or number (typed in)
            else {
                const parsed = parseInt(String(value), 10);
                if (!isNaN(parsed)) {
                    selectedMessageId.value = String(parsed);
                    customMessageType.value = String(parsed);
                    selectedMessageInput.value = parsed;
                }
            }
        };

        const addHeaderField = (value: any) => {
            if (!value) {
                headerToAdd.value = null;
                return;
            }

            let headerId: number;

            // If it's an object from the list
            if (typeof value === 'object' && value.id) {
                headerId = value.id;
            }
            // If it's a string or number (typed in - custom field)
            else {
                headerId = parseInt(String(value), 10);
                if (isNaN(headerId)) {
                    headerToAdd.value = null;
                    return;
                }

                // If not in spec, create a custom field
                if (!headers.value[headerId]) {
                    customHeaders.value.push({
                        enabled: true,
                        id: String(headerId),
                        type: 'uint8',
                        value: ''
                    });
                    headerToAdd.value = null;
                    return;
                }
            }

            // Add to selected headers if not already there
            if (!selectedHeaders.value.includes(headerId)) {
                selectedHeaders.value.push(headerId);
                selectedHeaders.value.sort((a, b) => a - b);
            }
            headerToAdd.value = null;
        };

        const addPayloadField = (value: any) => {
            if (!value) {
                payloadToAdd.value = null;
                return;
            }

            let fieldId: number;

            // If it's an object from the list
            if (typeof value === 'object' && value.id) {
                fieldId = value.id;
            }
            // If it's a string or number (typed in - custom field)
            else {
                fieldId = parseInt(String(value), 10);
                if (isNaN(fieldId)) {
                    payloadToAdd.value = null;
                    return;
                }

                // If not in spec for this message, create a custom field
                if (!selectedMessagePayload.value[fieldId]) {
                    customPayloads.value.push({
                        enabled: true,
                        id: String(fieldId),
                        type: 'uint8',
                        value: ''
                    });
                    payloadToAdd.value = null;
                    return;
                }
            }

            // Add to selected payload if not already there
            if (!selectedPayload.value.includes(fieldId)) {
                selectedPayload.value.push(fieldId);
                selectedPayload.value.sort((a, b) => a - b);
            }
            payloadToAdd.value = null;
        };

        const toggleMessagePin = () => {
            isMessagePinned.value = !isMessagePinned.value;
        };

        // Custom field management
        const removeCustomHeader = (index: number) => {
            customHeaders.value.splice(index, 1);
        };

        const removeCustomPayload = (index: number) => {
            customPayloads.value.splice(index, 1);
        };

        // Build custom field type map for Message component
        const customFieldTypesMap = computed(() => {
            const headers: Record<number, string> = {};
            const payload: Record<number, string> = {};

            // Add custom headers
            customHeaders.value.forEach(header => {
                if (header.enabled && header.id && header.type) {
                    headers[parseInt(header.id)] = header.type;
                }
            });

            // Add custom payloads
            customPayloads.value.forEach(payloadField => {
                if (payloadField.enabled && payloadField.id && payloadField.type) {
                    payload[parseInt(payloadField.id)] = payloadField.type;
                }
            });

            return { headers, payload };
        });

        // Generate bytes
        const generatedBytes = computed(() => {
            if (!selectedMessageId.value) return [];

            const messageType = selectedMessageId.value === 'custom'
                ? parseInt(customMessageType.value)
                : parseInt(selectedMessageId.value);

            if (isNaN(messageType)) return [];

            const bytes: number[] = [];

            // Optional prefix
            if (includePrefix.value) {
                bytes.push(0x4c, 0x42); // 'LB'
            }

            // Protocol version
            bytes.push(3);

            // Length placeholder
            const lengthIndex = bytes.length;
            bytes.push(0, 0);

            // Message type
            bytes.push(messageType & 0xff, (messageType >> 8) & 0xff);

            // Collect all header fields (regular + custom)
            const allHeaderFields: Array<{ id: number; value: any; type: string }> = [];

            for (const headerId of selectedHeaders.value) {
                const field = headers.value[headerId];
                allHeaderFields.push({
                    id: headerId,
                    value: headerValues.value[headerId],
                    type: field?.type || 'uint8'
                });
            }

            for (const customHeader of customHeaders.value) {
                if (customHeader.enabled && customHeader.id) {
                    allHeaderFields.push({
                        id: parseInt(customHeader.id),
                        value: customHeader.value,
                        type: customHeader.type
                    });
                }
            }

            // Sort by ID
            allHeaderFields.sort((a, b) => a.id - b.id);

            // Number of header fields
            bytes.push(allHeaderFields.length & 0xff, (allHeaderFields.length >> 8) & 0xff);

            // Header field types
            for (const field of allHeaderFields) {
                bytes.push(field.id);
            }

            // Header field data
            for (const field of allHeaderFields) {
                const fieldBytes = convertToBytes(field.value, field.type);
                bytes.push(fieldBytes.length);
                bytes.push(...fieldBytes);
            }

            // Collect all payload fields (regular + custom)
            const allPayloadFields: Array<{ id: number; value: any; type: string }> = [];

            for (const fieldId of selectedPayload.value) {
                const field = selectedMessagePayload.value[fieldId];
                allPayloadFields.push({
                    id: fieldId,
                    value: payloadValues.value[fieldId],
                    type: field?.type || 'uint8'
                });
            }

            for (const customPayload of customPayloads.value) {
                if (customPayload.enabled && customPayload.id) {
                    allPayloadFields.push({
                        id: parseInt(customPayload.id),
                        value: customPayload.value,
                        type: customPayload.type
                    });
                }
            }

            // Sort by ID
            allPayloadFields.sort((a, b) => a.id - b.id);

            // Number of payload fields
            bytes.push(allPayloadFields.length & 0xff, (allPayloadFields.length >> 8) & 0xff);

            // Payload field types
            for (const field of allPayloadFields) {
                bytes.push(field.id);
            }

            // Payload field data
            for (const field of allPayloadFields) {
                const fieldBytes = convertToBytes(field.value, field.type);
                bytes.push(fieldBytes.length);
                bytes.push(...fieldBytes);
            }

            // Update length (total message length, not including prefix if present)
            const lengthValue = includePrefix.value ? bytes.length - 2 + 2 : bytes.length + 2; // +2 for checksum
            bytes[lengthIndex] = lengthValue & 0xff;
            bytes[lengthIndex + 1] = (lengthValue >> 8) & 0xff;

            // Calculate CRC16-XMODEM (never includes prefix bytes)
            const checksumStartIndex = includePrefix.value ? 2 : 0;
            const messageBytes = bytes.slice(checksumStartIndex);
            const checksum = calculateCRC16XMODEM(messageBytes);
            bytes.push(checksum & 0xff, (checksum >> 8) & 0xff);

            return bytes;
        });

        const convertToBytes = (value: any, type: string): number[] => {
            if (value === undefined || value === null || value === '') {
                return [];
            }

            // Special handling for 'bytes' type - parse space-separated string
            if (type === 'bytes') {
                if (Array.isArray(value)) {
                    return value;
                }
                if (typeof value === 'string') {
                    // Parse space or comma-separated byte values
                    return value.split(/[\s,]+/)
                        .map(s => parseInt(s.trim(), 10))
                        .filter(b => !isNaN(b) && b >= 0 && b <= 255);
                }
                return [];
            }

            // Special handling for 'uint' variable length encoding
            if (type === 'uint') {
                const num = typeof value === 'number' ? value : parseInt(value, 10);
                if (isNaN(num)) return [];

                // Choose smallest encoding
                if (num <= 255) {
                    return [num];
                } else if (num <= 65535) {
                    return [num & 0xff, (num >> 8) & 0xff];
                } else if (num <= 4294967295) {
                    return [
                        num & 0xff,
                        (num >> 8) & 0xff,
                        (num >> 16) & 0xff,
                        (num >> 24) & 0xff
                    ];
                } else {
                    const bigNum = BigInt(num);
                    const low = Number(bigNum & 0xffffffffn);
                    const high = Number((bigNum >> 32n) & 0xffffffffn);
                    return [
                        low & 0xff,
                        (low >> 8) & 0xff,
                        (low >> 16) & 0xff,
                        (low >> 24) & 0xff,
                        high & 0xff,
                        (high >> 8) & 0xff,
                        (high >> 16) & 0xff,
                        (high >> 24) & 0xff
                    ];
                }
            }

            try {
                return writeTypedData(value, type || 'uint8');
            } catch (e) {
                console.error('Error converting to bytes:', e);
                return [];
            }
        };

        const calculateCRC16XMODEM = (bytes: number[]): number => {
            let crc = 0;
            for (const byte of bytes) {
                crc ^= byte << 8;
                for (let i = 0; i < 8; i++) {
                    if (crc & 0x8000) {
                        crc = (crc << 1) ^ 0x1021;
                    } else {
                        crc = crc << 1;
                    }
                }
                crc &= 0xffff;
            }
            return crc;
        };

        // URL management
        const updateUrl = () => {
            if (!urlLoaded.value) return;

            console.log('[updateUrl] Called with state:', {
                selectedMessageId: selectedMessageId.value,
                selectedPayload: selectedPayload.value,
                payloadValues: payloadValues.value,
                generatedBytes: generatedBytes.value.slice(0, 20) + '...'
            });

            const params = new URLSearchParams();

            if (selectedMessageId.value) {
                params.set('msg', selectedMessageId.value);
            }
            if (selectedMessageId.value === 'custom' && customMessageType.value) {
                params.set('customType', customMessageType.value);
            }
            if (selectedHeaders.value.length > 0) {
                params.set('headers', selectedHeaders.value.join(','));
            }
            if (selectedPayload.value.length > 0) {
                params.set('payload', selectedPayload.value.join(','));
            }
            if (Object.keys(headerValues.value).length > 0) {
                params.set('headerVals', JSON.stringify(headerValues.value));
            }
            if (Object.keys(payloadValues.value).length > 0) {
                params.set('payloadVals', JSON.stringify(payloadValues.value));
            }
            if (customHeaders.value.length > 0) {
                params.set('customHeaders', JSON.stringify(customHeaders.value));
            }
            if (customPayloads.value.length > 0) {
                params.set('customPayloads', JSON.stringify(customPayloads.value));
            }
            if (includePrefix.value) {
                params.set('prefix', '1');
            }
            if (showAllHeaders.value) {
                params.set('showAll', '1');
            }
            if (generatedBytes.value.length > 0) {
                params.set('bytes', generatedBytes.value.join('+'));
            }

            const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
            window.history.replaceState({}, '', newUrl);
        };

        const loadFromUrl = () => {
            const params = new URLSearchParams(window.location.search);

            // Check if we have a bytes parameter to parse
            const bytesParam = params.get('bytes');
            if (bytesParam) {
                isLoadingFromUrl.value = true;
                try {
                    // Parse the byte string (handles URL encoding with + for spaces)
                    const byteArray = bytesParam.split(/[\s+]+/).map(s => parseInt(s, 10)).filter(b => !isNaN(b));

                    if (byteArray.length >= 10) {
                        // Remove LB prefix if present
                        let startIndex = 0;
                        if (byteArray.length > 2 && byteArray[0] === 0x4c && byteArray[1] === 0x42) {
                            startIndex = 2;
                            includePrefix.value = true;
                        }

                        const messageBytes = byteArray.slice(startIndex);

                        // Parse the message structure
                        const parsed = parseRawMessage(messageBytes);

                        if (parsed) {
                            console.log('[loadFromUrl] Parsed message:', parsed);
                            console.log('[loadFromUrl] urlLoaded before setting messageId:', urlLoaded.value);

                            // Set message type
                            selectedMessageId.value = String(parsed.messageType);

                            console.log('[loadFromUrl] Set selectedMessageId to:', selectedMessageId.value);

                            // Also set the input value for the dropdown
                            const messageOption = messageOptions.value.find(m => m.id === String(parsed.messageType));
                            if (messageOption) {
                                selectedMessageInput.value = messageOption;
                            } else {
                                selectedMessageInput.value = String(parsed.messageType);
                            }

                            // Set headers
                            if (parsed.header && Object.keys(parsed.header).length > 0) {
                                // Set header values
                                for (const [fieldId, fieldData] of Object.entries(parsed.header)) {
                                    const id = Number(fieldId);
                                    const header = headers.value[id];

                                    if (header && fieldData) {
                                        // Field exists in spec - add to selected headers and read value
                                        if (!selectedHeaders.value.includes(id)) {
                                            selectedHeaders.value.push(id);
                                        }
                                        try {
                                            const value = readTypedData(fieldData, header.type || 'uint8');
                                            headerValues.value[id] = value;
                                        } catch (e) {
                                            console.error(`Failed to read header ${id}:`, e);
                                        }
                                    } else if (fieldData) {
                                        // Custom header not in spec - add as custom field
                                        // Try to intelligently detect the type
                                        let detectedType = 'bytes';
                                        let displayValue = fieldData.join(' ');

                                        // Check if it looks like ASCII text (all printable characters)
                                        if (fieldData.every((b: number) => b >= 32 && b <= 126)) {
                                            detectedType = 'ascii';
                                            displayValue = String.fromCharCode(...fieldData);
                                        }
                                        // Check if it's a single byte (could be uint8)
                                        else if (fieldData.length === 1) {
                                            detectedType = 'uint8';
                                            displayValue = fieldData[0];
                                        }
                                        // Check if it's 2 bytes (could be uint16)
                                        else if (fieldData.length === 2) {
                                            detectedType = 'uint16';
                                            displayValue = fieldData[0] | (fieldData[1] << 8);
                                        }
                                        // Check if it's 4 bytes (could be uint32)
                                        else if (fieldData.length === 4) {
                                            detectedType = 'uint32';
                                            displayValue = (fieldData[0] | (fieldData[1] << 8) | (fieldData[2] << 16) | (fieldData[3] << 24)) >>> 0;
                                        }

                                        customHeaders.value.push({
                                            enabled: true,
                                            id: String(id),
                                            type: detectedType,
                                            value: displayValue
                                        });
                                    }
                                }
                                selectedHeaders.value.sort((a, b) => a - b);
                            }

                            // Set payload
                            if (parsed.data && Object.keys(parsed.data).length > 0) {
                                console.log('[loadFromUrl] Processing payload, parsed.data:', parsed.data);
                                const messagePayload = messages.value[parsed.messageType]?.data || {};
                                console.log('[loadFromUrl] messagePayload from spec:', messagePayload);

                                // Set payload values
                                for (const [fieldId, fieldData] of Object.entries(parsed.data)) {
                                    const id = Number(fieldId);
                                    const payloadField = messagePayload[id];

                                    console.log(`[loadFromUrl] Processing payload field ${id}:`, {
                                        fieldData,
                                        payloadField,
                                        exists: !!payloadField
                                    });

                                    if (payloadField && fieldData) {
                                        // Field exists in spec - add to selected payload and read value
                                        if (!selectedPayload.value.includes(id)) {
                                            selectedPayload.value.push(id);
                                        }
                                        try {
                                            const value = readTypedData(fieldData, payloadField.type || 'uint8');
                                            payloadValues.value[id] = value;
                                            console.log(`[loadFromUrl] Added payload field ${id} = ${value} to selectedPayload`);
                                        } catch (e) {
                                            console.error(`Failed to read payload ${id}:`, e);
                                        }
                                    } else if (fieldData) {
                                        // Custom payload not in spec - add as custom field
                                        // Try to intelligently detect the type
                                        let detectedType = 'bytes';
                                        let displayValue = fieldData.join(' ');

                                        // Check if it looks like ASCII text (all printable characters)
                                        if (fieldData.every((b: number) => b >= 32 && b <= 126)) {
                                            detectedType = 'ascii';
                                            displayValue = String.fromCharCode(...fieldData);
                                        }
                                        // Check if it's a single byte (could be uint8)
                                        else if (fieldData.length === 1) {
                                            detectedType = 'uint8';
                                            displayValue = fieldData[0];
                                        }
                                        // Check if it's 2 bytes (could be uint16)
                                        else if (fieldData.length === 2) {
                                            detectedType = 'uint16';
                                            displayValue = fieldData[0] | (fieldData[1] << 8);
                                        }
                                        // Check if it's 4 bytes (could be uint32)
                                        else if (fieldData.length === 4) {
                                            detectedType = 'uint32';
                                            displayValue = (fieldData[0] | (fieldData[1] << 8) | (fieldData[2] << 16) | (fieldData[3] << 24)) >>> 0;
                                        }

                                        customPayloads.value.push({
                                            enabled: true,
                                            id: String(id),
                                            type: detectedType,
                                            value: displayValue
                                        });
                                    }
                                }
                                selectedPayload.value.sort((a, b) => a - b);
                                console.log('[loadFromUrl] Final selectedPayload:', selectedPayload.value);
                                console.log('[loadFromUrl] Final payloadValues:', payloadValues.value);
                            }

                            console.log('[loadFromUrl] Setting urlLoaded = true');
                            urlLoaded.value = true;

                            // Use nextTick to ensure all watchers have processed before clearing the flag
                            nextTick(() => {
                                console.log('[loadFromUrl] Clearing isLoadingFromUrl flag');
                                isLoadingFromUrl.value = false;
                            });

                            return; // Don't load other params if we parsed bytes
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse bytes from URL:', e);
                    isLoadingFromUrl.value = false;
                }
            }

            // Fall back to loading individual parameters if no bytes param
            const msg = params.get('msg');
            if (msg) {
                selectedMessageId.value = msg;
            }

            const customType = params.get('customType');
            if (customType) {
                customMessageType.value = customType;
            }

            const headersParam = params.get('headers');
            if (headersParam) {
                selectedHeaders.value = headersParam.split(',').map(Number);
            }

            const payloadParam = params.get('payload');
            if (payloadParam) {
                selectedPayload.value = payloadParam.split(',').map(Number);
            }

            const headerVals = params.get('headerVals');
            if (headerVals) {
                try {
                    headerValues.value = JSON.parse(headerVals);
                } catch (e) {
                    console.error('Failed to parse header values:', e);
                }
            }

            const payloadVals = params.get('payloadVals');
            if (payloadVals) {
                try {
                    payloadValues.value = JSON.parse(payloadVals);
                } catch (e) {
                    console.error('Failed to parse payload values:', e);
                }
            }

            const customHeadersParam = params.get('customHeaders');
            if (customHeadersParam) {
                try {
                    customHeaders.value = JSON.parse(customHeadersParam);
                } catch (e) {
                    console.error('Failed to parse custom headers:', e);
                }
            }

            const customPayloadsParam = params.get('customPayloads');
            if (customPayloadsParam) {
                try {
                    customPayloads.value = JSON.parse(customPayloadsParam);
                } catch (e) {
                    console.error('Failed to parse custom payloads:', e);
                }
            }

            if (params.get('prefix') === '1') {
                includePrefix.value = true;
            }

            if (params.get('showAll') === '1') {
                showAllHeaders.value = true;
            }

            urlLoaded.value = true;
        };

        // Lifecycle
        onMounted(() => {
            loadFromUrl();

            // If there's a hash in the URL and bytes were loaded, scroll to it after the form is populated
            if (typeof window !== 'undefined' && window.location.hash) {
                // Use setTimeout to ensure the DOM is updated after reactive data is set
                setTimeout(() => {
                    const hash = window.location.hash;
                    const element = document.querySelector(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 200);
            }
        });

        // Watchers
        watch(
            [selectedMessageId, customMessageType, selectedHeaders, selectedPayload,
             headerValues, payloadValues, customHeaders, customPayloads,
             includePrefix, showAllHeaders],
            () => {
                console.log('[main watcher] Something changed, calling updateUrl');
                updateUrl();
            },
            { deep: true }
        );

        watch(selectedMessageId, () => {
            console.log('[watcher] selectedMessageId changed to:', selectedMessageId.value);
            console.log('[watcher] urlLoaded:', urlLoaded.value);
            console.log('[watcher] isLoadingFromUrl:', isLoadingFromUrl.value);
            console.log('[watcher] selectedPayload before clear:', selectedPayload.value);
            console.log('[watcher] payloadValues before clear:', payloadValues.value);

            // Reset selections when message changes (but not during initial URL loading)
            if (!isLoadingFromUrl.value && selectedMessageId.value !== 'custom') {
                console.log('[watcher] CLEARING payload arrays');
                selectedPayload.value = [];
                payloadValues.value = {};
            } else {
                console.log('[watcher] NOT clearing (isLoadingFromUrl is true or custom message)');
            }
        });

        return {
            selectedMessageId,
            selectedMessageInput,
            customMessageType,
            selectedHeaders,
            selectedPayload,
            headerValues,
            payloadValues,
            includePrefix,
            showAllHeaders,
            customHeaders,
            customPayloads,
            typeOptions,
            headers,
            messageOptions,
            selectedMessageInfo,
            selectedMessagePayload,
            displayedHeaders,
            generatedBytes,
            customFieldTypesMap,
            getGroupName,
            isRelevantHeader,
            handleMessageTypeChange,
            addHeaderField,
            addPayloadField,
            headerToAdd,
            payloadToAdd,
            availableHeaderOptions,
            availablePayloadOptions,
            displayedPayload,
            isMessagePinned,
            toggleMessagePin,
            removeCustomHeader,
            removeCustomPayload
        };
    }
});
</script>

<style scoped>
.generate-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 20px 0;
    padding-bottom: 400px; /* Space for pinned section when active */
}

.selection-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    transition: all 0.3s ease;
}

.dark .selection-section {
    border-color: #444;
    background-color: #1e1e1e;
}

.pinned-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    margin: 0;
    border-radius: 0;
    border-top: 2px solid #3eaf7c;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    max-height: 60vh;
    overflow-y: auto;
}

.dark .pinned-section {
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
}

.dark .section-header {
    background-color: #2a2a2a;
    border-bottom-color: #444;
}

.section-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #666;
}

.dark .section-header h3 {
    color: #aaa;
}

.section-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.control-btn {
    font-size: 12px;
    text-transform: none;
}

.selection-content {
    padding: 12px;
}

.add-field-search {
    margin-bottom: 12px;
}

.field-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-item {
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fafafa;
    transition: all 0.2s ease;
}

.dark .field-item {
    border-color: #555;
    background-color: #2d2d2d;
}

.field-item.field-relevant {
    border-color: #3eaf7c;
    background-color: #f0fff4;
}

.dark .field-item.field-relevant {
    border-color: #3eaf7c;
    background-color: #1a2e1a;
}

.field-item.field-selected {
    border-width: 2px;
}

.field-label-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.field-name {
    font-weight: 600;
    color: #333;
}

.dark .field-name {
    color: #ddd;
}

.field-id {
    font-size: 12px;
    color: #999;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.dark .field-id {
    color: #777;
}

.relevant-chip {
    margin-left: 4px;
}

.field-input {
    margin-top: 8px;
    margin-left: 28px;
}

.field-custom {
    border-color: #9c27b0;
    background-color: #f3e5f5;
}

.dark .field-custom {
    border-color: #ba68c8;
    background-color: #2a1a2e;
}

.custom-field-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.message-name {
    font-weight: 600;
}

.message-id {
    font-size: 12px;
    color: #999;
    margin-left: 4px;
}

.empty-message {
    padding: 32px;
    text-align: center;
    color: #999;
    font-style: italic;
}

.dark .empty-message {
    color: #666;
}

.empty-fields-hint {
    padding: 24px;
    text-align: center;
    color: #999;
    font-size: 14px;
}

.empty-fields-hint p {
    margin: 4px 0;
}

.empty-fields-hint p:first-child {
    font-weight: 600;
}

.dark .empty-fields-hint {
    color: #777;
}
</style>
