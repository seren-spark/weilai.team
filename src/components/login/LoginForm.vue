<script setup lang="ts">
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLogin from "../../composables/useLoginAll";
import LoginContent from "./LoginContent.vue";
import { ref, watch, reactive } from "vue";
import * as z from "zod";
import { onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

const loginData = reactive({
  account: "" as string | number | undefined,
  password: "" as string | number | undefined,
});
interface LoginError {
  account: string;
  password: string;
}

const filedErrors = ref<z.ZodFormattedError<LoginError> | undefined>();
const loginSchema = z.object({
  account: z.string().min(1, { message: "请输入账号" }),
  password: z.string().min(1, { message: "请输入密码" }),
});

const loading = ref(false);
// const mouseX = ref(0);
// const mouseY = ref(0);

const validateLogin = () => {
  const loginResult = loginSchema.safeParse({
    account: loginData.account,
    password: loginData.password,
  });
  if (!loginResult.success) {
    filedErrors.value = loginResult.error.format();
  }
  return loginResult.success;
};

const { getLogin } = useLogin();

const handleLogin = async () => {
  if (!validateLogin()) {
    return;
  }
  watch(
    () => loading,
    () => {
      console.log(loading);
    },
  );
  getLogin(loginData.account, loginData.password);
};

// 控制动画显示的状态
const isVisible = ref(false);
// 监听点击事件，触发动画
const handleClick = () => {
  if (!isVisible.value) {
    isVisible.value = true;
  }
};

// 按钮状态
// const buttonActive = computed(() => loginData.account && loginData.password);

// // 1. 新增：用ref关联表单容器和按钮，动态获取DOM
// const formRef = ref<HTMLDivElement | null>(document.querySelector("#loginOut")); // 表单容器（.loginOut）
// const buttonRef = ref<HTMLButtonElement | null>(null); // 登录按钮

// // 2. 移除硬编码的尺寸，改为动态计算
// const buttonStyle = computed(() => {
//   if (buttonActive.value) {
//     return {
//       transform: "translate(0px, 0px) rotateX(0deg) rotateY(0deg)",
//       boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.15)",
//       pointerEvents: "auto",
//     };
//   }

//   // 2.1 获取表单和按钮的真实尺寸（动态适配）
//   const formDom = formRef.value;
//   const buttonDom = buttonRef.value;
//   console.log(formDom, buttonDom);
//   if (!formDom || !buttonDom) return {};

//   const formRect = formDom.getBoundingClientRect(); // 表单容器尺寸
//   const buttonRect = buttonDom.getBoundingClientRect(); // 按钮尺寸

//   // 2.2 计算按钮在表单内的中心坐标（相对表单的位置）
//   const formWidth = formRect.width; // 表单实际宽度（替代硬编码的400）
//   const formHeight = formRect.height; // 表单实际高度（替代硬编码的40）
//   // 按钮左上角相对于表单的偏移量（X轴）
//   const buttonOffsetX = buttonRect.left - formRect.left;
//   // 按钮中心X坐标 = 偏移量 + 按钮宽度的一半（动态计算，非硬编码）
//   const bx = buttonOffsetX + buttonRect.width / 2;
//   // 按钮中心Y坐标（垂直方向，根据实际布局调整）
//   const by = buttonOffsetX + buttonRect.height / 2;
//   console.log(bx, by);
//   // 2.3 计算鼠标在表单内的相对位置（以表单左上角为原点）
//   const mouseInFormX = mouseX.value; // 修正：已改为表单参考系的X
//   const mouseInFormY = mouseY.value; // 修正：已改为表单参考系的Y

//   // 2.4 后续计算保持不变（距离、角度、椭圆半径等）
//   const dist =
//     Math.sqrt(Math.pow(mouseInFormX - bx, 2) + Math.pow(mouseInFormY - by, 2)) *
//     2;
//   const angle = Math.atan2(mouseInFormY - by, mouseInFormX - bx);
//   const radius = Math.sqrt(
//     Math.pow(buttonRect.width + 20, 2) * Math.pow(Math.cos(angle), 2) +
//       Math.pow(buttonRect.height + 20, 2) * Math.pow(Math.sin(angle), 2),
//   );
//   const ox = -1 * Math.cos(angle) * Math.max((radius - dist) / 2, 0);
//   const oy = -1 * Math.sin(angle) * Math.max((radius - dist) / 2, 0);
//   const rx = oy / 2;
//   const ry = -ox / 2;

//   return {
//     transform: `translate(${ox}px, ${oy}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
//     boxShadow: `0px ${Math.abs(oy)}px ${(Math.abs(oy) / radius) * 40}px rgba(0, 0, 0, 0.15)`,
//     pointerEvents: "none",
//   };
// });

// 鼠标移动监听（注意：若按钮在表单内，建议通过 ref 获取 DOM ，减少 document.getElementById 硬编码）
// let handleMouseMove: ((event: MouseEvent) => void) | undefined;
onMounted(() => {
  //   handleMouseMove = (event: MouseEvent) => {
  //     const form = document.getElementById("loginButton");
  //     if (form) {
  //       const rect = form.getBoundingClientRect();
  //       mouseX.value = event.clientX - rect.left;
  //       mouseY.value = event.clientY - rect.top;
  //     }
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("click", handleClick);
});

onUnmounted(() => {
  //   if (handleMouseMove) {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   }
  document.removeEventListener("click", handleClick);
});
</script>

<template>
  <div id="loginOut" class="loginOut">
    <!-- :class="{ 'animate-fadeIn': isVisible }" -->
    <Card
      class="loginContent mx-auto max-w-sm"
      :class="{ clickContent: isVisible }"
    >
      <CardHeader>
        <a class="back" href="/"
          ><Icon icon="streamline-ultimate:house-1"></Icon
        ></a>
        <CardTitle class="loginTitle text-2xl"> 登录 </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <LoginContent
            :errors="filedErrors"
            :account="loginData.account"
            :password="loginData.password"
            :handle-login="handleLogin"
            @update:login-account="
              (val) => {
                loginData.account = val;
                const result = loginSchema.pick({ account: true }).safeParse({
                  account: val,
                });
                if (filedErrors) {
                  filedErrors.account = result.error?.format().account;
                }
              }
            "
            @update:login-password="
              (val) => {
                loginData.password = val;
                const result = loginSchema.pick({ password: true }).safeParse({
                  password: val,
                });
                if (filedErrors) {
                  filedErrors.password = result.error?.format().password;
                }
              }
            "
          ></LoginContent>
          <!-- :class="
              buttonActive
                ? 'button-active loginButton w-full'
                : 'loginButton w-full'
            "
            :style="buttonStyle" -->
          <Button
            id="loginButton"
            v-preventReClick
            type="submit"
            class="loginButton w-full"
            @click="handleLogin"
          >
            登录
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.loginOut {
  width: 24rem;
}

.back {
  position: absolute;
  font-size: 1.6rem;
  top: 2rem;
  color: rgb(119, 119, 119);
}

.loginContent {
  position: relative;
  margin-top: 5.2rem;
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  opacity: 0;
  height: 0;
  overflow: hidden;
  animation: fadeIn 0.5s linear forwards;
  animation-delay: 2.4s;

  .loginTitle {
    text-align: center;
    font-size: 2rem;
    margin: 0.3rem 0 0px 0;
  }

  .inputTitle {
    font-size: 1rem;
    margin: 0.3rem 0 0.3rem 0;
  }

  .forgotPass {
    position: relative;
    top: -1.2rem;
  }

  .loginButton {
    margin-bottom: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    border: none;
    box-shadow: none;
    border-radius: 1.2rem;
    background-color: #e1f2fd;
  }

  .button-active {
    transition: all 0.1s ease;
  }

  .errorHead {
    display: flex;
    align-items: center;
    color: var(--destructive-foreground);
  }

  .noWrite {
    border: 0.08rem solid var(--destructive-foreground);
  }
}

.clickContent {
  animation: none;
  animation-play-state: paused;
  opacity: 1;
  height: 100%;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    height: 0%;
  }

  100% {
    opacity: 1;
    height: 100%;
  }
}

@keyframes fadeIn2 {
  0% {
    height: 0%;
  }

  100% {
    height: 100%;
  }
}

@media screen and (max-width: 1400px) {
  .loginContent {
    .loginTitle {
      text-align: center;
    }
  }
}

@media screen and (max-width: 1200px) {
  .loginContent {
    .loginTitle {
      text-align: center;
    }
  }
}

@media screen and (min-width: 1024px) {
}

@media screen and (max-width: 500px) {
  .loginContent {
    background: none;
    border: none;
    box-shadow: none;

    .loginTitle {
      text-align: start;
    }

    .inputTitle {
      display: none;
    }
  }
}
</style>
