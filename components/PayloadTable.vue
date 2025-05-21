<template>
  <div>
    <h3 v-if="headerText" :style="{ marginTop: headerMarginTop }">{{ headerText }}</h3>
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
                {{ field.description }}
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
import { defineComponent, ref, onMounted, PropType } from 'vue';
import jsyaml from 'js-yaml';

export default defineComponent({
  name: 'PayloadTable',
  props: {
    messageId: {
      type: Number,
      required: true
    },
    headerText: {
      type: String,
      default: 'Payload'
    },
    headerMarginTop: {
      type: String,
      default: '0px'
    }
  },
  setup(props) {
    const payloadFields = ref<any[]>([]);

    const loadProtocolData = async () => {
      try {
        const response = await fetch('/files/protocol-v3.yaml');
        const yamlData = await response.text();
        const protocolData = jsyaml.load(yamlData);
        payloadFields.value = protocolData.messages[props.messageId]?.data || [];
      } catch (error) {
        console.error('Error loading YAML file:', error);
      }
    };

    onMounted(loadProtocolData);

    return {
      payloadFields,
      headerText: props.headerText,
      headerMarginTop: props.headerMarginTop
    };
  }
});
</script>
