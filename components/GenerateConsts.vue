<template>
    <v-card density="compact">
        <v-tabs v-model="activeTab" bg-color="primary" density="compact">
            <v-tab value="go">Go</v-tab>
            <v-tab value="toit">Toit</v-tab>
            <v-tab value="ts">TypeScript</v-tab>
            <v-tab value="cpp">C++</v-tab>
            <v-tab value="cs">C#</v-tab>
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
            <div v-else-if="activeTab === 'cs'">
                <VCodeBlock
                    :code="computedCsConstants"
                    highlightjs
                    lang="csharp"
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
            <!-- TODO, only count the first value of messageName, not user changed bits... -->
            <v-text-field
                v-if="activeTab === 'cpp' || activeTab === 'cs'"
                v-model="messageGroupName"
                label="Message Group Name"
                density="compact" variant="underlined"
                @input="messageGroupName = messageGroupName.toUpperCase()"
            />
            <v-text-field
                v-if="messageName"
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
            required: false
        },
        // Label for the message name text field
        messageNameLabel: {
            type: String,
            default: 'Message Name'
        },
        // Optional path for data
        dataPath: {
            type: String,
            required: false
        },
        // Optional prefix for constants
        prefix: {
            type: String,
            default: ''
        },
        // Optional data name
        dataName: {
            type: String,
            required: false
        }
    },
    setup(props) {
        const activeTab = ref('go');
        const goFormat = ref('individual');
        const showComments = ref(true);
        const constants = ref<any>({});
        const message = ref<any>({});
        const dataName = ref(props.dataName || '');
        const messageName = ref('');
        const messageGroupName = ref('');

        // Watch for changes in the message name and update message info
        watch(messageName, () => {
            // Trigger re-computation of message info
            message.value = { ...message.value };
        });
        watch(messageGroupName, () => {
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

        const formatConstantName = (base: string, name: string) => {
            return `${base}_${name}`.replace(/^_+/, '');
        };

        const computedGoConstantsIndividual = computed(() => {
            let goConstants = '';
            const lines = [];
            if (props.messageId) {
                lines.push(`const ${messageName.value} = ${props.messageId}`);
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`const ${formatConstantName(dataName.value, name)} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            if (props.messageId) {
                let line = `const ${messageName.value} = ${props.messageId}`;
                goConstants += `${line}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `const ${formatConstantName(dataName.value, name)} = ${key}`;
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
            if (props.messageId) {
                lines.push(`    ${messageName.value} = ${props.messageId}`);
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`    ${formatConstantName(dataName.value, name)} = ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            if (props.messageId) {
                let line = `    ${messageName.value} = ${props.messageId}`;
                goConstants += `${line}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `    ${formatConstantName(dataName.value, name)} = ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                goConstants += `${line}\n`;
            }
            goConstants += ')';
            return goConstants;
        });

        const computedCppConstants = computed(() => {
            let cppConstants = ``
            const lines = [];

            // TODO at some point fix comment indenting..

            // Generate a group for the message type
            if (props.messageId) {
                cppConstants += `enum ${messageGroupName.value} : uint8_t {\n`;
                lines.push(`    ${messageName.value} = ${props.messageId}`);
                let line = `    ${messageName.value} = ${props.messageId},`;
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    line = alignComment(line, messageDescription, getMaxLengthPlusOne(lines));
                }
                cppConstants += `${line}\n`;
                cppConstants += '};\n\n';
            }

            // Generate a separate enum for the data group
            cppConstants += `enum ${dataName.value} : uint8_t {\n`;
            const headerKeys = Object.keys(constants.value);
            headerKeys.forEach((key, index) => {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `    ${formatConstantName(dataName.value, name)} = ${key},`;
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
            if (props.messageId) {
                lines.push(`export const ${messageName.value} = ${props.messageId};`);
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`export const ${formatConstantName(dataName.value, name)} = ${key};`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            if (props.messageId) {
                let line = `export const ${messageName.value} = ${props.messageId};`;
                tsConstants += `${line}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `export const ${formatConstantName(dataName.value, name)} = ${key};`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                tsConstants += `${line}\n`;
            }
            return tsConstants;
        });

        const computedToitConstants = computed(() => {
            let toitConstants = '';
            const lines = []; // Collect lines first, so we know how long they get
            if (props.messageId){
                lines.push(`${messageName.value} /int ::= ${props.messageId}`);
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                lines.push(`${formatConstantName(dataName.value, name)} /int ::= ${key}`);
            }
            const maxLength = getMaxLengthPlusOne(lines);
            if (props.messageId){
                toitConstants += `${messageName.value} /int ::= ${props.messageId}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `${formatConstantName(dataName.value, name)} /int ::= ${key}`;
                if (showComments.value) {
                    line = alignComment(line, description, maxLength);
                }
                toitConstants += `${line}\n`;
            }
            return toitConstants;
        });

        const computedCsConstants = computed(() => {
            let csConstants = '';
            if (props.messageId) {
                csConstants += `public static class ${messageGroupName.value} {\n`;
                csConstants += `    public const int ${message.value.name.toUpperCase().replace(/ /g, '_')} = ${props.messageId};\n`;
                csConstants += '}\n\n';
            }
            csConstants += `public static class ${dataName.value} {\n`;
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                let line = `    public const int ${name} = ${key};`;
                if (showComments.value) {
                    line = alignComment(line, description, getMaxLengthPlusOne([line]));
                }
                csConstants += `${line}\n`;
            }
            csConstants += '}';
            return csConstants;
        });

        const loadConstants = async () => {
            try {
                const response = await fetch('/files/protocol-v3.yaml');
                const yamlData = await response.text();
                let parsedData = jsyaml.load(yamlData);
                // Get the data from the path within the parsed data
                const dataPath = props.dataPath || `messages/${props.messageId}/data`;
                dataPath.split('/').forEach((key) => {
                    parsedData = parsedData[key]
                });
                // Apply prefix to constants
                const prefixedConstants = {};
                for (const key in parsedData) {
                    prefixedConstants[`${key}`] = {
                        name: `${props.prefix}${parsedData[key].name}`,
                        description: parsedData[key].description
                    };
                }
                constants.value = prefixedConstants;
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        const loadMessage = async () => {
            if (!props.messageId) return;
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
                messageGroupName.value = `MT`
                if (!props.dataName) {
                    dataName.value = `MD_${message.value.name.toUpperCase().replace(/ /g, '_')}`;
                }
            } catch (error) {
                console.error('Error loading YAML file:', error);
            }
        };

        onMounted(() => {
            loadConstants();
            if (props.messageId) {
                loadMessage();
            }
        });

        return {
            activeTab,
            goFormat,
            showComments,
            dataName,
            messageGroupName,
            messageName,
            computedGoConstantsIndividual,
            computedGoConstantsGrouped,
            computedCppConstants,
            computedTsConstants,
            computedToitConstants,
            computedCsConstants,
            setActiveTab: (tab: string) => activeTab.value = tab,
            setGoFormat: (format: string) => goFormat.value = format,
        };
    },
});
</script>

<style scoped>
</style>
