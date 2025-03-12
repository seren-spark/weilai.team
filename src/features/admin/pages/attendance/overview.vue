<template>
  <div class="content">
    <!-- 选择日期 -->
    <div class="header">
      <Header></Header>
    </div>
    <!-- 考勤统计 -->

    <statistics class="statistics"></statistics>
    <!-- 近日趋势和部门明细 -->
    <div class="foot">
      <div class="recent-trend"><Trends /></div>
      <div class="department-detail"><Detail /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/attendance/overview/header.vue";
import Statistics from "../../components/attendance/overview/statistics.vue";
import Trends from "../../components/attendance/overview/trends.vue";
import Detail from "@admin/components/attendance/overview/detail.vue";
</script>

<style scoped lang="scss">
@use "@admin/styles/container";
.content {
  padding: 1.8rem 1.5rem;
}
.statistics {
  margin-top: 10px;
}
.header {
  margin-bottom: 1.2rem;
}
.foot {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  .recent-trend {
    width: 48%;
  }
  .department-detail {
    width: 48%;
  }
}
</style>
