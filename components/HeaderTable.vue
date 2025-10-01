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
        <tr v-for="(field, index) in fields" :key="index">
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

export default defineComponent({
  name: 'HeaderTable',
  props: {
    headerIds: {
      type: Array as PropType<number[]>,
      default: () => []
    },
    yamlData: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    headerText: {
      type: String,
      default: ''
    },
    headerMarginTop: {
      type: String,
      default: '0px'
    }
  },
  setup(props) {
    const fields = ref<any>({});

    onMounted(() => {
      fields.value = {};
      (props.headerIds as number[]).forEach((headerId: number) => {
        fields.value[headerId] = props.yamlData.header?.[headerId] || [];
      });
    });

    return {
      fields
    };
  }
});
</script>
