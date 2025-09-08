<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import NoData from "@/components/loading/NoData.vue";
import {
  MessageCard,
  ToggleShow,
  QuickShowCard,
  ShortcutOperation,
} from "@/components/recruitment";
import { interviewStatus, interviewStatusMap } from "@/types/recruitmentType";
import { ref, watch, onMounted ,computed} from "vue";
import { useApiRequest } from "@/utils/httpClient";
import RecruitmentApi from "@/constants/recruitment-apis";
import type { ApiResponseData } from "@/types/api-response";
import { ArrangeInterviewer } from "@/components/recruitment";
import { useAlert } from "@/composables/useAlert";

const { showAlert } = useAlert();

//切换框的状态参量
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
const messageCard = ref<Record<string, any>[]>([]);
const refreshPage = ref(false);
const messageCardMap = computed(() => {
  return messageCard.value.map((card: any) => {
    return {
      ApplyUserId: card.userId,
      startTime: card.startTime,
      endTime: card.endTime,
      InterviewAddress: card.place,
      InterviewRound: card.round,
      InterviewName: card.name,
      InterviewStatus: interviewStatusMap[card.interviewStatus as interviewStatus],
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
});

const {data:aboutMeData,fetchData:fetchAboutMeData} = useApiRequest<ApiResponseData<Record<string, any>>>({
  url: RecruitmentApi.getMyInterviewRecord.split(" ")[0],
  method: RecruitmentApi.getMyInterviewRecord.split(" ")[1],
});
const getMyInterviewRecord = async (status: string) => {
  try {
    await fetchAboutMeData({
      params: {
        pageNo: 1,
        pageSize: 100,
        status: status,
      },
    });
    if (aboutMeData.value?.data?.data) {
      messageCard.value = aboutMeData.value.data.data;
    } else {
      messageCard.value = [];
    }
  } catch (err) {
    showAlert("获取面试记录失败", "error");
    console.error("获取面试记录失败:", err);
  }
};
watch(
  refreshPage,
  () => {
    getMyInterviewRecord(toggleShowStatus.value);
  }
);
// 监听切换框的状态变化
watch(
  toggleShowStatus,
  () => {
    getMyInterviewRecord(toggleShowStatus.value);
  }
);


//获取待安排和已录取的人数
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

const { data: toBeArrangedCount, fetchData: fetchtoBeArrangedCount } =
  useApiRequest<ApiResponseData<number>>({
    url: RecruitmentApi.getCount.split(" ")[0].replace("{status}", "0"),
    method: RecruitmentApi.getCount.split(" ")[1],
  });
const { data: admittedCount, fetchData: fetchAdmittedCount } =
  useApiRequest<ApiResponseData<number>>({
    url: RecruitmentApi.getCount.split(" ")[0].replace("{status}", "2"),
    method: RecruitmentApi.getCount.split(" ")[1],
  });
const getCount = async () => {
  try {
    await fetchtoBeArrangedCount();
    await fetchAdmittedCount();
    if (toBeArrangedCount.value !== null && admittedCount.value !== null) {
    quickShowItems.value[0].number =
        toBeArrangedCount.value.data || 0;
      quickShowItems.value[1].number =
        admittedCount.value.data || 0;
    } else {
      showAlert("获取人数失败", "waring");
    }
  } catch (err) {
     showAlert("获取待安排人数时出错:", "error");
    console.error("获取待安排人数时出错:", err);
  }
};

const { data: nameList, fetchData: getName } = useApiRequest<
  ApiResponseData<{ id: string; name: string }[]>
>({
  url: RecruitmentApi.getName.split(" ")[0],
  method: RecruitmentApi.getName.split(" ")[1],
});
// 获取面试官列表
const { data: interviewerList, fetchData: getInterviewerList } = useApiRequest<
  ApiResponseData<any>
>({
  url: RecruitmentApi.getAllInterviewer.split(" ")[0],
  method: RecruitmentApi.getAllInterviewer.split(" ")[1],
  params: {
    pageNo: 1,
    pageSize: 100,
  },
});
// 安排面试
const arrangeDialogIsOpen = ref<boolean>(false);
const arrangeId = ref<string>("");
const arrangeName = ref<string>("");
const interviewers = ref<{ id: string; label: string }[]>([]);
const handleSendIdAndName = (id: string, name: string) => {
  if (!interviewerList.value) {
    showAlert("获取面试官信息失败", "error");
    return;
  }
  interviewers.value = interviewerList.value.data?.data?.map((item: any) => {
    return {
      id: item.id,
      label: item.name,
    };
  }) || [];
  arrangeDialogIsOpen.value = true;
  arrangeId.value = id;
  arrangeName.value = name;
};
const refreshData = () => {
  getName();
  getCount();
  getMyInterviewRecord(toggleShowStatus.value);
};

const {error: arrangeError, fetchData: fetchArrangeData} = useApiRequest<ApiResponseData<any>>({
  url: RecruitmentApi.arrangeInterviewer.split(" ")[0],
  method: RecruitmentApi.arrangeInterviewer.split(" ")[1],
  headers: {
    "Content-Type": "application/json",
  }
});
const arrangeSubmit = async (data: any) => {
  const { userId, place, startTime, endTime, firstHr, secondHr, thirdHr } = data;

  await fetchArrangeData(
    {
      data: {
        userId: userId,
        place: place,
        startTime: startTime,
        endTime: endTime,
        firstHr: firstHr,
        secondHr: secondHr,
        thirdHr: thirdHr,
      },
    }
  );
  if (arrangeError.value) {
    showAlert("安排失败", "error");
  } else {
    showAlert("安排成功", "pass");
    arrangeDialogIsOpen.value = false;
    refreshData();
  }


};
onMounted(() => {
  getName();
  getCount();
  getMyInterviewRecord(toggleShowStatus.value);
  getInterviewerList();
});
</script>

<template>
    <ArrangeInterviewer
      :id="arrangeId"
      :is-open="arrangeDialogIsOpen"
      :name="arrangeName"
      :interviewers="interviewers"
      @close="arrangeDialogIsOpen = false"
      @refresh="refreshData"
      @submit="arrangeSubmit"
    />
  <div class="main">
    <div class="left-side">
      <div
        class="quick-show"
      >
       <QuickShowCard :quick-show-item="quickShowItems[0]" @click="$router.push('/admin/recruitment/candidates')"/>
       <QuickShowCard :quick-show-item="quickShowItems[1]" @click="$router.push('/admin/recruitment/candidates')"/>
      </div>

      <div class="quick-control">
        <p class="quick-control-title">快捷操作</p>
        <div class="quick-control-content">
          <ShortcutOperation
            v-for="(item, index) in nameList?.data"
            :id="item?.id"
            :key="index"
            class="quick-control-item"
            :name="item?.name"
            @send-id-and-name="handleSendIdAndName"
          />
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
          <NoData
            v-if="messageCardMap.length === 0"
            style="
              width: 100%;
              height: 150px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          />
          <MessageCard
            v-for="(item, index) in messageCardMap"
            :key="index"
            :card-message="item"
            @refresh-page="refreshPage = !refreshPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";

.main {
  margin-left: 1rem;
  width: 98%;
  height: auto;
  background-color: var(--background);
  position: relative;
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 2rem;
  @media screen and (min-width: 1300px) {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-columns: 200px minmax(0, 1fr);
  }
  @media screen and (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

//.region 左侧边栏
.left-side {
  width: 100%;
  height: auto;
  background-color: var(--background);
  position: relative;
  display: inline-flex;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  border: none;
  margin-bottom: 30px;
  @media screen and (max-width: 1100px) {
    display: none;
  }
  .quick-show {
    width: 100%;
    height: auto;
    position: relative;
  }

  .quick-control {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    top: 30px;
    margin: 2rem 0;
    scroll-behavior: smooth;
    .quick-control-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
      margin-left: 10px;
    }
    .quick-control-content {
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      max-height: 240px;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      top: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .quick-control-item {
        min-height: 60px;
        margin-bottom: 10px;
      }
    }
  }
}

//.endregion

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
