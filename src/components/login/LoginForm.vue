<script setup lang="ts">
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLogin from "../../composables/useLoginAll";
import LoginContent from "./LoginContent.vue";
import { ref, watch, reactive } from "vue";
import * as z from "zod";
import { onMounted, onUnmounted } from "vue";

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
onMounted(() => {
  document.addEventListener("click", handleClick);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClick);
});
</script>

<template>
  <div class="loginOut">
    <!-- :class="{ 'animate-fadeIn': isVisible }" -->
    <Card
      class="loginContent mx-auto max-w-sm"
      :class="{ clickContent: isVisible }"
    >
      <CardHeader>
        <CardTitle class="loginTitle text-2xl"> 登录 </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <LoginContent
            :errors="filedErrors"
            :account="loginData.account"
            :password="loginData.password"
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
          <Button v-preventReClick type="submit" class="loginButton w-full" @click="handleLogin">
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

.loginContent {
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

  .errorHead {
    display: flex;
    align-items: center;
    color: var(--destructive-foreground);
  }

  .noWrite {
    border: 0.08rem solid var(--destructive-foreground);
    // color: var(--destructive-foreground);
  }
}

.clickContent {
  animation: none;
  animation-play-state: paused;
  opacity: 1;
  height: 100%;
}

// .loginContent.animate-fadeIn {
//     opacity: 1;
//     height: 100%;
// }

@keyframes fadeIn {
  0% {
    opacity: 0;
    height: 0%;
    // transform: scale(0);
  }

  100% {
    opacity: 1;
    height: 100%;
    // transform: scale(1);
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
//   .loginOut {
//     width: 350px;
//   }

  .loginContent {
    // margin-top: 80px;

    .loginTitle {
      text-align: center;
    //   font-size: 30px;
    //   margin: 5px 0 0px 0;
    }

    .inputTitle {
    //   font-size: 14px;
    //   margin: 3px 0 1px 0;
    }

    .formInput {
    //   height: 36px;
    //   font-size: 12px;
    }

    .loginButton {
    //   height: 35px;
    //   font-size: 14px;
    //   margin-bottom: 25px;
    }
  }
}

@media screen and (max-width: 1200px) {
//   .loginOut {
//     width: 300px;
//   }

  .loginContent {
    // margin-top: 70px;

    .loginTitle {
      text-align: center;
    //   font-size: 28px;
    //   margin: 0;
    }

    .inputTitle {
    //   font-size: 12px;
    //   margin: 0;
    }

    .formInput {
    //   height: 28px;
    //   font-size: 10px;
    }

    .loginButton {
    //   height: 28px;
    //   font-size: 13px;
    //   margin-bottom: 15px;
    }
  }
}

@media screen and (min-width: 1024px) {
}

@media screen and (max-width: 500px) {
//   .loginOut {
//     width: 100%;
//     margin: 0;
//   }

  .loginContent {
    background: none;
    // margin-top: 90px;
    border: none;
    box-shadow: none;

    .loginTitle {
      // display: none;
    //   width: 70px;
      text-align: start;
    //   font-size: 32px;
    //   margin: 8px 0 5px 0;
    //   padding: 2px 3px;
    //   border-bottom: #5abaf9 3px solid;
    }

    .inputTitle {
      display: none;
    //   font-size: 18px;
    //   margin: 2px 0 5px 0;
    }

    .formInput {
    //   height: 60px;
    //   font-size: 20px;
    //   border-radius: 40px;
    //   padding: 0 20px;
    //   margin: 10px 0;
    }

    .loginButton {
    //   height: 50px;
    //   font-size: 24px;
    //   border-radius: 25px;
    //   margin-bottom: 15px;
    }
  }
}
</style>
