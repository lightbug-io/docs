<template>
    <v-card class="full-width" density="compact">
        <v-card-title>Protocol Message Generator</v-card-title>
        <v-card-text>
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
                    <v-text-field
                        v-if="selectedHeaders.includes(key)"
                        v-model="headerValues[key]"
                        :label="`${header.name} (${header.type})`"
                        :placeholder="header.description"
                        density="compact"
                    />
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
                    <v-text-field
                        v-if="selectedPayload.includes(key)"
                        v-model="payloadValues[key]"
                        :label="`${data.name} (${data.type})`"
                        :placeholder="data.description"
                        density="compact"
                    />
                </div>
            </div>
            <ProtocolBytes :byteString="generatedInts" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import jsyaml from 'js-yaml';
import crc16xmodem from 'crc/calculators/crc16xmodem';
import ProtocolBytes from './ProtocolBytes.vue';

export default defineComponent({
    name: 'ProtocolGenerate',
    components: {
        ProtocolBytes
    },
    setup() {
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
            return protocolData.value.messages[selectedMessage.value]?.data || {};
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

        const generatedMessage = computed(() => {
            if (!selectedMessage.value) {
                return null;
            }
            // generate a list of bytes, that make up the message...
            let b: number[] = [];
            // Then the protocol version of 3
            b.push(3);
            // Then the length, as uint16 little endian which we don't know yet, so fill as 255 255
            b.push(255);
            b.push(255);
            // Then the message type as uint16 little endian
            if (selectedMessage.value !== null) { // TODO detect and deal with this error better..
                b.push(...intTouint16LE(selectedMessage.value));
            }

            // Header fields
            // First add a uint16 little endian for the number of headers
            b.push(...intTouint16LE(selectedHeaders.value.length));

            // Then push the header types
            selectedHeaders.value.forEach((headerIndex) => {
                b.push(headerIndex);
            });

            // Then push the header values
            selectedHeaders.value.forEach((headerIndex) => {
                let headerValue = headerValues.value[headerIndex] || '';
                headerValue = headerValue.trim();
                const headerValueBytes = headerValue.split(' ')
                const headerValueByteCount = headerValue ? headerValueBytes.length : 0;
                // first push a uint8 of the length of the header value
                b.push(headerValueByteCount);
                if (headerValueByteCount > 0) {
                    // then push the raw bytes of the header value, each one as a uint8
                    headerValueBytes.forEach((byte) => {
                        b.push(parseInt(byte, 10));
                    });
                }
            });

            // Payload fields
            // First add a uint16 little endian for the number of payloads
            b.push(...intTouint16LE(selectedPayload.value.length));

            // Then push the payload types
            selectedPayload.value.forEach((payloadIndex) => {
                b.push(payloadIndex);
            });

            // Then push the payload fields
            selectedPayload.value.forEach((payloadIndex) => {
                let payloadValue = payloadValues.value[payloadIndex] || '';
                payloadValue = payloadValue.trim();
                const payloadValueBytes = payloadValue.split(' ')
                const payloadValueByteCount = payloadValue ? payloadValueBytes.length : 0;
                // first push a uint8 of the length of the payload value
                b.push(payloadValueByteCount);
                if (payloadValueByteCount > 0) {
                    // then push the raw bytes of the payload value, each one as a uint8
                    payloadValueBytes.forEach((byte) => {
                        b.push(parseInt(byte, 10));
                    });
                }
            });

            // Then we insert the length at index 1 & 2, which is the length of b, +2 (for the checksum)
            const length = b.length + 2;
            b[1] = length & 0xff;
            b[2] = (length >> 8) & 0xff;
            // Then we calculate the checksum
            // This is CRC16 of the bytes
            // Add the csum to the end s a uint16 little endian
            let csumHex = calculateChecksum(b);
            let csumNum = parseInt(csumHex, 16);
            b.push(...intTouint16LE(csumNum));

            // Add the prefix to the start if includePrefix is true
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

        const calculateChecksum = (message: number[]) => {
            let crc = crc16xmodem(new Int8Array(message));
            return crc.toString(16);
        };

        onMounted(loadProtocolData);

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
