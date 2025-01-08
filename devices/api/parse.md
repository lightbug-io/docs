---
outline: [1,3]
---

<script setup>
import ProtocolBytesInput from '../../components/ProtocolBytesInput.vue';
import { ref, watch } from 'vue';

const urlParams = new URLSearchParams(window.location.search);
const bytes = ref(urlParams.get('bytes') || '');

const updateUrl = (newBytes) => {
    const url = new URL(window.location);
    url.searchParams.set('bytes', newBytes);
    window.history.replaceState({}, '', url);
};

const handleInputEvent = (event) => {
    if (event.target && event.target.value) {
        const newBytes = event.target.value.trim();
        bytes.value = newBytes;
        updateUrl(newBytes);
    }
};

watch(bytes, (newBytes) => {
    updateUrl(newBytes);
});
</script>

# Parse

You can parse messages online using the tool below.

<ProtocolBytesInput :byteString="bytes" @update="handleInputEvent" />
