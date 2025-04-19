<template>
  <div class="mySchedule">
    <Dialog v-if="userStore.isSelf" v-model:open="open">
      <DialogTrigger as-child> </DialogTrigger>
      <DialogContent
        class="sm:max-w-[425px] bg-white max-h-[900px] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle> 课程信息 </DialogTitle>
          <DialogDescription>
            在这里上传您的课程，完成之后点击保存即可
          </DialogDescription>
        </DialogHeader>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="courseName">
            <FormItem>
              <FormLabel>课程名称</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入课程名称"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="weeks">
            <FormItem>
              <FormLabel>课程周数</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入课程周数"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="weekTime">
            <FormItem>
              <FormLabel>课程日期</FormLabel>

              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择日期" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(item, index) in weekTimeArray"
                      :key="index"
                      :value="String(index)"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      {{ item }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="courseTime">
            <FormItem>
              <FormLabel>上课时间</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择上课时间" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="(item, index) in courseTimeArray"
                      :key="index"
                      :value="item"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      {{ item }}节
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="coursePlace">
            <FormItem>
              <FormLabel>上课地点</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入上课地点"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="mt-2"> 保存 </Button>
        </form>
      </DialogContent>
    </Dialog>
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell> </TableCell>
          <TableCell class="p-2 m-1 border-[1px] border-black text-center">
            1-2节
          </TableCell>
          <TableCell class="p-2 m-1 border-[1px] border-black text-center">
            3-4节
          </TableCell>
          <TableCell class="p-2 m-1 border-[1px] border-black text-center">
            5-6节
          </TableCell>
          <TableCell class="p-2 m-1 border-[1px] border-black text-center">
            7-8节
          </TableCell>
          <TableCell class="p-2 m-1 border-[1px] border-black text-center">
            9-10节
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(day, index) in courseList" :key="index">
          <TableCell
            class="p-2 border-[1px] border-black text-center width-[10px]"
          >
            {{ dayTransformer(index) }}
          </TableCell>
          <TableCell
            v-for="(item, itemIndex) in day"
            :key="itemIndex"
            class="p-2 border-[1px] border-black cursor-pointer relative cell-ctrl group"
            @click.stop="handleCellClick(index, itemIndex, item)"
          >
            <template v-if="item">
              <template v-if="isActive(index, itemIndex)">
                <!-- 只显示按钮 -->
                <div class="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    class="text-red-500 border-red-500"
                    @click.stop="deleteCourse(item.oneCourseId)"
                  >
                    删除课程
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    @click.stop="
                      showDialog();
                      initForm(item, index);
                    "
                  >
                    修改课程
                  </Button>
                </div>
              </template>
              <template v-else>
                <!-- 课程信息正常显示 -->
                <p>周数：{{ item.weeks }}</p>
                <p>课程：{{ item.courseName }}</p>
                <p>地点：{{ item.coursePlace }}</p>
              </template>
            </template>

            <!-- 如果 item 不存在，显示添加 Icon（同之前逻辑） -->
            <template v-else>
              <div class="flex justify-center items-center h-full min-h-[60px]">
                <Icon
                  icon="subway:add"
                  class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500"
                />
              </div>
            </template>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button/Button.vue";

import { useRequest } from "@/composables/useRequest";
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";

import { reactive, ref, watch } from "vue";
import { useUserStore } from "@/store/userStore";

import { showConfirm } from "@/composables/useConfirm";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAlert } from "@/composables/useAlert";

import { onMounted, onBeforeUnmount } from "vue";

const activeCell = ref(null); // 用于追踪当前激活的单元格：{ rowIndex, colIndex }

function handleCellClick(rowIndex, colIndex, item) {
  if (!item) {
    initAddForm(rowIndex, colIndex);
  }
  const key = `${rowIndex}-${colIndex}`;
  if (activeCell.value === key) {
    activeCell.value = null; // 再次点击取消激活
  } else {
    activeCell.value = key;
  }
}

function isActive(rowIndex, colIndex) {
  return activeCell.value === `${rowIndex}-${colIndex}`;
}

