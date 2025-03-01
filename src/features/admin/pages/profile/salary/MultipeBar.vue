<script lang="ts" setup>
import { BarChart } from "@/components/ui/chart-bar";
import CustomChartTooltip from '../CustomChartTooltip.vue'


const data = [
  { name: "17", total: 10, predicted: 12 },
  { name: "18", total: 15, predicted: 11 },
  { name: "19", total: 14, predicted: 10 },
  { name: "20", total: 10, predicted: 13 },
  { name: "21", total: 6, predicted: 8 },
  { name: "22", total: 4, predicted: 4 },
  { name: "23", total: 5, predicted: 5 },
];

const colors = ["#abdcce", "#9ebcd8"];
</script>
<template>
  <BarChart
    :data="data"
    index="name"
    :categories="['total', 'predicted']"
    :colors="colors"
    class="h-[100px] w-[400px]"
    :rounded-corners="4"
    :y-formatter="
      (tick, i) => {
        return typeof tick === 'number'
          ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
          : '';
      }
    "
    :custom-tooltip="CustomChartTooltip"
  />
</template>
<style lang="scss" scoped></style>
