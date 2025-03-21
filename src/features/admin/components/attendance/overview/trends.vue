<template>
  <div class="p-4">
    <h2 class="title">近期趋势图</h2>

    <LineChart
      class="echart"
      :data="groupData"
      :colors="['#6e9cfa', '#65dbac']"
      index="day"
      :categories="['应到人数', '打卡人数']"
      :y-formatter="
        (tick, i) => {
          return typeof tick === 'number'
            ? ` ${new Intl.NumberFormat('us').format(tick).toString()}`
            : '';
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
// import * as echarts from "echarts";
import moment from "moment";
import type { ChartData } from "@/types/attendance-overview";
import { LineChart } from "@/components/ui/chart-line";

const props = defineProps<{
  line: ChartData;
}>();

const groupData = ref<GroupDataType[]>([]);
// 定义 groupData 的类型
interface GroupDataType {
  day: string;
  应到人数: number;
  打卡人数: number;
}
watch(
  () => props.line,
  () => {
    console.log(props.line);
    groupData.value = [];
    const keys = Object.keys(props.line).sort();
    // day.value = Object.keys(props.line || {});
    // weekInfo.value = formatDate(day.value);
    keys.forEach((key) => {
      const day = moment(key).format("MM-DD");
      const groupObj = {
        day,
        应到人数: props.line[key][0],
        打卡人数: props.line[key][1],
      };
      groupData.value.push(groupObj);
    });
    console.log(groupData.value);
  },
  { immediate: true, deep: true },
);
// 修改时间格式
// function formatDate(date: string[]) {
//   return date.map((str) => moment(str).format("MM-DD"));
// }

// let charts = ref();

// onMounted(() => {
//   let mycharts = echarts.init(charts.value);
//   watch(
//     () => weekInfo.value,
//     () => {
//       mycharts.setOption({
//         tooltip: {
//           trigger: "axis",
//           backgroundColor: "white",
//           textStyle: {
//             color: "var(--secondary-foreground)",
//           },
//         },
//         legend: {
//           data: [
//             "应到人数",
//             "打卡人数",
//             "Video Ads",
//             "Direct",
//             "Search Engine",
//           ],
//         },
//         grid: {
//           left: "10%",
//           right: "4%",
//           bottom: "10%",
//         },

//         xAxis: {
//           type: "category",
//           boundaryGap: false,
//           data: weekInfo.value,
//           axisLabel: {
//             color: "#8f9097",
//           },
//           axisLine: {
//             show: false,
//           },
//           axisTick: {
//             lineStyle: {
//               color: "var(--secondary-foreground)",
//             },
//           },
//         },
//         yAxis: {
//           type: "value",
//           axisLabel: {
//             color: "#8f9097",
//           },
//           axisLine: {
//             show: false,
//           },
//           axisTick: {
//             show: false,
//           },
//           splitLine: {
//             show: true, //设置纵坐标没有刻度线
//           },
//         },
//         series: [
//           {
//             name: "应到人数",
//             type: "line",
//             showSymbol: false,

//             // 设置符号大小
//             symbolSize: 0.2,
//             itemStyle: {
//               color: "#5470c6",
//               borderColor: "#5470c6",
//             },

//             stack: "Total",
//             data: [120, 132, 101, 134, 90, 230, 210],
//           },
//           {
//             name: "打卡人数",
//             type: "line",
//             showSymbol: false,
//             symbolSize: 0.2,
//             itemStyle: {
//               color: "#94cd79",
//               borderColor: "#94cd79",
//             },
//             stack: "Total",
//             data: [220, 182, 191, 234, 290, 330, 310],
//           },
//           {
//             name: "Video Ads",
//             type: "line",
//             showSymbol: false,
//             symbolSize: 0.2,
//             itemStyle: {
//               color: "#facb63",
//               borderColor: "#facb63",
//             },
//             stack: "Total",
//             data: [150, 232, 201, 154, 190, 330, 410],
//           },
//           {
//             name: "Direct",
//             type: "line",
//             showSymbol: false,
//             symbolSize: 0.2,
//             stack: "Total",
//             itemStyle: {
//               color: "#f07f7f",
//               borderColor: "#f07f7f",
//             },

//             data: [320, 332, 301, 334, 390, 330, 320],
//           },
//           {
//             name: "Search Engine",
//             type: "line",
//             showSymbol: false,
//             symbolSize: 0.2,
//             itemStyle: {
//               color: "#7cc4e0",
//               borderColor: "#7cc4e0",
//             },
//             stack: "Total",
//             data: [820, 932, 901, 934, 1290, 1330, 1320],
//           },
//         ],
//       });
//     },
//     { immediate: true, deep: true },
//   );

//   mycharts.setOption({
//     tooltip: {
//       trigger: "axis",
//       backgroundColor: "white",
//       textStyle: {
//         color: "var(--secondary-foreground)",
//       },
//     },
//     legend: {
//       data: ["应到人数", "打卡人数", "Video Ads", "Direct", "Search Engine"],
//     },
//     grid: {
//       left: "10%",
//       right: "4%",
//       bottom: "10%",
//     },

//     xAxis: {
//       type: "category",
//       boundaryGap: false,
//       data: weekInfo.value,
//       axisLabel: {
//         color: "#8f9097",
//       },
//       axisLine: {
//         show: false,
//       },
//       axisTick: {
//         lineStyle: {
//           color: "var(--secondary-foreground)",
//         },
//       },
//     },
//     yAxis: {
//       type: "value",
//       axisLabel: {
//         color: "#8f9097",
//       },
//       axisLine: {
//         show: false,
//       },
//       axisTick: {
//         show: false,
//       },
//       splitLine: {
//         show: true, //设置纵坐标没有刻度线
//       },
//     },
//     series: [
//       {
//         name: "应到人数",
//         type: "line",
//         showSymbol: false,

//         // 设置符号大小
//         symbolSize: 0.2,
//         itemStyle: {
//           color: "#5470c6",
//           borderColor: "#5470c6",
//         },

//         stack: "Total",
//         data: [120, 132, 101, 134, 90, 230, 210],
//       },
//       {
//         name: "打卡人数",
//         type: "line",
//         showSymbol: false,
//         symbolSize: 0.2,
//         itemStyle: {
//           color: "#94cd79",
//           borderColor: "#94cd79",
//         },
//         stack: "Total",
//         data: [220, 182, 191, 234, 290, 330, 310],
//       },
//       {
//         name: "Video Ads",
//         type: "line",
//         showSymbol: false,
//         symbolSize: 0.2,
//         itemStyle: {
//           color: "#facb63",
//           borderColor: "#facb63",
//         },
//         stack: "Total",
//         data: [150, 232, 201, 154, 190, 330, 410],
//       },
//       {
//         name: "Direct",
//         type: "line",
//         showSymbol: false,
//         symbolSize: 0.2,
//         stack: "Total",
//         itemStyle: {
//           color: "#f07f7f",
//           borderColor: "#f07f7f",
//         },

//         data: [320, 332, 301, 334, 390, 330, 320],
//       },
//       {
//         name: "Search Engine",
//         type: "line",
//         showSymbol: false,
//         symbolSize: 0.2,
//         itemStyle: {
//           color: "#7cc4e0",
//           borderColor: "#7cc4e0",
//         },
//         stack: "Total",
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//       },
//     ],
//   });
// });
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
