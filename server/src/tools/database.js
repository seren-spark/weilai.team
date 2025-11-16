/*
 * @Author: serendipity 2843306836@qq.com
 * @Date: 2025-11-07 21:49:10
 * @LastEditors: serendipity 2843306836@qq.com
 * @LastEditTime: 2025-11-13 17:29:13
 * @FilePath: \weilai.team\server\src\tools\database.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
export const userSearchTool = {
  type: "function",
  function: {
    name: "search_users",
    description:
      "查询团队成员信息，支持按姓名、学号、组别查询。适用于：查找某个成员、了解团队人员等",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "搜索关键词：姓名、学号、组别等",
        },
        group: {
          type: "string",
          description: "组别筛选：前端组、后端组、AI组等",
        },
      },
      // required: ["keyword","group"]
      required: ["content"],
    },
  },
};

export const searchUsers = async (args, token) => {
  try {
    const { content, group } = args;
    let pageNumber = 1;
    let pageSize = 10;
    console.log("查询人员参数", content, group);

    const response = await axios.get(
      `${process.env.BACKEND_API_URL}/user/searchUser`,
      {
        params: { content, pageNumber, pageSize },
        headers: { Authorization: `${token}` },
      },
    );
    console.log("查询人员的响应", response);

    if (response.data.code === 200) {
      const users = response.data.data.searchUsers;

      if (users.length === 0) {
        return `未找到关于"${content}"的成员信息。`;
      }

      const result = users
        .map(
          (user, index) =>
            `${index + 1}. ${user.name} (${user.userId})
     简介${user.userDestination || "无简介"}
   `,
        )
        .join("\n\n");

      return `找到 ${users.length} 位成员：\n\n${result}`;
    }

    return `查询失败：${response.data.message}`;
  } catch (error) {
    console.error("用户查询失败:", error);
    return `抱歉，成员查询服务暂时不可用。`;
  }
};
