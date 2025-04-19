<template>
  <main class="flex-1 items-start gap-4 md:gap-8 main">
    <Tabs default-value="all">
      <div
        class="flex items-center"
        style="margin: 5px 0px; height: 2.5rem; width: 100%"
      >
        <TabsList class="bg-white">
          <div class="top-title">
            <span>{{ grade }}未来软件工作室</span>
          </div>
        </TabsList>
        <div class="ml-auto flex items-center gap-2">
          <SelectLeader
            :grade="grade"
            :group="group"
            :updateData="updateData"
            :havaLeader="haveLeader"
          />
        </div>
      </div>
      <hr />
      <TabsContent value="all" class="tc">
        <Card class="border-none shadow-none card">
          <CardHeader class="card-header">
            <div class="header-link">
              <AddMember :group="group" :grade="grade" :updateData="updateData">
                <DialogTrigger as-child>
                  <button class="head">
                    <Icon icon="icon-park-outline:people-plus-one" />
                    &nbsp;
                    <span>添加成员</span>
                  </button>
                </DialogTrigger>
              </AddMember>
              <EditMembers
                :grade="grade"
                :group="group"
                :selectIds="selectIds"
                :updateData="updateData"
              >
                <DropdownMenu class="min-w-[4rem]">
                  <DropdownMenuTrigger class="head"
                    >批量管理</DropdownMenuTrigger
                  >

                  <DropdownMenuContent
                    class="bg-white text-[--secondary-foreground]"
                  >
                    <DropdownMenuItem @click="deleteMembers"
                      >批量删除</DropdownMenuItem
                    >

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>批量导入</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent
                          class="bg-white text-[--secondary-foreground]"
                        >
                          <DropdownMenuItem @click="downloadTemplate">
                            <span>获取模版</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <input
                              class="xlsx-input"
                              type="file"
                              @change="handleXlsx"
                            />
                            <span style="position: absolute">导入数据</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DialogTrigger>
                      <DropdownMenuItem>批量修改</DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </EditMembers>
            </div>
          </CardHeader>

          <CardContent class="p-0">
            <div class="no-data" v-show="!userList.length">
              <p>请选择组别</p>
            </div>
            <Table id="tb" ref="tableRef" v-if="userList.length">
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
                    >姓名</TableHead
                  >
                  <TableHead class="hidden md:table-cell">组织</TableHead>
                  <TableHead class="hidden md:table-cell"> 年级 </TableHead>
                  <TableHead class="hidden md:table-cell"> 班级 </TableHead>
                  <TableHead class="hidden md:table-cell"> 学号 </TableHead>
                  <TableHead class="hidden md:table-cell"> 操作 </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody ref="tbodyRef" v-model="userList">
                <!-- 属性class=group-leader 为组长样式  -->
                <!-- 如果没有值，则显示选择组别  -->

                <TableRow
                  v-for="(user, index) in userList"
                  :key="index"
                  ref="rowRefs"
                  :class="user.isLeader ? 'group-leader' : ''"
                >
                  <TableCell class="hidden sm:table-cell"
                    ><input
                      type="checkbox"
                      name=""
                      id=""
                      v-model="(user as any).selected"
                      @change="handleItemSelect"
                  /></TableCell>
                  <TableCell class="font-medium">
                    {{ user.name }}
                  </TableCell>
                  <TableCell>
                    {{
                      chineseNums[user.group as keyof typeof chineseNums] +
                        "组" || "未知"
                    }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ user.grade }}级
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ user.clazz }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ user.studyId }}
                  </TableCell>
                  <TableCell>
                    <MemberInfo
                      :userId="user.id"
                      :rowData="editRowData"
                      :sendUpdateInfo="getUpdateInfo"
                    >
                      <DropdownMenu class="">
                        <DropdownMenuTrigger as-child>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            class="h-[3vh]"
                          >
                            <MoreHorizontal class="h-4 w-4" />
                            <span class="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          class="bg-white text-[--secondary-foreground]"
                        >
                          <DialogTrigger class="w-full">
                            <!-- @click="sendOldData(user)" -->
                            <DropdownMenuItem @click="sendOldData(user, index)">
                              <Icon icon="cuida:edit-outline" />
                              编辑
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            @click="deleteOne(user.id)"
                            v-if="!user.isLeader"
                            ><Icon
                              icon="uiw:user-delete"
                            />删除</DropdownMenuItem
                          >
                          <DropdownMenuItem
                            @click="cancelLeader(user.id)"
                            v-else
                            ><Icon
                              icon="uiw:user-delete"
                            />撤销组长</DropdownMenuItem
                          >
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </MemberInfo>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter> </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAlert } from "@/composables/useAlert";
import { showConfirm } from "@/composables/useConfirm";
import AddMember from "@/features/admin/components/contacts/AddMember.vue";
import MemberInfo from "@/features/admin/components/contacts/MemberInfo.vue";
import SelectLeader from "@/features/admin/components/contacts/SelectLeader.vue";
import {
  cancelGroupLeader,
  deletes,
  getMembersByGroupAndGrade,
} from "@/features/admin/composables/useContacts";
import type { TeamUserList } from "@/types/Contacts";
import EditMembers from "@admin/components/contacts/EditMembers.vue";
import { Icon } from "@iconify/vue";
import { MoreHorizontal } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRequest } from "vue-request";
import { useRoute } from "vue-router";
import { Input } from "@/components/ui/input";
import { setActivePinia } from "pinia";
import apiClient from "@/api/axios";
//引入批量导入方法
import { processFiles } from "@/composables/useXlsx";
const { showAlert } = useAlert();
const editRowData = ref<TeamUserList>();
const tableRef = ref<InstanceType<typeof Table> | null>(null);
const rowRefs = ref<InstanceType<typeof TableRow> | []>([]);
const tbodyRef = ref<InstanceType<typeof TableBody> | null>(null);
const selectIds = ref<number[]>([]);
const tableData = ref<TeamUserList[]>([]);
const haveLeader = ref(false);
const isAllSelected = ref(false);
// 记录当前数据的索引
const trIndex = ref<number>();
const route = useRoute();
const member = ref("");
const chineseNums = {
  "1": "一",
  "2": "二",
  "3": "三",
  "4": "四",
  "5": "五",
  "6": "六",
  "7": "七",
  "8": "八",
  "9": "九",
};
const userList = ref<TeamUserList[]>([]);

