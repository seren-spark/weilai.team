import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
// import { useRequest } from "@/composables/useRequest";
import { useRequest } from "vue-request";
import apiClient from "@/api/axios";
import { useLoginStore } from "@/store/useLoginStore";
import { useRouter } from "vue-router";
import { useAlert } from "./useAlert";
import { useSseStore } from "../store/useSseStore";
import type { ApiResponseData } from "@/types/api-response";
import { ref, watch } from "vue";
const sseStore = useSseStore();

const loginStore = useLoginStore();
const { setLocalStorageWithExpire } = useLocalStorageWithExpire();
const { showAlert } = useAlert();
interface EmailResponse {
  code: number;
  message?: string;
}

interface Data {
  code: number;
  message?: string;
  data?: {
    token: string;
    userId: string;
  };
}
export default function () {
    const passed = ref(false);
    const router = useRouter();
    // 登录
    function getLogin(account: string | number | undefined, password: string | number | undefined) {
        const getLoginAx = () => apiClient.post('/index/login', {
            account,
            password
        })

    const { data } = useRequest(getLoginAx, {
      debounceInterval: 500,
    });
    watch(data, () => {
      console.log(data);
      const res = data.value as Data;
      const resData = res.data;
      if (res.code == 1000) {
        if (resData) {
          setLocalStorageWithExpire("token", resData.token, 1000 * 60 * 60);
          setLocalStorageWithExpire("userId", resData.userId, 1000 * 60 * 60);
          showAlert("登录成功！", "pass");
          router.push("/");
          sseStore.connect();
        } else {
          showAlert("服务器返回数据异常", "error");
        }
      }
      if (res.code == 1002) {
        showAlert("用户名不存在", "error");
      } else if (res.code == 1001) {
        showAlert("密码错误", "error");
      } else if (res.code == 1003) {
        showAlert("账户已在别处登录，请重新登录", "waring");
      } else if (res.code == 403) {
        showAlert("请勿重复登录！", "waring");
      }
      if (res.code == 1002) {
        showAlert("用户名不存在", "error");
      } else if (res.code == 1001) {
        showAlert("密码错误", "error");
      } else if (res.code == 1003) {
        showAlert("账户已在别处登录，请重新登录", "waring");
      }
    });
  }

  // 获取验证码
  function useGetCode(email: string | number | undefined) {
    const useGetCodeAx = () => {
      return apiClient.get(`/index/sendEmailCode/${email}`);
    };
    const { data } = useRequest<ApiResponseData<EmailResponse>>(useGetCodeAx);
    watch(data, () => {
      console.log(data);
      const res = data.value as EmailResponse;
      if (res.code == 1007) {
        showAlert("验证码发送成功", "pass");
        loginStore.startCountdown();
      } else if (res.code == 1005) {
        showAlert("验证码未过期", "waring");
      } else if (res.code == 1004) {
        showAlert("邮箱格式错误", "waring");
      } else if (res.code == 1002) {
        showAlert("该用户不存在", "error");
      }
    });
  }

  // 重置密码
  function useResetPassword(
    email: string | number | undefined,
    code: string | number | undefined,
    newPassword: string | number | undefined,
  ) {
    const resetPasswordAx = () =>
      apiClient.put("/index/findPassword", {
        email,
        code,
        newPassword,
      });
    const { data } = useRequest(resetPasswordAx);
    watch(data, () => {
      const res = data.value as Data;
      if (res.code == 1006) {
        showAlert("验证码已过期", "error");
      } else if (res.code == 1008) {
        showAlert("验证码错误", "error");
      } else if (res.code == 1009) {
        showAlert("密码重置成功", "pass");
      }
    });
  }

  // 退出登录
  function logout() {
    const logoutAx = () => apiClient.delete("/index/logout");
    const { data } = useRequest(logoutAx);
    watch(data, () => {
      console.log(data);
      const res = data.value as Data;
      if (res.code == 200) {
        showAlert("退出登录成功", "pass");
        router.push("/login");
      }
    });
  }

  return {
    getLogin,
    useGetCode,
    useResetPassword,
    logout,
  };
}
