<template>
<div>
    考勤统计
</div>

</template>

<script setup lang='ts'>
import { useApiRequest } from '@/utils/httpClient';
import type { ApiResponseData } from "@/types/api-response";
import { onMounted,watch} from "vue";
const {
  data: Data,
  loading: Loading,
  error: Error,
  fetchData: getMessage,
} = useApiRequest<ApiResponseData<any>>({
//   url:"/Attendance/getAttendanceInfoBySingleTime",
url: "/Attendance/getCheckInfoByTimeSpan",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

watch(Data, (newValue) => {
  console.table(newValue);
});
watch(Error, (newValue) => {
    console.log(newValue);
})
watch(Loading, (newValue) => {
  console.log(newValue);
});

onMounted(() => {
  getMessage({ params: {
    group:"全部",
    // time:new Date("2025-04-01").toString(),
    from:new Date("2025-04-01").toString(),
    to:new Date("2025-04-04").toString(),
    pageNumber:1,
    pageSize:10
  }
  });
});
</script>

<style scoped>

</style>