const grade = ref("");
const group = ref("");
if (route.params && "member" in route.params) {
  grade.value = member.value.split(",")[0] || route.params.member.split(",")[0];
  group.value = member.value.split(",")[1] || route.params.member.split(",")[1];
} else {
  grade.value = "";
  group.value = "";
}
getMembersByGroupAndGrade(grade.value, group.value).then((res) => {
  userList.value = res.teamUserList;

  if (userList.value[0].isLeader) {
    haveLeader.value = true;
  }
});

function updateData(grade: string, group: string) {
  getMembersByGroupAndGrade(grade, group).then((res) => {
    userList.value = res.teamUserList;
  });
}
watch(route, (newVal) => {
  member.value = (route.params as any).member as string;
  grade.value = member.value.split(",")[0];
  group.value = member.value.split(",")[1];

  getMembersByGroupAndGrade(grade.value, group.value).then((res) => {
    tableData.value = userList.value = res.teamUserList;
  });
});
function sendOldData(oldData: TeamUserList, index: number) {
  // 将旧数据赋值给editRowData 并传递给子组件（弹窗）以进行修改
  editRowData.value = oldData;
  trIndex.value = index;
}
function getUpdateInfo(updateObj: TeamUserList) {
  // 更新数据(通过子组件接收回来新数据)
  if (trIndex.value !== undefined) {
    if (userList.value) {
      userList.value[trIndex.value] = { ...updateObj };
    }
  } else {
    console.log("trIndex.value is undefined");
  }
}

