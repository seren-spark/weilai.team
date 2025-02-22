<template>
  <div class="header">
    <Carousel
      class="relative"
      :plugins="[plugin]"
      @mouseenter="plugin.stop"
      @mouseleave="[plugin.reset(), plugin.play(), console.log('Running')]"
    >
      <CarouselContent>
        <CarouselItem v-for="(item, index) in userInfo.lifePhoto" :key="index">
          <div class="p-1">
            <Card>
              <CardContent class="flex items-center justify-center p-2">
                <img
                  :src="item ? item : '/logo.png'"
                  alt="生活照片"
                  class="w-[100%] h-[300px] object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
    <Skeleton
      v-if="!userInfo.lifePhoto || userInfo.lifePhoto.length == 0"
      class="w-[100%] h-[300px] bg-gray-100"
    />
    <div class="myInfo">
      <div class="container-left">
        <UserAvatar
          class="w-[100px] h-[100px] -mt-[50px] mr-[20px] ml-[20px] z-20"
          :avatar="userInfo.headPortrait"
        />
        <div
          class="bg-gray-100 w-[100px] h-[100px] -mt-[50px] mr-[20px] ml-[20px] z-10"
        ></div>
        <div class="infoBox">
          <p class="nameAndSex">
            {{ userInfo.name }}
            <Icon
              style="display: inline-block"
              v-if="userInfo.sex == '男'"
              icon="fluent-emoji-flat:male-sign"
            />
            <Icon
              style="display: inline-block"
              v-if="userInfo.sex == '女'"
              icon="fluent-emoji-flat:female-sign"
            />
          </p>
          <p class="job">{{ userInfo.direction }}</p>
        </div>
      </div>
      <div class="container-right" v-if="userStore.isSelf">
        <Dialog>
          <DialogTrigger as-child>
            <Button
              variant="outline"
              class="bg-blue-100 text-blue-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-100"
              @click="initForm"
            >
              修改信息
            </Button>
          </DialogTrigger>
          <DialogContent
            class="sm:max-w-[425px] bg-white max-h-[500px] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>修改信息</DialogTitle>
              <DialogDescription>
                在这里修改您的信息，完成之后点击保存即可
              </DialogDescription>
            </DialogHeader>
            <form @submit="onSubmit">
              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel>电话</FormLabel>
                  <FormControl class="my-1">
                    <Input
                      type="text"
                      placeholder="请输入11位电话号码"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormDescription> </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="qq">
                <FormItem>
                  <FormLabel>QQ</FormLabel>
                  <FormControl class="my-1">
                    <Input
                      type="text"
                      placeholder="请输入QQ账号"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage class="my-2" />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="graduationDestination"
              >
                <FormItem>
                  <FormLabel>毕业去向</FormLabel>
                  <FormControl class="my-1">
                    <Input
                      type="text"
                      placeholder="请输入毕业去向"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormDescription> </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="userDestination">
                <FormItem>
                  <FormLabel>个性签名</FormLabel>
                  <FormControl class="my-1">
                    <Textarea
                      type="text"
                      placeholder="请输入个性签名"
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
      </div>
    </div>
    <!-- 编辑信息 -->

    <div class="signature">
      <p>
        <Icon
          style="display: inline-block; height: 100%"
          icon="fluent:document-signature-16-regular"
        />&ensp;个性签名：
        <span>{{ userInfo.userDestination }}</span>
      </p>
    </div>

    <div class="moreInfoBox">
      <div class="arrowBox" @click="changeIsShow">
        <Icon width="20px" v-show="!isShow" icon="quill:chevron-down" />
        <Icon width="20px" v-show="isShow" icon="quill:chevron-up" />
      </div>
      <div class="moreInfo" v-show="isShow">
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="tabler:number"
          />&ensp;学号:
          <span>{{ userInfo.studyId }}</span>
        </p>
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="ri:group-line"
          />&ensp;组别:
          <span>{{ userInfo.group }}</span>
        </p>
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="ic:outline-email"
          />&ensp;邮箱:
          <span>{{ userInfo.email }}</span>
        </p>
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="icon-park-outline:classroom"
          />&ensp;班级:
          <span>{{ userInfo.clazz }}</span>
        </p>
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="solar:phone-linear"
          />&ensp;电话:
          <span>{{ userInfo.phone }}</span>
        </p>
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="ri:qq-line"
          />&ensp;QQ:
          <span>{{ userInfo.qq }}</span>
        </p>
        <p>
          <Icon
            style="display: inline-block; font-size: 18px"
            icon="teenyicons:direction-outline"
          />&ensp;毕业去向:
          <span>{{ userInfo.graduationDestination }}</span>
        </p>
      </div>
    </div>

    <div
      class="lastLoginTime"
      v-if="userInfo.lastLoginTime && userStore.isSelf"
    >
      <p>
        <Icon style="display: inline-block" icon="mdi:calendar-outline" />
        上次登录时间：<span>{{ formatPostTime(userInfo.lastLoginTime) }}</span>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
