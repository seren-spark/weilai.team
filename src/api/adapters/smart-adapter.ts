/**
 * 智能适配器 - 混合方案实现
 * 
 * 核心设计思路：
 * 1. 优先级机制：自定义函数 > 声明式配置 > 智能检测
 * 2. 层层兜底：每一层失败都有下一层兜底
 * 3. 缓存优化：首次检测后缓存配置，后续零开销
 * 
 * 面试亮点：
 * - 混合方案设计，平衡易用性和灵活性
 * - 多层兜底机制，确保系统稳定性
 * - 类型安全，完整的 TypeScript 支持
 * - 性能优化，智能缓存机制
 */

import type { StandardResponse } from '../types';
import type { TeamConfig, ResponseFormatConfig, CustomHandlers } from '../config/team-config';

/**
 * 智能适配器主类
 */
export class SmartAdapter {
  // 配置缓存，避免重复检测
  private static configCache = new Map<string, any>();
  
  // 是否启用调试日志
  private static debugMode = false;

  /**
   * 设置调试模式
   */
  static setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * 调试日志
   */
  private static log(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(`[SmartAdapter] ${message}`, ...args);
    }
  }

  /**
   * ==================== 主入口方法 ====================
   * 智能适配响应 - 支持混合配置
   * 
   * @param response 原始响应数据
   * @param teamConfig 团队配置（可选）
   * @returns 标准响应格式
   */
  static adaptResponse(
    response: any,
    teamConfig?: TeamConfig
  ): StandardResponse {
    try {
      this.log('开始适配响应', { response, teamConfig: teamConfig?.teamId });

      // ==================== 优先级1：自定义 transform 预处理 ====================
      let processedResponse = response;
      if (teamConfig?.customHandlers?.transform) {
        this.log('执行自定义 transform');
        processedResponse = teamConfig.customHandlers.transform(response);
      }

      // ==================== 优先级2：完整自定义函数处理 ====================
      if (this.hasCompleteCustomHandlers(teamConfig?.customHandlers)) {
        this.log('使用完整自定义函数处理');
        return this.applyCustomHandlers(processedResponse, teamConfig!.customHandlers!);
      }

      // ==================== 优先级3：混合处理（声明式 + 部分自定义） ====================
      if (teamConfig?.responseFormat) {
        this.log('使用声明式配置 + 部分自定义函数');
        return this.applyMixedAdapter(
          processedResponse,
          teamConfig.responseFormat,
          teamConfig.customHandlers
        );
      }

      // ==================== 优先级4：智能检测兜底 ====================
      this.log('使用智能检测兜底');
      const teamId = teamConfig?.teamId;
      
      // 尝试从缓存获取配置
      if (teamId && this.configCache.has(teamId)) {
        this.log('使用缓存配置', teamId);
        const cachedConfig = this.configCache.get(teamId);
        return this.applyAdapter(processedResponse, cachedConfig);
      }

      // 智能检测
      const detectedConfig = this.detectResponseFormat(processedResponse);
      
      // 缓存检测结果
      if (teamId && teamConfig?.enableCache !== false) {
        this.configCache.set(teamId, detectedConfig);
      }

      return this.applyAdapter(processedResponse, detectedConfig);

    } catch (error) {
      this.log('适配器错误', error);
      
      // 错误后处理
      if (teamConfig?.customHandlers?.errorTransform) {
        return teamConfig.customHandlers.errorTransform(error, response);
      }
      
      return this.createErrorResponse(error);
    }
  }

  /**
   * ==================== 判断是否有完整的自定义处理函数 ====================
   */
  private static hasCompleteCustomHandlers(handlers?: CustomHandlers): boolean {
    if (!handlers) return false;
    return !!(handlers.isSuccess && handlers.getData);
  }

  /**
   * ==================== 应用完整自定义函数处理 ====================
   */
  private static applyCustomHandlers(
    response: any,
    handlers: CustomHandlers
  ): StandardResponse {
    const isSuccess = handlers.isSuccess!(response);
    
    let data = null;
    let message = '';

    if (isSuccess) {
      data = handlers.getData!(response);
      message = handlers.getMessage
        ? handlers.getMessage(response, true)
        : this.extractMessage(response, 'message');
    } else {
      data = null;
      message = handlers.getError
        ? handlers.getError(response)
        : handlers.getMessage
        ? handlers.getMessage(response, false)
        : this.extractMessage(response, 'message');
    }

    return {
      success: isSuccess,
      data,
      message,
      code: this.extractCode(response),
      timestamp: Date.now()
    };
  }

  /**
   * ==================== 应用混合适配器（声明式 + 部分自定义） ====================
   */
  private static applyMixedAdapter(
    response: any,
    format: ResponseFormatConfig,
    handlers?: CustomHandlers
  ): StandardResponse {
    // 1. 判断成功状态（自定义优先）
    const isSuccess = handlers?.isSuccess
      ? handlers.isSuccess(response)
      : this.getSuccessValue(response, format.successField, format.successValues);

    // 2. 提取数据（自定义优先）
    const data = handlers?.getData
      ? handlers.getData(response)
      : this.getDataValue(response, format.dataField, format);

    // 3. 提取消息（自定义优先）
    let message = '';
    if (handlers?.getMessage) {
      message = handlers.getMessage(response, isSuccess);
    } else if (!isSuccess && handlers?.getError) {
      message = handlers.getError(response);
    } else {
      message = this.getMessageValue(response, format, isSuccess);
    }

    // 4. 提取状态码
    const code = this.getCodeValue(response, format.successField);

    return {
      success: isSuccess,
      data,
      message,
      code,
      timestamp: Date.now()
    };
  }

  /**
   * ==================== 应用声明式配置适配器 ====================
   */
  private static applyAdapter(response: any, config: any): StandardResponse {
    this.log('应用适配器', config);
    
    const success = this.getSuccessValue(
      response,
      config.successField,
      config.successValues || [200, 'success', true]
    );
    
    const data = this.getDataValue(response, config.dataField, config);
    const message = this.getMessageValue(response, config, success);
    const code = this.getCodeValue(response, config.successField);

    return {
      success,
      data,
      message,
      code,
      timestamp: Date.now()
    };
  }

  /**
   * ==================== 智能检测响应格式 ====================
   */
  private static detectResponseFormat(response: any) {
    // 先检测成功的各个数据的标识字段
    try {
      const successField = this.detectSuccessField(response);
      const dataField = this.detectDataField(response);
      const messageField = this.detectMessageField(response);

      // 检测分页信息
      const data = response[dataField];
      const paginationInfo = data && typeof data === 'object'
        ? this.detectPagination(data)
        : null;

      return {
        successField,
        successValues: this.detectSuccessValues(response[successField]),
        dataField,
        messageField,
        paginationInfo,
        isPaginated: paginationInfo !== null
      };
    } catch (error) {
      this.log('检测失败，使用默认配置', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * 检测成功值
   */
  private static detectSuccessValues(value: any): any[] {
    if (typeof value === 'number') return [200, 201, 204];
    if (typeof value === 'string') return ['success', 'ok'];
    if (typeof value === 'boolean') return [true];
    return [200];
  }

  /**
   * 检测成功标识字段
   */
  private static detectSuccessField(response: any): string {
    const successFields = ['code', 'status', 'success', 'result'];

    for (const field of successFields) {
      if (response[field] !== undefined) {
        if (this.isSuccessCondition(response[field])) {
          return field;
        }
      }
    }

    return successFields.find(field => response[field] !== undefined) || 'code';
  }

  /**
   * 检测数据字段
   */
  private static detectDataField(response: any): string {
    const dataFields = ['data', 'result', 'payload', 'content', 'records'];

    for (const field of dataFields) {
      if (response[field] !== undefined && response[field] !== null) {
        return field;
      }
    }

    return 'data';
  }

  /**
   * 检测消息字段（支持嵌套）
   */
  private static detectMessageField(response: any): string | string[] {
    const topLevelFields = ['message', 'msg', 'msgOther', 'error', 'errorMessage'];

    // 1. 先检测顶层
    for (const field of topLevelFields) {
      if (response[field] !== undefined && response[field] !== null) {
        return field;
      }
    }

    // 2. 检测 data 中的嵌套消息
    const dataField = this.detectDataField(response);
    const data = response[dataField];

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const field of topLevelFields) {
        if (data[field] !== undefined && data[field] !== null) {
          return [dataField, field]; // 返回嵌套路径
        }
      }
    }

    return 'message';
  }

  /**
   * 检测分页信息
   */
  private static detectPagination(data: any): any {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return null;
    }

    // 检测嵌套分页
    const paginationFields = ['pagination', 'pageInfo', 'meta', 'page']; //页数等信息
    const listFields = ['list', 'items', 'records', 'data', 'users'];//每页数据

    for (const paginationField of paginationFields) {
      if (data[paginationField]) { //如果找到页数的信息
        const listInfo = this.findListFieldWithName(data, listFields);
        if (listInfo) {
          return {
            listField: listInfo.fieldName,
            paginationField,
            pagination: data[paginationField]
          };
        }
      }
    }

    // 检测扁平化分页
    return this.detectFlatPagination(data, listFields);
  }

  /**
   * 检测扁平化分页
   */
  private static detectFlatPagination(data: any, listFields: string[]): any {
    const listInfo = this.findListFieldWithName(data, listFields);
    if (!listInfo) return null;

    const pageFields = ['current', 'page', 'pageNum', 'pageNumber'];
    const sizeFields = ['pageSize', 'size', 'limit'];
    const totalFields = ['total', 'totalCount', 'totalElements', 'count'];
    const pagesFields = ['totalPages', 'pages', 'totalPage'];

    const current = this.findField(data, pageFields);
    const pageSize = this.findField(data, sizeFields);
    const total = this.findField(data, totalFields);
    const totalPages = this.findField(data, pagesFields);

    if (current !== undefined && pageSize !== undefined && total !== undefined) {
      return {
        listField: listInfo.fieldName,
        isFlat: true,
        current,
        pageSize,
        total,
        totalPages: totalPages || Math.ceil(total / pageSize)
      };
    }

    return null;
  }

  /**
   * ==================== 获取成功值 ====================
   */
  private static getSuccessValue(
    response: any,
    field: string,
    successValues: any[]
  ): boolean {
    const value = response[field];
    return successValues.includes(value);
  }

  /**
   * ==================== 获取数据值 ====================
   */
  private static getDataValue(response: any, dataField: string, config: any): any {
    const data = response[dataField];

    if (config.isPaginated) {
      return this.handleMixedData(data, config);
    }

    return data;
  }

  /**
   * ==================== 获取消息值（支持嵌套和优先级） ====================
   */
  private static getMessageValue(
    response: any,
    format: ResponseFormatConfig,
    isSuccess: boolean
  ): string {
    const { messageField, errorConfig } = format;

    // 1. 成功时的消息提取
    if (isSuccess) {
      return this.extractMessageByField(response, messageField) || 'Success';
    }

    // 2. 失败时的消息提取
    // 优先级1: 使用 errorConfig 中的配置
    if (errorConfig?.nestedMessagePath) {
      const nestedMessage = this.extractNestedMessage(
        response,
        errorConfig.nestedMessagePath
      );
      if (nestedMessage) return nestedMessage;
    }

    // 优先级2: 使用 errorMessageField
    if (errorConfig?.errorMessageField) {
      const errorMessage = this.extractMessageByField(
        response,
        errorConfig.errorMessageField
      );
      if (errorMessage) return errorMessage;
    }

    // 优先级3: data 本身是字符串
    const data = response[format.dataField];
    if (typeof data === 'string') {
      return data;
    }

    // 优先级4: data 中的 message
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.msg) return data.msg;
      if (data.error) return data.error;
    }

    // 优先级5: 使用普通 messageField
    const message = this.extractMessageByField(response, messageField);
    if (message) return message;

    // 最终兜底
    return 'Error';
  }

  /**
   * 提取嵌套消息
   */
  private static extractNestedMessage(
    response: any,
    path: string | string[]
  ): string | null {
    // 支持字符串路径 'data.message'
    if (typeof path === 'string') {
      path = path.split('.');
    }

    let value = response;
    for (const key of path) {
      value = value?.[key];
      if (value === undefined) return null;
    }

    return typeof value === 'string' ? value : null;
  }

  /**
   * 根据字段提取消息（支持优先级数组）
   */
  private static extractMessageByField(
    response: any,
    field: string | string[]
  ): string | null {
    // 简单字段名
    if (typeof field === 'string') {
      return response[field] || null;
    }

    // 优先级数组
    if (Array.isArray(field)) {
      // 如果是嵌套路径 ['data', 'message']
      if (field.length > 1 && !response[field[0]]?.constructor?.name?.includes('String')) {
        let value = response;
        for (const key of field) {
          value = value?.[key];
          if (value === undefined) break;
        }
        if (typeof value === 'string') return value;
      }

      // 如果是优先级列表 ['message', 'msg', 'tips']
      for (const f of field) {
        if (response[f]) return response[f];
      }
    }

    return null;
  }

  /**
   * 提取简单消息
   */
  private static extractMessage(response: any, defaultField: string): string {
    const fields = ['message', 'msg', 'error', 'errorMessage'];
    for (const field of fields) {
      if (response[field]) return response[field];
    }
    return response[defaultField] || 'Unknown';
  }

  /**
   * 提取状态码
   */
  private static extractCode(response: any): number {
    if (typeof response.code === 'number') return response.code;
    if (typeof response.status === 'number') return response.status;
    if (typeof response.statusCode === 'number') return response.statusCode;
    return 200;
  }

  /**
   * ==================== 获取状态码值 ====================
   */
  private static getCodeValue(response: any, field: string): number {
    const value = response[field];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return value === 'success' ? 200 : 500;
    return 200;
  }

  /**
   * ==================== 处理混合数据（分页 + 其他数据） ====================
   */
  private static handleMixedData(data: any, config: any): any {
    const result: any = {};

    if (config.paginationInfo.isFlat) {
      // 扁平化分页处理
      const listField = config.paginationInfo.listField;

      result.records = data[listField] || [];
      result.current = config.paginationInfo.current || 1;
      result.size = config.paginationInfo.pageSize || 10;
      result.total = config.paginationInfo.total || 0;
      result.pages = config.paginationInfo.totalPages || 0;

      // 提取其他数据
      this.extractOtherData(data, result, [
        listField, 'current', 'pageSize', 'total', 'totalPages', 'pages'
      ]);
    } else {
      // 嵌套分页处理
      const listField = config.paginationInfo.listField;
      const paginationField = config.paginationInfo.paginationField;
      const pagination = data[paginationField];

      result.records = data[listField] || [];
      result.current = pagination?.current || pagination?.page || 1;
      result.size = pagination?.pageSize || pagination?.size || 10;
      result.total = pagination?.total || pagination?.totalCount || 0;
      result.pages = pagination?.totalPages || pagination?.pages || 0;

      // 提取其他数据
      this.extractOtherData(data, result, [listField, paginationField]);
    }

    return result;
  }

  /**
   * 提取其他数据字段
   */
  private static extractOtherData(
    sourceData: any,
    targetData: any,
    excludeFields: string[]
  ): void {
    Object.keys(sourceData).forEach(key => {
      if (!excludeFields.includes(key) && sourceData[key] !== undefined) {
        targetData[key] = sourceData[key];
      }
    });
  }

  /**
   * ==================== 辅助方法 ====================
   */
  private static isSuccessCondition(value: any): boolean {
    if (typeof value === 'number') return value >= 200 && value < 300;
    if (typeof value === 'string') return ['success', 'ok', 'completed'].includes(value);
    if (typeof value === 'boolean') return value === true;
    return false;
  }

  private static findListField(data: any, fields: string[]) {
    for (const field of fields) {
      if (data[field] && Array.isArray(data[field])) {
        return data[field];
      }
    }
    return null;
  }

  private static findListFieldWithName(
    data: any,
    fields: string[]
  ): { fieldName: string; value: any[] } | null {
    for (const field of fields) {
      if (data[field] && Array.isArray(data[field])) {
        return { fieldName: field, value: data[field] };
      }
    }
    return null;
  }

  private static findField(data: any, fields: string[]): any {
    for (const field of fields) {
      if (data[field] !== undefined) {
        return data[field];
      }
    }
    return undefined;
  }

  /**
   * 创建错误响应
   */
  private static createErrorResponse(error: any): StandardResponse {
    return {
      success: false,
      data: null,
      message: error?.message || 'Unknown error',
      code: 500,
      timestamp: Date.now()
    };
  }

  /**
   * 获取默认配置
   */
  private static getDefaultConfig() {
    return {
      successField: 'code',
      successValues: [200],
      dataField: 'data',
      messageField: 'message',
      paginationInfo: null,
      isPaginated: false
    };
  }

  /**
   * ==================== 工具方法 ====================
   */
  
  /**
   * 清除缓存
   */
  static clearCache(teamId?: string): void {
    if (teamId) {
      this.configCache.delete(teamId);
      this.log('清除缓存', teamId);
    } else {
      this.configCache.clear();
      this.log('清除所有缓存');
    }
  }

  /**
   * 获取缓存信息
   */
  static getCacheInfo(): Map<string, any> {
    return new Map(this.configCache);
  }
}

