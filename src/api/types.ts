/*
 * @Author: serendipity 2843306836@qq.com
 * @Date: 2025-09-27 10:17:07
 * @LastEditors: serendipity 2843306836@qq.com
 * @LastEditTime: 2025-11-07 11:18:29
 * @FilePath: \weilai.team\src\api\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 统一API客户端类型定义
 * 面试亮点：完整的类型系统设计，支持泛型和动态配置
 */

// ==================== 基础类型定义 ====================

/**
 * 标准响应格式 - 统一所有团队的响应结构
 */
export interface StandardResponse<T = any> {
  success: boolean; // 统一成功标识
  data: T; // 业务数据
  message: string; // 提示信息
  code: number; // 状态码
  timestamp: number; // 时间戳
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 标准分页响应格式 - 扁平化结构
 */
export interface StandardPagination<T = any> {
  list: T[];
  current: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * 批量请求配置
 */
export interface BatchRequestConfig {
  teamId: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  params?: any;
}
