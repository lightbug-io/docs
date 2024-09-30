<template>
    <div>
        <v-text-field
            type="number"
            v-model="bitfieldValue"
            @input="handleValueChange"
            min="0"
            max="255"
            label="Bitfield Value"
        />
        <div v-for="(description, index) in bitfieldDescriptions" :key="index">
            {{ bitfieldBits[index] ? '✅' : '❌' }} {{ 1 << index }}: {{ description }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'BitfieldCalculator',
    props: {
        bitfieldDescriptions: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            bitfieldValue: 0,
        };
    },
    computed: {
        bitfieldBits(): boolean[] {
            const bits: boolean[] = [];
            for (let i = 0; i < this.bitfieldDescriptions.length; i++) {
                const bit = (this.bitfieldValue & (1 << i)) !== 0;
                bits.push(bit);
            }
            return bits;
        },
    },
    methods: {
        handleValueChange() {
            const value = parseInt(this.bitfieldValue.toString());
            if (value > 255) {
                this.bitfieldValue = 255;
            }
        },
        calculateBitfield(value: number): boolean[] {
            const bits: boolean[] = [];
            for (let i = 0; i < this.bitfieldDescriptions.length; i++) {
                const bit = (value & (1 << i)) !== 0;
                bits.push(bit);
            }
            return bits;
        },
    },
    watch: {
        bitfieldValue(newValue) {
            this.bitfieldBits = this.calculateBitfield(newValue);
        },
    },
});
</script>

<style scoped>



</style>
