
/**
 * 团队配置文件 - 智能适配器配置中心
 * 
 * 设计思路：
 * 1. 配置优先：已知团队格式直接配置，性能最优
 * 2. 自动兜底：未配置的团队自动检测，灵活性最高
 * 3. 可扩展：新团队接入只需添加配置，无需改动代码
 * 
 * 面试亮点：
 * - 配置化设计，降低维护成本
 * - 类型安全，编译时错误检查
 * - 模板化配置，快速复制
 */

// ==================== 类型定义 ====================

/**
 * 响应格式配置 - 描述后端响应的结构（声明式配置）
 */
export interface ResponseFormatConfig {
  // 成功标识字段配置
  successField: string;              // 字段名: code | status | success
  successValues: (string | number | boolean)[]; // 成功值: [200] | ["success"] | [true]
  
  // 数据字段配置
  dataField: string;                 // 数据字段名: data | result | payload
  
  // 消息字段配置
  messageField: string | string[];   // 消息字段名: message | msg | ['message', 'msg'] (支持优先级)
  
  // 错误处理配置（可选）
  errorConfig?: {
    errorDataType?: 'string' | 'object' | 'null'; // data为错误信息时的类型
    errorMessageField?: string | string[];        // 错误消息字段: message | error | msg (支持优先级)
    nestedMessagePath?: string | string[];        // 嵌套消息路径: 'data.message' | ['data', 'message']
  };
  
  // 分页配置（可选）
  paginationConfig?: {
    type: 'nested' | 'flat';         // 分页类型: 嵌套 | 扁平
    recordsField: string;            // 列表字段: list | items | records
    paginationField?: string;        // 分页信息字段: pagination | pageInfo (nested类型必填)
    currentField?: string;           // 当前页字段: current | page
    sizeField?: string;              // 每页数量字段: pageSize | size
    totalField?: string;             // 总数字段: total | totalCount
    pagesField?: string;             // 总页数字段: totalPages | pages
  };
}

/**
 * 自定义处理函数（函数式配置）
 * 用于处理复杂场景，优先级高于声明式配置
 */
export interface CustomHandlers {
  /**
   * 自定义匹配规则 - 判断当前请求是否应用此配置
   * @param config 请求配置（包含 url, method 等）
   * @returns 是否匹配
   */
  match?: (config: { url?: string; method?: string; [key: string]: any }) => boolean;
  
  /**
   * 自定义成功判断 - 覆盖默认的 successField 判断
   * @param response 原始响应数据
   * @returns 是否成功
   */
  isSuccess?: (response: any) => boolean;
  
  /**
   * 自定义数据提取 - 覆盖默认的 dataField 提取
   * @param response 原始响应数据
   * @returns 提取的数据
   */
  getData?: (response: any) => any;
  
  /**
   * 自定义错误信息提取 - 覆盖默认的 messageField 提取
   * @param response 原始响应数据
   * @returns 错误信息
   */
  getError?: (response: any) => string;
  
  /**
   * 自定义消息提取 - 覆盖默认的 messageField 提取（包括成功和失败）
   * @param response 原始响应数据
   * @param isSuccess 是否成功
   * @returns 消息内容
   */
  getMessage?: (response: any, isSuccess: boolean) => string;
  
  /**
   * 响应预处理 - 在适配之前对响应进行转换
   * @param response 原始响应数据
   * @returns 转换后的响应数据
   */
  transform?: (response: any) => any;
  
  /**
   * 错误后处理 - 对适配后的错误响应进行额外处理
   * @param error 适配后的标准错误响应
   * @param originalResponse 原始响应数据
   * @returns 处理后的错误响应
   */
  errorTransform?: (error: any, originalResponse?: any) => any;
  
  /**
   * 自定义分页数据提取
   * @param response 原始响应数据
   * @returns 标准分页数据
   */
  getPagination?: (response: any) => {
    records: any[];
    current: number;
    size: number;
    total: number;
    pages: number;
    [key: string]: any;
  } | null;
}

/**
 * 团队配置（混合方案：声明式 + 函数式）
 */
