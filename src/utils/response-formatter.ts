import type { ApiResponse, TeamConfig } from "./types";

// 响应格式转换器
export class ResponseFormatter {
  // 将不同团队的响应格式转换为统一格式
  static formatResponse<T>(
    rawResponse: any,
    teamConfig: TeamConfig,
  ): ApiResponse<T> {
    const { codeField, dataField, messageField, successCode } =
      teamConfig.responseFormat;

    // 提取各字段值
    const code = rawResponse[codeField];
    const data = rawResponse[dataField];
    const message = rawResponse[messageField];

    // 判断是否成功
    const isSuccess = code === successCode;

    // 返回统一格式
    return {
      code: isSuccess ? 200 : typeof code === "number" ? code : 500,
      data: data || null,
      message: message || (isSuccess ? "成功" : "请求失败"),
    };
  }

  // 处理错误响应
  static formatError(error: any, teamConfig: TeamConfig): ApiResponse {
    let code = 500;
    let message = "网络错误";
    let data = null;

    if (error.response) {
      // 服务器响应了错误状态码
      const responseData = error.response.data;
      if (responseData) {
        const { codeField, messageField, dataField } =
          teamConfig.responseFormat;
        code = responseData[codeField] || error.response.status;
        message = responseData[messageField] || error.response.statusText;
        data = responseData[dataField] || null;
      } else {
        code = error.response.status;
        message = error.response.statusText;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message = "网络连接失败";
    } else {
      // 其他错误
      message = error.message || "未知错误";
    }

    return {
      code,
      data,
      message,
    };
  }
}
