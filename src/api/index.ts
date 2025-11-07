/**
 * 统一API客户端导出文件
 * 面试亮点：清晰的模块化结构，便于维护和扩展
 */

// 核心类导出
export { SmartApiClient } from "./core/smart-api-client";
export { SmartAdapter } from "./adapters/smart-adapter";

// 配置导出
export { smartTeamConfigs, smartApiClient } from "./config/team-config";

// 服务层导出
export { smartUserService } from "./services/smart-user-service";

// 类型导出
export type {
  StandardResponse,
  StandardPagination,
  PaginationParams,
  BatchRequestConfig,
} from "./types";
