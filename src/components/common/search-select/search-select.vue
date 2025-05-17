<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ref, onMounted } from "vue";

const props = defineProps<{
  selectedList: List[];
  emptyMessage: string;
  modelValue?: List[];
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: List[]): void;
}>();
interface List {
  id: string;
  label: string;
}

const open = ref(false);
const selectedItems = ref<List[]>([]);
const filteredList = ref<List[]>(props.selectedList);

const handleSelected = (item: List) => {
  const index = selectedItems.value.findIndex((i) => i.id === item.id);
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }
  emit("update:modelValue", selectedItems.value);
};

const handleSearch = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const value = input.value.toLowerCase();
  filteredList.value = props.selectedList.filter((item) =>
    item.label.toLowerCase().includes(value),
  );
};
onMounted(() => {
  selectedItems.value = props.modelValue || [];
});
</script>

<template>
  <div class="flex items-center space-x-4">

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="outline" size="sm" class=" justify-start">
          <template v-if="selectedItems.length > 0">
            <span v-for="(item, index) in selectedItems" :key="index" class="inline-flex items-center">
              {{ item.label
              }}<span v-if="index < selectedItems.length - 1">  </span>
            </span>
          </template>
          <template v-else> + 添加 </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder="搜索..." @input="handleSearch" />
          <CommandList>
            <CommandEmpty>{{ emptyMessage }}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="(item, index) in filteredList"
                :key="index"
                :value="item.id"
                :class="{
                  'interviewer-selected': selectedItems.some(
                    (i) => i.id === item.id,
                  ),
                }"
                @click="handleSelected(item)"
              >
                {{ item.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style lang="scss" scoped>
.interviewer-selected {
  background-color: var(--accent);
  border-left: 3px solid var(--accent);
  padding-left: 5px;
  margin-left: -5px;
}
</style>
