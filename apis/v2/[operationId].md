---
aside: false
outline: false
pageClass: api-reference-page
---

<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import ApiReference from '../../.vitepress/theme/components/ApiReference.vue'
import { loadSpec } from '../../swagger/load'
const spec = loadSpec(2)
const route = useRoute()
const operationId = computed(() => route.data.params.operationId)
</script>

<ApiReference :key="operationId" :operation-id="operationId" :spec="spec" />
