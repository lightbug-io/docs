<template>
    <div class="field-input-container">
        <!-- Enum/Values selection -->
        <div v-if="hasValues" class="input-group">
            <v-select
                :model-value="modelValue"
                @update:model-value="$emit('update:modelValue', $event)"
                :items="valueOptions"
                :label="getInputLabel()"
                item-title="label"
                item-value="value"
                density="compact"
                variant="outlined"
            />
        </div>

        <!-- Type-specific inputs -->
        <div v-else class="input-group">
            <!-- Boolean -->
            <div v-if="fieldType === 'bool'" class="boolean-input">
                <label class="input-label">{{ getInputLabel() }}</label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input
                            type="radio"
                            :value="false"
                            :checked="modelValue === false"
                            @change="handleBooleanInput(false)"
                        />
                        <span class="radio-label">False</span>
                    </label>
                    <label class="radio-option">
                        <input
                            type="radio"
                            :value="true"
                            :checked="modelValue === true"
                            @change="handleBooleanInput(true)"
                        />
                        <span class="radio-label">True</span>
                    </label>
                </div>
                <div class="input-hint">{{ getTypeHint() }}</div>
            </div>

            <!-- Numeric types -->
            <v-text-field
                v-else-if="isNumericType"
                :model-value="modelValue"
                @update:model-value="handleNumericInput"
                :label="getInputLabel()"
                type="number"
                density="compact"
                variant="outlined"
                :hint="getTypeHint()"
                :placeholder="getPlaceholder()"
                persistent-hint
            />

            <!-- Float32 -->
            <v-text-field
                v-else-if="fieldType === 'float32'"
                :model-value="modelValue"
                @update:model-value="handleFloatInput"
                :label="getInputLabel()"
                type="number"
                step="0.01"
                density="compact"
                variant="outlined"
                hint="Floating point number"
                :placeholder="getPlaceholder()"
                persistent-hint
            />

            <!-- ASCII/String -->
            <v-text-field
                v-else-if="fieldType === 'ascii' || fieldType === 'string'"
                :model-value="modelValue"
                @update:model-value="$emit('update:modelValue', $event)"
                :label="getInputLabel()"
                density="compact"
                variant="outlined"
                hint="ASCII text string"
                :placeholder="getPlaceholder()"
                persistent-hint
            />

            <!-- Bytes/Array types -->
            <div v-else-if="fieldType === 'bytes' || isArrayType">
                <v-text-field
                    :model-value="bytesDisplayValue"
                    @update:model-value="handleBytesInput"
                    :label="getInputLabel()"
                    density="compact"
                    variant="outlined"
                    :hint="getTypeHint()"
                    :placeholder="getPlaceholder()"
                    persistent-hint
                />
            </div>

            <!-- Default/Unknown types -->
            <v-text-field
                v-else
                :model-value="modelValue"
                @update:model-value="$emit('update:modelValue', $event)"
                :label="getInputLabel()"
                density="compact"
                variant="outlined"
                :hint="getTypeHint()"
                :placeholder="getPlaceholder()"
                persistent-hint
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

