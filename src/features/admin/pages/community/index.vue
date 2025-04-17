<script setup lang="ts">
import { Pagination } from "@/components/recruitment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NoData from "@/components/loading/NoData.vue";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAlert } from "@/composables/useAlert";
import { showConfirm } from "@/composables/useConfirm";
import { useDateFormatter } from "@/composables/useDateFormatter";
import { cn } from "@/lib/utils";
import router from "@/router";
import { checkType } from "@community/composables/search";
import { deletes, getAdminPost } from "@admin/composables/useCommunity";
import { Icon } from "@iconify/vue";
import { getLocalTimeZone, type DateValue } from "@internationalized/date";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRequest } from "vue-request";

import type { AdminPost, AdminResponseData } from "@/types/admin-community";

const { showAlert } = useAlert();
const { formatDatetoDay } = useDateFormatter();

const postList = ref<AdminPost[]>([]);
// 初始化数据
const isAllSelected = ref(false);
const selectType = ref("");
const selectTime = ref<string>("");
const value = ref<DateValue>();
const condition = ref("");
// 声明一个批量删除的数组
const deleteTodos = ref<Array<number>>([]);
let total = ref<number>();
let page = ref(1);
let pageSize = ref(10);
watch(value, (newVal) => {
  const selectTimeValue = newVal;
  if (selectTimeValue) {
    let { year, month, day } = selectTimeValue;
    selectTime.value = `${year}-${month}-${day} 00:00:00`;
  }
});
// 批量删除的方法

// 进行搜索
const searchArticleInAdmin = () => {
  runGetAdminPost(undefined, condition.value);
};

const { data: postData, run: runGetAdminPost } = getAdminPost();

watch(
  postData,
  () => {
    const res = postData.value as AdminResponseData;
    if (res.code == 2007) {
      postList.value = res.data.records;
      total.value = res.data.total;
      pageSize.value = res.data.size;
    }
  },
  { deep: true },
);

// 改变页数
const changePage = (newPage: number) => {
  page.value = newPage;
  isAllSelected.value = false;
};

watch(page, (newPage) => {
  runGetAdminPost(newPage);
});
// 搜索文章的方法
async function searchArticle() {
  let selectTimeValue = value.value;
  let endTime;
  if (selectTimeValue) {
    let { year, month, day } = selectTimeValue;
    selectTime.value = `${year}-${month}-${day} 00:00:00`;
    endTime = `${year}-${month}-${day + 1} 00:00:00`;
  } else {
    selectTime.value = "";
  }
  runGetAdminPost(
    page.value || 1,
    condition.value || undefined,
    selectType.value,
    selectTime.value || "",
    endTime,
  );
}
// 删除文章(单选)
const { data, run } = useRequest(deletes, { manual: true });

