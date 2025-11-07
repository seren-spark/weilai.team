import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { SmartAdapter } from "@/api/adapters/smart-adapter";
import type { StandardResponse } from "../types";
import { smartTeamConfigs } from "@/api/config/team-config";
import { TokenManager } from "./token-manager";

/**
 * 智能API客户端 - 完全兼容axios
 */
export class SmartApiClient {
  private instances: Map<string, AxiosInstance> = new Map();
  private tokenManager = TokenManager.getInstance();
  private defaultTeamId = "team-2023";

  constructor(
    teamConfigs: Record<
      string,
      { baseURL: string; headers?: Record<string, string> }
    >,
  ) {
    this.initializeInstances(teamConfigs);
  }

  /**
   * 初始化所有团队的axios实例
   */
  private initializeInstances(teamConfigs: Record<string, any>) {
    Object.entries(teamConfigs).forEach(([teamId, config]) => {
      const instance = axios.create({
        baseURL: config.baseURL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
      });

      // 请求拦截器 - 自动添加token
      instance.interceptors.request.use(
        (config) => {
          const token = this.tokenManager.getToken(teamId);
          if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log(`[${teamId.toUpperCase()}] 请求已添加token`);
          } else {
            console.warn(`[${teamId.toUpperCase()}] 未找到token,请先设置`);
          }
          return config;
        },
        (error) => {
          console.error(`[${teamId.toUpperCase()}] 请求拦截器错误:`, error);
          return Promise.reject(error);
        },
      );

      // 响应拦截器 - 自动适配
      instance.interceptors.response.use(
        (response) => {
          const adaptedResponse = SmartAdapter.adaptResponse(response.data);
          console.log(`[${teamId.toUpperCase()}] 智能适配:`, adaptedResponse);
          return adaptedResponse;
        },
        (error) => {
          const adaptedError = SmartAdapter.adaptResponse(
            error.response?.data || { message: error.message },
          );
          console.error(`[${teamId.toUpperCase()}] 错误:`, adaptedError);
          return Promise.reject(adaptedError);
        },
      );

      this.instances.set(teamId, instance);
    });
  }

  /**
   * 核心请求方法 - 完全兼容axios格式
   */
  async request<T = any>(
    config: AxiosRequestConfig & { teamId?: string },
  ): Promise<StandardResponse<T>> {
    const { teamId = this.defaultTeamId, ...axiosConfig } = config;
    const instance = this.instances.get(teamId);

    if (!instance) {
      throw new Error(`团队 ${teamId} 的实例不存在`);
    }

    return instance.request(axiosConfig);
  }

  /**
   * GET 请求 - 支持多种格式
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig & { teamId?: string },
  ): Promise<StandardResponse<T>> {
    return this.request({ ...config, method: "GET", url });
  }

  /**
   * POST 请求 - 支持多种格式
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { teamId?: string },
  ): Promise<StandardResponse<T>> {
    return this.request({ ...config, method: "POST", url, data });
  }

  /**
   * PUT 请求 - 支持多种格式
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { teamId?: string },
  ): Promise<StandardResponse<T>> {
    return this.request({ ...config, method: "PUT", url, data });
  }

  /**
   * DELETE 请求 - 支持多种格式
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & { teamId?: string },
  ): Promise<StandardResponse<T>> {
    return this.request({ ...config, method: "DELETE", url });
  }

  /**
   * PATCH 请求 - 支持多种格式
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { teamId?: string },
  ): Promise<StandardResponse<T>> {
    return this.request({ ...config, method: "PATCH", url, data });
  }

  /**
   * 设置团队token
   */
  setTeamToken(teamId: string, token: string, persistent: boolean = true) {
    this.tokenManager.setToken(teamId, token, persistent);
  }

  /**
   * 获取团队token
   */
  getTeamToken(teamId: string): string | undefined {
    return this.tokenManager.getToken(teamId);
  }

  /**
   * 清除团队token
   */
  clearTeamToken(teamId: string, clearStorage: boolean = true) {
    this.tokenManager.clearToken(teamId, clearStorage);
  }

  /**
   * 清除所有token
   */
  clearAllTokens() {
    this.tokenManager.clearAllTokens();
  }

  /**
   * 设置默认团队
   */
  setDefaultTeam(teamId: string) {
    this.defaultTeamId = teamId;
  }

  /**
   * 获取默认团队
   */
  getDefaultTeam(): string {
    return this.defaultTeamId;
  }
}

// 创建并导出实例
export const smartApiClient = new SmartApiClient(smartTeamConfigs);
// 创建函数包装器
const apiClient = async <T = any>(config: {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  params?: any;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  teamId?: string;
}): Promise<T> => {
  const {
    url,
    method,
    params,
    data,
    headers,
    timeout,
    teamId,
    ...otherConfig
  } = config;

  return smartApiClient.request({
    url,
    method: method.toUpperCase() as any,
    params,
    data,
    headers,
    timeout,
    teamId,
    ...otherConfig,
  });
};

// 添加方法到函数对象
apiClient.get = <T = any>(url: string, config?: any): Promise<T> => {
  return smartApiClient.get(url, config);
};
// 添加 request 方法
apiClient.request = <T = any>(config: {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  params?: any;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  teamId?: string;
}): Promise<T> => {
  const {
    url,
    method,
    params,
    data,
    headers,
    timeout,
    teamId,
    ...otherConfig
  } = config;

  return smartApiClient.request({
    url,
    method: method.toUpperCase() as any,
    params,
    data,
    headers,
    timeout,
    teamId,
    ...otherConfig,
  });
};

apiClient.post = <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<T> => {
  return smartApiClient.post(url, data, config);
};

apiClient.put = <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<T> => {
  return smartApiClient.put(url, data, config);
};

apiClient.delete = <T = any>(url: string, config?: any): Promise<T> => {
  return smartApiClient.delete(url, config);
};

apiClient.patch = <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<T> => {
  return smartApiClient.patch(url, data, config);
};

// Token 管理方法
apiClient.setTeamToken = (
  teamId: string,
  token: string,
  persistent?: boolean,
) => {
  smartApiClient.setTeamToken(teamId, token, persistent);
};

apiClient.getTeamToken = (teamId: string) => {
  return smartApiClient.getTeamToken(teamId);
};

apiClient.clearTeamToken = (teamId: string, clearStorage?: boolean) => {
  smartApiClient.clearTeamToken(teamId, clearStorage);
};

apiClient.clearAllTokens = () => {
  smartApiClient.clearAllTokens();
};

apiClient.setDefaultTeam = (teamId: string) => {
  smartApiClient.setDefaultTeam(teamId);
};

apiClient.getDefaultTeam = () => {
  return smartApiClient.getDefaultTeam();
};

export default apiClient;
