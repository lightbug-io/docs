<template>
  <div>
    <h3 :style="{ marginTop: headerMarginTop }">{{ headerText }}</h3>
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
        <tr v-for="(field, index) in payloadFields" :key="index">
          <td>{{ index }}</td>
          <td>{{ field.name }}</td>
          <td>{{ field.description }}</td>
          <td>{{ field.type }}</td>
        </tr>
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
      payloadFields
    };
  }
});
</script>
