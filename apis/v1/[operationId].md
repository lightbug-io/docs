---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { loadSpec } from '../../swagger/load'
const spec1 = loadSpec(1)
const route = useRoute()
const { isDark } = useData()
const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :spec="spec1" :isDark="isDark" :hideDefaultFooter="true" />
