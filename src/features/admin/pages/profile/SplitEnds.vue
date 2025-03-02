<script setup lang="ts">
import { DonutChart } from '@/components/ui/chart-donut'
import CustomChartTooltip from './CustomChartTooltip.vue'


const data = [
    { name: '前端', total: 15, predicted: 15 },
    { name: '后端', total: 20, predicted: 20 },
    { name: '考研', total: 2, predicted: 2 },
    { name: '实习', total: 10, predicted: 10 }
]

const colors = ['#e8cf94', '#58b99d', '#cfd1d3', '#3d79b1']


const valueFormatter = (tick: number | Date) => typeof tick === 'number' ? `${new Intl.NumberFormat('us').format(tick).toString()}人` : ''
</script>

<template>
    <div class="split-ends">
        <div class="split-title">小组学习方向</div>
        <div class="split-ends-container">
            <div class="types">
                <div class="type-info" v-for="(item, index) in data" :key="item.name">
                    <span class="type-color" :style="{ background: colors[index] }"></span>
                    <div class="type-name">{{ item.name }}</div>
                </div>
            </div>
            <DonutChart :value-formatter="valueFormatter" :data="data" :colors="colors" class="donut" index="name"
                :category="'total'" :custom-tooltip="CustomChartTooltip" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.split-ends {
    background-color: #fff;
    padding: 10px;
    // width: 24%;
    height: 100%;
    margin-right: 2%;


    .split-title {
        color: rgb(139, 139, 139);
        font-size: 18px;
        padding-bottom: 10px;
        border-bottom: #edecec 1px solid;
    }

    .split-ends-container {
        display: flex;
        justify-content: space-between;
        color: rgb(50, 50, 50);



        .types {
            display: flex;
            flex-direction: column;
            margin: 5px 10px 0 0;

            .type-info {
                display: flex;
                align-items: center;
                margin-top: 3px;

                .type-color {
                    display: inline-block;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    margin-right: 10px;
                }
            }
        }

        .donut {
            width: 180px;
            height: 160px;
        }
    }
}


@media screen and (min-width: 1600px) {
    .split-ends {

        .split-title {
            color: rgb(139, 139, 139);
            font-size: 20px;
        }

        .split-ends-container {

            .types {
                font-size: 18px;

                .type-info {
                    margin-top: 3px;

                    .type-color {
                        width: 1.2rem;
                        height: 1.2rem;
                    }
                }
            }

            .donut {
                width: 180px;
                height: 160px;
            }
        }
    }

}

@media screen and (max-width: 1410px) {
    .split-ends {

        .split-title {
            color: rgb(139, 139, 139);
            font-size: 16px;
        }

        .split-ends-container {

            .types {
                font-size: 13px;
                margin: 10px 7px 0 0;

                .type-info {

                    .type-color {
                        width: 0.8rem;
                        height: 0.8rem;
                        margin-right: 7px;
                    }
                }
            }

            .donut {
                width: 160px;
                height: 150px;
            }
        }
    }
}

@media screen and (max-width: 1200px) {
    .split-ends {

        .split-title {
            color: rgb(139, 139, 139);
            font-size: 16px;
        }

        .split-ends-container {

            .types {
                font-size: 12px;
                margin: 15px 3px 0 0;

                .type-info {

                    .type-color {
                        width: 0.5rem;
                        height: 0.5rem;
                        margin-right: 5px;
                    }
                }
            }

            .donut {
                width: 150px;
                height: 150px;
            }
        }
    }
}

@media screen and (max-width: 1040px) {
    .split-ends {

        .split-title {
            font-size: 13px;
        }

        .split-ends-container {

            .types {
                font-size: 10px;
                margin: 15px 0px 0 0;

                .type-info {

                    .type-color {
                        width: 0.5rem;
                        height: 0.5rem;
                        margin-right: 4px;
                    }
                }
            }

            .donut {
                width: 130px;
                height: 120px;
            }
        }
    }
}

@media screen and (max-width: 1000px) {}
</style>