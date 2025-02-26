---
outline: [1,3]
---

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

<script setup>
import ProtocolBytesInput from '../../../components/ProtocolBytesInput.vue';
import { ref, watch } from 'vue';

const urlParams = new URLSearchParams(window.location.search);
const bytes = ref(urlParams.get('bytes') || '');

const updateUrl = (newBytes) => {
    const sanitizedBytes = newBytes.replace(/ {2,}/g, ' ');
    const url = new URL(window.location);
    url.searchParams.set('bytes', sanitizedBytes);
    window.history.replaceState({}, '', url);
};

const handleInputEvent = (event) => {
    if (event.target && event.target.value) {
        const newBytes = event.target.value.trim();
        bytes.value = newBytes;
        updateUrl(newBytes);
    }
};

const parseBytes = (input) => {
    return input.split(/[\s,]+/).map(byte => {
        if (byte.startsWith('0x')) {
            return parseInt(byte, 16);
        } else if (/^[0-9a-fA-F]+$/.test(byte)) {
            return parseInt(byte, 16);
        } else {
            return parseInt(byte, 10);
        }
    }).filter(byte => !isNaN(byte)).join(' ');
};

watch(bytes, (newBytes) => {
    const parsedBytes = parseBytes(newBytes);
    updateUrl(parsedBytes);
});
</script>

# Parse

You can parse messages online using the tool below.

<ProtocolBytesInput :byteString="bytes" @update="handleInputEvent" />
