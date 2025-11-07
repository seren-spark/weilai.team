import { SmartAdapter } from "../adapters/smart-adapter";
import type { StandardResponse, PaginationParams } from "../types";

/**
 * 智能用户服务 - 企业级解决方案
 */
export class SmartUserService {
  /**
   * 获取团队用户列表 - 零配置使用
   */
  async getTeamUsers(teamId: string): Promise<StandardResponse> {
    try {
      // 模拟API调用
      const response = await this.mockApiCall(teamId);

      // 智能适配 - 无需任何配置
      return SmartAdapter.adaptResponse(response, teamId);
    } catch (error) {
      return SmartAdapter.adaptResponse({ error: error.message });
    }
  }

  /**
   * 创建用户 - 零配置使用
   */
  async createUser(teamId: string, userData: any): Promise<StandardResponse> {
    try {
      // 模拟API调用
      const response = await this.mockCreateUser(teamId, userData);

      // 智能适配 - 无需任何配置
      return SmartAdapter.adaptResponse(response, teamId);
    } catch (error) {
      return SmartAdapter.adaptResponse({ error: error.message });
    }
  }

  /**
   * 获取分页用户列表 - 零配置使用
   */
  async getUsersPaginated(
    teamId: string,
    params: PaginationParams,
  ): Promise<StandardResponse> {
    try {
      // 模拟API调用
      const response = await this.mockPaginatedApiCall(teamId, params);

      // 智能适配 - 自动识别分页格式
      return SmartAdapter.adaptResponse(response, teamId);
    } catch (error) {
      return SmartAdapter.adaptResponse({ error: error.message });
    }
  }

  private async mockApiCall(teamId: string): Promise<any> {
    // 模拟不同团队的响应格式
    const mockResponses = {
      "team-a": {
        code: 200,
        message: "获取成功",
        data: [
          { id: 1, name: "用户1", email: "user1@teama.com" },
          { id: 2, name: "用户2", email: "user2@teama.com" },
        ],
      },
      "team-b": {
        status: "success",
        msg: "数据获取成功",
        data: [
          { id: 1, name: "用户1", email: "user1@teamb.com" },
          { id: 2, name: "用户2", email: "user2@teamb.com" },
        ],
      },
      "team-c": {
        success: true,
        message: "请求成功",
        data: [
          { id: 1, name: "用户1", email: "user1@teamc.com" },
          { id: 2, name: "用户2", email: "user2@teamc.com" },
        ],
      },
    };

    return mockResponses[teamId] || mockResponses["team-a"];
  }

  private async mockCreateUser(teamId: string, userData: any): Promise<any> {
    // 模拟不同团队的创建响应格式
    const mockResponses = {
      "team-a": {
        code: 201,
        message: "创建成功",
        data: {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString(),
        },
      },
      "team-b": {
        status: "created",
        msg: "用户创建成功",
        data: {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString(),
        },
      },
      "team-c": {
        success: true,
        message: "用户创建成功",
        data: {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString(),
        },
      },
    };

    return mockResponses[teamId] || mockResponses["team-a"];
  }

  private async mockPaginatedApiCall(
    teamId: string,
    params: any,
  ): Promise<any> {
    // 模拟不同团队的分页响应格式
    const mockResponses = {
      "team-a": {
        code: 200,
        message: "获取成功",
        data: {
          list: [
            { id: 1, name: "用户1", email: "user1@teama.com" },
            { id: 2, name: "用户2", email: "user2@teama.com" },
            { id: 3, name: "用户3", email: "user3@teama.com" },
          ],
          pagination: {
            current: params.page,
            pageSize: params.pageSize,
            total: 100,
            totalPages: 10,
          },
        },
      },
      "team-b": {
        status: "success",
        msg: "数据获取成功",
        data: {
          items: [
            { id: 1, name: "用户1", email: "user1@teamb.com" },
            { id: 2, name: "用户2", email: "user2@teamb.com" },
            { id: 3, name: "用户3", email: "user3@teamb.com" },
          ],
          meta: {
            page: params.page,
            limit: params.pageSize,
            total: 100,
            total_pages: 10,
          },
        },
      },
      "team-c": {
        success: true,
        message: "请求成功",
        data: {
          users: [
            { id: 1, name: "用户1", email: "user1@teamc.com" },
            { id: 2, name: "用户2", email: "user2@teamc.com" },
            { id: 3, name: "用户3", email: "user3@teamc.com" },
          ],
          current: params.page,
          pageSize: params.pageSize,
          total: 100,
          totalPages: 10,
        },
      },
    };

    return mockResponses[teamId] || mockResponses["team-a"];
  }
}

export const smartUserService = new SmartUserService();
