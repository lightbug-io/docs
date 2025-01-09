<template>
    <GenerateConsts :prefix="'MH_'" :dataPath="'header'"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GenerateConsts from './GenerateConsts.vue';

export default defineComponent({
    name: 'ProtocolHeaders',
    components: {
        GenerateConsts
    },
});
</script>

<style scoped>
</style>