// 实现全选反选多选
function handleSelectAll() {
  if (userList.value.length === 0) return;
  // 全选
  userList.value.forEach((item: any) => {
    item.selected = isAllSelected.value;
    selectIds.value = userList.value.map((item) => item.id);
  });
}
const handleItemSelect = (item: any) => {
  isAllSelected.value = true;
  userList.value.forEach((item: any) => {
    if (!item.selected) {
      isAllSelected.value = false;
      if (selectIds.value.includes(item.id)) {
        selectIds.value = selectIds.value.filter((id) => id !== item.id);
      }
    } else {
      if (!selectIds.value.includes(item.id)) {
        selectIds.value.push(item.id);
      }
    }
  });
};
const { data, run } = useRequest(deletes, { manual: true });
// 批量删除功能
function deleteMembers() {
  if (selectIds.value.length > 0) {
    showConfirm({
      content: "你确定要删除该成员吗",
      description: "一旦删除组织中将不存在该用户",
    })
      .then(() => {
        run(selectIds.value);
      })
      .catch(() => {});
  } else {
    return showAlert("请选择后再进行删除", "waring");
  }
}

// 删除一个
function deleteOne(id: number) {
  selectIds.value.push(id);
  showConfirm({
    content: "你确定要删除该成员吗",
    description: "一旦删除组织中将不存在该用户",
  })
    .then(() => {
      run(selectIds.value);
    })
    .catch(() => {});
}
watch(
  () => data.value,
  () => {
    console.log(data.value);
    if ((data.value as any).code == 200) {
      showAlert("删除成功", "pass");
      updateData(grade.value, group.value);
    }
    selectIds.value = [];
  },
);

// 撤销组长
const { data: cancelData, run: cancel } = useRequest(cancelGroupLeader, {
  manual: true,
});
watch(
  () => cancelData.value,
  (newVal) => {
    console.log(newVal);
    if (newVal && newVal.code == 200) {
      showAlert("操作成功", "pass");
      updateData(grade.value, group.value);
    }
  },
);
function cancelLeader(id: number) {
  let str = `${grade.value}$${group.value}`;
  showConfirm({ content: "确定收回其组长的权限吗" }).then(() => {
    cancel(str, id);
  });
}

// 批量导入

const handleXlsx = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    processFiles(target.files[0])
      .then((response) => {
        showAlert("上传成功", "pass");
        updateData(grade.value, group.value);
        target.value = "";
      })
      .catch((error) => {
        showAlert(error, "error");
      });
  }
};

