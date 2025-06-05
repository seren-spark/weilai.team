<template>
  <Table class="adaptive">
    <TableCaption></TableCaption>
    <TableHeader>
      <TableRow>
        <template v-if="isShowCheckbox">
          <TableCell class="font-medium text-center">
            <Checkbox
              class="checkbox"
              :checked="isAllSelected"
              :checked-not-all="isNotAllSelected"
              @click="handleSelectAll"
            />
          </TableCell>
        </template>
        <TableCell
          v-for="column in columns"
          :key="column.key"
          class="font-medium text-center"
        >
          {{ column.title }}
        </TableCell>
      </TableRow>
    </TableHeader>

    <TableBody>
      <!-- 空数据提示 -->
      <TableRow v-show="rows.length === 0">

        <TableCell class="text-center" colspan="100%" style="height: 2rem;">
          <NoData />
        </TableCell>
      </TableRow>

      <TableRow v-for="row in rows" :key="row.id" class="hover-tr">
        <template v-if="isShowCheckbox">
          <TableCell class="font-medium text-center">
            <Checkbox
              class="checkbox"
              :checked="selectedIds.includes(row.id)"
              @click="handleSelect(row.id)"
            />
          </TableCell>
        </template>
        <TableCell
          v-for="column in columns"
          :key="column.key"
          class="font-medium text-center"
        >
          {{ (row as any)[column.key] }}
        </TableCell>
        <!-- 操作插槽 -->
        <slot name="action" :current-row="row"></slot>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { defineProps, ref, computed, watch } from "vue";
import NoData from "@/components/loading/NoData.vue";

// 定义通用的列和行接口
interface TableColumn {
  key: string;
  title: string;
}

interface TableRowData {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const props = defineProps<{
  columns: TableColumn[]; // 表头
  rows: TableRowData[]; // 表格数据
  isShowCheckbox: boolean; // 是否使用复选框
}>();

const selectedIds = ref<string[]>([]);
const handleSelect = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== id);
  } else {
    selectedIds.value.push(id);
  }
};
const handleSelectAll = () => {
  if (selectedIds.value.length === props.rows.length) {
    selectedIds.value = [];
  } else {
    selectedIds.value = props.rows.map((item) => item.id);
  }
};
const isAllSelected = computed(
  () => selectedIds.value.length === props.rows.length
);
const isNotAllSelected = computed(
  () =>
    selectedIds.value.length !== props.rows.length &&
    selectedIds.value.length !== 0
);
watch(
  () => props.rows,
  () => {
    selectedIds.value = [];
  }
);
const emit = defineEmits(["sendSelectedIds"]);
watch(
  selectedIds,
  (newValue) => {
    emit("sendSelectedIds", newValue);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.adaptive {
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px #ccc;
  overflow: hidden;
  white-space: nowrap;
}
.hover-tr {
  max-height: 40px;
  &:hover {
    background-color: var(--accent);
    cursor: pointer;
  }
}

</style>