export interface TeamConfig {
  teamId: string;                    // 团队标识
  teamName?: string;                 // 团队名称（便于管理）
  baseURL: string;                   // 接口基础URL
  headers?: Record<string, string>;  // 自定义请求头
  timeout?: number;                  // 超时时间（毫秒）
  
  // === 声明式配置（推荐，覆盖90%场景） ===
  // 可选，不配置则使用智能检测
  responseFormat?: ResponseFormatConfig;
  
  // === 函数式配置（可选，处理复杂场景） ===
  // 优先级：customHandlers > responseFormat > 智能检测
  customHandlers?: CustomHandlers;
  
  // 其他配置
  enableCache?: boolean;             // 是否启用缓存（默认true）
  description?: string;              // 配置说明
}

// ==================== 配置模板 ====================

/**
 * 标准模板1: {code, data, message} 格式
 * 适用场景：大部分标准RESTful API
 */
export const TEMPLATE_CODE_DATA_MESSAGE: ResponseFormatConfig = {
  successField: 'code',
  successValues: [200, 201],
  dataField: 'data',
  messageField: 'message',
  errorConfig: {
    errorDataType: 'null',
    errorMessageField: 'message'
  }
};

/**
 * 标准模板2: {status, data, msg} 格式
 * 适用场景：部分自定义API
 */
export const TEMPLATE_STATUS_DATA_MSG: ResponseFormatConfig = {
  successField: 'status',
  successValues: ['success', 'ok', 'completed'],
  dataField: 'data',
  messageField: 'msg',
  errorConfig: {
    errorDataType: 'null',
    errorMessageField: 'msg'
  }
};

/**
 * 标准模板3: {success, result, message} 格式
 * 适用场景：GraphQL风格API
 */
export const TEMPLATE_SUCCESS_RESULT_MESSAGE: ResponseFormatConfig = {
  successField: 'success',
  successValues: [true],
  dataField: 'result',
  messageField: 'message',
  errorConfig: {
    errorDataType: 'object',
    errorMessageField: 'message'
  }
};

/**
 * 分页模板1: 嵌套分页格式
 * {data: {records: [], pagination: {current, total}}}
 */
export const PAGINATION_NESTED_TEMPLATE = {
  type: 'nested' as const,
  recordsField: 'records',
  paginationField: 'pagination',
  currentField: 'current',
  sizeField: 'pageSize',
  totalField: 'total',
  pagesField: 'totalPages'
};

/**
 * 分页模板2: 扁平化分页格式
 * {data: {list: [], current: 1, total: 100}}
 */
export const PAGINATION_FLAT_TEMPLATE = {
  type: 'flat' as const,
  recordsField: 'list',
  currentField: 'current',
  sizeField: 'pageSize',
  totalField: 'total',
  pagesField: 'totalPages'
};

// ==================== 团队配置 ====================

/**
 * 团队配置映射表
 * 
 * 使用指南：
 * 1. 新团队接入时，复制模板并修改配置
 * 2. 如果不配置responseFormat，系统会自动检测
 * 3. 配置后性能更优，建议已知格式的团队都配置
 */
