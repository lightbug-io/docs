---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { loadSpec } from '../../swagger/load'
const spec2 = loadSpec(2)
const route = useRoute()
const { isDark } = useData()
const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :spec="spec2" :isDark="isDark" :hideDefaultFooter="true"/>
