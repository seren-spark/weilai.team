<script setup lang="ts">
import SumIndex from "./SummaryIndex.vue";

const props = defineProps({
  allTeamUserCount: {
    type: Number,
    default: 0,
  },
  salaryYearAll: {
    type: Number,
    default: 0,
  },
  lanQiaoCount: {
    type: Number,
    default: 0,
  },
  copyrightCount: {
    type: Number,
    default: 0,
  },
});

</script>
<template>
  <div class="person">
    <SumIndex
      :icon="'ic:outline-person'"
      :number="allTeamUserCount.toLocaleString()"
      :title="'小组总人数'"
    />
    <SumIndex
      :icon="'material-symbols-light:award-star-outline'"
      :number="lanQiaoCount.toLocaleString()"
      :title="'蓝桥杯获奖数'"
    />
    <SumIndex
      :icon="'material-symbols-light:local-atm-outline'"
      :number="salaryYearAll.toLocaleString()"
      :title="'平均年薪'"
    />
    <SumIndex
      :icon="'material-symbols-light:copyright-outline'"
      :number="copyrightCount.toLocaleString()"
      :title="'软件著作'"
    />
  </div>
</template>
<style lang="scss" scoped>
.person {
  display: grid;
  // width: 48%;
  height: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px 20px;
  margin-right: 2%;

  a {
    color: #fff;
  }
}

@media screen and (max-width: 1400px) {
  .person {
  }
}

@media screen and (max-width: 1024px) {
  .person {
  }
}

@media screen and (max-width: 768px) {
  .person {
    width: 100%;
    margin-right: 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    gap: 15px 0;
    margin-top: 80px;
  }
}
</style>