export const teamConfigs: Record<string, TeamConfig> = {
  // ==================== 默认团队 ====================
  'default': {
    teamId: 'team-2023',
    teamName: '默认团队',
    baseURL: import.meta.env.VITE_API_BASE_URL ,
    timeout: 10000,
    responseFormat: TEMPLATE_CODE_DATA_MESSAGE,
    description: '默认配置，使用标准的 {code, data, message} 格式'
  },

  // ==================== 团队A - 标准格式示例 ====================
  'team-a': {
    teamId: 'team-a',
    teamName: '团队A（技术部）',
    baseURL: 'http://localhost:3001/api/team-a',
    timeout: 10000,
    responseFormat: {
      ...TEMPLATE_CODE_DATA_MESSAGE,
      // 分页配置
      paginationConfig: {
        ...PAGINATION_NESTED_TEMPLATE,
        recordsField: 'records',
        paginationField: 'pagination'
      }
    },
    description: '团队A使用标准格式: {code: 200, data: {...}, message: "xxx"}'
  },

  // ==================== 团队B - 自定义格式示例 ====================
  // 'team-b': {
  //   teamId: 'team-b',
  //   teamName: '团队B（产品部）',
  //   baseURL: 'http://localhost:3002/api/team-b',
  //   timeout: 10000,
  //   responseFormat: {
  //     successField: 'status',
  //     successValues: ['success', 'created', 'updated', 'deleted'],
  //     dataField: 'data',
  //     messageField: 'msg',
  //     errorConfig: {
  //       errorDataType: 'null',
  //       errorMessageField: 'msg'
  //     },
  //     // 分页配置 - 扁平化格式
  //     paginationConfig: {
  //       type: 'flat',
  //       recordsField: 'items',
  //       currentField: 'page',
  //       sizeField: 'limit',
  //       totalField: 'total',
  //       pagesField: 'total_pages'
  //     }
  //   },
  //   description: '团队B使用自定义格式: {status: "success", data: {...}, msg: "xxx"}'
  // },
  'team-b': {
    teamId: 'team-b',
    teamName: '团队B（产品部）',
    baseURL: 'http://localhost:3002/api/team-b',
    timeout: 10000,
    responseFormat: {
      successField: 'status',
      successValues: ['success', 'created', 'updated', 'deleted'],
      dataField: 'data',
      messageField: ['msgOther', 'message'], 
      errorConfig: {
        errorDataType: 'object',
      errorMessageField: ['message', 'msgOther'],
      nestedMessagePath: ['data', 'msgOther']  // 支持从 data.msgOther 提取
      },
      // 分页配置 - 扁平化格式
      paginationConfig: {
      type: 'nested',              // 嵌套类型
      recordsField: 'items',       // 列表字段是 items
      paginationField: 'meta',     // 分页信息在 meta 中
      currentField: 'page',        // 当前页字段
      sizeField: 'limit',          // 每页数量字段
      totalField: 'total',         // 总数字段
      pagesField: 'total_pages'    // 总页数字段
      }
    },
    description: '团队B格式：success + items + meta嵌套分页'
  },
  

  // ==================== 团队C - 零配置示例（自动检测） ====================
  'team-c': {
    teamId: 'team-c',
    teamName: '团队C（新接入团队）',
    baseURL: 'http://localhost:3003/api/team-c',
    timeout: 10000,
    // 不配置responseFormat，使用智能检测
    enableCache: true,
    description: '新接入团队，未配置格式，系统将自动检测并缓存'
  },

  // ==================== 主业务团队 ====================
  'team-2023': {
    teamId: 'team-2023',
    teamName: '主业务团队',
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 15000,
    headers: {
      'X-Client-Version': '1.0.0'
    },
    responseFormat: {
      successField: 'code',
      successValues: [200, 201, 204],
      dataField: 'data',
      messageField: 'message',
      errorConfig: {
        errorDataType: 'object',
        errorMessageField: 'message'
      },
      paginationConfig: PAGINATION_NESTED_TEMPLATE
    },
    description: '主业务团队,标准RESTful API'
  },

  // ==================== 混合方案示例 ====================
  
  // 示例1: 声明式 + 部分函数式（推荐，处理嵌套message场景）
  'team-mixed-simple': {
    teamId: 'team-mixed-simple',
    teamName: '混合配置示例（简单）',
    baseURL: 'http://localhost:3004/api',
    timeout: 10000,
    // 基础配置用声明式
    responseFormat: {
      successField: 'code',
      successValues: [200],
      dataField: 'data',
      messageField: 'message',
      errorConfig: {
        errorDataType: 'object',
        nestedMessagePath: ['data', 'message']  // 支持嵌套路径
      }
    },
    // 复杂逻辑用函数式
    customHandlers: {
      // 自定义错误提取（处理多种错误格式）
      getError: (res) => {
        // 优先级1: 顶层message
        if (res.message) return res.message;
        // 优先级2: data中的message
        if (res.data?.message) return res.data.message;
        // 优先级3: data本身是字符串
        if (typeof res.data === 'string') return res.data;
        // 优先级4: 错误码映射
        const errorMap: Record<number, string> = {
          400: '请求参数错误',
          401: '未授权',
          403: '无权限',
          404: '资源不存在',
          500: '服务器错误'
        };
        return errorMap[res.code] || '未知错误';
      }
    },
    description: '混合配置：基础用声明式，复杂错误处理用函数式'
  },

  // 示例2: 声明式 + 响应预处理（处理加密数据）
  'team-mixed-transform': {
    teamId: 'team-mixed-transform',
    teamName: '混合配置示例（预处理）',
    baseURL: 'http://localhost:3005/api',
    timeout: 10000,
    responseFormat: TEMPLATE_CODE_DATA_MESSAGE,
    customHandlers: {
      // 响应预处理：解密、解嵌套等
      transform: (res) => {
        // 示例：后端返回多层嵌套，需要解嵌套
        if (res.result?.response?.data) {
          return {
            code: res.result.response.code,
            data: res.result.response.data,
            message: res.result.response.message
          };
        }
        return res;
      },
      // 错误后处理：特殊错误跳转
      errorTransform: (error, originalResponse) => {
        // 401 自动跳转登录
        if (originalResponse?.code === 401) {
          console.warn('未授权，即将跳转登录...');
          // window.location.href = '/login';
        }
        return error;
      }
    },
    description: '混合配置：使用 transform 预处理响应，errorTransform 处理特殊错误'
  },

  // 示例3: 纯函数式配置（极端复杂场景）
  'team-legacy-complex': {
    teamId: 'team-legacy-complex',
    teamName: '老接口（纯函数式）',
    baseURL: 'http://legacy.api.com',
    timeout: 10000,
    // 不配置 responseFormat，完全使用函数处理
    customHandlers: {
      // 自定义匹配规则
      match: (config) => {
        return config.url?.includes('/legacy/') || false;
      },
      // 复杂的成功判断
      isSuccess: (res) => {
        // 老接口有多种成功标识
        return (
          res.status === 1 ||
          res.code === '0000' ||
          res.code === 200 ||
          res.success === true ||
          res.errCode === 0
        );
      },
      // 复杂的数据提取
      getData: (res) => {
        // 多层嵌套提取
        if (res.result?.data?.content) return res.result.data.content;
        if (res.data?.result) return res.data.result;
        if (res.content) return res.content;
        return res.data || res.result || null;
      },
      // 复杂的错误信息提取
      getError: (res) => {
        // 100+ 种错误码映射
        const ERROR_CODE_MAP: Record<string, string> = {
          '1001': '用户不存在',
          '1002': '密码错误',
          '1003': '账号已被锁定',
          '2001': '参数缺失',
          '2002': '参数格式错误',
          '3001': '权限不足',
          '9999': '系统繁忙'
          // ... 更多错误码
        };
        
        const errorCode = res.errorCode || res.errCode || res.code;
        return ERROR_CODE_MAP[errorCode] || res.errorMsg || res.message || '未知错误';
      },
      // 自定义分页提取
      getPagination: (res) => {
        const data = res.data || res.result;
        if (!data) return null;
        
        // 老接口的特殊分页格式
        if (data.pageData && data.pageInfo) {
          return {
            records: data.pageData,
            current: data.pageInfo.pageNo,
            size: data.pageInfo.pageSize,
            total: data.pageInfo.totalCount,
            pages: Math.ceil(data.pageInfo.totalCount / data.pageInfo.pageSize)
          };
        }
        
        return null;
      }
    },
    description: '纯函数式配置：适用于极端复杂的老接口，完全自定义处理逻辑'
  },

  // 示例4: 混合方案 + 消息优先级（实际业务场景）
  'team-production': {
    teamId: 'team-production',
    teamName: '生产环境团队',
    baseURL: import.meta.env.VITE_PROD_API_URL || 'https://api.production.com',
    timeout: 15000,
    headers: {
      'X-API-Version': '2.0',
      'X-Client': 'web'
    },
    responseFormat: {
      successField: 'code',
      successValues: [200, 201],
      dataField: 'data',
      messageField: ['message', 'msg', 'tips'],  // 优先级数组
      errorConfig: {
        errorDataType: 'object',
        errorMessageField: ['message', 'error', 'msg'],  // 优先级数组
        nestedMessagePath: ['data', 'message']  // 嵌套路径
      },
      paginationConfig: {
        type: 'nested',
        recordsField: 'list',
        paginationField: 'pageInfo',
        currentField: 'current',
        sizeField: 'size',
        totalField: 'total',
        pagesField: 'pages'
      }
    },
    customHandlers: {
      // 只在必要时使用函数式
      getMessage: (res, isSuccess) => {
        if (!isSuccess && res.data?.errors) {
          // 后端返回多个错误，拼接显示
          return res.data.errors.map((e: any) => e.message).join('; ');
        }
        return res.message || res.msg || (isSuccess ? '操作成功' : '操作失败');
      },
      errorTransform: (error, originalResponse) => {
        // 生产环境特殊处理
        if (originalResponse?.code === 401) {
          console.log('Token过期，刷新Token...');
          // 触发token刷新逻辑
        }
        if (originalResponse?.code === 403) {
          console.warn('无权限访问');
          // 跳转无权限页面
        }
        return error;
      }
    },
    enableCache: true,
    description: '生产环境配置：声明式为主，关键逻辑用函数式增强'
  }
};

