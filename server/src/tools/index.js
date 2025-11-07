import { weatherTool, getCurrentWeather } from "./weather.js";

// 所有工具的定义
export const tools = [weatherTool];

// 工具执行映射
export const toolExecutors = {
  get_current_weather: getCurrentWeather,
  // 未来可以添加更多工具
  // get_stock_price: getStockPrice,
  // search_web: searchWeb,
};

// 执行工具函数
export const executeTool = (functionName, args) => {
  const executor = toolExecutors[functionName];
  if (!executor) {
    throw new Error(`未找到工具: ${functionName}`);
  }
  return executor(args);
};
