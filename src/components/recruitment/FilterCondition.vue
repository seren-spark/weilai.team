<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { defineEmits } from "vue";

import { Icon } from "@iconify/vue";

type ItemObj = {
  title: string;
  label: string;
  ref: string;
  arr: Array<{
    condition: string;
  }>;
};
const emit = defineEmits(["filter_condition"]);
const props = defineProps<{
  itemsObjArr: ItemObj[];
}>();

const filter_condition = (e: Event) => {
  if (e) {
    emit(
      "filter_condition",
      (e.target as HTMLInputElement).getAttribute("value"),
      (e.target as HTMLInputElement).getAttribute("title"),
    );
  }
  return;
};
</script>
<template>
  <div class="filter-condition">
    <DropdownMenu v-for="i in props.itemsObjArr" :key="i.title">
      <DropdownMenuTrigger>
        <div class="filter-title long-dashed-border">
          {{ i.title }}
          <Icon icon="pepicons-pencil:triangle-down" class="ml-2" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="filter-content bg-white"
        style="position: absolute"
      >
        <DropdownMenuLabel class="filter-label">{{
          i.label
        }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          v-for="j in i.arr"
          :key="j.condition"
          class="drap-menu-content"
        >
          <DropdownMenuRadioGroup v-model="i.ref">
            <DropdownMenuRadioItem
              :value="j.condition"
              :title="i.title"
              @click="filter_condition($event)"
            >
              {{ j.condition }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";
$undertone: #647499;

.filter-condition {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.filter-content {
  width: 150px;
}
.filter-title {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius);
  padding: 10px;
  font-size: 0.8em;
  margin-right: 10px;
  letter-spacing: 0.1em;
}
.drap-menu-content {
  background-color: var(--card);
}
.filter-label {
  font-weight: 500;
}
</style>
