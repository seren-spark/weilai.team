<script setup lang="ts" name="">
import AllSum from "./summary/AllSum.vue";
import SplitEnds from "./SplitEnds.vue";
import RadarChart from "./RadarChart.vue";
import SalaryStatistics from "./SalaryStatistics.vue";
// import MapDistribution from "./MapDistribution.vue";
import chinaMap from "./chinaMap.vue";
</script>

<template>
  <div class="profile-container">
    <div class="profile">
      <AllSum />
      <div class="profileRight">
        <SplitEnds />
        <RadarChart />
      </div>
    </div>
    <div class="SalaryStatistics">
      <SalaryStatistics />
    </div>
    <div class="map">
      <!-- <MapDistribution /> -->
      <chinaMap />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-container {
  overflow: auto;
  .profile {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    height: 220px;
  }

  .profileRight {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (max-width: 1400px) {
  .profile-container {
    .profile {
      height: 200px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .profile-container {
    .profile {
      height: 180px;
    }
  }
}

@media screen and (max-width: 992px) {
  .profile-container {
    .profile {
      height: auto;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 15px 0;
    }
  }
}

@media screen and (max-width: 768px) {
  .profile-container {
    .profile {
      flex-direction: column;
    }
  }
}
</style>
