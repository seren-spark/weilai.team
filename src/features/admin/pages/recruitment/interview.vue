<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import NoData from "@/components/loading/NoData.vue";
import {
  FilterConditionMoreSelect,
  FilterCondition,
  ToggleShow,
  MessageCard,
  AutoLongerInput,
} from "@/components/recruitment";
import { DateRangePicker } from "@/components/common/date-picker";
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import {
  getAllGrade,
  getAllInterviewUser,
  getAllInterviewer,
} from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import type { IGradeData } from "@/types/recruitmentType";
import { interviewStatusMap, interviewStatus } from "@/types/recruitmentType";
import { getLocalTimeZone } from "@internationalized/date";
//切换框
const toggleShowStatus = ref("-1");
const handleToggleShowStatus = (val: string) => {
  toggleShowStatus.value = val;
};

const toggleItems = ref([
  {
    index: -1,
    title: "全部",
    isActive: true,
  },
  {
    index: 0,
    title: "待我面试",
    isActive: false,
  },
  {
    index: 1,
    title: "待反馈",
    isActive: false,
  },
  {
    index: 2,
    title: "已录取",
    isActive: false,
  },
  {
    index: 3,
    title: "未录取",
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

const filterOneSeletedItems = ref([
  {
    title: "年级",
    label: "选择要筛选的年级",
    ref: "init",
    arr: [],
  },
  {
    title: "面试轮次",
    label: "选择要筛选的面试轮次",
    ref: "init",
    arr: [
      {
        condition: "一面",
      },
      {
        condition: "二面",
      },
    ],
  },
]);
const handleFilterConditionOne = (value: string, title: string) => {
  // console.log(value, title);
  if (value === "init" || value === "") {
    return;
  }
  if (title === "年级") {
    searchGrade.value = value;
  }
  if (title === "面试轮次") {
    searchRound.value = value == "一面" ? "1" : "2";
  }
};

//拿到后端的所有年级数据
const fetchAllGrade = () => {
  const { data, error } = useRequest(() =>
    getAllGrade({ pageNo: 1, pageSize: 100 }),
  );
  watch(
    [data, error],
    ([newData, newError]) => {
      if (newError) {
        console.log("请求失败:", newError);
        return;
      }
      if (newData) {
        //拿到数据后逆序渲染
        filterOneSeletedItems.value[0].arr = newData.data.data.data.map(
          (item: IGradeData) => {
            return {
              condition: item.grade,
            };
          },
        );
      }
    },
    { immediate: true },
  );
};
fetchAllGrade();



const searchValue = ref("");
const handleInput = (value: string) => {
  console.log(value);
  searchValue.value = value;
};

const handleFilterCondition = (ids: string[]) => {
  InterviewOfficerIds.value = ids;
};

const filterMoreSeletedItem = ref({
  title: "面试官",
  label: "选择面试官",
  drapdownItems: [],
});
getAllInterviewer({ pageNo: 1, pageSize: 100 }).then((res) => {
  filterMoreSeletedItem.value.drapdownItems = res.data.data.data.map(
    (item: any) => {
      return {
        id: item.id,
        condition: item.name,
        isSeleted: false,
      };
    },
  );
});
function formatDateToYMD(dateObj: any) {
  if (!dateObj) return undefined;
  const date = dateObj.toDate ? dateObj.toDate(getLocalTimeZone()) : dateObj;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
const dateRange = ref({
  start: undefined,
  end: undefined,
});
const searchGrade = ref<string>();
const searchRound = ref<string>();
const InterviewOfficerIds = ref<string[]>([]);
const getAllInterviewUserParams = computed(() => {
  return {
    status: toggleShowStatus.value,
    grade: searchGrade.value,
    round: searchRound.value,
    name: searchValue.value,
    ids: [...InterviewOfficerIds.value],
    startTime: formatDateToYMD(dateRange.value.start),
    endTime: formatDateToYMD(dateRange.value.end),
  };
});

//获取展示卡片的信息
watch(
  getAllInterviewUserParams,
  () => {
    const { data, error, loading } = useRequest(() =>
      getAllInterviewUser(getAllInterviewUserParams.value),
    );
    watch(
      [data, error, loading],
      ([newData, newError]) => {
        // console.log(newData);
        if (newData?.data.data) {
          messageCard.value = newData.data.data.map((card: any) => {
            return {
              ApplyUserId: card.userId,
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
        if (loading) {
          console.log(loading);
        }
        return;
      },
      { immediate: true },
    );
  },
  {
    immediate: true,
  },
);
const resetDateRange = () => {
  dateRange.value.start = undefined;
  dateRange.value.end = undefined;
};
//重置筛选条件
const resetCondition = () => {
  // 在这里处理重置条件的逻辑，例如清空输入框或其他组件的数据
  filterOneSeletedItems.value.forEach((item) => {
    item.ref = "init";
  });
  filterMoreSeletedItem.value.drapdownItems.forEach(
    (item: { id: string; condition: string; isSeleted: boolean }) => {
      item.isSeleted = false;
    },
  );
  searchValue.value = "";
  searchGrade.value = "";
  searchRound.value = "";
  InterviewOfficerIds.value = [];
  resetDateRange();
};
</script>

<template>
  <div class="content">
    <div class="filter-items">
      <FilterCondition
        :items-obj-arr="filterOneSeletedItems"
        @filter_condition="handleFilterConditionOne"
      />
      <FilterConditionMoreSelect
        class="mr-4 min-w-[300px]"
        :filter-more-seleted-item="filterMoreSeletedItem"
        @update:selected-ids="handleFilterCondition"
      />

      <div class="date-picker">
        <DateRangePicker
         v-model="dateRange"
          @reset="resetDateRange"
        />
      </div>
      <div class="reset" @click="resetCondition">
        重置
        <Icon icon="bitcoin-icons:cross-outline" />
      </div>

      <div class="search-input">
        <AutoLongerInput
          placeholder-text="搜索候选人："
          @input_src="handleInput"
        />
      </div>
    </div>
    <div class="toggle-handle">
      <ToggleShow
        :toggle-items="toggleItems"
        @transfer-toggle-show-status="handleToggleShowStatus"
      ></ToggleShow>
    </div>
    <div class="main-content-show">
      <NoData
        v-if="messageCard.length === 0"
        style="
          width: 100%;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      />
      <MessageCard
        v-for="(item, index) in messageCard"
        :key="index"
        :card-message="normalizeInterviewCard(item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";
</style>
