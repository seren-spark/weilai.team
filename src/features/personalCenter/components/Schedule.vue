<template>
  <div class="mySchedule">
    <Dialog v-if="userStore.isSelf">
      <DialogTrigger as-child>
        <Button
          variant="outline"
          class="bg-green-100 text-green-600 hover:border-green-500 hover:text-green-600 hover:bg-green-100 mb-4"
        >
          添加课程
        </Button>
      </DialogTrigger>
      <DialogContent
        class="sm:max-w-[425px] bg-white max-h-[900px] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>添加课程</DialogTitle>
          <DialogDescription>
            在这里添加您的课程，完成之后点击保存即可
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
                      value="0"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周一
                    </SelectItem>
                    <SelectItem
                      value="1"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周二
                    </SelectItem>
                    <SelectItem
                      value="2"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周三
                    </SelectItem>
                    <SelectItem
                      value="3"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周四
                    </SelectItem>
                    <SelectItem
                      value="4"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周五
                    </SelectItem>
                    <SelectItem
                      value="5"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周六
                    </SelectItem>
                    <SelectItem
                      value="6"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      周日
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
                      value="1-2"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      1-2节
                    </SelectItem>
                    <SelectItem
                      value="3-4"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      3-4节
                    </SelectItem>
                    <SelectItem
                      value="5-6"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      5-6节
                    </SelectItem>
                    <SelectItem
                      value="7-8"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      7-8节
                    </SelectItem>
                    <SelectItem
                      value="9-10"
                      class="cursor-pointer hover:bg-gray-100"
                    >
                      9-10节
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
            v-for="(item, index) in day"
            :key="index"
            class="p-2 border-[1px] border-black"
          >
            <template v-if="item">
              <p>周数：{{ item.weeks }}</p>
              <p>课程：{{ item.courseName }}</p>
              <p>地点：{{ item.coursePlace }}</p>
              <Dialog v-if="userStore.isSelf">
                <DropdownMenu>
                  <DropdownMenuTrigger class="w-full">
                    <Button class="p-1 h-full">
                      <Icon icon="lucide:ellipsis" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="bg-white">
                    <DropdownMenuItem class="text-gray-500 cursor-pointer">
                      <Icon icon="material-symbols:delete-outline" />
                      <span @click="deleteCourse" :data-id="item.oneCourseId">
                        删除课程
                      </span>
                    </DropdownMenuItem>
                    <DialogTrigger as-child>
                      <DropdownMenuItem class="text-gray-500 cursor-pointer">
                        <Icon icon="jam:write" />
                        <span>修改课程</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent
                  class="sm:max-w-[425px] bg-white max-h-[500px] overflow-y-auto"
                >
                  <DialogClose id="dialogClose"></DialogClose>

                  <DialogHeader>
                    <DialogTitle>修改课程</DialogTitle>
                    <DialogDescription>
                      在这里修改您的课程，完成之后点击保存即可
                    </DialogDescription>
                  </DialogHeader>
                  <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="courseName" class="text-right">
                        课程名称
                      </Label>
                      <Input
                        id="courseName"
                        class="col-span-3"
                        :default-value="item.courseName"
                      />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="weeks" class="text-right"> 课程周数 </Label>
                      <Input
                        id="weeks"
                        class="col-span-3"
                        :default-value="item.weeks"
                      />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="weekTime" class="text-right">
                        课程日期
                      </Label>
                      <Select :default-value="index" id="weekTime">
                        <SelectTrigger class="col-span-3">
                          <SelectValue placeholder="选择日期" />
                        </SelectTrigger>
                        <SelectContent class="bg-white">
                          <SelectGroup>
                            <SelectItem
                              value="0"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周一
                            </SelectItem>
                            <SelectItem
                              value="1"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周二
                            </SelectItem>
                            <SelectItem
                              value="2"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周三
                            </SelectItem>
                            <SelectItem
                              value="3"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周四
                            </SelectItem>
                            <SelectItem
                              value="4"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周五
                            </SelectItem>
                            <SelectItem
                              value="5"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周六
                            </SelectItem>
                            <SelectItem
                              value="6"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              周日
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="courseTime" class="text-right">
                        上课时间
                      </Label>
                      <Select :default-value="item.courseTime" id="courseTime">
                        <SelectTrigger class="col-span-3">
                          <SelectValue placeholder="选择时间" />
                        </SelectTrigger>
                        <SelectContent class="bg-white">
                          <SelectGroup>
                            <SelectItem
                              value="1-2"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              1-2节
                            </SelectItem>
                            <SelectItem
                              value="3-4"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              3-4节
                            </SelectItem>
                            <SelectItem
                              value="5-6"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              5-6节
                            </SelectItem>
                            <SelectItem
                              value="7-8"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              7-8节
                            </SelectItem>
                            <SelectItem
                              value="9-10"
                              class="cursor-pointer hover:bg-gray-100"
                            >
                              9-10节
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="coursePlace" class="text-right">
                        上课地点
                      </Label>
                      <Input
                        id="coursePlace"
                        class="col-span-3"
                        :default-value="item.coursePlace"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      @click="submitChangeForm(item.oneCourseId)"
                    >
                      保存
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button/Button.vue";

