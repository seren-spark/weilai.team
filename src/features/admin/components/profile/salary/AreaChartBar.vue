<script lang="ts" setup>
import { AreaChart } from "@/components/ui/chart-area";
import CustomChartTooltip from "../CustomChartTooltip.vue";
import { ref } from "vue";

const data = ref([
  { name: "17届", frontEnd: 25, backEnd: 27 },
  { name: "18届", frontEnd: 34, backEnd: 29 },
  { name: "19届", frontEnd: 30, backEnd: 30 },
  { name: "20届", frontEnd: 26, backEnd: 28 },
  { name: "21届", frontEnd: 25, backEnd: 22 },
  { name: "22届", frontEnd: 22, backEnd: 26 },
  { name: "23届", frontEnd: 20, backEnd: 23 },
]);

const colors = ["#447db3", "#5dba9f"];

</script>
<template>
  <div class="AreaChart">
    <AreaChart
      :data="data"
      :colors="colors"
      index="name"
      class="h-[110px] w-[100%]"
      :categories="['frontEnd', 'backEnd']"
      :custom-tooltip="CustomChartTooltip"
      :y-formatter="
        (tick, i) => {
          return typeof tick === 'number'
            ? `${new Intl.NumberFormat('us').format(tick).toString()}w`
            : '';
        }
      "
    />
  </div>
</template>
<style lang="scss" scoped>
.AreaChart {

}
</style>
