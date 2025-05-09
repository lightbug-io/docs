---
aside: false
---

# Version 2

The version 2 API provides a modern, higher level experience for interacting with the data in the Lightbug cloud.

New API functionality will be added to this version as developments happen.

If you find that the V2 API does not provide the functionality you need, you may need to use parts of the [V1 API](./../v1/).

<script setup lang="ts">
import { loadSpec } from '../../swagger/load'
const spec = loadSpec(2)
</script>
<OAServers :spec="spec" />
