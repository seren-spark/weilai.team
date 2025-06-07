<template>
<div class="content">
<DataTable
  :columns="columns"
  :rows="rows"
  :is-show-checkbox=false
/>
<div class="table-footer">
  <button
    :class="{'btn-style': true,'btn-disabled': pageNo <= 1,}"
    :disabled="pageNo <= 1"
    @click="pageNo--"
  >
    Last
  </button>
  <span style="text-align: center; vertical-align: middle;">{{ pageNo }}</span>
  <button
    :class="{'btn-style': true,'btn-disabled': rows.length < 10,}"
    :disabled="rows.length < 10"
    @click="pageNo++"
  >
    Next
  </button>
</div>
</div>
</template>

<script setup lang='ts'>
import { useApiRequest } from '@/utils/httpClient';
import type { ApiResponseData } from "@/types/api-response";
import { onMounted,ref,watch} from "vue";
import { DataTable } from '@/components/common/table';
import { columns ,CheckTypeMap,CheckType,TimeResultStatus,TimeResultStatusMap }from "./check_in-statistics-consts";
interface dataDTO {
  name: string;
  checkType: CheckType;
  group: string;
  baseCheckTime: string;
  timeResult: TimeResultStatus;
  userId: string;
  workDate: string;
  userCheckTime: string;
}
interface CheckInItem {
  name: string;
  checkType: string;
  group: string;
  baseCheckTime: string;
  timeResult: string;
  id: string;
  workDate: string;
  userCheckTime: string;
}
const {
  data: Data,
  loading: Loading,
  error: Error,
  fetchData: getMessage,
} = useApiRequest<ApiResponseData<dataDTO[]>>({
url: "/Attendance/getCheckInfoByTimeSpan",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

const timeFormat = (time: string) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const pageNo=ref(1);
const rows = ref<CheckInItem[]>([]);

watch(Data, (newValue) => {
  console.log(newValue);
  if (newValue?.data && newValue.code === 200) {
    rows.value = newValue.data.map((item) => ({
      name: item.name,
      checkType: CheckTypeMap[item.checkType],
      group: item.group,
      baseCheckTime: timeFormat(item.baseCheckTime),
      timeResult: TimeResultStatusMap[item.timeResult],
      userCheckTime: timeFormat(item.userCheckTime),
      id: item.userId,
      workDate: timeFormat(item.workDate),
    }));
  } else {
    rows.value = [];
  }
});
watch(Error, (newValue) => {
    console.log(newValue);
})
watch(Loading, (newValue) => {
  console.log(newValue);
});



onMounted(() => {
watch(pageNo, (newValue) => {
  rows.value = [];
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  getMessage({ params: {
    group: "全部",
    from: currentDate.toString(),
    to: sevenDaysAgo.toString(),
    pageNumber:newValue,
    pageSize:10,
  }
  });
}, { immediate: true });

});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";
.table-footer {
  width: 100%;
  display: flex;
  justify-content:flex-end;
  align-items: center;
  align-content: center;
  margin-top: 20px;
  font-size: 0.8rem;
  gap: 1rem;
  span{
    display: block;
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    border: 1px solid #ccc;
    border-radius: 50%;
    background-color: var(--primary-foreground);
    color: white;
  }
}

</style>