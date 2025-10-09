<template>
    <div v-if="headerData && headerData.values && Object.keys(headerData.values).length > 0">
        <table>
            <thead>
                <tr>
                    <th>Value</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(valueData, value) in headerData.values" :key="value">
                    <td>{{ value }}</td>
                    <td>{{ valueData.name }}</td>
                    <td>{{ valueData.description || '' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'HeaderInfo',
    props: {
        // ID of the header field
        headerId: {
            type: Number,
            required: true
        },
        // Pre-loaded YAML data
        yamlData: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const headerData = computed(() => {
            return props.yamlData?.header?.[props.headerId];
        });

        return {
            headerData
        };
    },
});
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
}
</style>