export default defineComponent({
    name: 'FieldInput',
    props: {
        field: {
            type: Object as PropType<any>,
            required: true
        },
        fieldId: {
            type: Number,
            required: true
        },
        modelValue: {
            type: [String, Number, Boolean, Array] as PropType<string | number | boolean | number[]>,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const fieldType = computed(() => {
            return props.field?.type?.toLowerCase() || 'uint8';
        });

        const hasValues = computed(() => {
            return props.field?.values && Object.keys(props.field.values).length > 0;
        });

        const valueOptions = computed(() => {
            if (!hasValues.value) return [];

            return Object.entries(props.field.values).map(([value, info]: [string, any]) => ({
                value: parseInt(value),
                name: info?.name || `Value ${value}`,
                description: info?.description || '',
                label: info?.name ? `${info.name} (${value})` : value
            }));
        });

        const isNumericType = computed(() => {
            const numericTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'int', 'int32', 'uint'];
            return numericTypes.includes(fieldType.value);
        });

        const isArrayType = computed(() => {
            return fieldType.value.includes('[]');
        });

        const bytesDisplayValue = computed(() => {
            if (Array.isArray(props.modelValue)) {
                return props.modelValue.join(' ');
            }
            return props.modelValue?.toString() || '';
        });

        const getInputLabel = () => {
            const name = props.field?.name || `Field ${props.fieldId}`;
            const type = props.field?.type || 'uint8';
            return `${name} (${type})`;
        };

        const getTypeHint = () => {
            const type = fieldType.value;
            if (isArrayType.value) {
                return `Array of ${type.replace('[]', '')} values`;
            }
            switch (type) {
                case 'uint8':
                    return '0-255';
                case 'uint16':
                    return '0-65535';
                case 'uint32':
                    return '0-4294967295';
                case 'uint64':
                    return '0-18446744073709551615';
                case 'int32':
                    return '-2147483648 to 2147483647';
                case 'uint':
                case 'int':
                    return 'Variable length integer';
                case 'bool':
                    return 'Boolean value (true/false)';
                default:
                    return type;
            }
        };

        const getPlaceholder = () => {
            const type = fieldType.value;
            if (isArrayType.value) {
                return 'e.g., 1 2 3 or 0x01,0x02,0x03';
            }
            switch (type) {
                case 'uint8':
                    return 'e.g., 200';
                case 'uint16':
                    return 'e.g., 4567';
                case 'uint32':
                    return 'e.g., 123456';
                case 'uint64':
                    return 'e.g., 9876543210';
                case 'int32':
                    return 'e.g., -12345';
                case 'float32':
                    return 'e.g., 3.14159';
                case 'ascii':
                case 'string':
                    return 'e.g., Hello';
                case 'bytes':
                    return 'e.g., 55 78 12 4';
                case 'uint':
                case 'int':
                    return 'e.g., 1234';
                case 'bool':
                    return 'Select true or false';
                default:
                    return '';
            }
        };

        const handleBooleanInput = (value: any) => {
            // Convert the emitted value to boolean
            const boolValue = Boolean(value);
            emit('update:modelValue', boolValue);
        };

        const handleNumericInput = (value: string) => {
            const parsed = value === '' ? '' : parseInt(value);
            emit('update:modelValue', parsed);
        };

        const handleFloatInput = (value: string) => {
            const parsed = value === '' ? '' : parseFloat(value);
            emit('update:modelValue', parsed);
        };

        const handleBytesInput = (value: string) => {
            if (!value || value.trim() === '') {
                emit('update:modelValue', []);
                return;
            }

            // Parse different byte formats
            const bytes: number[] = [];
            const parts = value.split(/[\s,]+/).filter(p => p.trim());

            for (const part of parts) {
                let byte: number;
                if (part.startsWith('0x') || part.startsWith('0X')) {
                    byte = parseInt(part, 16);
                } else {
                    byte = parseInt(part, 10);
                }

                if (!isNaN(byte) && byte >= 0 && byte <= 255) {
                    bytes.push(byte);
                }
            }

            emit('update:modelValue', bytes);
        };

        return {
            fieldType,
            hasValues,
            valueOptions,
            isNumericType,
            isArrayType,
            bytesDisplayValue,
            getInputLabel,
            getTypeHint,
            getPlaceholder,
            handleBooleanInput,
            handleNumericInput,
            handleFloatInput,
            handleBytesInput
        };
    }
});
</script>

<style scoped>
.field-input-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.field-info {
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-size: 13px;
}

.dark .field-info {
    background-color: #2a2a2a;
}

.field-description {
    margin: 0 0 4px 0;
    color: #666;
    white-space: pre-wrap;
}

.dark .field-description {
    color: #aaa;
}

.field-unit {
    margin: 0;
    font-size: 12px;
    color: #999;
}

.dark .field-unit {
    color: #777;
}

.input-group {
    display: flex;
    flex-direction: column;
}

.boolean-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.dark .input-label {
    color: #ddd;
}

.radio-group {
    display: flex;
    gap: 16px;
    align-items: center;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    margin: 0;
}

.radio-label {
    font-size: 14px;
    color: #333;
}

.dark .radio-label {
    color: #ddd;
}

.input-hint {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.dark .input-hint {
    color: #aaa;
}

.value-name {
    font-weight: 600;
}

.value-id {
    font-size: 12px;
    color: #999;
    margin-left: 4px;
}

.dark .value-id {
    color: #777;
}
</style>
