<script setup lang="ts">
import {
  FilterCondition,
  DataRangePicker,
  // MessageCard,
  AutoLongerInput,
} from "@/components/recruitment";

import { Icon } from "@iconify/vue";

import { ref } from "vue";

const recruitmentRecord_itemsObjArr = ref([
  {
    id: 0,
    title: "年级",
    label: "选择年级",
    ref: "init",
    arr: [
      {
        condition: "24级",
      },
      {
        condition: "23级",
      },
      {
        condition: "22级",
      },
      {
        condition: "21级",
      },
    ],
  },
  {
    id: 1,
    title: "专业",
    label: "选择专业",
    ref: "init",
    arr: [
      {
        condition: "计科",
      },
      {
        condition: "信息工程",
      },
      {
        condition: "物联网",
      },
      {
        condition: "网络安全",
      },
    ],
  },
  {
    id: 2,
    title: "性别",
    label: "选择性别",
    ref: "init",
    arr: [
      {
        condition: "男",
      },
      {
        condition: "女",
      },
    ],
  },
]);

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

//重置筛选条件
const resetCondition = () => {
  // 在这里处理重置条件的逻辑，例如清空输入框或其他组件的数据
  recruitmentRecord_itemsObjArr.value.forEach((item) => {
    item.ref = "init";
  });
  dateRange.value = null;
};
const handleFilterCondition = (value: string, title: string) => {
  console.log(value, title);
};

const searchValue = ref("");

const handleInput = (value: string) => {
  searchValue.value = value;
  console.log(searchValue);
};
const isReset = ref(false);
</script>

<template>
  <div class="content">
    <div class="filter-items">
      <FilterCondition
        :items-obj-arr="recruitmentRecord_itemsObjArr"
        @filter_condition="handleFilterCondition"
      ></FilterCondition>
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
          placeholder-text="搜索人员记录："
          @input_src="handleInput"
        />
      </div>
    </div>
    <div class="main-content-show"></div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/recruitment";
// .filter-condition{
//     display: flex;
//     flex-direction: row;
//     height: 80px;
//     position: relative;
//    .filter-items{
//         display: flex;
//         flex-direction: row;
//         justify-content:flex-start;
//         align-items: center;
//         height: 100%;
//    }
//    .reset{
//     display: flex;
//     flex-direction: row;
//     justify-content: center;
//     align-items: center;
//     width: 150px;
//     height: 40px;
//     cursor: pointer;
//    }
//    .search-input {
//         position: absolute;
//         right: 100px;
//     }
//    }
</style>
