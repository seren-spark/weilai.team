import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useLocalStorageWithExpire } from "../composables/useLocalStorage";
import router from "@/router";
const { setLocalStorageWithExpire, getLocalStorageWithExpire } =
  useLocalStorageWithExpire();
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
// 添加请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getLocalStorageWithExpire("token");
    if (token && config.headers) {
      setLocalStorageWithExpire("token", token, 1000 * 60 * 60);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }
    return response.data;
  },
  (error) => {
    const currentPath = router.currentRoute.value.path; //  获取当前路径
    const token = getLocalStorageWithExpire("token");
    let { message } = error;
    if (message == "Network Error") {
      message = "网络错误";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }

    showAlert(message, "error");
    return Promise.reject(error);
  },
);

export default apiClient;
