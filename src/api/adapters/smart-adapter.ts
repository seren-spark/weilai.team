import type { StandardResponse } from "../types";

/**
 * 智能适配器 - 企业级解决方案
 * 核心优势：零配置 + 高准确性 + 自动学习
 */
export class SmartAdapter {
  // 配置缓存，避免重复检测
  private static configCache = new Map<string, any>();

  /**
   * 智能适配响应 - 核心方法
   */
  static adaptResponse(response: any, teamId?: string): StandardResponse {
    try {
      // 1. 优先使用缓存配置
      if (teamId && this.configCache.has(teamId)) {
        return this.useCachedConfig(response, teamId);
      }

      console.log("开始智能检测response", response, typeof response);
      debugger;
      // 2. 智能检测
      const detected = this.detectResponseFormat(response);

      // 3. 缓存检测结果
      if (teamId) {
        this.configCache.set(teamId, detected);
      }
      console.log("检测结果", detected);
      debugger;
      // 4. 应用适配
      return this.applyAdapter(response, detected);
    } catch (error) {
      // 兜底机制7：任何错误都返回标准错误响应
      console.error("SmartAdapter error:", error);
      return this.createErrorResponse(error);
    }
  }

  /**
   * 智能检测响应格式 - 多层兜底机制
   */
  private static detectResponseFormat(response: any) {
    try {
      // 第一层：智能检测
      const successField = this.detectSuccessField(response);
      const dataField = this.detectDataField(response);
      const messageField = this.detectMessageField(response);
      // console.log(555);

      // const paginationInfo = this.detectPagination(response[dataField]);
      // 修复：确保data是对象才检测分页
      const data = response[dataField];
      const paginationInfo =
        data && typeof data === "object" ? this.detectPagination(data) : null;

      return {
        successField,
        dataField,
        messageField,
        paginationInfo,
        isPaginated: paginationInfo !== null,
      };
    } catch (error) {
      // 兜底机制1：检测失败时使用默认配置
      console.warn("智能检测失败，使用默认配置:", error);
      return this.getDefaultConfig();
    }
  }

  /**
   * 检测成功标识字段 - 兜底机制
   */
  private static detectSuccessField(response: any): string {
    const successFields = ["code", "status", "success", "result"];

    for (const field of successFields) {
      if (response[field] !== undefined) {
        // 进一步检测成功条件
        if (this.isSuccessCondition(response[field])) {
          return field;
        }
      }
    }

    // 兜底机制2：如果所有字段都不符合成功条件，返回第一个存在的字段
    return (
      successFields.find((field) => response[field] !== undefined) || "code"
    );
  }

  /**
   * 检测数据字段 - 兜底机制
   */
  private static detectDataField(response: any): string {
    const dataFields = ["data", "result", "payload", "content", "records"];
    

    for (const field of dataFields) {
      if (response[field] !== undefined && response[field] !== null) {
        return field;
      }
    }

    // 兜底机制3：如果所有字段都不存在，返回默认字段
    return "data";
  }

  /**
   * 检测消息字段
   */
  private static detectMessageField(response: any): string {
    const messageFields = [
      "message",
      "msg",
      "msgOther",
      "error",
      "errorMessage",
    ];

    for (const field of messageFields) {
      if (response[field] !== undefined && response[field] !== null) {
        return field;
      }
    }

    return "message";
  }

  /**
   * 检测分页信息 - 兜底机制
   */
  private static detectPagination(data: any): any {
    debugger;
    // 更严格的类型检查
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      console.log("数据不是有效对象，跳过分页检测:", typeof data, data);
      return null;
    }
    if (!data || typeof data !== "object") return null;

    // 检测嵌套分页
    const paginationFields = ["pagination", "pageInfo", "meta", "page"];
    const listFields = ["list", "items", "records", "data", "users"];

    for (const paginationField of paginationFields) {
      if (data[paginationField]) {
        const pagination = data[paginationField];
        const listInfo = this.findListFieldWithName(data, listFields);
        console.log("检测嵌套分页", listInfo);

        if (listInfo) {
          return {
            listField: listInfo.fieldName, // 使用实际找到的字段名
            paginationField,
            pagination,
          };
        }
      }
    }

