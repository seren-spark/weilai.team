import { SmartAdapter } from "../adapters/smart-adapter";

import { smartApiClient } from "@/api/core/smart-api-client";
import { smartTeamConfigs } from "@/api/config/team-config";

/**
 * 智能API客户端 - 面试核心亮点
 *
 * 核心优势：
 * 1. 自动适配任意响应格式
 * 2. 统一返回格式
 * 3. 零配置使用
 */

/**
 * 智能用户服务 - 面试亮点
 *
 * 核心优势：
 * 1. 零配置使用
 * 2. 自动适配任意格式
 * 3. 统一调用方式
 */
class SmartUserService {
  /**
   * 获取任意团队用户列表 - 自动适配
   * 一个方法支持所有团队，自动识别格式
   */
  async getTeamUsers(teamId: string) {
    return smartApiClient.get(teamId, "/users");
  }

  /**
   * 创建用户 - 支持所有团队
   */
  async createUser(teamId: string, userData: any) {
    return smartApiClient.post(teamId, "/users", userData);
  }

  /**
   * 更新用户信息
   */
  async updateUser(teamId: string, userId: string, userData: any) {
    return smartApiClient.put(teamId, `/users/${userId}`, userData);
  }

  /**
   * 删除用户
   */
  async deleteUser(teamId: string, userId: string) {
    return smartApiClient.delete(teamId, `/users/${userId}`);
  }

  /**
   * 获取分页用户列表 - 自动检测分页
   */
  async getUsersPaginated(teamId: string, params?: any) {
    return smartApiClient.get(teamId, "/users/paginated", params);
  }

  /**
   * 跨团队批量获取数据
   */
  async getAllTeamsData() {
    const promises = [
      this.getTeamUsers("team-a"),
      this.getTeamUsers("team-b"),
      this.getTeamUsers("team-c"),
    ];

    const results = await Promise.allSettled(promises);
    return results.map((result) =>
      result.status === "fulfilled" ? result.value : null,
    );
  }
}

// 导出单例实例
export const smartUserService = new SmartUserService();
export default smartUserService;

/**
 * 基础使用示例
 */
export const basicUsage = {
  // 处理任意团队的响应
  async handleAnyTeamResponse(originalResponse: any) {
    // 一行代码完成适配
    const adaptedResponse = SmartAdapter.adaptResponse(originalResponse);

    console.log("原始响应:", originalResponse);
    console.log("适配后响应:", adaptedResponse);

    return adaptedResponse;
  },

  // 处理团队A的响应
  async handleTeamA() {
    const teamAResponse = {
      code: 200,
      message: "获取成功",
      data: {
        list: [
          { id: 1, name: "用户1" },
          { id: 2, name: "用户2" },
        ],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 100,
          totalPages: 10,
        },
      },
    };

    const result = SmartAdapter.adaptResponse(teamAResponse);
    console.log("团队A结果:", result);
    return result;
  },

  // 处理团队B的响应
  async handleTeamB() {
    const teamBResponse = {
      status: "success",
      msg: "数据获取成功",
      data: {
        items: [
          { id: 1, name: "用户1" },
          { id: 2, name: "用户2" },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 100,
          total_pages: 10,
        },
      },
    };

    const result = SmartAdapter.adaptResponse(teamBResponse);
    console.log("团队B结果:", result);
    return result;
  },
};
