<template>
  <div class="mapdrilling-inner">
    <div id="chart" class="chart" style="width: 100%; height: 100%"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
// import { EChartsOption, AnimationEasing } from 'echarts';

import * as echarts from "echarts";
import {
  TAIWAN_ADCODE,
  JD_ADCODE,
  EXISTING_SECOND_LAYER_REGION,
  EXISTING_THIRD_LAYER_REGION,
} from "./constant";
import { getGeoJson, getMapData } from "@/api/map";

// 定义 ECharts 实例的引用
const mapChart = ref<echarts.ECharts | null>(null);
// 存储地图数据的栈
const mapStack = ref<
  {
    mapName: string;
    partData: any[];
    geoJson: any;
  }[]
>([]);
// 防抖定时器
const timer = ref<number | null>(null);

// 初始化图表的函数
const initChart = async () => {
  const chartElement = document.getElementById("chart");
  if (chartElement) {
    mapChart.value = echarts.init(chartElement);
    addChartEvent();

    mapChart.value.showLoading();
    const mapName = "china";
    const { partData, geoJson } = await getGeoAndMapData("china", mapName);
    mapChart.value.hideLoading();

    const specialAreas = {
      澳门: {
        left: 113,
        top: 20.5,
        width: 0.7,
      },
      香港: {
        left: 115,
        top: 21.3,
        width: 2,
      },
    };
    registerRenderMap(mapName, partData, geoJson, specialAreas);
  }
};

// 添加绑定事件的函数
const addChartEvent = () => {
  bindResizeWindow();
  bindClickChart();
  bindContextmenuChart();
};

// 监听屏幕大小改变的函数
const bindResizeWindow = () => {
  window.addEventListener("resize", () => {
    if (timer.value) return;

    timer.value = setTimeout(() => {
      if (mapChart.value) {
        mapChart.value.resize();
      }
      timer.value = null;
    }, 100);
  });
};
// 绑定自定义单击事件的函数
const bindClickChart = () => {
  if (mapChart.value) {
    mapChart.value.on("click", (e: echarts.ECElementEvent) => {
      handleClickEvent(e);
    });
  }
};
// 处理点击事件的函数
// 修改 handleClickEvent 函数中的解构赋值部分
const handleClickEvent = async (e: echarts.ECElementEvent) => {
  const {
    seriesName,
    name,
    data: { adcode } ,
  } = e;

  if (typeof adcode === "undefined") return; // 如果 adcode 不存在，直接返回

  if (EXISTING_SECOND_LAYER_REGION.find((i) => i.adcode === adcode)) {
    const mapName = `${adcode}-${name}`;
    const { partData, geoJson } = await getGeoAndMapData("province", mapName);
    registerRenderMap(mapName, partData, geoJson);
  } else if (
    EXISTING_THIRD_LAYER_REGION.find(
      (i) => `${i.adcode}-${i.name}` === seriesName,
    )
  ) {
    // 检查 seriesName 是否存在
    if (!seriesName || seriesName.includes(TAIWAN_ADCODE.toString())) return;

    const mapName = `${seriesName}-${adcode}-${name}`;
    const { partData, geoJson } = await getGeoAndMapData("city", mapName);
    registerRenderMap(mapName, partData, geoJson);
  }
};

// 绑定自定义右击事件的函数
const bindContextmenuChart = () => {
  const container = document.getElementById("chart");
  if (container) {
    container.oncontextmenu = (e: any) => e.preventDefault();
  }
  if (mapChart.value) {
    mapChart.value.on("contextmenu", () => {
      goBack();
    });
  }
};

// 获取渲染地图的相关数据 geoJson 和 partData（地图部分数据内容）的函数
const getGeoAndMapData = async (type: string, mapName: string) => {
  const [{ data: geoJson }, res] = await Promise.all([
    getGeoJson(type, mapName),
    getMapData(type),
  ]);
  const { data: partData } = res.data;
  return { geoJson, partData };
};

// 返回上一级地图的函数
const goBack = () => {
  if (mapStack.value.length <= 1) {
    return;
  }
  mapStack.value.pop();
  const topChildData = topChild();
  if (topChildData) {
    const { mapName, partData, geoJson } = topChildData;
    registerRenderMap(mapName, partData, geoJson);
  }
};

// 地图数据入栈，栈顶成员即当前渲染的地图数据的函数
const pushStack = (mapName: string, partData: any[], geoJson: any) => {
  mapStack.value.push({
    mapName,
    partData,
    geoJson,
  });
};

// 获取栈顶成员的函数
const topChild = () => {
  if (mapStack.value.length === 0) return undefined;
  return mapStack.value[mapStack.value.length - 1];
};