// 引入组件
import { Icon } from "@iconify/vue";
import { reactive, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
//引入pinia
import { useUserStore } from "@/store/userStore";

// 引入hooks并调用
import { useRequest } from "@/composables/useRequest";
const { data, error, loading, executeRequest } = useRequest();
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
const { getLocalStorageWithExpire, setLocalStorageWithExpire } =
  useLocalStorageWithExpire();
import { useDateFormatter } from "@/composables/useDateFormatter";
import type { RefSymbol } from "@vue/reactivity";
import { Store } from "lucide-vue-next";
import UserAvatar from "@/components/avatar/UserAvatar.vue";
import { formatPostTime } from "@/utils/formatPostTime";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { useAlert } from "@/composables/useAlert";
import router from "@/router";
import { get } from "http";
const { showAlert } = useAlert();

const phoneNumberRegex = /^1[3-9]\d{9}$/;
const qqNumberRegex = /^[1-9][0-9]{4,10}$/;
const formSchema = toTypedSchema(
  z.object({
    phone: z
      .string()
      .min(11, "请输入11位电话号码")
      .regex(phoneNumberRegex, { message: "请输入正确的电话号码" })
      .optional(),
    qq: z
      .string()
      .regex(qqNumberRegex, { message: "请输入正确的QQ账号" })
      .optional(),
    userDestination: z.string().max(50, "个性签名不能超过50个字"),
    graduationDestination: z.string().max(20, "毕业去向不能超过20个字"),
  }),
);

let userInfo = reactive<UserInfo>({
  clazz: "",
  direction: "",
  email: "",
  grade: "",
  graduationDestination: "",
  group: "",
  headPortrait: "",
  lastLoginTime: "",
  lifePhoto: [],
  name: "",
  phone: "",
  qq: "",
  sex: "",
  studyId: "",
  userDestination: "",
});

// 定义UserInfo接口
interface UserInfo {
  clazz: string;
  direction: string;
  email: string;
  grade: string;
  graduationDestination: string;
  group: string;
  headPortrait: string;
  lastLoginTime: string;
  lifePhoto: [];
  name: string;
  phone: string;
  qq: string;
  sex: string;
  studyId: string;
  userDestination: string;
}

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log("修改信息表单提交成功!", values);
  executeRequest({
    url: "/user/updateUserInfo",
    method: "put",
    requestData: values,
  }).then(() => {
    console.log("修改成功：", data.value);
    showAlert("修改成功", "pass");
    getUserInfo();
  });
});

const userStore = useUserStore();
console.log("pinia///", userStore.userId, userStore.isSelf);
watch(
  () => userStore,
  () => {
    if (userStore.isSelf) {
      userId = getLocalStorageWithExpire("userId");
    } else {
      userId = userStore.userId;
    }
    getUserInfo();
  },
  {
    deep: true,
  },
);
const plugin = Autoplay({
  delay: 2000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
});

//控制更多信息的显示与隐藏
let isShow = ref(false);
function changeIsShow() {
  isShow.value = !isShow.value;
}

// 获取userId
let userId = 0;
if (userStore.isSelf) {
  userId = getLocalStorageWithExpire("userId");
} else {
  userId = userStore.userId;
}
console.log("userId:", userId);

let phone = ref("");
let qq = ref("");
let userDestination = ref("");
let graduationDestination = ref("");
// 获取用户信息函数
async function getUserInfo() {
  await executeRequest({ url: `/user/getUserInfoByUserId/${userId}` });
  if (data.value && data.value.code == 200) {
    Object.assign(userInfo, data.value.data);
    console.log("用户信息：", userInfo);

    phone.value = userInfo.phone;
    qq.value = userInfo.qq;
    userDestination.value = userInfo.userDestination;
    graduationDestination.value = userInfo.graduationDestination;
  }
  console.log("请求结果", data.value);
}
// 打开页面立刻调用一次函数
getUserInfo();

function initForm() {
  form.setValues({
    phone: userInfo.phone,
    qq: userInfo.qq,
    userDestination: userInfo.userDestination,
    graduationDestination: userInfo.graduationDestination,
  });
}
</script>
<style lang="scss" scoped>
.text-destructive {
  color: rgb(255, 103, 103);
}

.header {
  width: 100%;
  background-color: white;
  padding: 10px;
  border-radius: 10px;

  .bagdImg {
    width: 100%;
    height: 30vh;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .myInfo {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .container-left {
      display: flex;
    }

    .infoBox {
      height: 50px;

      .nameAndSex {
        width: 70px;
      }

      .job {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .signature {
    margin: 20px 0px 0px 20px;
    font-size: 14px;
    color: #999;
  }

  .moreInfoBox {
    position: relative;

    .arrowBox {
      width: 20px;
      border-radius: 50%;
      background-color: #cccccc;
      color: white;
      position: absolute;
      right: 10px;
      bottom: 0px;
      cursor: pointer;
    }

    .moreInfo {
      margin-top: 10px;
      width: 100%;

      p {
        height: 22px;
        line-height: 22px;
        margin: 10px;
        margin-left: 20px;
        color: #999;
        font-size: 14px;
      }
    }
  }

  .lastLoginTime {
    width: 100%;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    margin: 20px 0px;
    padding: 20px;
    text-align: center;
    color: #999;
  }
}
</style>
