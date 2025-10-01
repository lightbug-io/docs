<template>
  <div>
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
        <template v-for="(field, index) in payloadFields" :key="index">
          <tr>
            <td>{{ index }}</td>
            <td>{{ field.name }}</td>
            <td>
              <template v-if="field.description">
                <span v-html="field.description.replace(/\n/g, '<br>')"></span>
              </template>
              <template v-if="field.values">
                <template v-if="field.description">
                  <br />
                </template>
                <span style="font-size: 0.95em; color: #555;">
                  <strong>Possible values:</strong>
                  <ul style="margin: 0 0 0 1.2em; padding: 0; list-style-type: disc;">
                    <li v-for="([key, val]) in Object.entries(field.values)" :key="key">
                      <span style="font-family: monospace;">{{ key }}</span>: <strong>{{ (val as any).name }}</strong>
                      <span v-if="(val as any).description">— {{ (val as any).description }}</span>
                    </li>
                  </ul>
                </span>
              </template>
            </td>
            <td>{{ field.type }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PayloadTable',
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
      default: 'Payload'
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
    const payloadFields = computed(() => {
      if (!props.yamlData || !props.yamlData.messages) {
        return [];
      }
      return props.yamlData.messages[props.messageId]?.data || [];
    });

    return {
      payloadFields,
      headerText: props.headerText,
      headerMarginTop: props.headerMarginTop
    };
  }
});
</script>
