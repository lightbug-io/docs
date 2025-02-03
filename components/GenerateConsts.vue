<template>
    <v-card density="compact">
        <v-tabs v-model="activeTab" bg-color="primary" density="compact">
            <v-tab value="go">Go</v-tab>
            <v-tab value="toit">Toit</v-tab>
            <v-tab value="cpp">C++</v-tab>
            <v-tab value="ts">TypeScript</v-tab>
        </v-tabs>
        <v-card-text>
            <div v-if="activeTab === 'go'">
                <v-tabs v-model="goFormat" bg-color="secondary" density="compact">
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
                v-model="messageName"
                :label="messageNameLabel"
                density="compact" variant="underlined"
                @input="messageName = messageName.toUpperCase()"
            />
            <v-text-field
                v-model="dataName"
                label="Data Name"
                density="compact" variant="underlined"
                @input="dataName = dataName.toUpperCase()"
            />
            <v-checkbox
                v-model="showComments"
                label="Show Comments"
                density="compact"
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
        // ID of the message
        messageId: {
            type: Number,
            required: true
        },
        // Label for the message name text field
        messageNameLabel: {
            type: String,
            default: 'Message Name'
        }
    },
    setup(props) {
        const activeTab = ref('go');
        const goFormat = ref('individual');
        const showComments = ref(true);
        const constants = ref<any>({});
        const message = ref<any>({});
        const dataName = ref('');
        const messageName = ref('');

        // Watch for changes in the message name and update message info
        watch(messageName, () => {
            // Trigger re-computation of message info
            message.value = { ...message.value };
        });

        const alignComment = (line: string, comment: string, maxLength: number) => {
            const padding = ' '.repeat(Math.max(1, maxLength - line.length));
            return `${line}${padding}// ${comment}`;
        };

        const getMaxLengthPlusOne = (lines: string[]) => {
            return Math.max(...lines.map(line => line.length)) + 1;
        };

        const computedGoConstantsIndividual = computed(() => {
            let goConstants = '';
            const lines = [];
            lines.push(`const ${messageName.value} = ${props.messageId}`);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`const ${dataName.value}_${name} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            let line = `const ${messageName.value} = ${props.messageId}`;
            goConstants += `${line}\n`;
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                line = `const ${dataName.value}_${name} = ${key}`;
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
            lines.push(`    ${messageName.value} = ${props.messageId}`);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`    ${dataName.value}_${name} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            let line = `    ${messageName.value} = ${props.messageId}`;
            goConstants += `${line}\n`;
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                line = `    ${dataName.value}_${name} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                goConstants += `${line}\n`;
            }
            goConstants += ')';
            return goConstants;
        });

        const computedCppConstants = computed(() => {
            let cppConstants = `enum ${messageName.value} : uint8_t {\n`;
            const lines = [];

            // TODO at some point fix comment indenting..

            // Generate a group for the message type
            lines.push(`    ${messageName.value} = ${props.messageId}`);
            let line = `    ${messageName.value} = ${props.messageId},`;
            const messageDescription = message.value.description || '';
            if (showComments.value && messageDescription) {
                line = alignComment(line, messageDescription, getMaxLengthPlusOne(lines));
            }
            cppConstants += `${line}\n`;
            cppConstants += '};\n\n';

            // Generate a separate enum for the data group
            cppConstants += `enum ${dataName.value} : uint8_t {\n`;
            const headerKeys = Object.keys(constants.value);
            headerKeys.forEach((key, index) => {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                line = `    ${dataName.value}_${name} = ${key},`;
                lines.push(line);
                if (showComments.value) {
                    line = alignComment(line, description, getMaxLengthPlusOne(lines));
                }
                cppConstants += `${line}\n`;
            });
            cppConstants += '};';

            return cppConstants;
        });

        const computedTsConstants = computed(() => {
            let tsConstants = '';
            const lines = [];
            lines.push(`export const ${messageName.value} = ${props.messageId};`);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`export const ${dataName.value}_${name} = ${key};`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            let line = `export const ${messageName.value} = ${props.messageId};`;
            tsConstants += `${line}\n`;
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                line = `export const ${dataName.value}_${name} = ${key};`;
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
            lines.push(`${messageName.value} /int ::= ${props.messageId}`);
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`${dataName.value}_${name} /int ::= ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            let line = `${messageName.value} /int ::= ${props.messageId}`;
            toitConstants += `${line}\n`;
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                line = `${dataName.value}_${name} /int ::= ${key}`;
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
                // Get the data from the path within the parsed data
                const dataPath = `messages/${props.messageId}/data`;
                dataPath.split('/').forEach((key) => {
                    parsedData = parsedData[key]
                })
                constants.value = parsedData
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        const loadMessage = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                let parsedData = jsyaml.load(yamlData);
                // Get the message from the path within the parsed data
                const messagePath = `messages/${props.messageId}`;
                messagePath.split('/').forEach((key) => {
                    parsedData = parsedData[key]
                })
                message.value = parsedData;
                messageName.value = `MT_${message.value.name.toUpperCase().replace(/ /g, '_')}`;
                dataName.value = `MD_${message.value.name.toUpperCase().replace(/ /g, '_')}`;
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        onMounted(() => {
            loadConstants();
            loadMessage();
        });

        return {
            activeTab,
            goFormat,
            showComments,
            dataName,
            messageName,
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
</style>
