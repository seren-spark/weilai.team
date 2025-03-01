<script setup lang="ts" name="">
import AllSum from './summary/AllSum.vue';
import SplitEnds from './SplitEnds.vue';
import RadarChart from './RadarChart.vue';
import SalaryStatistics from './SalaryStatistics.vue';
import MapDistribution from './MapDistribution.vue';
import chinaMap from './chinaMap.vue';
</script>

<template>
    <div class="profile">
        <AllSum />
        <SplitEnds />
        <RadarChart />
    </div>
    <div class="SalaryStatistics">
        <SalaryStatistics />
    </div>
    <div class="map">
        <!-- <MapDistribution /> -->
         <chinaMap />
    </div>
</template>

<style lang="scss" scoped>
.profile{
    display: flex;
}

@media screen and (max-width: 768px) {
    .profile{
        flex-direction: column;
    }
}
</style>