// 点击其他区域时关闭激活状态
function handleClickOutside(event) {
  if (!event.target.closest(".cell-ctrl")) {
    activeCell.value = null;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const open = ref(false);
watch(
  () => open,
  () => {
    if (!open.value) {
      isAddForm.value = true;
      oneCourseId.value = 0;
      // form.reset();
    }
  },
);
const showDialog = () => {
  open.value = true;
};

const weekTimeArray = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const courseTimeArray = ["1-2", "3-4", "5-6", "7-8", "9-10"];

const { data, executeRequest } = useRequest();
const { getLocalStorageWithExpire } = useLocalStorageWithExpire();
const { showAlert } = useAlert();

const userStore = useUserStore();
console.log("pinia///", userStore);
// 获取userId
let userId = 0;
if (userStore.isSelf) {
  userId = getLocalStorageWithExpire("userId");
} else {
  userId = userStore.userId;
}
watch(
  () => userStore,
  () => {
    if (userStore.isSelf) {
      userId = getLocalStorageWithExpire("userId");
    } else {
      userId = userStore.userId;
    }
    getSchedule();
  },
  {
    deep: true,
  },
);
let courseList = reactive({});

async function getSchedule() {
  await executeRequest({ url: `/user/getUserCourse/${userId}` });
  if (data.value && data.value.code == 200) {
    Object.assign(courseList, data.value.data.allCourse);
    console.log("课表：", courseList);
  }
}
getSchedule();

function deleteCourse(e) {
  showConfirm({
    title: "警告",
    content: "确定删除吗？",
    description: "删除后不可恢复",
  })
    .then(() => {
      let courseId = e;
      executeRequest({
        url: `/user/deleteUserCourse/${courseId}`,
        method: "delete",
      }).then(() => {
        if (data.value && data.value.code == 200) {
          showAlert("删除成功", "pass");
          console.log("删除成功", data.value);
          getSchedule();
        }
      });
    })
}
const isAddForm = ref(true);
const oneCourseId = ref(0);
const initForm = (item, weekTime) => {
  console.log("修改课程", item, weekTime);

  oneCourseId.value = item.oneCourseId;
  isAddForm.value = false;
  form.resetForm({
    values: {
      coursePlace: item.coursePlace,
      courseTime: item.courseTime,
      weekTime: weekTime,
      weeks: item.weeks,
      courseName: item.courseName,
    },
  });
};
const initAddForm = (weekTime, courseTime) => {
  showDialog();
  console.log("weekTime", weekTime, "courseTime", courseTime);
  form.resetForm({
    values: {
      courseTime: courseTimeArray[courseTime],
      weekTime: weekTime,
    },
  });
};
const formSchema = toTypedSchema(
  z.object({
    coursePlace: z
      .string({ required_error: "请填写上课地点" })
      .max(10, "上课地点不能超过10个字")
      .min(2, "上课地点不能少于2个字"),
    courseTime: z.string(),
    weekTime: z.string(),
    weeks: z
      .string({ required_error: "请填写课程周数" })
      .max(10, "课程周数不能超过10个字")
      .min(2, "课程周数不能少于2个字"),
    courseName: z
      .string({ required_error: "请填写课程名称" })
      .max(10, "课程名称不能超过10个字")
      .min(2, "课程名称不能少于2个字"),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  if (isAddForm.value) {
    executeRequest({
      url: `/user/addUserCourse`,
      method: "post",
      requestData: values,
    }).then(() => {
      console.log("上传成功：", data.value);
      showAlert("上传成功", "pass");
      getSchedule();
    });
  } else {
    values.oneCourseId = oneCourseId.value;
    console.log("修改信息表单", values);
    executeRequest({
      url: `/user/updateUserCourse`,
      method: "put",
      requestData: values,
    }).then(() => {
      console.log("修改成功：", data.value);
      showAlert("修改成功", "pass");
      getSchedule();
    });
  }
  open.value = false;
  form.reset();
  isAddForm.value = true;
  oneCourseId.value = 0;
});
function dayTransformer(day) {
  switch (day) {
    case "0":
      return "周一";
      break;
    case "1":
      return "周二";
      break;
    case "2":
      return "周三";
      break;
    case "3":
      return "周四";
      break;
    case "4":
      return "周五";
      break;
    case "5":
      return "周六";
      break;
    case "6":
      return "周日";
      break;
  }
}
</script>
<style lang="scss" scoped>
.text-destructive {
  color: rgb(255, 103, 103);
}
.mySchedule {
  margin-top: 20px;
  width: 100%;
  background-color: white;
  padding: 10px;
  border-radius: 10px;

  tr {
    box-sizing: content-box;
    border: 1px solid black;

    td {
      min-width: 80px;

      .iconControl {
        opacity: 0;
        color: #5e5e5e;
        text-align: center;
        &:hover {
          color: #ff4d4d;
          opacity: 1;
        }
      }

      &:hover {
        background-color: #f5f5f5;
      }

      &:first-child {
        min-width: 50px;
        width: 50px; // 强制设置宽度
      }
    }
  }
}
</style>
