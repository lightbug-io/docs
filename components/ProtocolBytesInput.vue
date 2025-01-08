<template>
    <v-text-field
        v-model="inputByteString"
        label="Enter Byte String"
    />
    <ProtocolBytes :byteString="processedByteString" />
</template>

<script lang="ts">
import ProtocolBytes from './ProtocolBytes.vue';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'ProtocolHeaders',
    components: {
        ProtocolBytes
    },
    props: {
        byteString: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const inputByteString = ref(props.byteString);

        const processedByteString = computed(() => {
            let byteString = inputByteString.value
                // Allow 0x prefix input (hex)
                .replace(/0x/g, '')
                // Allow CSV lists, with or without spaces
                .replace(/,/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();

            if (byteString === '') {
                return '';
            }

            // Check if there are any letters, then its gonna be hex?
            if (/[a-fA-F]/.test(byteString)) {
                // Remove spaces if any
                byteString = byteString.replace(/\s/g, '');
                // Parse each 2 chars from hex to int
                byteString = byteString.match(/.{1,2}/g)?.map(part => parseInt(part, 16)).join(' ') || '';
            } else {
                // parse each number to int
                byteString = byteString.split(' ').map(part => parseInt(part, 10)).join(' ');
            }

            return byteString;
        });

        return {
            inputByteString,
            processedByteString
        };
    }
});
</script>
