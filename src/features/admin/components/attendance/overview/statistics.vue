<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { AttendanceOverview } from "@/types/attendance-overview";
import { computed, watch } from "vue";

//
const props = defineProps<{ data: AttendanceOverview | undefined }>();
watch(
  () => props.data,
  (newValue) => {
    console.log(newValue);
  },
);

// 出勤率
const rate = computed(() => {
  if (
    !props.data ||
    props.data.userCountShould === 0 ||
    props.data.userCountCurrent === undefined ||
    props.data.userCountShould === undefined
  ) {
    return 0;
  }
  return (props.data?.userCountCurrent / props.data?.userCountShould) * 100;
});
</script>

<template>
  <div class="statistics-container">
    <!-- 应到人数 -->
    <Card class="supposed card selected">
      <CardHeader class="card-header">
        <span>应到人数</span>
      </CardHeader>
      <CardContent class="card-content">
        <h1>{{ data?.userCountShould }}</h1>
        &nbsp;
        <span>人</span>
      </CardContent>
      <CardFooter class="card-footer"> 较昨日 持平 </CardFooter>
    </Card>
    <!-- 打卡人数 -->
    <Card class="clock-in card">
      <CardHeader class="card-header">
        <span>打卡人数</span>
      </CardHeader>
      <CardContent class="card-content">
        <h1>{{ data?.userCountCurrent }}</h1>
        &nbsp;
        <span>人</span>
      </CardContent>
      <CardFooter class="card-footer"> 较昨日 持平 </CardFooter>
    </Card>
    <!-- 出勤率 -->
    <Card class="rate card">
      <CardHeader class="card-header">
        <span>出勤率</span>
      </CardHeader>
      <CardContent class="card-content">
        <h1>{{ rate }}</h1>
        &nbsp;
        <span>%</span>
      </CardContent>
      <CardFooter class="card-footer"> 较昨日 持平 </CardFooter>
    </Card>
    <!-- 请假人数 -->
    <Card class="leave card">
      <CardHeader class="card-header">
        <span>请假人数</span>
      </CardHeader>
      <CardContent class="card-content">
        <h1>{{ data?.leavesUserCount }}</h1>
        &nbsp;
        <span>人</span>
      </CardContent>
      <CardFooter class="card-footer"> 较昨日 持平 </CardFooter>
    </Card>
    <!-- 迟到人数 -->
    <Card class="late card">
      <CardHeader class="card-header">
        <span>迟到人数</span>
      </CardHeader>
      <CardContent class="card-content">
        <h1>{{ data?.lateUserCount }}</h1>
        &nbsp;
        <span>人</span>
      </CardContent>
      <CardFooter class="card-footer"> 较昨日 持平 </CardFooter>
    </Card>
  </div>
</template>
<style scoped lang="scss">
.statistics-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
.card {
  overflow: hidden;
  transition: all 0.3s;
  background-color: var(--secondary);
  width: 12em;
  height: 7rem;
  border: 0.1rem solid var(--border);
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  &-header {
    padding: 0.5rem 1rem;
    color: var(--card-foreground);
  }
  &-content {
    padding: 0rem 1rem;
    display: flex;
    align-items: center;
    span {
      font-size: 0.8rem;
      color: var(--secondary-foreground);
    }
  }
  &-footer {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    color: var(--secondary-foreground);
  }
  &:hover {
    cursor: pointer;
    background-color: var(--background);
    border: 0.1rem solid var(--primary-foreground);
  }
}
.selected {
  cursor: pointer;
  background-color: var(--background);
  border: 0.1rem solid var(--primary-foreground);
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    background: url("/public/ding.png") no-repeat;
    background-size: cover;
    width: 1.5rem;
    height: 1.5rem;
    top: 0;
    right: 0;
  }
}
</style>
