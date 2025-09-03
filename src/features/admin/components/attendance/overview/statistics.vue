<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { AttendanceOverview } from "@/types/attendance-overview";
import { computed, ref, watch } from "vue";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Dialog from "@/components/ui/dialog/Dialog.vue";

const props = defineProps<{ data: AttendanceOverview | undefined }>();

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
  return parseFloat(
    (
      (props.data?.userCountCurrent / props.data?.userCountShould) *
      100
    ).toFixed(2),
  );
});
const dialogType = ref("");
const clickModal = (type: keyof typeof dialogMap) => {
  dialogType.value = dialogMap[type];
  if (props.data) {
    dialogData.value = props.data.detail[type];
  }
};
const dialogData = ref();
const dialogMap = {
  userCurrentName: "实到",
  userLeavesName: "请假",
  userLateName: "迟到",
  userShouldName: "应到",
  userClockInName: "打卡",
  userRateName: "出勤率",
};
</script>

<template>
  <div class="statistics-container">
    <Dialog>
      <!-- 应到人数 -->
      <DialogTrigger @click="clickModal('userShouldName')">
        <Card class="supposed card selected">
          <CardHeader class="card-header">
            <span>应到人数</span>
          </CardHeader>
          <CardContent class="card-content">
            <h1>{{ data?.userCountShould }}</h1>
            &nbsp;
            <span>人</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <!-- 打卡人数 -->
      <DialogTrigger @click="clickModal('userCurrentName')">
        <Card class="clock-in card">
          <CardHeader class="card-header">
            <span>打卡人数</span>
          </CardHeader>
          <CardContent class="card-content">
            <h1>{{ data?.userCountCurrent }}</h1>
            &nbsp;
            <span>人</span>
          </CardContent>
        </Card>
      </DialogTrigger>

      <!-- 请假人数 -->
      <DialogTrigger @click="clickModal('userLeavesName')">
        <Card class="leave card">
          <CardHeader class="card-header">
            <span>请假人数</span>
          </CardHeader>
          <CardContent class="card-content">
            <h1>{{ data?.leavesUserCount }}</h1>
            &nbsp;
            <span>人</span>
          </CardContent>
        </Card>
      </DialogTrigger>

      <!-- 迟到人数 -->
      <DialogTrigger @click="clickModal('userLateName')">
        <Card class="late card">
          <CardHeader class="card-header">
            <span>迟到人数</span>
          </CardHeader>
          <CardContent class="card-content">
            <h1>{{ data?.lateUserCount }}</h1>
            &nbsp;
            <span>人</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogTrigger>
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
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ dialogType }}({{ dialogData.length }})</DialogTitle>
          <!-- <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> -->
          <div class="persons-list">
            <div class="person-item" v-for="(item, index) in dialogData">
              {{ index + 1 }}. {{ item }}
            </div>
          </div>
        </DialogHeader>

        <!-- <DialogFooter> Save changes </DialogFooter> -->
      </DialogContent>
    </Dialog>
  </div>
</template>
<style scoped lang="scss">
.statistics-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
.persons-list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 200px;
  min-height: 150px;
  .person-item {
    color: var(--secondary-foreground);
    padding: 0.5rem 1rem;
  }
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
