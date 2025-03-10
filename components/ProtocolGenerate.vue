<template>
    <div style="display: flex; align-items: center;">
        <v-select
            v-model="selectedMessage"
            :items="messageOptionsWithCustom"
            label="Message Type"
            item-title="name"
            item-value="id"
            density="compact"
        />
        <v-text-field
            v-if="selectedMessage === 'custom'"
            v-model="customMessageType"
            label="Custom Message Type (uint8)"
            density="compact"
            style="margin-left: 10px;"
        />
    </div>
    <div v-if="selectedMessage">
        <h5>Headers</h5>
        <div v-for="(header, key) in headers" :key="key">
            <v-checkbox-btn
                v-model="selectedHeaders"
                :label="`${key}: ${header.name}`"
                :value="key"
                density="compact"
            />
            <template v-if="selectedHeaders.includes(key)">
                <v-select
                    v-if="header.values"
                    v-model="headerValues[key]"
                    :items="Object.entries(header.values).map(([key, value]) => ({ key, name: `${key}: ${value.name}` }))"
                    :label="`${header.name} (${header.type})`"
                    item-title="name"
                    item-value="key"
                    density="compact"
                />
                <v-text-field
                    v-else
                    v-model="headerValues[key]"
                    :label="`${header.name} (${header.type})`"
                    :placeholder="header.description"
                    density="compact"
                />
            </template>
        </div>
        <div v-for="(customHeader, index) in customHeaders" :key="index">
            <v-checkbox-btn
                v-model="customHeader.enabled"
                :label="`Custom Header ${index + 1}`"
                density="compact"
            />
            <template v-if="customHeader.enabled">
                <div style="display: flex; align-items: center;">
                    <v-text-field
                        v-model="customHeader.id"
                        label="Header Type ID (uint8)"
                        density="compact"
                        style="margin-right: 10px;"
                    />
                    <v-select
                        v-model="customHeader.type"
                        :items="typeOptions"
                        item-title="name"
                        item-value="key"
                        label="Header Type"
                        density="compact"
                        style="margin-right: 10px;"
                    />
                    <v-text-field
                        v-model="customHeader.value"
                        :label="`Header Value (${customHeader.type})`"
                        density="compact"
                    />
                </div>
            </template>
        </div>
        <small>
            Custom headers:
            <a href="javascript:void(0);" @click.prevent="addCustomHeaderField">Add</a> /
            <a href="javascript:void(0);" @click.prevent="removeCustomHeaderField">Remove</a>
        </small>
        <br/>
        <h5>Payload</h5>
        <div v-for="(data, key) in selectedMessageData" :key="key">
            <v-checkbox-btn
                v-model="selectedPayload"
                :label="`${key}: ${data.name}`"
                :value="key"
                density="compact"
            />
            <template v-if="selectedPayload.includes(key)">
                <v-select
                    v-if="data.values"
                    v-model="payloadValues[key]"
                    :items="Object.entries(data.values).map(([key, value]) => ({ key, name: `${key}: ${value.name}` }))"
                    :label="`${data.name} (${data.type})`"
                    item-title="name"
                    item-value="key"
                    density="compact"
                />
                <v-text-field
                    v-else
                    v-model="payloadValues[key]"
                    :label="`${data.name} (${data.type})`"
                    :placeholder="data.description"
                    density="compact"
                />
            </template>
        </div>
        <div v-for="(customPayload, index) in customPayloads" :key="index">
            <v-checkbox-btn
                v-model="customPayload.enabled"
                :label="`Custom Payload ${index + 1}`"
                density="compact"
            />
            <template v-if="customPayload.enabled">
                <div style="display: flex; align-items: center;">
                    <v-text-field
                        v-model="customPayload.id"
                        label="Payload Type ID (uint8)"
                        density="compact"
                        style="margin-right: 10px;"
                    />
                    <v-select
                        v-model="customPayload.type"
                        :items="typeOptions"
                        item-title="name"
                        item-value="key"
                        label="Payload Type"
                        density="compact"
                        style="margin-right: 10px;"
                    />
                    <v-text-field
                        v-model="customPayload.value"
                        :label="`Payload Value (${customPayload.type})`"
                        density="compact"
                    />
                </div>
            </template>
        </div>
        <small>
            Custom payloads:
            <a href="javascript:void(0);" @click.prevent="addCustomPayloadField">Add</a> /
            <a href="javascript:void(0);" @click.prevent="removeCustomPayloadField">Remove</a>
        </small>
    </div>
    <h5>Bytes</h5>
    <ProtocolBytes
        :byteString="generatedInts"
        showValidation
        :showGeneratorLink="false"
        :customHeaderTypes="customHeaderTypes"
        :customPayloadTypes="customPayloadTypes"
    />
    <h5>Extras</h5>
    <v-checkbox
            v-model="includePrefix"
            label="Include LB Prefix / Sync bytes"
            density="compact"
        />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import jsyaml from 'js-yaml';
