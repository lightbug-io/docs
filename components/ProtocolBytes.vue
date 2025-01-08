<template>
    <FancyBytes :byteString="byteString" :byteDefinition="computedByteDefinition" />
</template>
<script lang="ts">
import FancyBytes from './FancyBytes.vue';
import { defineComponent, ref, PropType, computed, onMounted } from 'vue';
import jsyaml from 'js-yaml';

interface ByteDefinition {
    pos: number;
    len: number;
    name?: string;
    desc: string;
    type: string;
    value: string;
    valueHover?: string;
    bold?: boolean;
}

export default defineComponent({
    name: 'ProtocolBytes',
    props: {
        byteString: {
            type: String,
            required: true
        },
        boldPositions: {
            type: Array as PropType<number[]>,
            default: () => []
        }
    },
    components: {
        FancyBytes
    },
    setup(props) {
        const protocolData = ref<any>({});
        const loadProtocolData = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                protocolData.value = jsyaml.load(yamlData);
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        const uint16LEtoInt = (byte1, byte2): number => {
            return (byte2 << 8) | byte1;
        };

        const typedBytesToString = (type: string, bytes: number[]): string => {
            if (type === 'uint8') {
                // should only be a list of 1 byte
                return bytes[0].toString();
            } else if (type === 'uint16') {
                // should be a list of 2 bytes
                return uint16LEtoInt(bytes[0], bytes[1]).toString();
            } else if (type === 'ascii') {
                return String.fromCharCode(...bytes);
            } else {
                return bytes.join(' ');
            }
        }

        const computeByteDefinition = (byteString: string): ByteDefinition[] => {
            const byteArray = byteString.split(' ')
            const byteDefinition: ByteDefinition[] = [];
            let msgStart = 0;
            // Check if the byte string has a prefix, of [ 76, 66 ], if so, the first 2 bytes are the prefix
            if (byteArray[0] === '76' && byteArray[1] === '66') {
                byteDefinition.push({
                    pos: 0,
                    len: 2,
                    name: 'Prefix',
                    desc: 'Prefix',
                    type: 'uint16',
                    value: byteArray.slice(0, 2).join(' '),
                    bold: props.boldPositions.includes(0)
                });
                msgStart = 2;
            }
            // The first message byte is the protocol version
            byteDefinition.push({
                pos: msgStart,
                len: 1,
                name: 'Meta',
                desc: 'Protocol',
                type: 'uint8',
                value: byteArray[msgStart],
                bold: props.boldPositions.includes(msgStart)
            });
            // Then we should have 2 bytes which are uint16 little endian for the message length
            byteDefinition.push({
                pos: msgStart + 1,
                len: 2,
                name: 'Meta',
                desc: 'Length',
                type: 'uint16',
                value: byteArray.slice(msgStart + 1, msgStart + 3).join(' '),
                valueHover: typedBytesToString('uint16', byteArray.slice(msgStart + 1, msgStart + 3)),
                bold: props.boldPositions.includes(msgStart + 1)
            });
            // Then the message type as uint16 little endian
            byteDefinition.push({
                pos: msgStart + 3,
                len: 2,
                name: 'Meta',
                desc: 'Type',
                type: 'uint16',
                value: byteArray.slice(msgStart + 3, msgStart + 5).join(' '),
                valueHover: typedBytesToString('uint16', byteArray.slice(msgStart + 3, msgStart + 5)),
                bold: props.boldPositions.includes(msgStart + 3)
            });
            const messageType = uint16LEtoInt(byteArray[msgStart + 3], byteArray[msgStart + 4]);
            const messageData = protocolData.value?.messages?.[messageType]?.data || {};
            // Then the number of headers as uint16 little endian
            byteDefinition.push({
                pos: msgStart + 5,
                len: 2,
                name: 'Header Meta',
                desc: 'Header Field Count',
                type: 'uint16',
                value: byteArray.slice(msgStart + 5, msgStart + 7).join(' '),
                valueHover: typedBytesToString('uint16', byteArray.slice(msgStart + 5, msgStart + 7)),
                bold: props.boldPositions.includes(msgStart + 5)
            });
            // then we should have the header field types
            const numHeaderFields = parseInt(byteArray.slice(msgStart + 5, msgStart + 7).reverse().join(''));
            const headerFieldStart = msgStart + 7;
            const headerFieldTypes = byteArray.slice(headerFieldStart, headerFieldStart + numHeaderFields).join(' ');
            byteDefinition.push({
                pos: headerFieldStart,
                len: numHeaderFields,
                name: 'Header Meta',
                desc: 'Header Field Types',
                type: 'uint8',
                value: headerFieldTypes,
                bold: props.boldPositions.includes(headerFieldStart)
            });
            const initialHeaderDataStart = headerFieldStart + numHeaderFields;
            let headerDataStart = initialHeaderDataStart;
            // Then we should have the header data, each header has a length byte, then the raw bytes
            for (let i = 0; i < numHeaderFields; i++) {
                const headerLength = parseInt(byteArray[headerDataStart]);
                const headerFieldType = parseInt(byteArray[headerFieldStart + i]);
                const headerFieldName = protocolData.value?.header?.[headerFieldType]?.name || 'Header ' + headerFieldType;
                const headerFieldValueType = protocolData.value?.header?.[headerFieldType]?.type || 'undefined';
                byteDefinition.push({
                    pos: headerDataStart,
                    len: 1,
                    name: 'Header ' + (i+1),
                    desc: headerFieldName + '('+headerFieldType+')' + ' Length',
                    type: 'uint8',
                    value: byteArray[headerDataStart],
                    bold: props.boldPositions.includes(headerDataStart)
                });
                byteDefinition.push({
                    pos: headerDataStart + 1,
                    len: headerLength,
                    name: 'Header ' + (i+1),
                    desc: headerFieldName + '('+headerFieldType+')' + ' Data',
                    type: 'uint8',
                    value: byteArray.slice(headerDataStart + 1, headerDataStart + 1 + headerLength).join(' '),
                    valueHover: typedBytesToString(headerFieldValueType, byteArray.slice(headerDataStart + 1, headerDataStart + 1 + headerLength)),
                    bold: props.boldPositions.includes(headerDataStart + 1)
                });
                headerDataStart += headerLength + 1;
            }
            // Then the number of payloads as uint16 little endian
            byteDefinition.push({
                pos: headerDataStart,
                len: 2,
                name: 'Payload Meta',
                desc: 'Payload Field Count',
                type: 'uint16',
                value: byteArray.slice(headerDataStart, headerDataStart + 2).join(' '),
                valueHover: typedBytesToString('uint16', byteArray.slice(headerDataStart, headerDataStart + 2)),
                bold: props.boldPositions.includes(headerDataStart)
            });
            // then we should have the payload field types
            const numPayloadFields = parseInt(byteArray.slice(headerDataStart, headerDataStart + 2).reverse().join(''));
            let payloadFieldStart = headerDataStart + 2;
            const payloadFieldTypes = byteArray.slice(payloadFieldStart, payloadFieldStart + numPayloadFields).join(' ');
            byteDefinition.push({
                pos: payloadFieldStart,
                len: numPayloadFields,
                name: 'Payload Meta',
                desc: 'Payload Field Types',
                type: 'uint8',
                value: payloadFieldTypes,
                bold: props.boldPositions.includes(payloadFieldStart)
            });
            // Then we should have the payload data, each payload has a length byte, then the raw bytes
            let payloadDataStart = payloadFieldStart + numPayloadFields;
            for (let i = 0; i < numPayloadFields; i++) {
                const payloadLength = parseInt(byteArray[payloadDataStart], 10);
                const payloadFieldType = parseInt(byteArray[payloadFieldStart + i]);
                const payloadFieldName = messageData[payloadFieldType]?.name || 'Payload ' + payloadFieldType;
                const payloadFieldValueType = messageData[payloadFieldType]?.type || 'undefined';
                byteDefinition.push({
                    pos: payloadDataStart,
                    len: 1,
                    name: payloadFieldName,
                    desc: payloadFieldName + '('+payloadFieldType+')' + ' Length',
                    type: 'uint8',
                    value: byteArray[payloadDataStart],
                    bold: props.boldPositions.includes(payloadDataStart)
                });
                byteDefinition.push({
                    pos: payloadDataStart + 1,
                    len: payloadLength,
                    name: payloadFieldName,
                    desc: payloadFieldName + '('+payloadFieldType+')' +' Data',
                    type: 'uint8',
                    value: byteArray.slice(payloadDataStart + 1, payloadDataStart + 1 + payloadLength).join(' '),
                    valueHover: typedBytesToString(payloadFieldValueType, byteArray.slice(payloadDataStart + 1, payloadDataStart + 1 + payloadLength)),
                    bold: props.boldPositions.includes(payloadDataStart + 1)
                });
                payloadDataStart += payloadLength + 1;
            }
            // The last 2 bytes are the checksum
            byteDefinition.push({
                pos: payloadDataStart,
                len: 2,
                name: 'Meta',
                desc: 'Checksum',
                type: 'uint16',
                value: byteArray.slice(payloadDataStart, payloadDataStart + 2).join(' '),
                valueHover: typedBytesToString('uint16', byteArray.slice(payloadDataStart, payloadDataStart + 2)),
                bold: props.boldPositions.includes(payloadDataStart)
            });
            return byteDefinition;
        };

        const computedByteDefinition = computed(() => computeByteDefinition(props.byteString));

        onMounted(loadProtocolData);

        return {
            computedByteDefinition
        };
    }
});
</script>
