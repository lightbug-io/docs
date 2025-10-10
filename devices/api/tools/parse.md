---
outline: [2,3]
---

<script setup>
import ParseInput from '../../../components/Protocol/ParseInput.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'

const createExampleUrl = (bytes) => {
  const url = new URL(window.location.href);
  url.searchParams.set('bytes', bytes);
  url.hash = 'parser';
  return url.toString();
}
</script>

# Parse

You can parse messages online using the tool below.

Enter bytes in any format (decimal integers, hex, 0x notation, comma or space separated), and the tool will automatically detect and display any valid protocol messages found in the byte stream, and tell you information about them.

You can find some example byte streams [below](#examples) to try out.

## Parser

<ParseInput :yaml-data="protocolData" />

## Examples

Click any example below to load it into the parser:

<div class="example-buttons">
  <a :href="createExampleUrl('3 14 0 13 0 0 0 1 0 6 1 84 103 57 3 14 0 13 0 0 0 1 0 6 1 84 103 57')" class="example-btn">2 Heartbeats</a>
  <a :href="createExampleUrl('1 8 6 55 3 14 0 13 0 0 0 1 0 6 1 84 103 57 0 0 1 2 3 3 14 0 13 0 0 0 1 0 6 1 84 103 57 9 8 7 6 ')" class="example-btn">2 Heartbeats, with some noise</a>
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
</style>
