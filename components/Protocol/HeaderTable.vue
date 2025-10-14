<template>
  <div v-if="hasHeaderFields">
    <h3 v-if="showHeader && headerText" :style="{ marginTop: headerMarginTop }">{{ headerText }}</h3>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fieldId in headerFieldIds" :key="fieldId">
          <tr v-if="headerFieldData[fieldId]">
            <td>{{ fieldId }}</td>
            <td>{{ headerFieldData[fieldId].name }}</td>
            <td>
              <template v-if="headerFieldData[fieldId].description">
                <span v-html="headerFieldData[fieldId].description.replace(/\n/g, '<br>')"></span>
              </template>
              <template v-if="headerFieldData[fieldId].values">
                <template v-if="headerFieldData[fieldId].description">
                  <br />
                </template>
                <span style="font-size: 0.95em; color: #555;">
                  <strong>Possible values:</strong>
                  <ul style="margin: 0 0 0 1.2em; padding: 0; list-style-type: disc;">
                    <li v-for="([key, val]) in Object.entries(headerFieldData[fieldId].values)" :key="key">
                      <span style="font-family: monospace;">{{ key }}</span>: <strong>{{ (val as any).name }}</strong>
                      <span v-if="(val as any).description">— {{ (val as any).description }}</span>
                    </li>
                  </ul>
                </span>
              </template>
            </td>
            <td>{{ headerFieldData[fieldId].type }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'HeaderTable',
  props: {
    messageId: {
      type: Number,
      required: true
    },
    yamlData: {
      type: Object,
      required: true
    },
    headerText: {
      type: String,
      default: 'Header Fields'
    },
    headerMarginTop: {
      type: String,
      default: '0px'
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const headerFieldIds = computed(() => {
      if (!props.yamlData || !props.yamlData.messages) {
        return [];
      }
      return props.yamlData.messages[props.messageId]?.header || [];
    });

    const headerFieldData = computed(() => {
      if (!props.yamlData || !props.yamlData.header) {
        return {};
      }
      return props.yamlData.header;
    });

    const hasHeaderFields = computed(() => {
      return headerFieldIds.value && headerFieldIds.value.length > 0;
    });

    return {
      headerFieldIds,
      headerFieldData,
      hasHeaderFields,
      headerText: props.headerText,
      headerMarginTop: props.headerMarginTop
    };
  }
});
</script>
