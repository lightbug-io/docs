<template>
    <div class="protocol-constants-container">
        <!-- Language tabs and controls -->
        <div class="constants-header">
            <div class="language-tabs">
                <button
                    v-for="lang in languages"
                    :key="lang.value"
                    :class="['language-tab', { active: activeTab === lang.value }]"
                    @click="activeTab = lang.value"
                >
                    {{ lang.label }}
                </button>
            </div>
            <div class="constants-controls">
                <v-icon
                    v-if="activeTab === 'go'"
                    @click="toggleGoFormat"
                    class="control-icon"
                    :title="goFormat === 'individual' ? 'Switch to Grouped' : 'Switch to Individual'"
                >
                    {{ goFormat === 'individual' ? 'mdi-group' : 'mdi-format-list-bulleted' }}
                </v-icon>
                <v-icon @click="toggleOptionsModal" class="control-icon" title="Options">mdi-cog</v-icon>
                <v-icon @click="copyToClipboard" class="control-icon" title="Copy to Clipboard">mdi-content-copy</v-icon>
            </div>
        </div>

        <!-- Code display -->
        <div class="code-display">
            <ClientOnly>
                <VCodeBlock
                    :code="currentCode"
                    highlightjs
                    :lang="currentLang"
                    theme="default"
                />
            </ClientOnly>
        </div>

        <!-- Options Modal -->
        <v-dialog v-model="isOptionsModalVisible" max-width="400px">
            <v-card>
                <v-card-title>Options</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-if="activeTab === 'cpp' || activeTab === 'cs'"
                        v-model="messageGroupName"
                        label="Message Group Name"
                        density="compact"
                        variant="underlined"
                        @input="messageGroupName = ($event.target as HTMLInputElement).value.toUpperCase()"
                    />
                    <v-text-field
                        v-if="messageId"
                        v-model="messageName"
                        :label="messageNameLabel"
                        density="compact"
                        variant="underlined"
                        @input="messageName = ($event.target as HTMLInputElement).value.toUpperCase()"
                    />
                    <v-text-field
                        v-model="dataName"
                        label="Data Name"
                        density="compact"
                        variant="underlined"
                        @input="dataName = ($event.target as HTMLInputElement).value.toUpperCase()"
                    />
                    <v-checkbox
                        v-model="showComments"
                        label="Show Comments"
                        density="compact"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="isOptionsModalVisible = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';

interface Language {
    value: string;
    label: string;
    lang: string;
}

