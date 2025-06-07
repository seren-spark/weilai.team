<script setup lang="ts">
import type { DateRange } from "radix-vue";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import { computed} from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";

const props = defineProps<{
  modelValue?: DateRange;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: DateRange): void;
}>();

const df = new DateFormatter("zh-CN", {
  dateStyle: "short",
});

// 代理 modelValue，实现双向绑定
const value = computed<DateRange>({
  get: () => props.modelValue ?? { start: undefined, end: undefined },
  set: (val) => emit("update:modelValue", val),
});

// 重置方法
const reset = () => {
  emit("update:modelValue", { start: undefined, end: undefined });
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal',
            !value.start && 'text-muted-foreground',
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>
          <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else> 选取日期范围 </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
        :key="(value.start?.toString() ?? '') + (value.end?.toString() ?? '')"
        v-model="value"
        :number-of-months="2"
        locale="zh-CN"
      />
      <div class="p-2 border-t flex justify-end">
        <Button variant="ghost" size="sm" @click="reset">重置</Button>
      </div>
    </PopoverContent>
  </Popover>
</template>