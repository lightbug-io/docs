<template>
    <v-select
        v-model="selectedMessage"
        :items="messageOptions"
        label="Message Type"
        item-title="name"
        item-value="id"
        density="compact"
    />
    <div v-if="selectedMessage">
        <h5>Headers</h5>
        <div v-for="(header, key) in headers" :key="key">
            <v-checkbox-btn
                v-model="selectedHeaders"
                :label="header.name"
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
        <br/>
        <h5>Payload</h5>
        <div v-for="(data, key) in selectedMessageData" :key="key">
            <v-checkbox-btn
                v-model="selectedPayload"
                :label="data.name"
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
    </div>
    <ProtocolBytes :byteString="generatedInts" showValidation :showGeneratorLink="false" />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import jsyaml from 'js-yaml';
import crc16xmodem from 'crc/calculators/crc16xmodem';
import ProtocolBytes from './ProtocolBytes.vue';
import Float32Utils from './../utils/Float32Utils';

export default defineComponent({
    name: 'ProtocolGenerate',
    components: {
        ProtocolBytes
    },
    setup() {
        const urlLoaded = ref(false);
        const shouldWatchForChanges = ref(false);
        const includePrefix = ref(true);
        const selectedMessage = ref(null);
        const selectedHeaders = ref([]);
        const selectedPayload = ref([]);
        const headerValues = ref({});
        const payloadValues = ref({});
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
        const selectedMessageData = computed(() => {
            if (!selectedMessage.value) return {};
            return protocolData.value.messages?.[selectedMessage.value]?.data || {};
        });

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
                b.push(...intTouint16LE(selectedMessage.value));
            }

            b.push(...intTouint16LE(selectedHeaders.value.length));
            selectedHeaders.value.forEach((headerIndex) => {
                b.push(headerIndex);
            });

            selectedHeaders.value.forEach((headerIndex) => {
                let headerValue = headerValues.value[headerIndex] || '';
                const headerType = headers.value[headerIndex]?.type || 'undefined type';
                const headerValueBytes = convertToBytes(headerValue, headerType);
                b.push(headerValueBytes.length);
                b.push(...headerValueBytes);
            });

            b.push(...intTouint16LE(selectedPayload.value.length));
            selectedPayload.value.forEach((payloadIndex) => {
                b.push(payloadIndex);
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
            return [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff, (value >> 32) & 0xff, (value >> 40) & 0xff, (value >> 48) & 0xff, (value >> 56) & 0xff];
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
            selectedHeaders,
            selectedPayload,
            headerValues,
            payloadValues,
            generatedHex,
            generatedLongHex,
            generatedInts,
            headers,
            messageOptions,
            selectedMessageData,
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