export default defineComponent({
    name: 'MessageCodeGen',
    props: {
        messageId: {
            type: Number,
            required: false
        },
        yamlData: {
            type: Object,
            required: true
        },
        messageNameLabel: {
            type: String,
            default: 'Message Name'
        },
        dataPath: {
            type: String,
            required: false
        },
        prefix: {
            type: String,
            default: ''
        },
        dataName: {
            type: String,
            required: false
        },
        headerIds: {
            type: Array,
            required: false
        }
    },
    setup(props) {
        // Load saved preferences from localStorage
        const savedLanguage = typeof window !== 'undefined'
            ? localStorage.getItem('protocolConstants_language')
            : null;
        const savedGoFormat = typeof window !== 'undefined'
            ? localStorage.getItem('protocolConstants_goFormat')
            : null;
        const savedShowComments = typeof window !== 'undefined'
            ? localStorage.getItem('protocolConstants_showComments')
            : null;

        const activeTab = ref(savedLanguage || 'go');
        const goFormat = ref(savedGoFormat || 'individual');
        const showComments = ref(savedShowComments !== null ? savedShowComments === 'true' : true);
        const isOptionsModalVisible = ref(false);
        const constants = ref<any>({});
        const message = ref<any>({});
        const dataName = ref(props.dataName || '');
        const messageName = ref('');
        const messageGroupName = ref('');

        const languages: Language[] = [
            { value: 'go', label: 'Go', lang: 'go' },
            { value: 'toit', label: 'Toit', lang: 'toit' },
            { value: 'ts', label: 'TypeScript', lang: 'typescript' },
            { value: 'cpp', label: 'C++', lang: 'cpp' },
            { value: 'cs', label: 'C#', lang: 'csharp' }
        ];

        // Watch for changes and save to localStorage
        watch(activeTab, (newValue) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('protocolConstants_language', newValue);
            }
        });

        watch(goFormat, (newValue) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('protocolConstants_goFormat', newValue);
            }
        });

        watch(showComments, (newValue) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('protocolConstants_showComments', String(newValue));
            }
        });

        const currentLang = computed(() => {
            const lang = languages.find(l => l.value === activeTab.value);
            return lang ? lang.lang : 'text';
        });

        const formatDescription = (description: string) => {
            if (!description) return '';
            const lines = description.split('\n').filter(line => line.trim());
            return lines.map(line => `// ${line.trim()}`).join('\n');
        };

        const formatConstantName = (base: string, name: string) => {
            return `${base}_${name}`.replace(/^_+/, '');
        };

        const computedGoConstantsIndividual = computed(() => {
            let goConstants = '';
            if (props.messageId) {
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    goConstants += `${formatDescription(messageDescription)}\n`;
                }
                goConstants += `const ${messageName.value} = ${props.messageId}\n`;
                if (showComments.value && messageDescription) {
                    goConstants += '\n';
                }
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    goConstants += `${formatDescription(description)}\n`;
                }
                goConstants += `const ${formatConstantName(dataName.value, name)} = ${key}\n`;
                if (showComments.value && description) {
                    goConstants += '\n';
                }
            }
            return goConstants;
        });

        const computedGoConstantsGrouped = computed(() => {
            let goConstants = 'const (\n';
            if (props.messageId) {
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    const formattedDesc = formatDescription(messageDescription).replace(/\/\/ /g, '    // ');
                    goConstants += `${formattedDesc}\n`;
                }
                goConstants += `    ${messageName.value} = ${props.messageId}\n`;
                if (showComments.value && messageDescription) {
                    goConstants += '\n';
                }
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
                    goConstants += '\n';
                }
            }
            goConstants += ')';
            return goConstants;
        });

        const computedCppConstants = computed(() => {
            let cppConstants = '';

            if (props.messageId) {
                cppConstants += `enum ${messageGroupName.value} : uint8_t {\n`;
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    const formattedDesc = formatDescription(messageDescription).replace(/\/\/ /g, '    // ');
                    cppConstants += `${formattedDesc}\n`;
                }
                cppConstants += `    ${messageName.value} = ${props.messageId},\n`;
                cppConstants += '};';
            }

            // Only generate the data enum if there are constants
            if (Object.keys(constants.value).length > 0) {
                if (cppConstants) cppConstants += '\n\n';
                cppConstants += `enum ${dataName.value} : uint8_t {\n`;
                const headerKeys = Object.keys(constants.value);
                headerKeys.forEach((key, index) => {
                    const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                    const description = constants.value[key].description || '';
                    if (showComments.value && description) {
                        const formattedDesc = formatDescription(description).replace(/\/\/ /g, '    // ');
                        cppConstants += `${formattedDesc}\n`;
                    }
                    cppConstants += `    ${formatConstantName(dataName.value, name)} = ${key},\n`;
                    if (showComments.value && description && index < headerKeys.length - 1) {
                        cppConstants += '\n';
                    }
                });
                cppConstants += '};';
            }

            return cppConstants;
        });

        const computedTsConstants = computed(() => {
            let tsConstants = '';
            if (props.messageId) {
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    tsConstants += `${formatDescription(messageDescription)}\n`;
                }
                tsConstants += `export const ${messageName.value} = ${props.messageId};\n`;
                if (showComments.value && messageDescription) {
                    tsConstants += '\n';
                }
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    tsConstants += `${formatDescription(description)}\n`;
                }
                tsConstants += `export const ${formatConstantName(dataName.value, name)} = ${key};\n`;
                if (showComments.value && description) {
                    tsConstants += '\n';
                }
            }
            return tsConstants;
        });

        const computedToitConstants = computed(() => {
            let toitConstants = '';
            if (props.messageId) {
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    toitConstants += `${formatDescription(messageDescription)}\n`;
                }
                toitConstants += `${messageName.value} /int ::= ${props.messageId}\n`;
                if (showComments.value && messageDescription) {
                    toitConstants += '\n';
                }
            }
            for (const key in constants.value) {
                const name = constants.value[key].name.toUpperCase().replace(/ /g, '_');
                const description = constants.value[key].description || '';
                if (showComments.value && description) {
                    toitConstants += `${formatDescription(description)}\n`;
                }
                toitConstants += `${formatConstantName(dataName.value, name)} /int ::= ${key}\n`;
                if (showComments.value && description) {
                    toitConstants += '\n';
                }
            }
            return toitConstants;
        });

        const computedCsConstants = computed(() => {
            let csConstants = '';
            if (props.messageId && message.value.name) {
                csConstants += `public static class ${messageGroupName.value} {\n`;
                const messageDescription = message.value.description || '';
                if (showComments.value && messageDescription) {
                    const formattedDesc = formatDescription(messageDescription).replace(/\/\/ /g, '    // ');
                    csConstants += `${formattedDesc}\n`;
                }
                csConstants += `    public const int ${message.value.name.toUpperCase().replace(/ /g, '_')} = ${props.messageId};\n`;
                csConstants += '}';
            }

            // Only generate the data class if there are constants
            if (Object.keys(constants.value).length > 0) {
                if (csConstants) csConstants += '\n\n';
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
                        csConstants += '\n';
                    }
                }
                csConstants += '}';
            }

            return csConstants;
        });

        const currentCode = computed(() => {
            switch (activeTab.value) {
                case 'go':
                    return goFormat.value === 'individual'
                        ? computedGoConstantsIndividual.value
                        : computedGoConstantsGrouped.value;
                case 'cpp':
                    return computedCppConstants.value;
                case 'ts':
                    return computedTsConstants.value;
                case 'toit':
                    return computedToitConstants.value;
                case 'cs':
                    return computedCsConstants.value;
                default:
                    return '';
            }
        });

        const toggleGoFormat = () => {
            goFormat.value = goFormat.value === 'individual' ? 'grouped' : 'individual';
        };

        const toggleOptionsModal = () => {
            isOptionsModalVisible.value = !isOptionsModalVisible.value;
        };

        const copyToClipboard = () => {
            navigator.clipboard.writeText(currentCode.value).then(() => {
                console.log('Copied to clipboard');
            });
        };

        const loadConstants = () => {
            try {
                const dataPath = props.dataPath || `messages.${props.messageId}.data`;
                let parsedData = props.yamlData;
                dataPath.split('.').forEach((key) => {
                    parsedData = parsedData[key];
                });
                if (props.headerIds && props.headerIds.length > 0) {
                    const filteredData: Record<string, any> = {};
                    props.headerIds.forEach((id: any) => {
                        if (parsedData[id] !== undefined) {
                            filteredData[id] = parsedData[id];
                        }
                    });
                    parsedData = filteredData;
                }
                const prefixedConstants: Record<string, any> = {};
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
                const messagePath = `messages.${props.messageId}`;
                let parsedData = props.yamlData;
                messagePath.split('.').forEach((key) => {
                    parsedData = parsedData[key];
                });
                message.value = parsedData;
                messageName.value = `MT_${message.value.name.toUpperCase().replace(/ /g, '_')}`;
                messageGroupName.value = 'MT';
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
            isOptionsModalVisible,
            dataName,
            messageName,
            messageGroupName,
            languages,
            currentLang,
            currentCode,
            toggleGoFormat,
            toggleOptionsModal,
            copyToClipboard
        };
    }
});
</script>

