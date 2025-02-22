<script setup lang="ts">
import { HotTable } from "@handsontable/vue3";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, ref } from "vue";
import "handsontable/dist/handsontable.full.css";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";
import type Handsontable from "handsontable";

const props = defineProps<NodeViewProps>();
registerAllModules();

interface TableInterface {
  hotInstance: Handsontable.Core | null;
}

const tableRef = ref<TableInterface | null>(null);

const hotSettings = {
  startRows: 5,
  startCols: 5,
  width: "100%",
  height: "auto",
  autoWrapRow: true,
  autoWrapCol: true,
  formulas: {
    engine: HyperFormula,
  },
  colHeaders: true,
  rowHeaders: true,
  licenseKey: "non-commercial-and-evaluation",
};

console.log(hotSettings);

onMounted(() => {
  let tableInstance = tableRef.value?.hotInstance as Handsontable.Core;

  if (tableInstance) {
    tableInstance.addHook("afterChange", () => {
      console.log(tableInstance.getCellMeta(1, 1));
      console.log(props.editor?.getJSON());
    });
  }
});

onBeforeUnmount(() => {
  let tableInstance = tableRef.value?.hotInstance as Handsontable.Core;
  if (tableInstance) {
    tableInstance.destroy();
    tableRef.value = null;
  }
});
</script>

<template>
  <NodeViewWrapper class="app-table">
    <HotTable
      ref="tableRef"
      :data="props.node.attrs.tableData"
      :settings="hotSettings"
    ></HotTable>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped></style>
/** * Initializes the Handsontable instance with the specified settings and adds
a hook to log cell metadata changes. * The Handsontable instance is destroyed
and the reference is set to null when the component is unmounted. */
