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
                    <highlightjs language="go" :code="computedGoHeaderConstantsIndividual" />
                </div>
                <div v-else>
                    <highlightjs language="go" :code="computedGoHeaderConstantsGrouped" />
                </div>
            </div>
            <div v-else-if="activeTab === 'cpp'">
                <highlightjs language="cpp" :code="computedCppHeaderConstants" />
            </div>
            <div v-else-if="activeTab === 'ts'">
                <highlightjs language="typescript" :code="computedTsHeaderConstants" />
            </div>
            <div v-else>
                <highlightjs language="toit" :code="computedToitHeaderConstants" />
            </div>
        </v-card-text>
        <v-card-title>Options</v-card-title>
        <v-card-text>
            <v-text-field
                v-model="prefix"
                label="Prefix"
                placeholder="Enter prefix"
                @input="prefix = prefix.toUpperCase()"
            />
            <v-checkbox
                v-model="showComments"
                label="Show Comments"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
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
        const prefix = ref('MH_');
        const showComments = ref(true);
        const headers = ref<any>({});

        const alignComment = (line: string, comment: string, maxLength: number) => {
            const padding = ' '.repeat(Math.max(1, maxLength - line.length));
            return `${line}${padding}// ${comment}`;
        };

        const getMaxLengthPlusOne = (lines: string[]) => {
            return Math.max(...lines.map(line => line.length)) +1;
        };

        const computedGoHeaderConstantsIndividual = computed(() => {
            let goConstants = '';
            const lines = [];
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`const ${prefix.value}${name} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = headers.value[key].description || '';
                let line = `const ${prefix.value}${name} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                goConstants += `${line}\n`;
            }
            return goConstants;
        });

        const computedGoHeaderConstantsGrouped = computed(() => {
            let goConstants = 'const (\n';
            const lines = [];
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`    ${prefix.value}${name} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = headers.value[key].description || '';
                let line = `    ${prefix.value}${name} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                goConstants += `${line}\n`;
            }
            goConstants += ')';
            return goConstants;
        });

        const computedCppHeaderConstants = computed(() => {
            let cppConstants = 'enum LB_MESSAGE_HEADERS : uint8_t {\n';
            const lines = [];
            const headerKeys = Object.keys(headers.value);
            headerKeys.forEach((key) => {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`    ${prefix.value}${name} = ${key}`);
            });
            const maxLength = getMaxLengthPlusOne(lines);
            headerKeys.forEach((key, index) => {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = headers.value[key].description || '';
                let line = `    ${prefix.value}${name} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                cppConstants += `${line}`;
                if (index < headerKeys.length - 1) {
                    cppConstants += ',\n';
                }
            });
            cppConstants += '\n}';
            return cppConstants;
        });

        const computedTsHeaderConstants = computed(() => {
            let tsConstants = '';
            const lines = [];
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`export const ${prefix.value}${name} = ${key};`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = headers.value[key].description || '';
                let line = `export const ${prefix.value}${name} = ${key};`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                tsConstants += `${line}\n`;
            }
            return tsConstants;
        });

        const computedToitHeaderConstants = computed(() => {
            let toitConstants = '';
            const lines = [];
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`${prefix.value}${name} /int ::= ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in headers.value) {
                const name = headers.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = headers.value[key].description || '';
                let line = `${prefix.value}${name} /int ::= ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                toitConstants += `${line}\n`;
            }
            return toitConstants;
        });

        const loadHeaderConstants = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                const parsedData = jsyaml.load(yamlData);
                headers.value = parsedData.header;
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        onMounted(loadHeaderConstants);

        return {
            activeTab,
            goFormat,
            prefix,
            showComments,
            computedGoHeaderConstantsIndividual,
            computedGoHeaderConstantsGrouped,
            computedCppHeaderConstants,
            computedTsHeaderConstants,
            computedToitHeaderConstants,
            setActiveTab: (tab: string) => activeTab.value = tab,
            setGoFormat: (format: string) => goFormat.value = format,
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
