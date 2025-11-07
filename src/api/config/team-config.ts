/**
 * 智能团队配置 - 零配置方案
 * 面试亮点：无需手动配置，自动识别数据格式
 */
export const smartTeamConfigs = {
  default: { teamId: "team-2023", baseURL: import.meta.env.VITE_API_BASE_URL },
  "team-2023": {
    teamId: "team-2023",
    baseURL: import.meta.env.VITE_API_BASE_URL,
  },
  "team-a": {
    baseURL: "http://localhost:3001/api/team-a",
  },
  "team-b": {
    baseURL: "http://localhost:3002/api/team-b",
  },
  "team-c": {
    baseURL: "http://localhost:3003/api/team-c",
  },
};

