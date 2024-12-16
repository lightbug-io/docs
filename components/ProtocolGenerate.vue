<template>
    <v-card class="full-width">
        <v-card-title>Protocol Message Generator</v-card-title>
        <v-card-text>
            <v-select
                v-model="selectedMessage"
                :items="messageOptions"
                label="Message Type"
                item-title="name"
                item-value="id"
            />
            <div v-if="selectedMessage">
                <h3> Adding data coming soon...</h3>
                <v-divider class="my-4"></v-divider>
                <!-- <h3>Headers</h3>
                <div v-for="(header, key) in headers" :key="key">
                    <v-checkbox
                        v-model="selectedHeaders"
                        :label="header.name"
                        :value="key"
                    />
                    <v-text-field
                        v-if="selectedHeaders.includes(key)"
                        v-model="headerValues[key]"
                        :label="header.name"
                        :placeholder="header.description"
                    />
                </div> -->
                <!-- <h3>Payload</h3>
                <div v-for="(data, key) in selectedMessageData" :key="key">
                    <v-checkbox
                        v-model="selectedPayload"
                        :label="data.name"
                        :value="key"
                    />
                    <v-text-field
                        v-if="selectedPayload.includes(key)"
                        v-model="payloadValues[key]"
                        :label="data.name"
                        :placeholder="data.description"
                    />
                </div> -->
            </div>
            <h3>Generated Message</h3>
            <v-text-field
                v-model="generatedInts"
                label="Generated Ints"
                readonly
            />
            <v-text-field
                v-model="generatedHex"
                label="Generated Hex"
                readonly
            />
            <v-text-field
                v-model="generatedLongHex"
                label="Generated Long Hex"
                readonly
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import jsyaml from 'js-yaml';
import crc16xmodem from 'crc/calculators/crc16xmodem';

export default defineComponent({
    name: 'ProtocolGenerate',
    setup() {
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
            // Then the length, as uint16 little endiand which we don't know yet, so fill as 255 255
            b.push(255);
            b.push(255);
            // Then the message type as uint16 little endian
            if (selectedMessage.value !== null) { // TODO detect and deal with this error better..
                b.push(...intTouint16LE(selectedMessage.value));
            }
            // We don't allow fields or data yet, so 4x blanks 0s
            b.push(0);
            b.push(0);
            b.push(0);
            b.push(0);
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

            // Add the prefix to the start
            b.unshift(0x42);
            b.unshift(0x4c);

            return b;
        });

        const generatedHex = computed(() => {
            if (!generatedMessage.value) {
                return "Please select valid message information";
            }
            return generatedMessage.value.map((x) => x.toString(16).padStart(2, '0')).join(' ');
        });

        const generatedLongHex = computed(() => {
            if (!generatedMessage.value) {
                return "Please select valid message information";
            }
            return generatedMessage.value.map((x) => '0x' + x.toString(16).padStart(2, '0')).join(' ');
        });

        const generatedInts = computed(() => {
            if (!generatedMessage.value) {
                return "Please select valid message information";
            }
            return generatedMessage.value.join(', ');
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
