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

// ==================== 响应格式配置类型定义 ====================

/**
 * 分页配置类型
 */
export type PaginationType = "nested" | "flat" | "none";

/**
 * 分页格式配置
 */
export interface PaginationConfig {
  /** 分页类型：nested-嵌套分页, flat-扁平分页, none-不分页 */
  type: PaginationType;
  /** 列表字段名（如：records, list, items, data） */
  listField: string;
  /** 分页信息字段名（仅nested类型需要，如：pagination, pageInfo, meta） */
  paginationField?: string;
  /** 当前页字段名 */
  currentField: string;
  /** 每页数量字段名 */
  sizeField: string;
  /** 总记录数字段名 */
  totalField: string;
  /** 总页数字段名（可选） */
  pagesField?: string;
}

/**
 * 消息字段配置
 */
export interface MessageConfig {
  /** 消息字段位置：top-顶层, data-data字段内 */
  location: "top" | "data";
  /** 消息字段名（如：message, msg, msgOther, error） */
  field: string;
  /** 备用消息字段（可选） */
  fallbackField?: string;
}

/**
 * 响应格式配置
 */
export interface ResponseFormatConfig {
  /** 成功标识字段（如：code, status, success） */
  successField: string;
  /** 成功值（可以是单个值或数组）*/
  successValue: number | string | boolean | Array<number | string | boolean>;
  /** 数据字段（如：data, result, payload） */
  dataField: string;
  /** 消息配置 */
  message: MessageConfig;
  /** 分页配置（可选） */
  pagination?: PaginationConfig;
  /** 错误时data是否包含错误信息 */
  errorInData?: boolean;
}

/**
 * 团队配置
 */
export interface TeamConfig {
  /** 团队ID */
  teamId?: string;
  /** 基础URL */
  baseURL: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 响应格式配置（可选，不配置则使用自动检测） */
  responseFormat?: ResponseFormatConfig;
  /** 自定义规则：针对特定接口的配置 */
  customRules?: Record<string, Partial<ResponseFormatConfig>>;
}

/**
 * 检测结果
 */
export interface DetectionResult {
  /** 成功标识字段 */
  successField: string;
  /** 数据字段 */
  dataField: string;
  /** 消息字段 */
  messageField: string;
  /** 消息字段位置 */
  messageLocation: "top" | "data";
  /** 分页信息 */
  paginationInfo: any;
  /** 是否分页 */
  isPaginated: boolean;
  /** 置信度评分 0-100 */
  confidence: number;
}

/**
 * 适配器配置
 */
export interface AdapterConfig {
  /** 启用调试模式 */
  debug: boolean;
  /** 适配模式：config-仅配置, auto-仅自动, hybrid-混合 */
  mode: "config" | "auto" | "hybrid";
  /** 缓存配置 */
  cache: {
    enabled: boolean;
    ttl?: number; // 缓存过期时间（毫秒）
  };
  /** 低置信度阈值 */
  lowConfidenceThreshold: number;
}
