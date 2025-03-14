<template>
  <div class="p-4">
    <h2 class="title">近期趋势图</h2>
    <div class="echart" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";

let charts = ref();

onMounted(() => {
  let mycharts = echarts.init(charts.value);
  mycharts.setOption({
    // title: {
    //   text: "Stacked Line",
    // },
    tooltip: {
      trigger: "axis",
      
    },
    legend: {
      data: ["应到人数", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    },
    grid: {
      left: "10%",
      right: "4%",
      bottom: "10%",
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "应到人数",
        type: "line",
        showSymbol: false,
        stack: "Total",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        showSymbol: false,
        stack: "Total",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        showSymbol: false,
        stack: "Total",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        showSymbol: false,
        stack: "Total",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        showSymbol: false,
        stack: "Total",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  });
});
</script>

<style scoped lang="scss">
.echart {
  height: 20rem;
}
.title {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
