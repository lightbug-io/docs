---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { loadSpec } from '../../swagger/load'
const spec = loadSpec(1)
const route = useRoute()
const { isDark } = useData()
const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :spec="spec" :isDark="isDark" :hideDefaultFooter="true"/>
