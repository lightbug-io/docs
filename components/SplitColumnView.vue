<template>
    <v-row no-gutters>
        <v-col cols="12" sm="6">
            <v-sheet>
                <slot name="left"></slot>
            </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
            <v-sheet class="ma-2 pa-2">
                <slot name="right"></slot>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SplitColumnView',
});
</script>