// 删除文章
function deleteArticles(oneId?: number) {
  if (oneId !== 0) {
    deleteTodos.value.push(oneId as number);
    const str = deleteTodos.value.join(",");
    showConfirm({ description: "一旦删除无法恢复" }).then(() => {
      run(str);
      watch(
        () => data.value,
        (newVal) => {
          console.log(newVal);
          if (newVal && newVal.code === 2002) {
            // 检查 newVal 是否存在
            showAlert("删除成功", "pass");
            postList.value = postList.value.filter((item) => item.id !== oneId);
          }
        },
      );
    });
  }
}
// 实现全选反选多选
function handleSelectAll() {
  if (postList.value.length === 0) return;
  // 全选
  postList.value.forEach((item: AdminPost) => {
    item.selected = isAllSelected.value;
  });
}
//刷新
function reset() {
  value.value = undefined;
  selectType.value = "";
  condition.value = "";
  runGetAdminPost();
}
const handleItemSelect = () => {
  isAllSelected.value = true;
  postList.value.forEach((item: AdminPost) => {
    if (!item.selected) {
      isAllSelected.value = false;
    }
  });
};
function df(date: Date, format = "yyyy - MM - dd HH:mm") {
  // 获取日期的各个部分，包括分钟
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  // 根据format字符串进行格式化，包含分钟部分
  let formattedDate = format
    .replace("yyyy", year.toString())
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("HH", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"));
  return formattedDate;
}
</script>

<template>
  <div class="content" style="display: flex; flex-wrap: wrap">
    <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs default-value="all">
        <TabsContent value="all" class="tc">
          <Card class="border-none shadow-none">
            <CardHeader class="card_header">
              <div class="header-link">
                <div class="select-type">
                  <span>类型:</span>
                  <Select v-model="selectType">
                    <SelectTrigger class="w-[11.25rem]">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent class="bg-white">
                      <SelectGroup class="text-[0.9rem]">
                        <SelectItem class="text-[0.9rem]" value="1">
                          博客</SelectItem
                        >
                        <SelectItem class="text-[0.9rem]" value="3"
                          >交流
                        </SelectItem>
                        <SelectItem class="text-[0.9rem]" value="4">
                          头脑风暴
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div class="select-time">
                  <span>发布时间:</span>
                  <Popover class="select-time-container">
                    <PopoverTrigger as-child>
                      <Button
                        v-model="selectTime"
                        variant="outline"
                        :class="
                          cn(
                            'w-[280px] justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                          )
                        "
                        class="select-time-btn"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{
                          value
                            ? df(value.toDate(getLocalTimeZone()), "yyyy-MM-dd")
                            : "选择日期"
                        }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      class="w-full p-0 select-time-content bg-white"
                    >
                      <Calendar
                        ref="selectTime"
                        v-model="value"
                        initial-focus
                        locale="zh-CN"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div class="header-search">
                  <span>作者/标题/内容:</span>
                  <div class="search_input_box">
                    <input
                      v-model="condition"
                      placeholder="请输入关键词"
                      class="search_input"
                      @keydown.enter="searchArticleInAdmin"
                    />
                  </div>
                </div>
                <button class="search-btn" @click="searchArticle()">
                  搜索
                </button>
                <div class="reset" @click="reset()">
                  <Icon icon="grommet-icons:power-reset" />
                </div>
                <br />
              </div>
              <div class="header-operation">
                <div class="operation">
                  <!-- <button>
                    <RouterLink
                      to="/admin/recruitment/detail"
                      class="addMember operation-btn"
                    >
                      <Icon icon="icon-park-outline:people-plus-one" />
                      &nbsp;
                      <span>添加成员</span>
                    </RouterLink>
                  </button> -->
                  <button>
                    <button class="addMember operation-btn">
                      <span>批量管理</span>
                    </button>
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent class="card_content">
              <Table v-if="postList.length" id="tb">
                <TableHeader>
                  <TableRow>
                    <TableHead class="hidden w-[100px] md:table-cell text-left">
                      <input
                        v-model="isAllSelected"
                        type="checkbox"
                        @change="handleSelectAll"
                      />
                    </TableHead>
                    <TableHead id="th" class="hidden md:table-cell"
                      >文章标题</TableHead
                    >
                    <TableHead class="hidden md:table-cell"> 作者 </TableHead>
                    <TableHead class="hidden md:table-cell">发布时间</TableHead>
                    <TableHead class="hidden md:table-cell">
                      所属分类
                    </TableHead>
                    <!-- <TableHead class="hidden md:table-cell"> 状态 </TableHead> -->

                    <TableHead class="hidden md:table-cell"> 操作 </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(item, index) in postList"
                    :key="index"
                    class=""
                  >
                    <TableCell class="hidden sm:table-cell"
                      ><input
                        v-model="(item as any).selected"
                        type="checkbox"
                        name=""
                        @change="handleItemSelect"
                    /></TableCell>
                    <TableCell class="font-medium table_title">
                      {{ item.title }}
                    </TableCell>
                    <TableCell class="table_writer">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger class="tooltip_trigger">{{
                            item.name
                          }}</TooltipTrigger>
                          <TooltipContent class="bg-white">
                            <p>
                              {{ item.name }}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                    <TableCell class="hidden md:table-cell">
                      {{ formatDatetoDay(item.postTime) }}
                    </TableCell>

                    <TableCell class="font-medium table_type">
                      {{ checkType(item.type) }}
                    </TableCell>

                    <!-- <TableCell class="hidden md:table-cell"> 删除 </TableCell> -->
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal class="h-4 w-4" />
                            <span class="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="bg-white">
                          <DropdownMenuItem>
                            <Icon
                              icon="cuida:edit-outline"
                            />编辑</DropdownMenuItem
                          >
                          <DropdownMenuItem @click="deleteArticles(item.id)"
                            ><Icon
                              icon="uiw:user-delete"
                            />删除</DropdownMenuItem
                          >
                          <DropdownMenuItem
                            @click="router.push(`/community/post/${item.id}`)"
                          >
                            <Icon
                              icon="ic:outline-article"
                            />查看详情</DropdownMenuItem
                          >
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div v-else>
                <NoData />
              </div>
            </CardContent>
            <CardFooter v-show="postList.length" class="justify-center">
              <div class="pagination-container">
                <Pagination
                  :total-items="total"
                  :page-size="pageSize"
                  @update:page="changePage"
                >
                </Pagination>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "@admin/styles/table.scss";
$font: #8c9296;

.group-leader {
  background-color: var(--secondary);
}

.card {
  &_header {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 15px 20px;
    justify-content: space-between;
  }
  &_content {
    min-height: 36.25rem;
    padding-bottom: 5px;
  }
}
.content {
  top: 0;
  height: max-content;
  margin-bottom: 50px;
  background-color: white;
  padding-top: 5px;
}

.header-link {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 5px;
  width: 100%;
  .select-type {
    select {
      font-size: 0.825rem;
    }
  }
  .select {
    &-type,
    &-time {
      margin-right: 5px;
      span {
        width: max-content;
        padding: 0.2rem;
        font-size: 0.825rem;
        margin-right: 0.3rem;
      }
      display: flex;
      font-size: 0.825rem;
      color: var(--secondary-foreground);
      align-items: center;
    }
    &-time {
      &-btn {
        width: 15vw;
        height: 2rem;
        font-size: 0.825rem;
      }
    }
    &-type {
      button {
        outline: none;
        height: 2rem;
        padding: 0 0.625rem;
      }
    }
  }
}
.header-operation {
  width: 100%;
  .operation {
    display: flex;
    align-items: center;
    .operation-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      text-align: center;
      color: var(--secondary-foreground);
      width: 7rem;
      margin: 0 5px;
      padding: 5px;
      font-size: 0.825rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      &:hover {
        color: var(--primary-foreground);
        background-color: var(--primary);
      }
    }
  }
}

.header-btn {
  color: var(--primary-foreground);
  border: none;
  box-shadow: none;
}

.header-search {
  display: flex;
  align-items: center;
  span {
    font-size: 0.9vw;
    width: max-content;
    color: var(--secondary-foreground);
    margin-right: 5px;
  }
  .search_input_box {
    float: right;
    position: relative;

    input {
      text-decoration: none;
      list-style: none;
      outline-style: none;
      width: 11rem;
      height: 2rem;
      font-size: 0.825rem;
      border: 0.125rem solid var(--border);
      border-radius: var(--radius);
      padding: 5px 10px;
      padding-left: 10px;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      left: 2%;
      transform: translateY(-50%);
    }
    &_list {
      border-radius: var(--radius);
      background-color: white;
      box-shadow:
        0px 2px 5px rgba(0, 0, 0, 0.1),
        inset 0px 0.2px 0.5px rgba(0, 0, 0, 0.24);
    }

    &_item {
      padding: 5px 6px;
      font-size: 15px;
      color: var(--secondary-foreground);
      a {
        width: 100%;
      }
      &:hover {
        background-color: #f8f8fa;
      }
    }
  }
}
.search-btn {
  margin: 0 10px;
  width: max-content;
  height: max-content;
  padding: 0.35rem 1.5rem;
  font-size: 0.825rem;
  border-radius: 0.5rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
}
.reset {
  color: var(--secondary-foreground);
  font-size: 0.9rem;
  &:hover {
    cursor: pointer;
  }
}
.top-title {
  text-align: center;
  height: 30px;
  border: 2px solid #e0f1f6;
  border-radius: 15px;
  margin: 0 10px;
  text-align: center;
  color: var(--secondary-foreground);
  font-size: 12px;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    margin: 0 8px;
  }
}
.table {
  &_title {
    max-width: 250px;
  }
  &_writer {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.tooltip {
  &_trigger {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 150px;
  }
}
@media screen and (min-width: 900px) and (max-width: 2600px) {
  td {
    height: 25px;
  }
  .header-link {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 5px;
    width: 100%;
    .select-type {
      select {
        font-size: 0.9rem;
      }
    }
  }
  .header-search {
    display: flex;
    align-items: center;
    span {
      font-size: 0.9vw;
      width: max-content;
      color: var(--secondary-foreground);
      margin-right: 5px;
    }
    .search_input_box {
      float: right;
      position: relative;

      .search-icon {
        position: absolute;
        top: 50%;
        left: 2%;
        transform: translateY(-50%);
      }
      &_list {
        border-radius: var(--radius);
        background-color: white;
        box-shadow:
          0px 2px 5px rgba(0, 0, 0, 0.1),
          inset 0px 0.2px 0.5px rgba(0, 0, 0, 0.24);
      }

      &_item {
        padding: 5px 6px;
        font-size: 15px;
        color: var(--secondary-foreground);
        a {
          width: 100%;
        }
        &:hover {
          background-color: #f8f8fa;
        }
      }
    }
  }
  #radix-vue-popover-content-v-46 {
    font-size: 0.9vw;
  }
}
</style>
