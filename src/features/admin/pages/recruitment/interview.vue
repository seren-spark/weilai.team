<script setup lang="ts">
import {
  FilterConditionMoreSelect,
  FilterCondition,
  DataRangePicker,
  ToggleShow,
  MessageCard,
  AutoLongerInput,
} from "@/components/recruitment";
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import {
  getAllGrade,
  getAllInterviewUser,
} from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import type { IGradeData } from "@/types/recruitmentType";
import { interviewStatusMap, interviewStatus } from "@/types/recruitmentType";
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
const messageCard = ref([
  // {
  //   ApplyUserId: "1",
  //   InterviewTime: "2024-12-14 12:00-13:00",
  //   InterviewAddress: "北京",
  //   InterviewRound: "第一轮",
  //   InterviewName: "王科林",
  //   InterviewStatus: "待我反馈",
  //   InterviewId: "1",
  //   InterviewOfficerFirst: {
  //     name: "张三",
  //     id: "1",
  //   },
  //   InterviewOfficerSecond: {
  //    name:"李四",
  //     id: "2",
  //   },
  //   InterviewOfficerThird: {
  //     name: "王五",
  //     id: "3",
  //   },
  // },
  // {
  //   ApplyUserId: "2",
  //   InterviewTime: "2024-12-12 13:00-14:00",
  //   InterviewAddress: "北京",
  //   InterviewRound: "第一轮",
  //   InterviewName: "刘志文",
  //   InterviewStatus: "待我反馈",
  //   InterviewId: "2",
  //   InterviewOfficerFirst: {
  //     name: "张三",
  //     id: "1",
  //   },
  //   InterviewOfficerSecond: {
  //    name: "李四",
  //     id: "2",
  //   },
  //   InterviewOfficerThird: {
  //     name: "王五",
  //     id: "3",
  //   },
  // }
]);
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

const getAllInterviewUserParams = computed(() => {
  return {
    pageNo: 1,
    pageSize: 100,
    status: toggleShowStatus.value,
  };
});

//获取展示卡片的信息
watch(
  toggleShowStatus,
  () => {
    const { data, error, loading } = useRequest(() =>
      getAllInterviewUser(getAllInterviewUserParams.value),
    );
    watch(
      [data, error, loading],
      ([newData, newError]) => {
        if (newData?.data.data.data) {
          console.log(newData.data.data.data);
          messageCard.value = newData.data.data.data.map((card: any) => {
            return {
              ApplyUserId: card.userId,
              InterviewTime: card.interviewTime,
              InterviewAddress: card.place,
              InterviewRound: card.interviewRound || "一面",
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

const dateRange = ref(null); // 初始化日期范围

// 获得子组件的日期参数
const handleDateRangeUpdate = (newDateRange: any) => {
  dateRange.value = newDateRange;
  // 在这里可以对日期范围进行处理，例如发送请求或更新其他组件的数据
  handleDateRange();
};
//对dateRange进行处理
const handleDateRange = () => {
  // 在这里处理日期范围，例如将日期范围转换为字符串格式
  if (!dateRange.value) {
    return;
  }
  const startDate = Reflect.get(dateRange.value, "start");
  const endDate = Reflect.get(dateRange.value, "end");
  const formattedRange = `${startDate} - ${endDate}`;
  console.log(formattedRange);
};

const searchValue = ref("");
const handleInput = (value: string) => {
  searchValue.value = value;
  console.log(searchValue);
};

const handleFilterCondition = (value: string, title: string) => {
  console.log(value, title);
};

const filterMoreSeletedItem = ref({
  title: "面试官",
  label: "选择面试官",
  drapdownItems: [
    {
      condition: "王科林",
      isSeleted: false,
    },
    {
      condition: "刘志文",
      isSeleted: false,
    },
    {
      condition: "贝利亚",
      isSeleted: false,
    },
    {
      condition: "张三",
      isSeleted: false,
    },
    {
      condition: "李四",
      isSeleted: false,
    },
    {
      condition: "王五",
      isSeleted: false,
    },
    {
      condition: "赵六",
      isSeleted: false,
    },
  ],
});

const isReset = ref(false);
//重置筛选条件
const resetCondition = () => {
  // 在这里处理重置条件的逻辑，例如清空输入框或其他组件的数据
  filterOneSeletedItems.value.forEach((item) => {
    item.ref = "init";
  });
  filterMoreSeletedItem.value.drapdownItems.forEach((item) => {
    item.isSeleted = false;
  });
  dateRange.value = null;
  isReset.value = true;
  setTimeout(() => {
    isReset.value = false;
  }, 500);
};
</script>

<template>
  <div class="content">
    <div class="filter-items">
      <FilterCondition
        :items-obj-arr="filterOneSeletedItems"
        @filter_condition="handleFilterCondition"
      />
      <FilterConditionMoreSelect
        class="mr-4 min-w-[300px]"
        :filter-more-seleted-item="filterMoreSeletedItem"
      />

      <div class="date-picker">
        <DataRangePicker
          :date-range="dateRange"
          :is-reset="isReset"
          @update-date-range="handleDateRangeUpdate"
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
      <MessageCard
        v-for="(item, index) in messageCard"
        :key="index"
        :card-message="normalizeInterviewCard(item)"
      ></MessageCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";
</style>
