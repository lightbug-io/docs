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

export default defineComponent({
    name: 'GenerateConsts',
    props: {
        // ID of the message
        messageId: {
            type: Number,
            required: false
        },
        // Pre-loaded YAML data
        yamlData: {
            type: Object,
            required: true
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

        const formatDescription = (description: string) => {
            if (!description) return '';
            const lines = description.split('\n').filter(line => line.trim());
            return lines.map(line => `// ${line.trim()}`).join('\n');
        };

        const getMaxLengthPlusOne = (lines: string[]) => {
            return Math.max(...lines.map(line => line.length)) + 1;
        };

        const formatConstantName = (base: string, name: string) => {
            return `${base}_${name}`.replace(/^_+/, '');
        };

        const computedGoConstantsIndividual = computed(() => {
            let goConstants = '';
            if (props.messageId) {
                goConstants += `const ${messageName.value} = ${props.messageId}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    goConstants += `${formatDescription(description)}\n`;
                }
                goConstants += `const ${formatConstantName(dataName.value, name)} = ${key}\n`;
                if (showComments.value && description) {
                    goConstants += '\n'; // Add extra line after block comment
                }
            }
            return goConstants;
        });

        const computedGoConstantsGrouped = computed(() => {
            let goConstants = 'const (\n';
            if (props.messageId) {
                goConstants += `    ${messageName.value} = ${props.messageId}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    const formattedDesc = formatDescription(description).replace(/\/\/ /g, '    // ');
                    goConstants += `${formattedDesc}\n`;
                }
                goConstants += `    ${formatConstantName(dataName.value, name)} = ${key}\n`;
                if (showComments.value && description) {
                    goConstants += '\n'; // Add extra line after block comment
                }
            }
            goConstants += ')';
            return goConstants;
        });

        const computedCppConstants = computed(() => {
            let cppConstants = ``

            // Generate a group for the message type
            if (props.messageId) {
                cppConstants += `enum ${messageGroupName.value} : uint8_t {\n`;
                let line = `    ${messageName.value} = ${props.messageId},`;
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    const formattedDesc = formatDescription(messageDescription).replace(/\/\/ /g, '    // ');
                    cppConstants += `${formattedDesc}\n`;
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
                if (showComments.value && description) {
                    const formattedDesc = formatDescription(description).replace(/\/\/ /g, '    // ');
                    cppConstants += `${formattedDesc}\n`;
                }
                let line = `    ${formatConstantName(dataName.value, name)} = ${key},`;
                cppConstants += `${line}\n`;
                if (showComments.value && description && index < headerKeys.length - 1) {
                    cppConstants += '\n'; // Add extra line after block comment (except for last item)
                }
            });
            cppConstants += '};';

            return cppConstants;
        });

        const computedTsConstants = computed(() => {
            let tsConstants = '';
            if (props.messageId) {
                tsConstants += `export const ${messageName.value} = ${props.messageId};\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    tsConstants += `${formatDescription(description)}\n`;
                }
                tsConstants += `export const ${formatConstantName(dataName.value, name)} = ${key};\n`;
                if (showComments.value && description) {
                    tsConstants += '\n'; // Add extra line after block comment
                }
            }
            return tsConstants;
        });

        const computedToitConstants = computed(() => {
            let toitConstants = '';
            if (props.messageId){
                toitConstants += `${messageName.value} /int ::= ${props.messageId}\n`;
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    toitConstants += `${formatDescription(description)}\n`;
                }
                toitConstants += `${formatConstantName(dataName.value, name)} /int ::= ${key}\n`;
                if (showComments.value && description) {
                    toitConstants += '\n'; // Add extra line after block comment
                }
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
                if (showComments.value && description) {
                    const formattedDesc = formatDescription(description).replace(/\/\/ /g, '    // ');
                    csConstants += `${formattedDesc}\n`;
                }
                csConstants += `    public const int ${name} = ${key};\n`;
                if (showComments.value && description) {
                    csConstants += '\n'; // Add extra line after block comment
                }
            }
            csConstants += '}';
            return csConstants;
        });

        const loadConstants = () => {
            try {
                // Get the data from the path within the parsed data
                const dataPath = props.dataPath || `messages.${props.messageId}.data`;
                let parsedData = props.yamlData;
                dataPath.split('.').forEach((key) => {
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
                console.error('Error loading constants from YAML data:', error);
            }
        };

        const loadMessage = () => {
            if (!props.messageId) return;
            try {
                // Get the message from the path within the parsed data
                const messagePath = `messages.${props.messageId}`;
                let parsedData = props.yamlData;
                messagePath.split('.').forEach((key) => {
                    parsedData = parsedData[key]
                })
                message.value = parsedData;
                messageName.value = `MT_${message.value.name.toUpperCase().replace(/ /g, '_')}`;
                messageGroupName.value = `MT`
                if (!props.dataName) {
                    dataName.value = `MD_${message.value.name.toUpperCase().replace(/ /g, '_')}`;
                }
            } catch (error) {
                console.error('Error loading message from YAML data:', error);
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
