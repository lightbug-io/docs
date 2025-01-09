---
aside: false
outline: false
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { loadSpec } from '../../swagger/load'
const spec = loadSpec(2)
const route = useRoute()
const { isDark } = useData()
const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :spec="spec" :isDark="isDark" :hideDefaultFooter="true"/>
