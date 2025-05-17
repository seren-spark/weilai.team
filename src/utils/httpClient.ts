import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useRequest } from "vue-request";
import { ref } from "vue";

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      // 如果 token 存在，则将其添加到请求头中
      const Token = JSON.parse(token).value;
      config.headers.Authorization = `Bearer ${Token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function useApiRequest<T>(config: AxiosRequestConfig) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  let resolveFetch: ((value: T) => void) | null = null
  let rejectFetch: ((reason: unknown) => void) | null = null

  const { run } = useRequest(
    async (dynamicConfig?: Partial<AxiosRequestConfig>) => {
      loading.value = true
      try {
        const response = await axiosInstance.request<T>({
          ...config,
          ...dynamicConfig,
        })
        data.value = response.data
        resolveFetch?.(response.data)
      } catch (err) {
        error.value = err as Error
        rejectFetch?.(err)
      } finally {
        loading.value = false
      }
    },
    {
      manual: true,
    }
  )

  const fetchData = (dynamicConfig?: Partial<AxiosRequestConfig>) => {
    return new Promise<T>((resolve, reject) => {
      resolveFetch = resolve
      rejectFetch = reject
      run(dynamicConfig)
    })
  }

  return {
    data,
    error,
    loading,
    fetchData,
  }
}


export const apis = {
  addUserLifePhotos: {
    url: "/user/addUserLifePhoto",
    method: "POST",
  },
  deleteUserLifePhotos: {
    url: "/user/deleteUserLifePhoto",
    method: "DELETE",
  },
  getUserLifePhotos: {
    url: "/user/getUserLifePhotoByUserId/{userId}",
    method: "GET",
  },
};