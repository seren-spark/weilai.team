<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/vue";
import { ref, watch } from "vue";

type filterItem = {
  title: string;
  label: string;
  drapdownItems: {
    condition: string;
    isSeleted: boolean | false;
  }[];
};

const selectedItems = ref<string[]>([]);

const props = defineProps<{
  filterMoreSeletedItem: filterItem;
}>();
watch(
  props.filterMoreSeletedItem,
  () => {
    // 监听 filterMoreSeletedItem 的变化，更新 selectedItems
    selectedItems.value = props.filterMoreSeletedItem.drapdownItems
      .filter((item) => item.isSeleted)
      .map((item) => item.condition);
  },
  {
    deep: true,
  },
);
const handleCheckboxChange = (item: {
  condition: string;
  isSeleted: boolean;
}) => {
  if (selectedItems.value.length >= 3 && item.isSeleted) {
    // 如果已经选择了三个项，并且当前项被选中，则取消选中
    item.isSeleted = false;
    console.log("最多只能选择3个");
  } else {
    // 更新 selectedItems
    if (item.isSeleted) {
      selectedItems.value.push(item.condition);
    } else {
      selectedItems.value = selectedItems.value.filter(
        (s) => s !== item.condition,
      );
    }
  }
};
</script>
<template>
  <div class="checkbox-group long-dashed-border">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="drapdown-btn">
          <Icon icon="formkit:add" />
          {{ filterMoreSeletedItem.title }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56 bg-white">
        <DropdownMenuLabel>{{ filterMoreSeletedItem.label }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          v-for="(drapdownItem, index) in filterMoreSeletedItem.drapdownItems"
          :key="index"
          v-model:checked="drapdownItem.isSeleted"
          class="bg-white"
          @click="handleCheckboxChange(drapdownItem)"
        >
          {{ drapdownItem.condition }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div
      v-for="(selectedItem, index) in selectedItems"
      :key="index"
      class="inline-flex"
    >
      <span class="selected-items">{{ selectedItem }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "@/assets/styles";
@use "@/assets/styles/recruitment.scss";
.drapdown-btn {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border: 0;
  font-size: 0.8em;
}

.checkbox-group {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 5px;
  .selected-items {
    font-size: 0.4em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    padding: 5px;
    border-radius: 4px;
    background-color: #f0f0f0;
  }
}
</style>