const downloadTemplate = () => {
  // const link = document.createElement("a");
  // link.href = "/public/用户导入专用表.xlsx";
  // link.download = "用户专用表.xlsx";
  // link.click();
  const link = document.createElement("a");
  link.href = "/public/用户导入专用表.xlsx"; // 修正路径
  link.download = "用户导入模板.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style lang="scss" scoped>
$font: #8c9296;

th {
  height: 3rem;
}
tr {
  text-align: center;
  font-size: 0.9vw;
}
#tb {
  padding: 0;
  border: 0.1vw solid var(--border);
  border-radius: var(--radius);
}
th {
  text-align: center;
  color: var(--secondary-foreground);
}
td {
  height: 2.5rem;
  font-size: 0.9vw;
  padding: 0.7vh 0;
}
.main {
  width: 55vw;
}
.group-leader {
  background-color: var(--secondary);
}
.table-actions {
  height: 5vh;
}
.content {
  width: 100%;
  height: 90vh;
  overflow: hidden;
  background-color: white;
  #sidebar {
    color: var(--secondary-foreground);
    width: 20vw;
    a {
      display: block;
    }
    .sidebar-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.1vw;
      width: 100%;
      height: 4vh;
      &-item {
        display: flex;
        align-items: center;
        padding: 0.8vh 1vw;
        width: 100%;
        height: max-content;
        font-size: 0.9vw;
        color: var(--secondary-foreground);
        border-radius: var(--radius);
        border: 0.1vw solid #e8ebec;
      }
    }
  }
  #sidebar-container {
    width: 20vw;

    overflow: hidden;
  }
}
.sidebar-menu {
  color: var(--secondary-foreground);
}
#search {
  border-radius: 10px;
  height: 5vh;
  margin-bottom: 10px;
  border: 1px solid #d0d9e4;
  #search_input {
    border-style: none !important;
    height: 100% !important;
    padding: 0 5px !important;
  }
  .search {
    position: relative;

    &_list {
      box-shadow:
        0px 2px 5px rgba(0, 0, 0, 0.1),
        inset 0px 0.2px 0.5px rgba(0, 0, 0, 0.24);
      border: 1px solid var(--secondary-border);
      position: absolute;
      top: 5vh;
      padding: 5px 0;
      border-radius: 2px;
      width: 280px;
      z-index: 5;
      background-color: white;
    }
    &_item {
      &:hover {
        background-color: #f8f8fa;
      }
    }
  }
  input {
    width: 100%;
    height: 45px;
    border: 1px solid #d0d9e4;
    border-radius: 10px;
    padding: 5px 10px;
    padding-left: 30px;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    left: 2%;
    transform: translateY(-50%);
  }
}
#sideber {
  &-provider {
    width: 20vw;
  }
  .group {
    width: 20vw;
  }
}
.card {
  padding: 0 2vw;
  .card-header {
    padding: 1vh 0;
    .header-link {
      display: flex;
      button {
        margin-right: 10px;
      }
      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        text-align: center;
        color: var(--secondary-foreground);
        width: 7vw;
        height: 2rem;

        padding: 0.1vh 0.05vw;
        font-size: 0.9rem;
        border: 1.5px solid var(--border);
        border-radius: var(--radius);
        &:hover {
          color: var(--primary-foreground);
          background-color: var(--primary);
        }
      }
      margin-bottom: 20px;
    }
  }
}

.header-btn {
  color: var(--primary-foreground);
  border: none;
  box-shadow: none;
}
.top-title {
  text-align: center;
  height: 2rem;
  border: 0.1rem solid #e0f1f6;
  border-radius: 1rem;
  margin: 0 10px;
  text-align: center;
  color: var(--secondary-foreground);
  font-size: 0.825rem;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    margin: 0 8px;
  }
}

.dropdown_menu_content {
  background-color: white;
}
div[role="menu"] {
  min-width: 32px !important;
}
// 无数据的样式
.no-data {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0.125rem solid var(--border);
  p {
    color: var(--secondary-foreground);
    font-size: 1.5rem;
    text-align: center;
    width: 100%;
  }
}
.xlsx-input {
  opacity: 0;
  height: 0.875rem;
  width: 4rem;
  position: relative;
  z-index: 3;
}
@media screen and (max-width: 1400px) {
  .content {
    span {
      font-size: 12px !important;
    }
    font-size: 12px !important;
  }
}
@media screen and (max-width: 1260px) {
  .content {
    span {
      font-size: 10px !important;
    }
  }
  .content {
    height: 520px;
    ul {
      button {
        height: max-content;
      }
    }
    #sidebar {
      a {
        display: block;
      }
      .sidebar-link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 20px;
        &-item {
          padding: 0.8vh 1vw;
          font-size: 12px;
          border: 0.1vw solid #e8ebec;
        }
      }
    }
    #sidebar-container {
      width: 20vw;

      overflow: hidden;
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .content {
    span {
      font-size: 8px !important;
    }
    svg {
      font-size: 8px !important;
      width: 0.8rem;
    }
  }
}
</style>
