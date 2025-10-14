---
outline: [2,3]
---

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'
import { ref, onMounted } from 'vue'

const currentBytes = ref('')

const loadExample = (bytes) => {
  currentBytes.value = bytes
  // Update URL
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    url.searchParams.set('bytes', bytes)
    url.hash = 'parser'
    window.history.pushState({}, '', url)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    // Load from URL on mount
    const urlParams = new URLSearchParams(window.location.search)
    const bytesParam = urlParams.get('bytes')
    if (bytesParam) {
      currentBytes.value = bytesParam
    }

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', () => {
      const urlParams = new URLSearchParams(window.location.search)
      const bytesParam = urlParams.get('bytes')
      currentBytes.value = bytesParam || ''
    })
  }
})
</script>

# Parse

You can parse Lightbug V3 messages using the tool below.

Enter bytes in any format (decimal integers, hex, 0x notation, comma or space separated), and the tool will automatically detect and display any valid protocol messages found in the byte stream, and tell you information about them.

The parser can detect one or more valid messages in a byte stream, even if they are surrounded by noise bytes or random text (such as other logs).

The parser can also detect and display partially correct messages:
- **Invalid checksum**: The message structure is valid but the CRC check fails
- **Truncated messages**: The message is cut off before completion
- **Malformed structure**: The message can be parsed up to a certain point

Partial messages are highlighted with a yellow border and warning badge.

You can find some example byte streams [below](#examples) to try out.

## Parser

<ParseInput :initialBytes="currentBytes" :yaml-data="protocolData" />

## Examples

Click any example below to load it into the parser:

<div class="example-buttons">
  <button @click="loadExample('3 14 0 13 0 0 0 1 0 6 1 84 103 57')" class="example-btn">Single Heartbeat</button>
  <button @click="loadExample('3 14 0 13 0 0 0 1 0 6 1 84 103 57 3 14 0 13 0 0 0 1 0 6 1 84 103 57')" class="example-btn">2 Heartbeats</button>
  <button @click="loadExample('1 8 6 55 3 14 0 13 0 0 0 1 0 6 1 84 103 57 0 0 1 2 3 3 14 0 13 0 0 0 1 0 6 1 84 103 57 9 8 7 6')" class="example-btn">2 Heartbeats with Noise</button>
  <button @click="loadExample('3 19 0 148 38 1 0 201 1 3 1 0 202 3 102 111 111 112 94')" class="example-btn">Custom Message</button>
</div>

#### Partial or Messy Input

These examples demonstrate the parser's ability to detect partially correct messages:, or messages embedded in noisy text.
<div class="example-buttons">
  <button @click="loadExample('3 14 0 13 0 0 0 1 0 6 1 84 99 99')" class="example-btn example-partial">Invalid Checksum</button>
  <button @click="loadExample('3 14 0 13 0 0 0 1 0 6 1')" class="example-btn example-partial">Truncated Message</button>
  <button @click="loadExample('3 19 0 148 38 1 0 201 1 3 1 0 0 3 14 0 13 0 0 0 1 0 6 1 84 103 57')" class="example-btn example-partial">Partial + Valid</button>
  <button @click="loadExample('[lb.comms] DEBUG: car: Running sendHeartbeats_\n[lb.comms] DEBUG: SEND: Message type: 13 length: 0 id: 1 bytes: 03, 11, 00, 0d, 00, 01, 00, 01, 04, 01, 00, 00, 00, 00, 00, 4a, e7\n[lb.comms] DEBUG: car: Running processOutbox_')" class="example-btn example-partial">Message in Logs</button>
</div>

<style scoped>
.example-buttons {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.example-btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
}

.example-btn:hover {
  background-color: #3eaf7c;
  color: white;
  border-color: #3eaf7c;
}

.example-btn.example-partial {
  border-color: #ffc107;
  background-color: #fff3cd;
}

.example-btn.example-partial:hover {
  background-color: #ffc107;
  border-color: #ff9800;
  color: #333;
}

.dark .example-btn {
  background-color: #2a2a2a;
  border-color: #555;
  color: #ddd;
}

.dark .example-btn:hover {
  background-color: #3eaf7c;
  color: white;
  border-color: #3eaf7c;
}

.dark .example-btn.example-partial {
  border-color: #fbbf24;
  background-color: #664d03;
  color: #ffc107;
}

.dark .example-btn.example-partial:hover {
  background-color: #fbbf24;
  border-color: #f59e0b;
  color: #333;
}
</style>
