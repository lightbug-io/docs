<template>
    <v-card>
        <v-tabs v-model="activeTab" bg-color="primary">
            <v-tab value="go">Go</v-tab>
            <v-tab value="toit">Toit</v-tab>
            <v-tab value="cpp">C++</v-tab>
            <v-tab value="ts">TypeScript</v-tab>
        </v-tabs>

        <v-card-text>
            <div v-if="activeTab === 'go'">
                <v-tabs v-model="goFormat" bg-color="secondary">
                    <v-tab value="individual">Individual</v-tab>
                    <v-tab value="grouped">Grouped</v-tab>
                </v-tabs>
                <div v-if="goFormat === 'individual'">
                    <highlightjs language="go" :code="goHeaderConstantsIndividual" />
                </div>
                <div v-else>
                    <highlightjs language="go" :code="goHeaderConstantsGrouped" />
                </div>
            </div>
            <div v-else-if="activeTab === 'cpp'">
                <highlightjs language="cpp" :code="cppHeaderConstants" />
            </div>
            <div v-else-if="activeTab === 'ts'">
                <highlightjs language="typescript" :code="tsHeaderConstants" />
            </div>
            <div v-else>
                <highlightjs language="toit" :code="toitHeaderConstants" />
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import jsyaml from 'js-yaml';
import hljsVuePlugin from '@highlightjs/vue-plugin';

export default defineComponent({
    name: 'ProtocolHeaders',
    components: {
        highlightjs: hljsVuePlugin.component
    },
    setup() {
        const activeTab = ref('go');
        const goFormat = ref('individual');
        const goHeaderConstantsIndividual = ref('');
        const goHeaderConstantsGrouped = ref('');
        const cppHeaderConstants = ref('');
        const tsHeaderConstants = ref('');
        const toitHeaderConstants = ref('');

        const generateGoConstants = (headers: any) => {
            let goConstants = '';
            for (const key in headers) {
                const name = headers[key].name.toUpperCase().replace(/ /g, '_');
                goConstants += `const MH_${name} = ${key}\n`;
            }
            return goConstants;
        };

        const generateGoConstantsGrouped = (headers: any) => {
            let goConstants = 'const (\n';
            for (const key in headers) {
                const name = headers[key].name.toUpperCase().replace(/ /g, '_');
                goConstants += `\tMH_${name} = ${key}\n`;
            }
            goConstants += ')';
            return goConstants;
        };

        const generateTsConstants = (headers: any) => {
            let tsConstants = '';
            for (const key in headers) {
                const name = headers[key].name.toUpperCase().replace(/ /g, '_');
                tsConstants += `export const MH_${name} = ${key};\n`;
            }
            return tsConstants;
        };

        const generateToitConstants = (headers: any) => {
            let toitConstants = '';
            for (const key in headers) {
                const name = headers[key].name.toUpperCase().replace(/ /g, '_');
                toitConstants += `HEADER_${name} /int ::= ${key}\n`;
            }
            return toitConstants;
        };

        const loadHeaderConstants = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                const parsedData = jsyaml.load(yamlData);
                const headers = parsedData.header;

                // Generate Go constants
                goHeaderConstantsIndividual.value = generateGoConstants(headers);
                goHeaderConstantsGrouped.value = generateGoConstantsGrouped(headers);

                // Generate C++ constants
                let cppConstants = 'enum LB_MESSAGE_HEADERS : uint8_t {\n';
                const headerKeys = Object.keys(headers);
                headerKeys.forEach((key, index) => {
                    const name = headers[key].name.toUpperCase().replace(/ /g, '_');
                    cppConstants += `\tMH_${name}\t= ${key}`;
                    if (index < headerKeys.length - 1) {
                        cppConstants += ',\n';
                    }
                });
                cppConstants += '\n}';
                cppHeaderConstants.value = cppConstants;

                // Generate TypeScript constants
                tsHeaderConstants.value = generateTsConstants(headers);

                // Generate Toit constants
                toitHeaderConstants.value = generateToitConstants(headers);
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        const setActiveTab = (tab: string) => {
            activeTab.value = tab;
        };

        const setGoFormat = (format: string) => {
            goFormat.value = format;
        };

        onMounted(loadHeaderConstants);

        return {
            activeTab,
            goFormat,
            goHeaderConstantsIndividual,
            goHeaderConstantsGrouped,
            cppHeaderConstants,
            tsHeaderConstants,
            toitHeaderConstants,
            setActiveTab,
            setGoFormat,
        };
    },
});
</script>

<style scoped>
button {
    margin-right: 10px;
    padding: 5px 10px;
    cursor: pointer;
}
label {
    display: block;
    margin-bottom: 10px;
}
</style>
