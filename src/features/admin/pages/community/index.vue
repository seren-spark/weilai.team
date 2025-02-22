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
// @ts-ignore
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
import type { ArticleList } from "@/types/Community";
import { checkType, deletes, getArticle } from "@community/composables/search";
import { Icon } from "@iconify/vue";
import { getLocalTimeZone, type DateValue } from "@internationalized/date";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRequest } from "vue-request";
const { showAlert } = useAlert();
const { formatDatetoDay } = useDateFormatter();

const postList = ref<ArticleList[]>([]);
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
const getArticleInAdmin = () => {
  getArticle(undefined, condition.value).then((res) => {
    postList.value = res.records;
    total.value = res.total;
    pageSize.value = res.size;
  });
};
getArticleInAdmin();
// 改变页数
const changePage = (newPage: number) => {
  page.value = newPage;
  isAllSelected.value = false;
};

watch(page, (newPage) => {
  getArticle(undefined, undefined, newPage).then((res) => {
    postList.value = res.records;
  });
});
// 搜索文章的方法
async function searchArticle() {
  let selectTimeValue = value.value;
  if (selectTimeValue) {
    let { year, month, day } = selectTimeValue;
    selectTime.value = `${year}-${month}-${day} 00:00:00`;
  } else {
    selectTime.value = "";
  }
  let res = await getArticle(
    selectType.value,
    condition.value || undefined,
    page.value || 1,
    selectTime.value || "",
  );
  postList.value = res.records;
  total.value = res.total;
  pageSize.value = res.size;
}
// 删除文章(单选)
const { data, run } = useRequest(deletes, { manual: true });
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
// 监听删除请求数据变化

// 实现全选反选多选
function handleSelectAll() {
  if (postList.value.length === 0) return;
  // 全选
  postList.value.forEach((item: any) => {
    item.selected = isAllSelected.value;
  });
}
function reset() {
  value.value = undefined;
  selectType.value = "";
  condition.value = "";
  getArticleInAdmin();
}
const handleItemSelect = (item: any) => {
  console.log(postList.value);

  isAllSelected.value = true;
  postList.value.forEach((item: any) => {
    if (!item.selected) {
      isAllSelected.value = false;
    }
  });
};
function df(date: any, format = "yyyy - MM - dd HH:mm") {
  // 获取日期的各个部分，包括分钟
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  // 根据format字符串进行格式化，包含分钟部分
  let formattedDate = format
    .replace("yyyy", year)
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
                        variant="outline"
                        v-model="selectTime"
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
                        v-model="value"
                        ref="selectTime"
                        initial-focus
                        locale="zh-CN"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div class="header-search">
                  <span>作者/标题:</span>
                  <div class="search_input_box">
                    <input
                      placeholder="请输入关键词"
                      class="search_input"
                      v-model="condition"
                      @keydown.enter="getArticleInAdmin"
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
              <Table id="tb" v-if="postList.length">
                <TableHeader>
                  <TableRow>
                    <TableHead class="hidden w-[100px] md:table-cell text-left">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        v-model="isAllSelected"
                        @change="handleSelectAll"
                      />
                    </TableHead>
                    <TableHead class="hidden md:table-cell" id="th"
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
                        type="checkbox"
                        name=""
                        id=""
                        v-model="(item as any).selected"
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
            <CardFooter class="justify-center" v-show="postList.length">
              <div class="pagination-container">
                <Pagination
                  :totalItems="total"
                  :pageSize="pageSize"
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
@import "@admin/styles/table.scss";
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
    min-height: 580px;
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
      width: 110px;
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

    &_input_box {
      position: relative;
    }
    input {
      text-decoration: none;
      list-style: none;
      outline-style: none;
      width: 180px;
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
  border-radius: 8px;
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
