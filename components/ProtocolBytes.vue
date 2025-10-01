<template>
    <FancyBytes :byteString="byteString" :byteDefinition="computedByteDefinition" />
</template>
<script lang="ts">
import FancyBytes from './FancyBytes.vue';
import { defineComponent, ref, PropType, computed, onMounted } from 'vue';
import crc16 from 'crc/crc16xmodem';
import Float32Utils from '../utils/Float32Utils';
import {Buffer} from 'buffer';

interface ByteDefinition {
    pos: number;
    len: number;
    name?: string;
    desc: string;
    type: string;
    value: string;
    valueParsed?: string;
    bold?: boolean;
}

export default defineComponent({
    name: 'ProtocolBytes',
    props: {
        byteString: {
            type: String,
            required: true
        },
        yamlData: {
            type: Object as PropType<any>,
            default: () => ({})
        },
        boldPositions: {
            type: Array as PropType<number[]>,
            default: () => []
        },
        showValidation: {
            type: Boolean,
            default: false
        },
        customHeaderTypes: {
            type: Object as PropType<{ [key: string]: string }>,
            default: () => ({})
        },
        customPayloadTypes: {
            type: Object as PropType<{ [key: string]: string }>,
            default: () => ({})
        }
    },
    components: {
        FancyBytes
    },
    setup(props) {
        // Use preloaded YAML data provided by the caller via `yamlData` prop.

        const uint16LEtoUInt = (byte1: number, byte2: number): number => {
            return ((byte2 << 8) | byte1) >>> 0;
        };

        const uint32LEtoUInt = (byte1: number, byte2: number, byte3: number, byte4: number): number => {
            return ((byte4 << 24) | (byte3 << 16) | (byte2 << 8) | byte1) >>> 0;
        };

        const uint64LEtoUInt = (byte1: number, byte2: number, byte3: number, byte4: number, byte5: number, byte6: number, byte7: number, byte8: number): number => {
            return ((byte8 << 56) | (byte7 << 48) | (byte6 << 40) | (byte5 << 32) | (byte4 << 24) | (byte3 << 16) | (byte2 << 8) | byte1) >>> 0;
        };

    const typedBytesToString = (type: string, bytes: number[], fieldType?: number, isMessageType?: any): string => {
            if (bytes.length === 0) {
                return '';
            }
            let result = '';
            switch (type) {
                case 'uint8':
                    result = bytes.length < 1 ? "" : bytes[0].toString();
                    break;
                case 'uint16':
                    result = bytes.length < 2 ? "" : uint16LEtoUInt(bytes[0], bytes[1]).toString();
                    break;
                case 'uint32':
                    result = bytes.length < 4 ? "" : uint32LEtoUInt(bytes[0], bytes[1], bytes[2], bytes[3]).toString();
                    break;
                case 'uint64':
                    result = bytes.length < 8 ? "" : Buffer.from(bytes).readBigUInt64LE().toString();
                    break;
                case 'int32':
                    result = bytes.length < 4 ? "" : new Int32Array(new Uint8Array(bytes).buffer)[0].toString();
                    break;
                case 'float32':
                    result = bytes.length < 4 ? "" : Float32Utils.bytesLEToFloat32(bytes).toString();
                    break;
                case 'ascii':
                    result = String.fromCharCode(...bytes);
                    break;
                case '[]uint8':
                    result = bytes.map(byte => byte.toString()).join(' ');
                    break;
                case 'uint':
                    const size = bytes.length;
                    result = bytes.reduce((acc, byte, index) => {
                        return acc + (byte << (8 * index));
                    }, 0).toString();
                    break;
                default:
                    result = bytes.map(byte => byte.toString()).join(' ');
            }

            if (fieldType !== undefined) {
                const fieldValues = props.yamlData?.header?.[fieldType]?.values || props.yamlData?.messages?.[fieldType]?.values;
                if (fieldValues && fieldValues[result]) {
                    result += ` (${fieldValues[result].name})`;
                }
            }

            // Add message type names in some specific cases
            if (isMessageType !== undefined && isMessageType && type === 'uint16') {
                const messageName = props.yamlData?.messages?.[result]?.name;
                if (messageName) {
                    result += ` (${messageName})`;
                }
            }

            return result;
        };

        const computeByteDefinition = (byteString: string): ByteDefinition[] => {
            const byteArray = byteString.split(' ').map(s => parseInt(s, 10));
            const byteDefinition: ByteDefinition[] = [];
            let msgStart = 0;
            // Check if the byte string has a prefix, of [ 76, 66 ], if so, the first 2 bytes are the prefix
            if (byteArray.length > 2 && byteArray[0] === 76 && byteArray[1] === 66) {
                byteDefinition.push({
                    pos: 0,
                    len: 2,
                    name: 'Prefix',
                    desc: 'Prefix',
                    type: '[]uint8',
                    value: byteArray.slice(0, 2).join(' '),
                    valueParsed: typedBytesToString('[]uint8', byteArray.slice(0, 2)),
                    bold: props.boldPositions.includes(0)
                });
                msgStart = 2;
            }
            if (byteArray.length <= msgStart) {
                return byteDefinition;
            }
            let protocolAsString = typedBytesToString('uint8', byteArray.slice(msgStart, msgStart + 1));
            if (protocolAsString != '') {
                if (props.showValidation) {
                    if (protocolAsString === '3') {
                        protocolAsString += '✅';
                    } else {
                        protocolAsString += '❌';
                    }
                }
            }
            const protocolValue = byteArray[msgStart];
            byteDefinition.push({
                pos: msgStart,
                len: 1,
                name: 'Meta',
                desc: 'Protocol',
                type: 'uint8',
                value: String(byteArray[msgStart]),
                valueParsed: protocolAsString,
                bold: props.boldPositions.includes(msgStart)
            });
            // Then we should have 2 bytes which are uint16 little endian for the message length
            const providedLengthString = typedBytesToString('uint16', byteArray.slice(msgStart + 1, msgStart + 3));
            const expectedLength = byteArray.length - msgStart;
            const isLengthValid = parseInt(providedLengthString) === expectedLength;
            let lengthValueParsedString = ''
            if (providedLengthString != '') {
                lengthValueParsedString = props.showValidation ? (isLengthValid ? providedLengthString + '✅' : providedLengthString + '❌ wanted ' + expectedLength) : providedLengthString;
            }
            byteDefinition.push({
                pos: msgStart + 1,
                len: 2,
                name: 'Meta',
                desc: 'Length',
                type: 'uint16',
                value: byteArray.slice(msgStart + 1, msgStart + 3).join(' '),
                valueParsed: lengthValueParsedString,
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
                valueParsed: typedBytesToString('uint16', byteArray.slice(msgStart + 3, msgStart + 5), undefined, 1),
                bold: props.boldPositions.includes(msgStart + 3)
            });
            const messageType = uint16LEtoUInt(byteArray[msgStart + 3], byteArray[msgStart + 4]);
            const messageData = props.yamlData?.messages?.[messageType]?.data || {};
            // Then the number of headers as uint16 little endian
            byteDefinition.push({
                pos: msgStart + 5,
                len: 2,
                name: 'Header Meta',
                desc: 'Header Field Count',
                type: 'uint16',
                value: byteArray.slice(msgStart + 5, msgStart + 7).join(' '),
                valueParsed: typedBytesToString('uint16', byteArray.slice(msgStart + 5, msgStart + 7)),
                bold: props.boldPositions.includes(msgStart + 5)
            });
            // then we should have the header field types
            const numHeaderFields = uint16LEtoUInt(byteArray[msgStart + 5], byteArray[msgStart + 6]);
            const headerFieldStart = msgStart + 7;
            const headerFieldTypes = byteArray.slice(headerFieldStart, headerFieldStart + numHeaderFields).join(' ');
            byteDefinition.push({
                pos: headerFieldStart,
                len: numHeaderFields,
                name: 'Header Meta',
                desc: 'Header Field Types',
                type: '[]uint8',
                value: headerFieldTypes,
                valueParsed: typedBytesToString('[]uint8', byteArray.slice(headerFieldStart, headerFieldStart + numHeaderFields)),
                bold: props.boldPositions.includes(headerFieldStart)
            });
            const initialHeaderDataStart = headerFieldStart + numHeaderFields;
            let headerDataStart = initialHeaderDataStart;
            // Then we should have the header data, each header has a length byte, then the raw bytes
            for (let i = 0; i < numHeaderFields; i++) {
                const headerLength = byteArray[headerDataStart];
                const headerFieldType = byteArray[headerFieldStart + i];
                const headerFieldName = props.yamlData?.header?.[headerFieldType]?.name || 'Header ' + headerFieldType;
                const headerFieldValueType = props.yamlData?.header?.[headerFieldType]?.type || props.customHeaderTypes[headerFieldType] || 'undefined';
                byteDefinition.push({
                    pos: headerDataStart,
                    len: 1,
                    name: 'Header ' + (i+1),
                    desc: headerFieldName + '('+headerFieldType+')' + ' Length',
                    type: 'uint8',
                    value: String(byteArray[headerDataStart]),
                    valueParsed: typedBytesToString('uint8', byteArray.slice(headerDataStart, headerDataStart + 1)),
                    bold: props.boldPositions.includes(headerDataStart)
                });
                byteDefinition.push({
                    pos: headerDataStart + 1,
                    len: headerLength,
                    name: 'Header ' + (i+1),
                    desc: headerFieldName + '('+headerFieldType+')' + ' Data',
                    type: headerFieldValueType,
                    value: byteArray.slice(headerDataStart + 1, headerDataStart + 1 + headerLength).join(' '),
                    valueParsed: typedBytesToString(headerFieldValueType, byteArray.slice(headerDataStart + 1, headerDataStart + 1 + headerLength), headerFieldType),
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
                valueParsed: typedBytesToString('uint16', byteArray.slice(headerDataStart, headerDataStart + 2)),
                bold: props.boldPositions.includes(headerDataStart)
            });
            // then we should have the payload field types
            const numPayloadFields = uint16LEtoUInt(byteArray[headerDataStart], byteArray[headerDataStart + 1]);
            let payloadFieldStart = headerDataStart + 2;
            const payloadFieldTypes = byteArray.slice(payloadFieldStart, payloadFieldStart + numPayloadFields).join(' ');
            byteDefinition.push({
                pos: payloadFieldStart,
                len: numPayloadFields,
                name: 'Payload Meta',
                desc: 'Payload Field Types',
                type: '[]uint8',
                value: payloadFieldTypes,
                valueParsed: typedBytesToString('[]uint8', byteArray.slice(payloadFieldStart, payloadFieldStart + numPayloadFields)),
                bold: props.boldPositions.includes(payloadFieldStart)
            });
            // Then we should have the payload data, each payload has a length byte, then the raw bytes
            let payloadDataStart = payloadFieldStart + numPayloadFields;
            for (let i = 0; i < numPayloadFields; i++) {
                const payloadLength = byteArray[payloadDataStart];
                const payloadFieldType = byteArray[payloadFieldStart + i];
                const payloadFieldName = messageData[payloadFieldType]?.name || 'Payload ' + (i + 1);
                const payloadFieldValueType = messageData[payloadFieldType]?.type || props.customPayloadTypes[payloadFieldType] || 'undefined';
                byteDefinition.push({
                    pos: payloadDataStart,
                    len: 1,
                    name: payloadFieldName,
                    desc: payloadFieldName + ' ('+payloadFieldType+')' + ' Length',
                    type: 'uint8',
                    value: String(byteArray[payloadDataStart]),
                    valueParsed: typedBytesToString('uint8', byteArray.slice(payloadDataStart, payloadDataStart + 1)),
                    bold: props.boldPositions.includes(payloadDataStart)
                });
                let isDataValueAckedTypeId = false;
                // is msg type is 5, and payload field is 1, then we know it is the isDataValueAckedTypeId
                if (messageType === 5 && payloadFieldType === 1) {
                    isDataValueAckedTypeId = true;
                }

                byteDefinition.push({
                    pos: payloadDataStart + 1,
                    len: payloadLength,
                    name: payloadFieldName,
                    desc: payloadFieldName + ' ('+payloadFieldType+')' +' Data',
                    type: payloadFieldValueType,
                    value: byteArray.slice(payloadDataStart + 1, payloadDataStart + 1 + payloadLength).join(' '),
                    valueParsed: typedBytesToString(payloadFieldValueType, byteArray.slice(payloadDataStart + 1, payloadDataStart + 1 + payloadLength), payloadFieldType, isDataValueAckedTypeId),
                    bold: props.boldPositions.includes(payloadDataStart + 1)
                });
                payloadDataStart += payloadLength + 1;
            }
            // The last 2 bytes are the checksum
            const providedCRCString = typedBytesToString('uint16', byteArray.slice(payloadDataStart, payloadDataStart + 2))
            const expectedCRC = crc16(Buffer.from(byteArray.slice(msgStart, payloadDataStart)));
            const isValid = parseInt(providedCRCString) === expectedCRC;
            let checksumValueParsedString = ''
            if (providedCRCString != '') {
                checksumValueParsedString = props.showValidation ? (isValid ? providedCRCString + '✅' : providedCRCString + '❌ wanted ' + expectedCRC) : providedCRCString;
            }
            byteDefinition.push({
                pos: payloadDataStart,
                len: 2,
                name: 'Meta',
                desc: 'Checksum',
                type: 'uint16',
                value: byteArray.slice(payloadDataStart, payloadDataStart + 2).join(' '),
                valueParsed: checksumValueParsedString,
                bold: props.boldPositions.includes(payloadDataStart)
            });
            return byteDefinition;
        };
        const computedByteDefinition = computed(() => computeByteDefinition(props.byteString));

        return {
            computedByteDefinition
        };
    }
});
</script>
