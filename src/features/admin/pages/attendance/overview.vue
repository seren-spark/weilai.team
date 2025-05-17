<template>
  <div class="content">
    <!-- 选择日期 -->
    <div class="header">
      <Header v-model="date"></Header>
    </div>
    <!-- 考勤统计 -->

    <statistics class="statistics" :data="data?.data"></statistics>
    <!-- 近日趋势和部门明细 -->
    <div class="foot">
      <div class="recent-trend">
        <Trends :line="data?.data.lineChart || {}" />
      </div>
      <div class="department-detail">
        <Detail :team-info="data?.data.teamTable || {}" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/attendance/overview/header.vue";
import Statistics from "../../components/attendance/overview/statistics.vue";
import Trends from "../../components/attendance/overview/trends.vue";
import Detail from "@admin/components/attendance/overview/detail.vue";
// 获取请假信息
import apiClient from "@/api/axios";
import { useRequest } from "vue-request";
import { ref, watch } from "vue";
import type { ApiResponseData } from "@/types/api-response";
import type { AttendanceOverview } from "@/types/attendance-overview";

const date = ref();
watch(
  () => date.value,
  () => {
    run();
  },
);

const getLeaveInfo = () => {
  return apiClient({
    url: `/Attendance/getAttendanceInfoBySingleTime`,
    method: "get",
    params: {
      group: "全部",
      time: String(date.value ? new Date(date.value) : new Date()),
    },
  });
};
const { data, run } =
  useRequest<ApiResponseData<AttendanceOverview>>(getLeaveInfo);

getLeaveInfo();

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