    // 兜底机制4：检测扁平化分页
    const flatPagination = this.detectFlatPagination(data, listFields);
    if (flatPagination) {
      return flatPagination;
    }
    debugger;
    // 兜底机制5：如果都不是分页格式，返回null
    return null;
  }

  /**
   * 检测扁平化分页
   */
  private static detectFlatPagination(data: any, listFields: string[]): any {
    const list = this.findListField(data, listFields);
    if (!list) return null;
    console.log("检测扁平化");

    // 检测分页字段
    const pageFields = ["current", "page", "pageNum", "pageNumber"];
    const sizeFields = ["pageSize", "size", "limit", "pageSize"];
    const totalFields = ["total", "totalCount", "totalElements", "count"];
    const pagesFields = ["totalPages", "pages", "totalPage"];

    const current = this.findField(data, pageFields);
    const pageSize = this.findField(data, sizeFields);
    const total = this.findField(data, totalFields);
    const totalPages = this.findField(data, pagesFields);
    const listField = this.findListFieldWithName(data, listFields);

    if (
      current !== undefined &&
      pageSize !== undefined &&
      total !== undefined
    ) {
      return {
        listField: listField?.fieldName || "list",
        isFlat: true,
        current,
        pageSize,
        total,
        totalPages: totalPages || Math.ceil(total / pageSize),
      };
    }

    return null;
  }

  /**
   * 应用适配器
   */
  private static applyAdapter(response: any, config: any): StandardResponse {
    console.log("应用适配器", response, config);
    const success = this.getSuccessValue(response, config.successField);
    const data = this.getDataValue(response, config.dataField, config);
    const message = this.getMessageValue(response, config.messageField);
    const code = this.getCodeValue(response, config.successField);
    debugger;

    return {
      success,
      data,
      message,
      code,
      timestamp: Date.now(),
    };
  }

  /**
   * 获取数据值 - 增强版，支持混合数据
   */
  private static getDataValue(
    response: any,
    dataField: string,
    config: any,
  ): any {
    const data = response[dataField];

    if (config.isPaginated) {
      return this.handleMixedData(data, config);
    }

    // 兜底机制6：非分页数据直接返回
    return data;
  }

  /**
   * 处理混合数据 - 分页数据 + 其他数据
   */
  private static handleMixedData(data: any, config: any): any {
    const result: any = {};

    if (config.paginationInfo.isFlat) {
      // 扁平化分页处理
      const listField = config.paginationInfo.listField;

      // 1. 提取分页数据
      result.records = data[listField] || [];
      result.current = config.paginationInfo.current || 1;
      result.size = config.paginationInfo.pageSize || 10;
      result.total = config.paginationInfo.total || 0;
      result.pages = config.paginationInfo.totalPages || 0;

      // 2. 提取其他数据
      this.extractOtherData(data, result, [
        listField,
        "current",
        "pageSize",
        "total",
        "totalPages",
        "pages",
      ]);
    } else {
      // 嵌套分页处理
      const listField = config.paginationInfo.listField;
      const paginationField = config.paginationInfo.paginationField;
      const pagination = data[paginationField];

      // 1. 提取分页数据
      result.records = data[listField] || [];
      result.current = pagination?.current || pagination?.page || 1;
      result.size = pagination?.pageSize || pagination?.size || 10;
      result.total = pagination?.total || pagination?.totalCount || 0;
      result.pages = pagination?.totalPages || pagination?.pages || 0;

      // 2. 提取其他数据
      const excludeFields = [listField, paginationField];
      this.extractOtherData(data, result, excludeFields);
    }

    return result;
  }

  /**
   * 提取其他数据字段
   */
  private static extractOtherData(
    sourceData: any,
    targetData: any,
    excludeFields: string[],
  ): void {
    Object.keys(sourceData).forEach((key) => {
      if (!excludeFields.includes(key) && sourceData[key] !== undefined) {
        targetData[key] = sourceData[key];
      }
    });
  }

  // 辅助方法
  private static isSuccessCondition(value: any): boolean {
    if (typeof value === "number") return value === 200;
    if (typeof value === "string") return value === "success";
    if (typeof value === "boolean") return value === true;
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

  private static findField(data: any, fields: string[]): any {
    for (const field of fields) {
      if (data[field] !== undefined) {
        return data[field];
      }
    }
    return undefined;
  }

  private static getSuccessValue(response: any, field: string): boolean {
    const value = response[field];
    return this.isSuccessCondition(value);
  }

  private static getMessageValue(response: any, field: string): string {
    return response[field] || "Success";
  }

  private static getCodeValue(response: any, field: string): number {
    const value = response[field];
    if (typeof value === "number") return value;
    if (typeof value === "string") return value === "success" ? 200 : 500;
    return 200;
  }

  /**
   * 创建错误响应 - 兜底机制
   */
  private static createErrorResponse(error: any): StandardResponse {
    return {
      success: false,
      data: null,
      message: error.message || "Unknown error", // 兜底：默认错误消息
      code: 500,
      timestamp: Date.now(),
    };
  }

  /**
   * 使用缓存配置 - 兜底机制
   */
  private static useCachedConfig(
    response: any,
    teamId: string,
  ): StandardResponse {
    try {
      const config = this.configCache.get(teamId);
      return this.applyAdapter(response, config);
    } catch (error) {
      // 兜底机制8：缓存配置失败时重新检测
      console.log("缓存配置失败，重新检测:", error);

      return this.adaptResponse(response, teamId);
    }
  }

  /**
   * 获取默认配置 - 兜底机制
   */
  private static getDefaultConfig() {
    return {
      successField: "code",
      dataField: "data",
      messageField: "message",
      paginationInfo: null,
      isPaginated: false,
    };
  }

  // 新增方法：查找列表字段并返回字段名
  private static findListFieldWithName(
    data: any,
    fields: string[],
  ): { fieldName: string; value: any[] } | null {
    for (const field of fields) {
      if (data[field] && Array.isArray(data[field])) {
        return {
          fieldName: field,
          value: data[field],
        };
      }
    }
    return null;
  }

  /**
   * 智能数据适配器 - 处理各种数据结构
   */
  private static adaptDataStructure(data: any): any {
    if (!data || typeof data !== "object") {
      return data;
    }

    // 检测数据结构
    const structure = this.detectMixedDataStructure(data);

    if (structure.hasPagination) {
      // 分页数据 + 其他数据
      return this.createMixedDataResponse(data, structure);
    } else if (structure.hasOtherData) {
      // 只有其他数据
      return this.createOtherDataResponse(data, structure);
    } else {
      // 普通数据
      return data;
    }
  }

  /**
   * 创建混合数据响应
   */
  private static createMixedDataResponse(data: any, structure: any): any {
    const result: any = {};

    // 分页信息
    result.pagination = {
      current: data.current || data.page || 1,
      pageSize: data.pageSize || data.size || 10,
      total: data.total || 0,
      totalPages: data.totalPages || data.pages || 0,
    };

    // 列表数据
    const listFields = ["records", "list", "items", "data"];
    for (const field of listFields) {
      if (Array.isArray(data[field])) {
        result.records = data[field];
        break;
      }
    }

    // 其他数据
    structure.otherFields.forEach((field) => {
      result[field] = data[field];
    });

    return result;
  }

  /**
   * 创建其他数据响应
   */
  private static createOtherDataResponse(data: any, structure: any): any {
    const result: any = {};

    structure.otherFields.forEach((field) => {
      result[field] = data[field];
    });

    return result;
  }

  /**
   * 检测混合数据结构
   */
  private static detectMixedDataStructure(data: any): {
    hasPagination: boolean;
    hasOtherData: boolean;
    paginationFields: string[];
    otherFields: string[];
  } {
    const paginationFields = [
      "current",
      "page",
      "pageSize",
      "size",
      "total",
      "totalPages",
      "pages",
    ];
    const listFields = ["records", "list", "items", "data"];

    const hasPagination = paginationFields.some(
      (field) => data[field] !== undefined,
    );
    const hasList = listFields.some((field) => Array.isArray(data[field]));

    const detectedPaginationFields = paginationFields.filter(
      (field) => data[field] !== undefined,
    );
    const detectedListFields = listFields.filter((field) =>
      Array.isArray(data[field]),
    );

    const otherFields = Object.keys(data).filter(
      (key) =>
        !paginationFields.includes(key) &&
        !listFields.includes(key) &&
        data[key] !== undefined,
    );

    return {
      hasPagination: hasPagination && hasList,
      hasOtherData: otherFields.length > 0,
      paginationFields: detectedPaginationFields,
      otherFields,
    };
  }
}
