<script setup lang="ts">
import { ref, watch, reactive, onMounted, onUnmounted } from "vue";
import * as z from "zod";
import Button from "./Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLogin from "../../composables/useLoginAll";
import LoginContent from "./LoginContent.vue";
import useDanerceHook from "@/composables/useDance";
import { Icon } from "@iconify/vue";

const loginData = reactive({
  account: "" as string | number | undefined,
  password: "" as string | number | undefined,
});
interface LoginError {
  account: string;
  password: string;
}

const buttonRef = ref<{ style: any; getElement: () => HTMLElement } | null>(
  null,
);
const { setDanceshow, resetPosition } = useDanerceHook(buttonRef);

const filedErrors = ref<z.ZodFormattedError<LoginError> | undefined>();
const loginSchema = z.object({
  account: z.string().min(1, { message: "请输入账号" }),
  password: z.string().min(1, { message: "请输入密码" }),
});

const loading = ref(false);

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
      //   console.log(loading);
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

onMounted(() => {
  document.addEventListener("click", handleClick);
});

onUnmounted(() => {
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
      <CardHeader class="flex items-center">
        <a class="back" href="/">
          <Icon icon="streamline-ultimate:house-1"></Icon>
        </a>
        <CardTitle class="loginTitle text-2xl"> 登录 </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <LoginContent
            :errors="filedErrors"
            :account="loginData.account"
            :password="loginData.password"
            :handle-login="handleLogin"
            :set-danceshow="setDanceshow"
            :reset-position="resetPosition"
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
            ref="buttonRef"
            v-preventReClick
            :native-type="'button'"
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
  left: 1.5rem;
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
  //   overflow: hidden;
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
    transition: all 0.1s ease;
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