// 注册渲染地图的函数
const registerRenderMap = (
  mapName: string,
  partData: any[],
  geoJson: any,
  specialAreas: any = {},
) => {
  echarts.registerMap(mapName, geoJson, specialAreas);
  renderMap(mapName, partData, geoJson);
};

// 绘制地图的函数
const renderMap = (mapName: string, partData: any[], geoJson: any) => {
  const seriesData = getSeriesDataByPart(partData, geoJson);
  //   const visualMapMax = getVisualMapMax(seriesData);
  const option = {
    title: {
      text: mapName,
      textStyle: {
        color: "#b7def9",
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}<br>{c}人",
      //   formatter: function (params: { name: string; data: { adcode: string } }) {
      //     // params 是包含数据项的详细信息的对象
      //     return params.name + "<br>" + params.data.adcode;
      //   },
      backgroundColor: "#fff",
      textStyle: {
        color: "#999",
        fontSize: 12,
      },
    },
    // 视觉映射
    visualMap: {
      min: 0,
      max: 15,
      text: ["高", "低"],
      realtime: true,
      calculable: true,
      inRange: {
        color: ["#cfe6f8", "#4d72f6"], // 色阶范围
      },
      textStyle: {
        color: "#b7def9",
      },
    },
    series: [
      {
        name: mapName, // 系列名称
        type: "map",
        map: mapName, // 同 registerMap 方法的第一个参数一致
        zoom: 1.25, // 当前视角的缩放比例
        zlevel: 1, // 用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中
        // center: [105.5, 33.5],
        roam: true,
        // projection: "mercator",
        scaleLimit: {
          min: 0.8,
          max: 2,
        },
        label: {
          // 非高亮状态下的文本样式
          normal: {
            show: true,
            position: "inside", // 文本标签显示的位置
            textStyle: {
              color: "#123", // 文本颜色
              fontSize: 14,
            },
            // formatter: '{b}\n{c}', // 文本上显示的值  data:[{name: "地名", value: 数据}],  {b}表示label信息,{c}代表value
          },
          // 高亮状态下的文本样式
          emphasis: {
            textStyle: {
              color: "#000", // 文本颜色
            },
          },
        },
        itemStyle: {
          // 非高亮状态下的地图块样式
          normal: {
            borderColor: "#999",
          },
          // 高亮状态下的地图块样式
          emphasis: {
            areaColor: "#ebd180",
          },
        },

        data: seriesData,
      },
    ],
    animation: true,
    animationDuration: 1000,
    animationEasingUpdate: "cubicInOut",
    animationDurationUpdate: 600,
  };

  if (mapChart.value) {
    mapChart.value.setOption(option);
  }

  if (topChild()?.mapName === mapName) {
    return;
  }
  pushStack(mapName, partData, geoJson);
};

// 根据partData 和 geoJson 生成 seriesData 的函数
interface GeoJsonProperties {
  adcode: number;
  name: string;
  // 其他可能的属性
}

interface GeoJsonFeature {
  properties: GeoJsonProperties;
  // 其他可能的属性
}

interface GeoJson {
  features: GeoJsonFeature[];
  attach?: { adcode: number; name: string }[];
}
const getSeriesDataByPart = (partData: any[], geoJson: GeoJson) => {
  let data = geoJson.features.map(({ properties }: GeoJsonFeature) => ({
    adcode: properties.adcode,
    name: properties.name,
    value: 0,
  }));

  if (geoJson.attach) {
    const attachData = geoJson.attach.map(
      (item: { adcode: number; name: string }) => ({
        adcode: item.adcode,
        name: item.name,
        value: 0,
      }),
    );
    data.push(...attachData);
  }

  data = data.filter((item: { adcode: number }) => item.adcode !== JD_ADCODE); // Check if JD_ADCODE is defined

  data.forEach((item: { adcode: number; value: number }) => {
    const currData = partData.find((i) => i.adcode === item.adcode);
    if (currData) {
      item.value = currData.value;
    }
  });

  return data;
};

// 根据seriesData 动态计算生成 visualMap 的最大值的函数
const getVisualMapMax = (seriesData: any[]) => {
  const maxValue = Math.max(...seriesData.map((item) => item.value));
  return parseInt(maxValue.toString()) + 50;
};

// 组件挂载后初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载前销毁地图实例
onBeforeUnmount(() => {
  if (mapChart.value) {
    mapChart.value.dispose();
  }
});
</script>
<style lang="scss" scoped>
.mapdrilling-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .chart {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;
    // border: 3px solid #ebd180;
  }
}
</style>
