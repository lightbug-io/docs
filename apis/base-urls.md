---
aside: false
---

<script setup lang="ts">
import { loadSpec } from '../swagger/load'
const spec1 = loadSpec(1)
const spec2 = loadSpec(2)
console.log(spec1.servers[0])
</script>

# Base URLs

Both APIs are accessible using  `api.lightbug.cloud`.

 - [Version 1](/apis/v1/) API, accessible at `{{spec1.servers[0].url}}`
 - [Version 2](/apis/v2/) API, accessible at `{{spec2.servers[0].url}}`