// ==================== 配置工具函数 ====================

/**
 * 获取团队配置
 * @param teamId 团队ID
 * @returns 团队配置
 */
export function getTeamConfig(teamId: string): TeamConfig | undefined {
  return teamConfigs[teamId];
}

/**
 * 获取团队响应格式配置
 * @param teamId 团队ID
 * @returns 响应格式配置，如果不存在返回undefined（将使用智能检测）
 */
export function getResponseFormat(teamId: string): ResponseFormatConfig | undefined {
  return teamConfigs[teamId]?.responseFormat;
}

/**
 * 添加团队配置（动态添加）
 * @param config 团队配置
 */
export function addTeamConfig(config: TeamConfig): void {
  teamConfigs[config.teamId] = config;
}

/**
 * 快速创建团队配置（使用模板）
 * @param teamId 团队ID
 * @param baseURL 基础URL
 * @param template 响应格式模板
 * @param options 其他配置
 */
export function createTeamConfig(
  teamId: string,
  baseURL: string,
  template: ResponseFormatConfig = TEMPLATE_CODE_DATA_MESSAGE,
  options?: Partial<TeamConfig>
): TeamConfig {
  return {
    teamId,
    baseURL,
    responseFormat: template,
    timeout: 10000,
    enableCache: true,
    ...options
  };
}