<style scoped>
.protocol-constants-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    margin: 20px 0;
}

.dark .protocol-constants-container {
    border-color: #444;
}

.constants-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 16px;
    background-color: #fafafa;
    border-bottom: 1px solid #e0e0e0;
}

.dark .constants-header {
    background-color: #1e1e1e;
    border-bottom-color: #444;
}

.language-tabs {
    display: flex;
    gap: 4px;
}

.language-tab {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    color: #666;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.language-tab:hover {
    border-color: #fc7c3d;
    color: #fc7c3d;
}

.language-tab.active {
    background-color: #fc7c3d;
    border-color: #fc7c3d;
    color: white;
}

.dark .language-tab {
    background-color: #2d2d2d;
    border-color: #555;
    color: #aaa;
}

.dark .language-tab:hover {
    border-color: #fc7c3d;
    color: #fc7c3d;
}

.dark .language-tab.active {
    background-color: #fc7c3d;
    border-color: #fc7c3d;
    color: white;
}

.constants-controls {
    display: flex;
    gap: 8px;
}

.control-icon {
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
}

.control-icon:hover {
    color: #fc7c3d;
}

.dark .control-icon {
    color: #aaa;
}

.dark .control-icon:hover {
    color: #fc7c3d;
}

.code-display {
    padding: 0;
}

.code-display :deep(pre) {
    margin: 0 !important;
    border-radius: 0 !important;
}
</style>
