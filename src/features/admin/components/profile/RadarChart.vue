<template>
  <div class="card">
    <div class="card-header items-center pb-4">
      <h3 class="card-title">Radar Chart</h3>
    </div>
    <div class="card-content pb-0">
      <div
        ref="radarChart"
        style="width: 200px; height: 140px"
        class="mx-auto aspect-square max-h-[300px]"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  userCount: {
    type: Number,
    default: 0,
  },
  postB: {
    type: Number,
    default: 0,
  },
  postG: {
    type: Number,
    default: 0,
  },
  postJ: {
    type: Number,
    default: 0,
  },
  postT: {
    type: Number,
    default: 0,
  },
});

const chartData = computed(() => [
  { type: "博客", desktop: props.postB },
  { type: "公告", desktop: props.postG },
  { type: "交流", desktop: props.postJ },
  { type: "头脑风暴", desktop: props.postT },
  { type: "用户", desktop: props.userCount },
]);

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3d79b1",
  },
};

const color = ["#3d79b1"];

const radarChart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

onMounted(() => {
  if (radarChart.value) {
    myChart = echarts.init(radarChart.value);

    const updateChart = () => {
      // 自定义每个指标的最大值
      const indicators = chartData.value.map((item) => ({
        name: item.type,
        max: Math.max(...chartData.value.map((data) => data.desktop)), // 动态计算最大值
      }));

      const option = {
        tooltip: {
          trigger: "axis",
        },
        color: color,

        radar: {
          indicator: indicators,
          center: ["50%", "55%"],
          radius: "70%",
        },
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "item",
              backgroundColor: "#ffffffde",
              border: "solid 1px var(--vis-tooltip-border-color)",
              textStyle: {
                color: "rgb(91 91 91)",
              },
              itemStyle: { normal: { areaStyle: { type: "default" } } },
            },
            data: [
              {
                // 将每个指标的值按顺序放入数组
                value: chartData.value.map((item) => item.desktop),
                name: chartConfig.desktop.label,
                areaStyle: {
                  normal: {
                    color: chartConfig.desktop.color,
                    opacity: 0.3,
                  },
                },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    };
    // 初始化时更新图表
    updateChart();

    // 监听 props 的变化
    watch(
      () => [
        props.userCount,
        props.postB,
        props.postG,
        props.postJ,
        props.postT,
      ],
      () => {
        updateChart();
      },
      { deep: true },
    );
  }
});
</script>

<style lang="scss" scoped>
.card {
  padding: 10px;
  // width: 24%;
  background-color: #fff;

  .card-header {
    .card-title {
      color: rgb(139, 139, 139);
      font-size: 18px;
      padding-bottom: 10px;
      border-bottom: #edecec 1px solid;
    }
  }

  .card-content {
  }

  .tooltipItem {
    font-size: 13px;
  }
}
</style>
