<template>
  <div>
    <p class="time">日期</p>
    <Popover class="select-time-container">
      <PopoverTrigger as-child>
        <Button
          v-model="selectTime"
          variant="outline"
          :class="
            cn(
              'w-[280px] justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )
          "
          class="select-time-btn"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{
            value
              ? df(value.toDate(getLocalTimeZone()), "yyyy-MM-dd")
              : "选择日期"
          }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-full p-0 select-time-content bg-white">
        <Calendar
          ref="selectTime"
          v-model="value"
          initial-focus
          locale="zh-CN"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { getLocalTimeZone, type DateValue } from "@internationalized/date";
import { ref } from "vue";
let selectTime = ref<DateValue | null>(null);
const value = ref<DateValue>();
function df(date: Date, format = "yyyy - MM - dd HH:mm") {
  // 获取日期的各个部分，包括分钟
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  // 根据format字符串进行格式化，包含分钟部分
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
</style>
