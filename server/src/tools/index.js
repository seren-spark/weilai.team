import { weatherTool, getCurrentWeather } from "./weather.js";
import { searchUsers, userSearchTool } from "./database.js";
// 所有工具的定义
export const tools = [weatherTool,userSearchTool];

// 工具执行映射
export const toolExecutors = {
  get_current_weather: getCurrentWeather,
  search_users: searchUsers,

};

// 执行工具函数
export const executeTool = (functionName, args, token = null) => {
  const executor = toolExecutors[functionName];
  if (!executor) {
    throw new Error(`未找到工具: ${functionName}`);
  }
  return executor(args, token);
};
