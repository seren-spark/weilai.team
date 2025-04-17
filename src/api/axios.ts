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
      console.log("token过期或未登录");
      localStorage.removeItem("token");
      router.push("/login");
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