import crc16xmodem from 'crc/calculators/crc16xmodem';
import ProtocolBytes from './ProtocolBytes.vue';
import Float32Utils from './../utils/Float32Utils';
import {Buffer} from 'buffer';

export default defineComponent({
    name: 'ProtocolGenerate',
    components: {
        ProtocolBytes
    },
    setup() {
        const urlLoaded = ref(false);
        const shouldWatchForChanges = ref(false);
        const includePrefix = ref(false);
        const selectedMessage = ref(null);
        const customMessageType = ref('');
        const selectedHeaders = ref([]);
        const selectedPayload = ref([]);
        const headerValues = ref({});
        const payloadValues = ref({});
        const customHeaders = ref([]);
        const customPayloads = ref([]);
        const protocolData = ref<any>({});
        const headers = computed(() => protocolData.value.header || {});
        const messageOptions = computed(() => {
            return Object.keys(protocolData.value.messages || {}).map(key => {
                return {
                    id: key,
                    name: key + ": " + protocolData.value.messages[key].name,
                };
            });
        });
        const messageOptionsWithCustom = computed(() => {
            return [...messageOptions.value, { id: 'custom', name: 'Custom' }];
        });
        const selectedMessageData = computed(() => {
            if (!selectedMessage.value || selectedMessage.value === 'custom') return {};
            return protocolData.value.messages?.[selectedMessage.value]?.data || {};
        });
        const typeOptions = [
            { key: 'uint8', name: 'uint8' },
            { key: 'uint16', name: 'uint16' },
            { key: 'uint32', name: 'uint32' },
            { key: 'uint64', name: 'uint64' },
            { key: 'ascii', name: 'ascii' },
            { key: '[]uint8', name: '[]uint8' },
            { key: 'bytes', name: 'bytes' },
            { key: 'float32', name: 'float32' },
            { key: 'uintn', name: 'uintn' },
            { key: 'int32', name: 'int32' }
        ];

        const loadProtocolData = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                protocolData.value = jsyaml.load(yamlData);
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        const convertToBytes = (value: string, type: string): number[] => {
            switch (type) {
                case 'uintn':
                    const num = parseInt(value, 10);
                    if ( num <= 255 ) {
                        return [num];
                    } else if ( num <= 65535 ) {
                        return intTouint16LE(num);
                    } else if ( num <= 4294967295 ) {
                        return intTouint32LE(num);
                    } else {
                        return intTouint64LE(num);
                    }
                case 'uint8':
                    return [parseInt(value, 10)];
                case 'uint16':
                    return intTouint16LE(parseInt(value, 10));
                case 'uint32':
                    return intTouint32LE(parseInt(value, 10));
                case 'uint64':
                    return intTouint64LE(parseInt(value, 10));
                case 'ascii':
                    return value.split('').map(char => char.charCodeAt(0));
                case '[]uint8':
                    return value.split(' ').map(part => parseInt(part, 10));
                case 'float32':
                    return Float32Utils.float32ToBytesLE(parseFloat(value));
                case 'int32':
                    return int32ToBytesLE(parseInt(value, 10));
                case 'bytes':
                    // Replace , with space
                    value = value.replace(/,/g, ' ');
                    // Replace "  " with " "
                    value = value.replace(/  /g, ' ');
                    // Replace commas with spaces
                    value = value.replace(/,/g, ' ');
                    let valContainsLetters = value.match(/[a-z]/i);
                    // Split by space and parse as hex if needed
                    let split = value.split(' ').map(part => {
                        if (part.startsWith('0x') || valContainsLetters) {
                            return parseInt(part, 16);
                        } else {
                            return parseInt(part, 10);
                        }
                    });
                    return split;
                default:
                    return [];
            }
        };

        const generatedMessage = computed(() => {
            if (!selectedMessage.value) {
                return null;
            }
            let b: number[] = [];
            b.push(3);
            b.push(255);
            b.push(255);
            if (selectedMessage.value !== null) {
                const messageType = selectedMessage.value === 'custom' ? parseInt(customMessageType.value, 10) : selectedMessage.value;
                b.push(...intTouint16LE(messageType));
            }

            b.push(...intTouint16LE(selectedHeaders.value.length + customHeaders.value.filter(header => header.enabled).length));
            selectedHeaders.value.forEach((headerIndex) => {
                b.push(headerIndex);
            });

            customHeaders.value.forEach(customHeader => {
                if (customHeader.enabled) {
                    const customHeaderIdNum = parseInt(customHeader.id, 10);
                    b.push(customHeaderIdNum);
                }
            });

            selectedHeaders.value.forEach((headerIndex) => {
                let headerValue = headerValues.value[headerIndex] || '';
                const headerType = headers.value[headerIndex]?.type || 'undefined type';
                const headerValueBytes = convertToBytes(headerValue, headerType);
                b.push(headerValueBytes.length);
                b.push(...headerValueBytes);
            });

            customHeaders.value.forEach(customHeader => {
                if (customHeader.enabled) {
                    const customHeaderValueBytes = convertToBytes(customHeader.value, customHeader.type);
                    b.push(customHeaderValueBytes.length);
                    b.push(...customHeaderValueBytes);
                }
            });

            b.push(...intTouint16LE(selectedPayload.value.length + customPayloads.value.filter(payload => payload.enabled).length));
            selectedPayload.value.forEach((payloadIndex) => {
                b.push(payloadIndex);
            });

            customPayloads.value.forEach(customPayload => {
                if (customPayload.enabled) {
                    const customPayloadIdNum = parseInt(customPayload.id, 10);
                    b.push(customPayloadIdNum);
                }
            });

            selectedPayload.value.forEach((payloadIndex) => {
                let payloadValue = payloadValues.value[payloadIndex] || '';
                if (payloadValue === '') {
                    b.push(0);// a zero value still needs a length of 0
                    return;
                }
                const payloadType = selectedMessageData.value[payloadIndex]?.type || 'undefined type';
                const payloadValueBytes = convertToBytes(payloadValue, payloadType);
                b.push(payloadValueBytes.length);
                b.push(...payloadValueBytes);
            });

            customPayloads.value.forEach(customPayload => {
                if (customPayload.enabled) {
                    const customPayloadValueBytes = convertToBytes(customPayload.value, customPayload.type);
                    b.push(customPayloadValueBytes.length);
                    b.push(...customPayloadValueBytes);
                }
            });

            const length = b.length + 2;
            b[1] = length & 0xff;
            b[2] = (length >> 8) & 0xff;
            let csumHex = calculateChecksum(b);
            let csumNum = parseInt(csumHex, 16);
            b.push(...intTouint16LE(csumNum));

            if (includePrefix.value) {
                b.unshift(0x42);
                b.unshift(0x4c);
            }

            return b;
        });

        const generatedHex = computed(() => {
            if (!generatedMessage.value) {
                return "";
            }
            return generatedMessage.value.map((x) => x.toString(16).padStart(2, '0')).join(' ');
        });

        const generatedLongHex = computed(() => {
            if (!generatedMessage.value) {
                return "";
            }
            return generatedMessage.value.map((x) => '0x' + x.toString(16).padStart(2, '0')).join(' ');
        });

        const generatedInts = computed(() => {
            if (!generatedMessage.value) {
                return "";
            }
            return generatedMessage.value.join(' ');
        });

        const intTouint16LE = (value: number) => {
            return [value & 0xff, (value >> 8) & 0xff];
        };

        const intTouint32LE = (value: number) => {
            return [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff];
        };

        const intTouint64LE = (value: number) => {
            try {
                let buff = Buffer.alloc(8);
                buff.writeBigUInt64LE(BigInt(value));
                return Array.from(buff);
            } catch (error) {
                console.error('Error converting to uint64LE:', error);
                return Array(8).fill(0);
            }
        };

        const int32ToBytesLE = (value: number) => {
            return [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff];
        };

        const bytesToInt32LE = (bytes: number[]) => {
            return (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
        };

        const calculateChecksum = (message: number[]) => {
            let crc = crc16xmodem(new Int8Array(message));
            return crc.toString(16);
        };

        const updateUrl = () => {
            const url = new URL(window.location.href);
            // write back the bytes into the bytes param
            url.searchParams.set('bytes', generatedInts.value);
            window.history.replaceState({}, '', url.toString());
        };

        const parseBytesFromUrl = (byteString: string) => {
            const byteArray = byteString.split(' ').map(byte => parseInt(byte, 10));
            let index = 0;

            if (byteArray[index] === 0x4c && byteArray[index + 1] === 0x42) {
                index += 2; // Skip prefix
            }

            const protocolVersion = byteArray[index++];
            const length = (byteArray[index + 1] << 8) | byteArray[index];
            index += 2;

            const messageType = (byteArray[index + 1] << 8) | byteArray[index];
            index += 2;
            selectedMessage.value = messageType.toString();

            const numHeaders = (byteArray[index + 1] << 8) | byteArray[index];
            index += 2;

            const headers = [];
            for (let i = 0; i < numHeaders; i++) {
                headers.push(byteArray[index++]);
            }
            selectedHeaders.value = headers.map(header => header.toString());

            headers.forEach(headerIndex => {
                const headerLength = byteArray[index++];
                const headerValueBytes = byteArray.slice(index, index + headerLength);
                index += headerLength;
                headerValues.value[headerIndex] = headerValueBytes.join(' ');
            });

            const numPayloads = (byteArray[index + 1] << 8) | byteArray[index];
            index += 2;

            const payloads = [];
            for (let i = 0; i < numPayloads; i++) {
                payloads.push(byteArray[index++]);
            }
            selectedPayload.value = payloads.map(payload => payload.toString());

            payloads.forEach(payloadIndex => {
                const payloadLength = byteArray[index++];
                const payloadValueBytes = byteArray.slice(index, index + payloadLength);
                index += payloadLength;
                const payloadType = selectedMessageData.value[payloadIndex]?.type || 'undefined type';
                payloadValues.value[payloadIndex] = convertBytesToValue(payloadValueBytes, payloadType);
            });

            // Skip checksum
        };

        const convertBytesToValue = (bytes: number[], type: string): string => {
            switch (type) {
                case 'uint8':
                    return bytes[0].toString();
                case 'uint16':
                    return ((bytes[1] << 8) | bytes[0]).toString();
                case 'uint32':
                    return ((bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0]).toString();
                case 'uint64':
                    return ((bytes[7] << 56) | (bytes[6] << 48) | (bytes[5] << 40) | (bytes[4] << 32) | (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0]).toString();
                case 'float32':
                    return Float32Utils.bytesLEToFloat32(bytes).toString();
                case 'ascii':
                    return String.fromCharCode(...bytes);
                case '[]uint8':
                    return bytes.join(' ');
                case 'uintn':
                    // decide based on the length of the array
                    switch (bytes.length) {
                        case 1:
                            return bytes[0].toString();
                        case 2:
                            return ((bytes[1] << 8) | bytes[0]).toString();
                        case 4:
                            return ((bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0]).toString();
                        case 8:
                            return ((bytes[7] << 56) | (bytes[6] << 48) | (bytes[5] << 40) | (bytes[4] << 32) | (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0]).toString();
                    }
                case 'int32':
                    return bytesToInt32LE(bytes).toString();
                default:
                    return bytes.join(' ');
            }
        };

        const loadFromUrl = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const bytes = urlParams.get('bytes');
            if (bytes) {
                parseBytesFromUrl(bytes);
            }
            urlLoaded.value = true;
        };

        const addCustomHeaderField = () => {
            customHeaders.value.push({ enabled: true, id: '', type: '', value: '' });
        };

        const removeCustomHeaderField = () => {
            if (customHeaders.value.length > 0) {
            const removedHeader = customHeaders.value.pop();
            if (removedHeader && removedHeader.id) {
                delete headerValues.value[removedHeader.id];
            }
            }
        };

        const addCustomPayloadField = () => {
            customPayloads.value.push({ enabled: true, id: '', type: '', value: '' });
        };

        const removeCustomPayloadField = () => {
            if (customPayloads.value.length > 0) {
                customPayloads.value.pop();
            }
        };

        const customHeaderTypes = computed(() => {
            const headerTypes: { [key: string]: string } = {};
            customHeaders.value.filter(header => header.enabled).forEach(header => {
                headerTypes[header.id] = header.type;
            });
            return headerTypes;
        });

        const customPayloadTypes = computed(() => {
            const payloadTypes: { [key: string]: string } = {};
            customPayloads.value.filter(payload => payload.enabled).forEach(payload => {
                payloadTypes[payload.id] = payload.type;
            });
            return payloadTypes;
        });

        watch(selectedMessage, () => {
            if (urlLoaded.value) {
                if (!shouldWatchForChanges.value) {
                    shouldWatchForChanges.value = true;
                    return; // ignore the first change
                }
                selectedPayload.value = [];
                payloadValues.value = {};
            }
        });

        onMounted(async () => {
            await loadProtocolData();
            loadFromUrl();
        });

        watch([selectedMessage, selectedHeaders, selectedPayload, headerValues, payloadValues], updateUrl, { deep: true });

        return {
            includePrefix,
            selectedMessage,
            customMessageType,
            selectedHeaders,
            selectedPayload,
            headerValues,
            payloadValues,
            customHeaders,
            customPayloads,
            addCustomHeaderField,
            removeCustomHeaderField,
            addCustomPayloadField,
            removeCustomPayloadField,
            generatedHex,
            generatedLongHex,
            generatedInts,
            headers,
            messageOptions,
            messageOptionsWithCustom,
            selectedMessageData,
            typeOptions,
            customHeaderTypes,
            customPayloadTypes
        };
    },
});
</script>

<style scoped>
.v-card {
    width: 100%;
    margin: auto;
}
</style>
