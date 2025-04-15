<script setup lang="ts">
import {
  FilterCondition,
  DataRangePicker,
  ToggleShow,
  // DataTable,
  Pagination,
  AutoLongerInput,
  UpdateStatus,
  UpdateApplyUserInfo,
  ArrangeInterviewer,
} from "@/components/recruitment";
import { DataTable } from "@/components/common";
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
import { ref, watch, computed } from "vue";
import {
  getAllApplyUser,
  getAllGrade,
  getResumeById,
  deleteApplyUserById,
} from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TableCell,
} from "@/components/ui/table";
import type {
  IAllApplyUserVO,
  IAllApplyUserDTO,
  IGradeData,
} from "@/types/recruitmentType";
import { interviewStatusMap } from "@/types/recruitmentType";
import { showConfirm } from "@/composables/useConfirm";
import { useAlert } from "@/composables/useAlert";
import * as XLSX from "xlsx";
const { showAlert } = useAlert();

const searchValue = ref("");
const handleInput = (value: string) => {
  console.log(value);
  if (value === "") {
    searchValue.value = "";
    return;
  }
  searchValue.value = value;
};

//下拉过滤框
const candidates_itemsObjArr = ref([
  {
    title: "年级",
    label: "选择要筛选的年级",
    ref: "init",
    arr: [],
  },
  {
    title: "性别",
    label: "选择要筛选的性别",
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

//处理筛选条件
const handleFilterConditions = (value: string, title: string) => {
  if (title === "年级") {
    grade.value = value;
    return;
  } else if (title === "性别") {
    sex.value = value;
    return;
  }
};

const dateRange = ref(null); // 初始化日期范围

// 获得子组件的日期参数
const handleDateRangeUpdate = (newDateRange: never) => {
  dateRange.value = newDateRange;
  handleDateRange();
};
let formattedRange = "";
let startTime = ref<string>("");
let endTime = ref<string>("");
//对dateRange进行处理
const handleDateRange = () => {
  // 将日期范围转换为字符串格式
  if (!dateRange.value) {
    return;
  }
  const startDate = Reflect.get(dateRange.value, "start");
  const endDate = Reflect.get(dateRange.value, "end");
  formattedRange = `${startDate}@${endDate}`;
  const [start, end] = formattedRange.split("@");
  startTime.value = start;
  endTime.value = end;
};

const isReset = ref(false);
//重置筛选条件
const resetCondition = () => {
  // 在这里处理重置条件的逻辑，例如清空输入框或其他组件的数据
  candidates_itemsObjArr.value.forEach((item) => {
    item.ref = "init";
  });
  grade.value = "";
  sex.value = "";
  dateRange.value = null;
  startTime.value = "";
  endTime.value = "";
  searchValue.value = "";
  isReset.value = true;
  setTimeout(() => {
    isReset.value = false;
  }, 500);
};

//切换框
const toggleItems = ref([
  {
    index: 0,
    title: "待安排",
    isActive: true,
  },
  {
    index: 1,
    title: "待面试",
    isActive: false,
  },
  {
    index: 2,
    title: "已录取",
    isActive: false,
  },
  {
    index: 3,
    title: "已淘汰",
    isActive: false,
  },
]);

const tableData = ref(<IAllApplyUserVO[]>[]);
const pageSize = ref(6);
const pageNo = ref(1);
const total = ref(0);
const status = ref(0);

//从分页组件拿到页码信息并更新
const changePage = (newPage: number) => {
  pageNo.value = newPage;
};
//筛选状态
const handleToggleShowStatus = (newStatus: number) => {
  status.value = newStatus;
};

const headers = ref([
  {
    title: "姓名",
    key: "name",
  },
  {
    title: "年级",
    key: "session",
  },
  {
    title: "性别",
    key: "gender",
  },
  {
    title: "班级",
    key: "clazz",
  },
  {
    title: "学号",
    key: "studentId",
  },
  {
    title: "QQ",
    key: "QQ",
  },
  {
    title: "邮箱",
    key: "email",
  },
  {
    title: "状态",
    key: "state",
  },
]);
//表格操作事件

// 查看简历 \/
const viewResume = (id: string) => {
  const { data, error } = useRequest(() => getResumeById({ id }));
  watch([data, error], ([newData, newError]) => {
    if (newError) {
      console.log("请求失败:", newError);
      return;
    }
    if (newData) {
      window.open(newData.data.data, "_blank");
    }
  });
};
// 编辑
const currentUpdateApplyUserId = ref("");
const tableEdit = (id: string) => {
  updateApplyUserInfo.value = true;
  currentUpdateApplyUserId.value = id;
};

// 安排面试
const currentArrangeInterviewId = ref("");
const currentArrangeInterviewName = ref<string>("");
const arrangeInterview = (id: string, name?: string) => {
  arrangeInterviewerDialog.value = true;
  currentArrangeInterviewId.value = id;
  currentArrangeInterviewName.value = name || "";
};

// 删除候选人
const DeleteCandidate = (id: string) => {
  confirmDeleteCandidate(id);
};
const confirmDeleteCandidate = (id: string) => {
  showConfirm({
    title: "系统提示",
    content: "确定删除该用户吗？",
  })
    .then(() => {
      const { data, error } = useRequest(() => deleteApplyUserById({ id }));
      watch(
        [data, error],
        ([newData, newError]) => {
          if (newError) {
            showAlert("删除失败", "error");
            return;
          }
          if (newData) {
            showAlert("删除成功", "pass");
            // 刷新表格数据
            updateParameter.value = !updateParameter.value;
          }
        },
        { immediate: true },
      );
    })
    .catch(() => {
      console.log("取消删除");
    });
};
//为表格传递操作项和图标
const actionItems = ref([
  {
    title: "查看简历",
    icon: "tabler:eye",
    onclick: viewResume,
  },
  {
    title: "编辑",
    icon: "tabler:pencil",
    onclick: tableEdit,
  },
  {
    title: "安排面试",
    icon: "tabler:calendar-check",
    onclick: arrangeInterview,
  },
  // {
  //   title: "淘汰",
  //   icon: "tabler:cross",
  //   onclick: eliminateCandidate,
  // },
  {
    title: "删除候选人",
    icon: "tabler:trash",
    onclick: DeleteCandidate,
  },
]);
// const currentTableData=ref({
//   id:"",
//   name:""
// })
// const getCurrentTableData=(id:string,name:string)=>{
//   currentTableData.value={
//     id,
//     name
//   }
// }
const actions = computed(() => {
  if(status.value === 0){
    return actionItems.value
  }
  else{
    return actionItems.value.filter((item, index) => index !== 2)
  }
});

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
        candidates_itemsObjArr.value[0].arr = newData.data.data.data.map(
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

const grade = ref<string>("");
const sex = ref<string>("");

watch([grade, sex, startTime, endTime, searchValue, status], () => {
  pageNo.value = 1;
});

const getAllApplyUserRequestParams = computed(() => ({
  pageNo: pageNo.value,
  pageSize: pageSize.value,
  status: status.value,
  condition: searchValue.value,
  grade: grade.value,
  sex: sex.value,
  startTime: startTime.value,
  endTime: endTime.value,
}));

//设置一个状态变量，用来强制更新
const updateParameter = ref<boolean>(false);

watch(
  [getAllApplyUserRequestParams, updateParameter],
  ([newParams]) => {
    const { data, error } = useRequest(() => getAllApplyUser(newParams));
    watch(
      [data, error],
      ([newData, newError]) => {
        if (newError) {
          console.error("请求失败:", newError);
          return;
        }
        if (newData) {
          total.value = newData.data.data.total;
          //拿到数据后逆序渲染
          tableData.value = newData.data.data.data.map(
            (item: IAllApplyUserDTO) => {
              return {
                id: item.id,
                name: item.name,
                session: item.grade,
                gender: item.sex,
                clazz: item.clazz,
                studentId: item.studentId,
                QQ: item.qqNumber,
                email: item.email,
                state: interviewStatusMap[item.status],
              };
            },
          );
        }
      },
      {
        immediate: true,
      },
    );
  },
  {
    immediate: true,
  },
);

const excelHeaders = ref([
  {
    title: "姓名",
    key: "name",
  },
  {
    title: "年级",
    key: "session",
  },
  {
    title: "班级",
    key: "clazz",
  },
  {
    title: "性别",
    key: "gender",
  },
  {
    title: "状态",
    key: "state",
  },
]);

const exportToExcelFunction = <T>(data: Array<T>) => {
  const filteredData = data.map((item: T) => {
    const newItem: Partial<T> = {};
    excelHeaders.value.forEach((Header) => {
      newItem[Header.key as keyof T] = item[Header.key as keyof T];
    });
    return newItem;
  });

  // 创建一个工作簿
  const workbook = XLSX.utils.book_new();

  // 将表格数据转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(filteredData);

  // 自定义导出表格的表头，使用组件内定义的 headers 中的 title 字段
  const customHeaders = excelHeaders.value.map((item) => item.title);

  // 在工作表第一行添加自定义表头
  XLSX.utils.sheet_add_aoa(worksheet, [customHeaders], { origin: "A1" });

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 生成 Excel 文件并触发下载
  XLSX.writeFile(workbook, "导出信息表.xlsx");
};

//导出excel表格
const exportExcel = () => {
  exportToExcelFunction(tableData.value);
};

//dialog
const updateStatus = ref(false);
const currentTableSelectIds = ref<string[]>([]);
//修改状态
const handleTableSelectIds = (ids: string[]) => {
  currentTableSelectIds.value = ids;
};
const handleEditStatus = () => {
  if (currentTableSelectIds.value.length === 0) {
    showAlert("请选择候选人以更改状态", "error");
    return;
  }
  //把修改状态的弹窗组件展示
  updateStatus.value = true;
};

const refreshPage = () => {
  updateParameter.value = !updateParameter.value;
};

const updateApplyUserInfo = ref(false);
const arrangeInterviewerDialog = ref(false);
</script>

<template>
  <div class="content">
    <ArrangeInterviewer
      :id="currentArrangeInterviewId"
      :name="currentArrangeInterviewName"
      :is-open="arrangeInterviewerDialog"
      @close="arrangeInterviewerDialog = false"
    />
    <UpdateApplyUserInfo
      :id="currentUpdateApplyUserId"
      :is-open="updateApplyUserInfo"
      @close="updateApplyUserInfo = false"
    />
    <UpdateStatus
      :ids="currentTableSelectIds"
      :is-open="updateStatus"
      @close="updateStatus = false"
      @refresh-page="refreshPage"
    />

    <div class="filter-items">
      <FilterCondition
        :items-obj-arr="candidates_itemsObjArr"
        @filter_condition="handleFilterConditions"
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
          placeholder-text="搜索候选人："
          @input_src="handleInput"
        />
      </div>
    </div>
    <div class="toggle-handle">
      <ToggleShow
        :toggle-items="toggleItems"
        @transfer-toggle-show-status="handleToggleShowStatus"
      />

      <div class="handle-btns">
        <Button type="primary" class="btn-style" @click="handleEditStatus"
          >修改状态</Button
        >
        <Button type="primary" class="btn-style" @click="exportExcel"
          >结果导出</Button
        >
      </div>
    </div>

    <div class="data-table">
      <DataTable
        :rows="tableData"
        :columns="headers"
        :is-show-checkbox=true
        :actions="actions"
        @send-selected-ids="handleTableSelectIds"
      >
        <template #action="{ currentRow }">
          <TableCell class="font-medium">
            <Popover>
              <PopoverTrigger>
                <Icon
                  icon="tabler:dots"
                  style="display: inline-block; font-size: 1rem; cursor: pointer;"
                />
              </PopoverTrigger>
              <PopoverContent class="popover-content" style="z-index: 10;width: 10rem;">
                <div>
                  <div
                    v-for="(i, index) in actions"
                    :key="index"
                    class="pop-content-item"
                    @click="i.onclick(currentRow.id, currentRow.name)"
                  >
                    <Icon
                      :key="index"
                      :icon="i.icon"
                      style="display: inline-block; font-size: 18px; cursor: pointer;"
                    />
                    <span class="pop-content-item-text">{{ i.title }}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TableCell>
        </template>
      </DataTable>
      <div class="pagination-container">
        <Pagination
          :total-items="total"
          :page-size="pageSize"
          @update:page="changePage"
        >
        </Pagination>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";
.popover-content {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px #ccc;
  position: relative;
  left: -40px;
  top: 0;
  z-index: 39;
  .pop-content-item {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    &:hover {
      background-color: var(--accent);
    }

    .pop-content-item-text {
      font-size: 14px;
      margin-left: 10px;
    }
  }
}
</style>
