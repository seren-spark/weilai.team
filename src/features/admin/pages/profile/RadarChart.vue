<template>
    <div class="card">
        <div class="card-header items-center pb-4">
            <h3 class="card-title">Radar Chart</h3>
        </div>
        <div class="card-content pb-0">
            <div ref="radarChart" style="width: 200px; height: 140px;" class="mx-auto aspect-square max-h-[300px]">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { TrendingUp } from 'lucide-vue-next';
import * as echarts from 'echarts';

const chartData = [
    { type: "博客", desktop: 186 },
    { type: "公告", desktop: 305 },
    { type: "交流", desktop: 237 },
    { type: "头脑风暴", desktop: 273 },
    { type: "用户", desktop: 209 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#3d79b1",
    },
};


const radarChart = ref<HTMLElement | null>(null);

onMounted(() => {
    if (radarChart.value) {
        const myChart = echarts.init(radarChart.value);

        // 自定义每个指标的最大值
        const indicators = chartData.map(item => ({
            name: item.type,
            max: Math.max(...chartData.map(data => data.desktop)) // 动态计算最大值
        }));

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params: { name: any; value: any; }) {
                    const typeName = params.name;
                    const value = params.value;
                    let tooltipHtml = `<div>
                        <p>${typeName}</p>`
                    value.forEach((value: any, index: number) => {
                        tooltipHtml += `<p class="tooltipItem">${indicators[index].name}: ${value}</p>`;
                    })
                    tooltipHtml += `</div>`;
                    return tooltipHtml;
                },
                textStyle: {
                    color: "rgb(91 91 91)"
                }
            },
            radar: {
                indicator: indicators,
                center: ['50%', '55%'],
                radius: '70%'
            },
            series: [
                {
                    type: 'radar',

                    // data:
                    // chartData.map(item => ({
                    //     value: item.desktop,
                    //     name: item.type,
                    //     areaStyle: {
                    //         color: chartConfig.desktop.color,
                    //         opacity: 0.3
                    //     }
                    // }))
                    data: [
                        {
                            // 将每个指标的值按顺序放入数组
                            value: chartData.map(item => item.desktop),
                            name: chartConfig.desktop.label,
                            areaStyle: {
                                color: chartConfig.desktop.color,
                                opacity: 0.3
                            }
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    }
});

</script>

<style lang="scss" scoped>
.card {
    padding: 10px;
    width: 24%;
    background-color: #fff;

    .card-header {
        .card-title {
            color: rgb(139, 139, 139);
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: #edecec 1px solid;
        }
    }

    .card-content {}

    .tooltipItem {
        font-size: 13px;
    }
}
</style>