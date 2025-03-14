<script setup lang="ts" name="">
import AllSum from "./summary/AllSum.vue";
import SplitEnds from "./SplitEnds.vue";
import RadarChart from "./RadarChart.vue";
import SalaryStatistics from "./SalaryStatistics.vue";
// import MapDistribution from "./MapDistribution.vue";
import chinaMap from "./chinaMap.vue";

import UseOverview from "@/features/admin/composables/useOverview";
const { profile } = UseOverview();
console.log(profile);
</script>

<template>
  <div class="profile-container">
    <div class="profile">
      <AllSum
        :all-team-user-count="profile?.allTeamUserCount"
        :salary-year-all="profile?.salaryYearAll"
        :lan-qiao-count="profile?.lanQiaoCount"
        :copyright-count="profile?.copyrightCount"
      />
      <div class="profileRight">
        <SplitEnds
          :java-current="profile?.javaCurrent"
          :html-current="profile?.htmlCurrent"
          :exam-current="profile?.examCurrent"
          :work-current="profile?.workCurrent"
        />
        <RadarChart
          :user-count="profile?.userCount"
          :post-b="profile?.postB"
          :post-g="profile?.postG"
          :post-j="profile?.postJ"
          :post-t="profile?.postT"
        />
      </div>
    </div>
    <div class="SalaryStatistics">
      <SalaryStatistics
        :java-all="profile?.javaAll"
        :html-all="profile?.htmlAll"
        :html-per="profile?.htmlPer"
        :java-per="profile?.javaPer"
      />
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
