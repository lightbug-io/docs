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
                    <VCodeBlock
                        :code="computedGoConstantsIndividual"
                        highlightjs
                        lang="go"
                        theme="default"
                    />
                </div>
                <div v-else>
                    <VCodeBlock
                        :code="computedGoConstantsGrouped"
                        highlightjs
                        lang="go"
                        theme="default"
                    />
                </div>
            </div>
            <div v-else-if="activeTab === 'cpp'">
                <VCodeBlock
                    :code="computedCppConstants"
                    highlightjs
                    lang="cpp"
                    theme="default"
                />
            </div>
            <div v-else-if="activeTab === 'ts'">
                <VCodeBlock
                    :code="computedTsConstants"
                    highlightjs
                    lang="typescript"
                    theme="default"
                />
            </div>
            <div v-else>
                <VCodeBlock
                    :code="computedToitConstants"
                    highlightjs
                    theme="default"
                />
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import jsyaml from 'js-yaml';

export default defineComponent({
    name: 'GenerateConsts',
    props: {
        // Prefix before constants
        prefix: {
            type: String,
            default: 'MH_'
        },
        // Name of any ENUMS that are generated
        enumName: {
            type: String,
            default: 'MyEnum'
        },
        // Path within the protocol YAML file that we want to use for constants
        dataPath: {
            type: String
        }
    },
    setup(props) {
        const activeTab = ref('go');
        const goFormat = ref('individual');
        const showComments = ref(true);
        const constants = ref<any>({});
        const prefix = ref(props.prefix);

        // Watch for changes in the local prefix and update constants
        watch(prefix, () => {
            // Trigger re-computation of constants
            constants.value = { ...constants.value };
        });

        // Watch for changes in the props.prefix and update local prefix
        watch(() => props.prefix, (newPrefix) => {
            prefix.value = newPrefix;
        });

        const alignComment = (line: string, comment: string, maxLength: number) => {
            const padding = ' '.repeat(Math.max(1, maxLength - line.length));
            return `${line}${padding}// ${comment}`;
        };

        const getMaxLengthPlusOne = (lines: string[]) => {
            return Math.max(...lines.map(line => line.length)) +1;
        };

        const computedGoConstantsIndividual = computed(() => {
            let goConstants = '';
            const lines = [];
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`const ${prefix.value}${name} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `const ${prefix.value}${name} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                goConstants += `${line}\n`;
            }
            return goConstants;
        });

        const computedGoConstantsGrouped = computed(() => {
            let goConstants = 'const (\n';
            const lines = [];
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`    ${prefix.value}${name} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `    ${prefix.value}${name} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                goConstants += `${line}\n`;
            }
            goConstants += ')';
            return goConstants;
        });

        const computedCppConstants = computed(() => {
            let cppConstants = 'enum LB_MESSAGE_HEADERS : uint8_t {\n';
            const lines = [];
            const headerKeys = Object.keys(constants.value);
            headerKeys.forEach((key) => {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`    ${prefix.value}${name} = ${key}`);
            });
            const maxLength = getMaxLengthPlusOne(lines);
            headerKeys.forEach((key, index) => {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
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

        const computedTsConstants = computed(() => {
            let tsConstants = '';
            const lines = [];
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`export const ${prefix.value}${name} = ${key};`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `export const ${prefix.value}${name} = ${key};`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                tsConstants += `${line}\n`;
            }
            return tsConstants;
        });

        const computedToitConstants = computed(() => {
            let toitConstants = '';
            const lines = [];
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`${prefix.value}${name} /int ::= ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `${prefix.value}${name} /int ::= ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                toitConstants += `${line}\n`;
            }
            return toitConstants;
        });

        const loadConstants = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                let parsedData = jsyaml.load(yamlData);
                // Get the data from the path within the parsed data, where every string between a / is a new key
                props.dataPath.split('/').forEach((key) => {
                    parsedData = parsedData[key]
                })
                constants.value = parsedData
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        onMounted(loadConstants);

        return {
            activeTab,
            goFormat,
            showComments,
            prefix,
            computedGoConstantsIndividual,
            computedGoConstantsGrouped,
            computedCppConstants,
            computedTsConstants,
            computedToitConstants,
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