/**
 * 批量导入团队配置
 * @param configs 团队配置数组
 */
export function importTeamConfigs(configs: TeamConfig[]): void {
  configs.forEach(config => {
    teamConfigs[config.teamId] = config;
  });
}

// ==================== 配置验证 ====================

/**
 * 验证团队配置是否有效
 * @param config 团队配置
 * @returns 是否有效及错误信息
 */
export function validateTeamConfig(config: TeamConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.teamId) {
    errors.push('teamId 不能为空');
  }

  if (!config.baseURL) {
    errors.push('baseURL 不能为空');
  }

  if (config.responseFormat) {
    const format = config.responseFormat;
    
    if (!format.successField) {
      errors.push('successField 不能为空');
    }
    
    if (!format.successValues || format.successValues.length === 0) {
      errors.push('successValues 不能为空');
    }
    
    if (!format.dataField) {
      errors.push('dataField 不能为空');
    }
    
    if (!format.messageField) {
      errors.push('messageField 不能为空');
    }

    // 验证分页配置
    if (format.paginationConfig) {
      const pagConfig = format.paginationConfig;
      
      if (!pagConfig.recordsField) {
        errors.push('paginationConfig.recordsField 不能为空');
      }
      
      if (pagConfig.type === 'nested' && !pagConfig.paginationField) {
        errors.push('nested 类型分页必须指定 paginationField');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ==================== 默认导出 ====================

/**
 * 智能团队配置（向后兼容）
 * 保留原有的smartTeamConfigs命名
 */
export const smartTeamConfigs = teamConfigs;

export default teamConfigs;

