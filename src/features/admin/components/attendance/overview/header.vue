<template>
  <div>
    <p class="time">日期</p>
    <div class="flex">
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="
              cn(
                'w-[280px] justify-start text-left font-normal',
                !value && 'text-muted-foreground',
              )
            "
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ value ? df(value.toDate(getLocalTimeZone())) : df(new Date()) }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="value" initial-focus locale="zh-CN" />
        </PopoverContent>
      </Popover>
      <Select default-value="0" v-model="selectValue" class="selectContainer">
        <SelectTrigger class="w-[6rem] h-9 shadow-sm select-trigger">
          <SelectValue
            placeholder="选择时间段"
            style="color: var(--muted-foreground)"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="0"> 一天 </SelectItem>
            <SelectItem value="1"> 上午 </SelectItem>
            <SelectItem value="2"> 下午 </SelectItem>
            <SelectItem value="3"> 晚上</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { getLocalTimeZone, type DateValue } from "@internationalized/date";
import { ref, watch } from "vue";

const value = ref<DateValue>();
// 定义 props 和 emits
const props = defineProps(["modelValue", ""]);
const selectValue = ref<string>("0");
const emits = defineEmits(["update:model-value", "update:select-value"]);

// 使用局部变量存储 modelValue 的值
let localModelValue = ref<DateValue | null>(props.modelValue || null);

// 监听 props.modelValue 的变化并同步到局部变量
watch(
  () => props.modelValue,
  (newValue) => {
    localModelValue.value = newValue || null;
  },
);
watch(
  () => value.value,
  () => {
    console.log(value.value);
  },
);

// 监听局部变量的变化并通知父组件
watch(value, (newValue) => {
  emits("update:model-value", newValue);
});
watch(selectValue, (newValue) => {
  console.log("选择了", newValue);

  emits("update:select-value", newValue);
});
// 格式化日期函数
function df(date: Date, format = "yyyy - MM - dd") {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let formattedDate = format
    .replace("yyyy", year.toString())
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("HH", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"));
  return formattedDate;
}
</script>

<style scoped lang="scss">
.time {
  font-size: 0.825rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}
:deep(option) {
  color: #64748b;
}
:deep(select) {
  margin: 0 0.5rem;
}
.selectContainer {
  option {
    color: var(--muted-foreground);
  }
}
.select-trigger {
  margin: 0 0.5rem !important;
}
</style>
