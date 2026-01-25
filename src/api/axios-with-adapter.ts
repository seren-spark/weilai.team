/**
 * Axios + 智能适配器集成示例
 * 这个文件展示了如何在现有的 axios 实例中集成智能适配器
 * 可以直接替换原有的 axios.ts 文件使用
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useLocalStorageWithExpire } from "../composables/useLocalStorage";
import router from "@/router";
import { SmartAdapter } from "./adapters/smart-adapter";
import { teamConfigs } from "./config/team-config";
import type { StandardResponse } from "./types";

const { setLocalStorageWithExpire, getLocalStorageWithExpire } =
  useLocalStorageWithExpire();

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();

// ==================== 请求拦截器 ====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getLocalStorageWithExpire("token");
    if (token && config.headers) {
      setLocalStorageWithExpire("token", token, 1000 * 60 * 60);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[Request]", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==================== 响应拦截器（集成智能适配器） ====================
apiClient.interceptors.response.use(
  (response: AxiosResponse): any => {
    console.log("[Response]", response.data);

    // 🚀 使用智能适配器处理响应
    // 方案1: 使用默认团队配置
    // const adaptedResponse = SmartAdapter.adaptResponse(
    //   response.data,
    //   teamConfigs['default']  // 使用默认配置
    // );

    // 方案2: 零配置，自动检测（适用于不确定格式的情况）
    const adaptedResponse = SmartAdapter.adaptResponse(response.data);

    // 方案3: 根据请求URL动态选择团队配置
    // const teamId = getTeamIdFromUrl(response.config.url);
    // const adaptedResponse = SmartAdapter.adaptResponse(
    //   response.data,
    //   teamConfigs[teamId]
    // );

    // 处理401未授权
    if (adaptedResponse.code === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }

    // 返回标准化的响应
    return adaptedResponse;
  },
  (error) => {
    console.error("[Response Error]", error);

    let { message } = error;
    if (message == "Network Error") {
      message = "网络错误";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }

    showAlert(message, "error");

    // 返回标准错误响应
    return Promise.reject({
      success: false,
      data: null,
      message,
      code: error.response?.status || 500,
      timestamp: Date.now(),
    } as StandardResponse);
  },
);

// ==================== 辅助函数 ====================

/**
 * 根据 URL 判断使用哪个团队配置
 * 可以根据实际需求自定义规则（当前未使用）
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTeamIdFromUrl(url?: string): string {
  if (!url) return "default";

  // 示例：根据URL路径判断
  if (url.includes("/team-a/")) return "team-a";
  if (url.includes("/team-b/")) return "team-b";
  if (url.includes("/legacy/")) return "team-legacy-complex";

  return "default";
}

// ==================== 便捷方法封装 ====================

/**
 * 类型安全的GET请求
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function get<T = any>(
  url: string,
  params?: Record<string, unknown>,
): Promise<StandardResponse<T>> {
  const response = await apiClient.get(url, { params });
  return response as StandardResponse<T>;
}

/**
 * 类型安全的POST请求
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post<T = any>(
  url: string,
  data?: Record<string, unknown>,
): Promise<StandardResponse<T>> {
  const response = await apiClient.post(url, data);
  return response as StandardResponse<T>;
}

/**
 * 类型安全的PUT请求
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function put<T = any>(
  url: string,
  data?: Record<string, unknown>,
): Promise<StandardResponse<T>> {
  const response = await apiClient.put(url, data);
  return response as StandardResponse<T>;
}

/**
 * 类型安全的DELETE请求
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function del<T = any>(
  url: string,
  params?: Record<string, unknown>,
): Promise<StandardResponse<T>> {
  const response = await apiClient.delete(url, { params });
  return response as StandardResponse<T>;
}

export default apiClient;
