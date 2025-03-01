<script lang="ts" setup>
import { AreaChart } from "@/components/ui/chart-area";
import CustomChartTooltip from "../CustomChartTooltip.vue";

const data = [
  { name: "17", frontEnd: 25, backEnd: 27 },
  { name: "18", frontEnd: 34, backEnd: 29 },
  { name: "19", frontEnd: 30, backEnd: 30 },
  { name: "20", frontEnd: 26, backEnd: 28 },
  { name: "21", frontEnd: 25, backEnd: 22 },
  { name: "22", frontEnd: 22, backEnd: 26 },
  { name: "23", frontEnd: 20, backEnd: 23 },
];

const colors = ["#447db3", "#5dba9f"];
</script>
<template>
  <div class="AreaChart">
    <AreaChart
      :data="data"
      :colors="colors"
      index="name"
      class="h-[100px] w-[400px]"
      :categories="['frontEnd', 'backEnd']"
      :custom-tooltip="CustomChartTooltip"
    />
  </div>
</template>
<style lang="scss" scoped>
// .AreaChart {
//     width: 100%;
//     height: 500px;
// }
</style>
