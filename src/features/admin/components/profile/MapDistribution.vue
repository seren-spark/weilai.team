<template>
  <div ref="chartRef" style="width: 100%; height: 900px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
// import "../../../../../node_modules/echarts/extension/bmap/bmap.js";
import getChinaMap from "@/api/getChinaMap";
import { onMounted, ref } from "vue";

// 定义存储图表 DOM 元素引用的 ref
const chartRef = ref<HTMLElement | null>(null);
// echarts.registerMap(
//   "china",
//   " https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
// );
// 在组件挂载后初始化图表
onMounted(async()=> {
  if (chartRef.value) {
    // 初始化 ECharts 实例
    const chart = echarts.init(chartRef.value);
    try {
      const res = await getChinaMap;
      const mapData = res.data;
      echarts.registerMap("china", mapData);
      var option = {
        series: [
          {
            name: "中国地图",
            type: "map",
            map: "china", // 这个是上面注册时的名字哦，registerMap（'这个名字保持一致'）
            label: {
              show: false,
            },
            roam: true,
            scaleLimit: [1, 5],
          },
        ],
      };
      // 应用配置选项到图表
      chart.setOption(option);

      // 设置下钻逻辑
    //   chart.on('click', (params) => {
    //     const selectedRegion = params.name; // 获取点击的省份/地区名称
    //     console.log(`Clicked on: ${selectedRegion}`);
    //     // 这里你可以根据点击的省份/地区来加载相应的地图数据
    //     // 比如，获取某个省份的地图数据并重新加载图表
    //     // 例如：如果点击的是广东省，就加载广东省的地图数据
    //     if (selectedRegion === '广东') {
    //       // 获取并注册广东省的地图数据
    //       // 这里假设你有一个函数可以获取到广东的地图数据
    //       console.log("广东");
    //     //   const res = await getMapDataForRegion('广东');
    //     //   const mapDataForGuangdong = res.data;
    //     //   echarts.registerMap("guangdong", mapDataForGuangdong);

    //     //   // 更新地图到广东省
    //     //   chart.setOption({
    //     //     series: [{
    //     //       map: "guangdong",
    //     //       name: "广东地图",
    //     //     }],
    //     //   });
    //     }
    //   });

    // 设置下钻逻辑
      chart.on('click', (params: any) => {
        handleMapClick(params, chart);
      });
    } catch (error) {
      console.error("Failed to load China map data:", error);
    }

    // 定义图表配置选项
    // const option = {
    //   tooltip: {
    //     trigger: "item",
    //     formatter: "{b}<br/>{c} 人",
    //   },
    //   visualMap: {
    //     min: 0,
    //     max: 10000, // 可以根据实际的数据调整
    //     text: ["High", "Low"],
    //     realtime: false,
    //     calculable: true,
    //     inRange: {
    //       color: ["#e0ffff", "#006edd"], // 色阶设置
    //     },
    //   },
    //   series: [
    //     {
    //       name: "人员分布",
    //       type: "Map",
    //       mapType: "China",
    //       roam: false,
    //       label: {
    //         show: true,
    //         color: "#000",
    //       },
    //       data: [
    //         { name: "北京", value: 5000 },
    //         { name: "上海", value: 8000 },
    //         { name: "广州", value: 7000 },
    //         { name: "深圳", value: 6000 },
    //         { name: "成都", value: 4000 },
    //         // 可以添加更多数据
    //       ],
    //     },
    //   ],
    // };

}
});

function handleMapClick(params: any, chart: echarts.ECharts) {
  const selectedRegion = params.name;
  console.log(`Clicked on: ${selectedRegion}`);

  if (selectedRegion === '广东省') {
    console.log("广东");
    // 这里可以继续实现获取并注册广东省的地图数据的逻辑
  }
}
</script>

<style scoped>
/* 可以自定义样式 */
</style>