import { useRequest } from "@/composables/useRequest";
const { data, error, loading, executeRequest } = useRequest();
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
const { getLocalStorageWithExpire, setLocalStorageWithExpire } =
  useLocalStorageWithExpire();

import { reactive, watch, ref } from "vue";
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
      let courseId = e.target.dataset.id;
      executeRequest({
        url: `/user/deleteUserCourse/${courseId}`,
        method: "delete",
      }).then(() => {
        if (data.value && data.value.code == 200) {
          showAlert({ message: "删除成功", type: "pass" });
          console.log("删除成功", data.value);
          getSchedule();
        }
      });
    })
    .catch(() => {
      console.log("取消删除");
    });
}

let weeks = ref("");
let weekTime = ref("");
let courseName = ref("");
let courseTime = ref("");
let coursePlace = ref("");
// async function submitAddForm() {
//   console.log(
//     weeks.value,
//     weekTime.value,
//     courseName.value,
//     courseTime.value,
//     coursePlace.value,
//   );
//   const dataToSend = {
//     weeks: weeks.value,
//     weekTime: Number(weekTime.value),
//     courseName: courseName.value,
//     courseTime: courseTime.value,
//     coursePlace: coursePlace.value,
//   };
//   await executeRequest({
//     url: "/user/addUserCourse",
//     method: "post",
//     requestData: dataToSend,
//   });
//   weeks.value = "";
//   weekTime.value = "";
//   courseName.value = "";
//   courseTime.value = "";
//   coursePlace.value = "";
//   document.getElementById("dialogClose").click();
//   if (data.value.code === 200) {
//     console.log(data.value);
//   }
//   console.log(error.value);
//   getSchedule();
// }
const formSchema = toTypedSchema(
  z.object({
    coursePlace: z
      .string({ required_error: "请填写上课地点" })
      .max(10, "上课地点不能超过10个字"),
    courseTime: z.string(),
    weekTime: z.string(),
    weeks: z
      .string({ required_error: "请填写课程周数" })
      .max(10, "课程周数不能超过10个字"),
    courseName: z
      .string({ required_error: "请填写课程名称" })
      .max(10, "课程名称不能超过10个字"),
  }),
);
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values) => {
  console.log("修改信息表单提交成功!", values);
});
let changeCourseName = ref("");
let changeCourseTime = ref("");
let changeWeeks = ref("");
let changeCoursePlace = ref("");
let changeWeekTime = ref("");
async function submitChangeForm(oneCourseId) {
  //获取输入框
  const courseNameInput = document.getElementById("courseName");
  const courseTimeInput = document.getElementById("courseTime");
  const weeksInput = document.getElementById("weeks");
  const coursePlaceInput = document.getElementById("coursePlace");
  const weekTimeInput = document.getElementById("weekTime");
  //获取输入框的值
  changeCourseName.value = courseNameInput.value;
  changeCourseTime.value = courseTimeInput.value;
  changeWeeks.value = weeksInput.value;
  changeCoursePlace.value = coursePlaceInput.value;
  changeWeekTime.value = weekTimeInput.value;
  // 封装成对象
  const dataToSend = {
    courseName: changeCourseName.value,
    courseTime: changeCourseTime.value,
    weeks: changeWeeks.value,
    coursePlace: changeCoursePlace.value,
    weekTime: Number(changeWeekTime.value),
    oneCourseId: oneCourseId,
  };
  document.getElementById("dialogClose").click();

  console.log(dataToSend);
  // 发送请求
  await executeRequest({
    url: "/user/updateUserCourse",
    method: "put",
    requestData: dataToSend,
  });

  console.log(data.value);

  getSchedule();
}

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
