<template>
    <v-text-field
        v-model="inputByteString"
        label="Enter Byte String"
        @input="updateByteString"
        density="compact"
    />
    <ProtocolBytes :byteString="processedByteString" showValidation/>
</template>

<script lang="ts">
import ProtocolBytes from './ProtocolBytes.vue';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'ProtocolBytesInput',
    components: {
        ProtocolBytes
    },
    props: {
        byteString: {
            type: String,
            default: ''
        }
    },
    emits: ['update'],
    setup(props, { emit }) {
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

        const updateByteString = (newByteString: string) => {
            emit('update', newByteString);
        };
        return {
            inputByteString,
            processedByteString,
            updateByteString
        };
    }
});
</script>
