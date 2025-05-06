<script lang="ts" setup>
import { BarChart } from "@/components/ui/chart-bar";
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

let data: { name: number; total: number; predicted: number }[];

watch(
  () => props.perByGrade,
  () => {
    data = props.perByGrade.map((item) => {
      return {
        name: item.grade,
        total: item.peopleCountPerHtml,
        predicted: item.peopleCountPerJava,
      };
    });
    // console.log(data);
  },
  { deep: true },
);

const colors = ["#abdcce", "#9ebcd8"];
</script>
<template>
  <BarChart
    v-if="data"
    :data="data"
    index="name"
    :categories="['total', 'predicted']"
    :colors="colors"
    class="h-[110px]"
    :rounded-corners="4"
    :y-formatter="
      (tick, i) => {
        return typeof tick === 'number'
          ? `${new Intl.NumberFormat('us').format(tick).toString()}`
          : '';
      }
    "
    :custom-tooltip="ChartTooltip"
  />
</template>
<style lang="scss" scoped></style>
