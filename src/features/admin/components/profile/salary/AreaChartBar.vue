<script lang="ts" setup>
import { AreaChart } from "@/components/ui/chart-area";
import ChartTooltip from "../ChartTooltip.vue";
import { watch } from "vue";

interface Item {
  grade: number;
  salaryYearPerHtml: number;
  salaryYearPerJava: number;
  peopleCountPerHtml: number;
  peopleCountPerJava: number;
}

const props = defineProps({
  perByGrade: {
    type: Array as () => Item[],
    default: () => {},
  },
});

let data: { name: number; frontEnd: number; backEnd: number }[];

watch(
  () => props.perByGrade,
  () => {
    data = props.perByGrade.map((item) => {
      return {
        name: item.grade,
        frontEnd: item.salaryYearPerHtml,
        backEnd: item.salaryYearPerJava,
      };
    });
    // console.log(data);
  },
  { deep: true },
);

const colors = ["#447db3", "#5dba9f"];
</script>
<template>
  <div class="AreaChart">
    <AreaChart
      v-if="data"
      :data="data"
      :colors="colors"
      index="name"
      class="h-[110px] w-[100%]"
      :categories="['frontEnd', 'backEnd']"
      :custom-tooltip="ChartTooltip"
      :y-formatter="
        (tick, i) => {
          return typeof tick === 'number'
            ? `${new Intl.NumberFormat('us').format(tick).toString()}`
            : '';
        }
      "
    />
  </div>
</template>
<style lang="scss" scoped></style>
