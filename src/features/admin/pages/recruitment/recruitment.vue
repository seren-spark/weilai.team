<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// 引入组件
import {
  MessageCard,
  ToggleShow,
  QuickShowCard,
  ShortcutOperation,
} from "@/components/recruitment";
import { useRequest } from "vue-request";
import {
  getMyInterviewRecord,
  getInterviewCount,
} from "@/composables/useRecruitmentRequest";
import { interviewStatus, interviewStatusMap } from "@/types/recruitmentType";
// 引入vue函数
import { ref, watch } from "vue";

// 定义切换组件的基本信息 传给子组件

//切换框的数据展示状态参量
const toggleShowStatus = ref<string>("1");
const handleToggleShowStatus = (newValue: string) => {
  toggleShowStatus.value = newValue;
};
const toggleItems = ref([
  {
    index: 1,
    title: "待我反馈",
    isActive: true,
  },
  {
    index: 2,
    title: "我录取的",
    isActive: false,
  },
  {
    index: 3,
    title: "我淘汰的",
    isActive: false,
  },
]);

// 卡片信息展示
const messageCard = ref([]);
// 确保所有 id 都是字符串
const normalizeInterviewCard = (card: any) => ({
  ...card,
  InterviewOfficerSecond: {
    ...card.InterviewOfficerSecond,
    id: card.InterviewOfficerSecond.id || "",
  },
  InterviewOfficerThird: {
    ...card.InterviewOfficerThird,
    id: card.InterviewOfficerThird.id || "",
  },
});
const refreshPageParams = ref(false);
watch(
  [toggleShowStatus, refreshPageParams],
  ([newStatus]) => {
    const { data, error, loading } = useRequest(() =>
      getMyInterviewRecord({ pageNo: 1, pageSize: 100, status: newStatus }),
    );
    watch(
      [data, error, loading],
      ([newData, newError, loading]) => {
        console.log(loading);
        if (newData?.data.data.data) {
          messageCard.value = newData.data.data.data.map((card: any) => {
            return {
              userId: card.userId,
              startTime: card.startTime,
              endTime: card.endTime,
              InterviewAddress: card.place,
              InterviewRound: card.round,
              InterviewName: card.name,
              InterviewStatus:
                interviewStatusMap[card.interviewStatus as interviewStatus],
              InterviewId: card.id,
              InterviewOfficerFirst: {
                name: card.firstHr?.name,
                id: card.firstHr?.id || "",
              },
              InterviewOfficerThird: {
                name: card.thirdHr?.name,
                id: card.thirdHr?.id || "",
              },
              InterviewOfficerSecond: {
                name: card.secondHr?.name,
                id: card.secondHr?.id || "",
              },
            };
          });
        }
        if (newError) {
          console.log(newError);
        }
        // if (loading) {
        //   console.log(loading);
        // }
        return;
      },
      { immediate: true },
    );
  },
  {
    immediate: true,
  },
);
//获取待安排和已录取的人数
const fetchAllInterviewCount = () => {
  const {
    data: countOne,
    error: errorOne,
    loading: loadingOne,
  } = useRequest(() => getInterviewCount({ status: 0 }));
  watch(
    [countOne, errorOne, loadingOne],
    ([newData, newError, loading]) => {
      console.log(loading);
      if (newData?.data.data) {
        quickShowItems.value[0].number = newData.data.data;
      }
      if (newError) {
        console.log(newError);
      }
      // if (loading) {
      //   console.log(loading);
      // }
      return;
    },
    { immediate: true },
  );
  const {
    data: countTwo,
    error: errorTwo,
    loading: loadingTwo,
  } = useRequest(() => getInterviewCount({ status: 2 }));
  watch(
    [countTwo, errorTwo, loadingTwo],
    ([newData, newError, loading]) => {
      console.log(loading);
      if (newData?.data.data) {
        quickShowItems.value[1].number = newData.data.data;
      }
      if (newError) {
        console.log(newError);
      }
      // if (loading) {
      //   console.log(loading);  }
      return;
    },
    { immediate: true },
  );
};
fetchAllInterviewCount();
const quickShowItems = ref([
  {
    label: "待安排",
    number: 0,
  },
  {
    label: "已录取",
    number: 0,
  },
]);
</script>

<template>
  <div class="main">
    <div class="left-side">
      <div
        v-for="(item, index) in quickShowItems"
        :key="index"
        class="quick-show"
      >
        <QuickShowCard :quick-show-item="item"></QuickShowCard>
      </div>

      <div class="quick-control">
        <p class="quick-control-title">快捷操作</p>
        <div class="quick-control-content">
          <ShortcutOperation class="quick-control-item" />
          <ShortcutOperation class="quick-control-item" />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-container">
        <div class="toggle-outer long-dashed-border">
          <ToggleShow
            :toggle-items="toggleItems"
            @transfer-toggle-show-status="handleToggleShowStatus"
          />
        </div>
        <div class="main-content-show">
          <div v-show="messageCard.length === 0" class="no-data">暂无数据</div>
          <MessageCard
            v-for="(item, index) in messageCard"
            :key="index"
            :card-message="normalizeInterviewCard(item)"
            @refresh-page="refreshPageParams = !refreshPageParams"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "@/assets/styles";
@use "@/assets/styles/recruitment.scss";

.main {
  width: 100%;
  height: auto;
  background-color: #fff;
  position: relative;
  display: grid;
  grid-template-columns: 150px calc(100% - 170px);
  gap: 30px;
  top: 20px;
  box-sizing: content-box;
  margin-bottom: 40px;
  @media screen and (min-width: 1300px) {
    grid-template-columns: 200px calc(100% - 220px);
  }
  @media screen and (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

//.region 左侧边栏
.left-side {
  width: 100%;
  height: auto;
  background-color: #fff;
  position: relative;
  margin-left: 2em;
  display: inline-block;
  margin-top: 30px;
  border: none;
  @media screen and (max-width: 1100px) {
    display: none;
  }
  .quick-control {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    top: 30px;
    .quick-control-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
      margin-left: 10px;
    }
    .quick-control-content {
      position: relative;
      top: 20px;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .quick-control-item {
        width: 100%;
        min-height: 60px;
        margin-bottom: 10px;
      }
    }
  }
}

//.endregion

//.region 中间内容区
.content {
  width: 100%;
  background-color: var(--background);
  position: relative;
  top: 20px;
  left: 20px;
  border: none;
}
.content-container {
  width: 100%;
  height: auto;
  .toggle-outer {
    width: 100%;
    height: 80px;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}
//.endregion
</style>
