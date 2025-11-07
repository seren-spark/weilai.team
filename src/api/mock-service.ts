// ... existing code ...
import Mock from "mockjs";
// ==================== 团队A服务器模拟 (风格: {code, data, message}) ====================
// 团队A使用标准的 {code, data, message} 格式
Mock.mock("http://localhost:3001/api/team-a/users", "get", () => {
  return {
    code: 200,
    message: "获取用户列表成功",
    data: [
      {
        id: 1,
        name: "张三",
        email: "zhangsan@teama.com",
        role: "developer",
        department: "技术部",
      },
      {
        id: 2,
        name: "李四",
        email: "lisi@teama.com",
        role: "designer",
        department: "设计部",
      },
      {
        id: 3,
        name: "王五",
        email: "wangwu@teama.com",
        role: "manager",
        department: "产品部",
      },
    ],
  };
});

Mock.mock("http://localhost:3001/api/team-a/users", "post", (options: any) => {
  const userData = JSON.parse(options.body);

  
  return {
    code: 201,
    message: "用户创建成功",
    data: {
      id: Math.floor(Math.random() * 1000) + 100,
      ...userData,
      createdAt: new Date().toISOString(),
    },
  };
});

Mock.mock(
  "http://localhost:3001/api/team-a/users/:id",
  "put",
  (options: any) => {
    const id = options.url.split("/").pop();
    const userData = JSON.parse(options.body);
    return {
      code: 200,
      message: "用户更新成功",
      data: {
        id: parseInt(id),
        ...userData,
        updatedAt: new Date().toISOString(),
      },
    };
  },
);

Mock.mock(
  "http://localhost:3001/api/team-a/users/:id",
  "delete",
  (options: any) => {
    const id = options.url.split("/").pop();
    return {
      code: 200,
      message: "用户删除成功",
      data: { id: parseInt(id) },
    };
  },
);

Mock.mock("http://localhost:3001/api/team-a/posts", "get", () => {
  return {
    code: 200,
    message: "获取文章列表成功",
    data: [
      {
        id: 1,
        title: "团队A技术分享",
        content: "Vue3最佳实践",
        author: "张三",
        publishTime: "2024-01-15",
      },
      {
        id: 2,
        title: "设计系统更新",
        content: "新的设计规范发布",
        author: "李四",
        publishTime: "2024-01-16",
      },
    ],
  };
});

// ==================== 团队B服务器模拟 (风格: {status, data, msg, msgOther}) ====================
// 团队B使用 {status, data, msg, msgOther} 格式
Mock.mock("http://localhost:3002/api/team-b/users", "get", () => {
  return {
    status: "success",
    data: [
      {
        id: 1,
        name: "Alice",
        email: "alice@teamb.com",
        role: "senior_developer",
        team: "Frontend",
      },
      {
        id: 2,
        name: "Bob",
        email: "bob@teamb.com",
        role: "tech_lead",
        team: "Backend",
      },
      {
        id: 3,
        name: "Charlie",
        email: "charlie@teamb.com",
        role: "product_manager",
        team: "Product",
      },
    ],
    msg: "用户数据获取成功",
    msgOther: "User data retrieved successfully",
  };
});

Mock.mock("http://localhost:3002/api/team-b/users", "post", (options: any) => {
  const userData = JSON.parse(options.body);
  return {
    status: "created",
    data: {
      id: Math.floor(Math.random() * 1000) + 200,
      ...userData,
      created_at: new Date().toISOString(),
    },
    msg: "用户创建成功",
    msgOther: "User created successfully",
  };
});

Mock.mock(
  "http://localhost:3002/api/team-b/users/:id",
  "put",
  (options: any) => {
    const id = options.url.split("/").pop();
    const userData = JSON.parse(options.body);
    return {
      status: "updated",
      data: {
        id: parseInt(id),
        ...userData,
        updated_at: new Date().toISOString(),
      },
      msg: "用户信息更新成功",
      msgOther: "User information updated successfully",
    };
  },
);

Mock.mock(
  "http://localhost:3002/api/team-b/users/:id",
  "delete",
  (options: any) => {
    const id = options.url.split("/").pop();
    return {
      status: "deleted",
      data: { id: parseInt(id) },
      msg: "用户删除成功",
      msgOther: "User deleted successfully",
    };
  },
);

Mock.mock("http://localhost:3002/api/team-b/posts", "get", () => {
  return {
    status: "success",
    data: [
      {
        id: 1,
        title: "Innovation Hub",
        content: "Latest tech trends",
        author: "Alice",
        published_at: "2024-01-15",
      },
      {
        id: 2,
        title: "Product Strategy",
        content: "New features roadmap",
        author: "Bob",
        published_at: "2024-01-16",
      },
    ],
    msg: "文章列表获取成功",
    msgOther: "Posts retrieved successfully",
  };
});

// ==================== 错误响应示例 ====================
// 团队A错误响应格式
Mock.mock("http://localhost:3001/api/team-a/error", "get", () => {
  return {
    code: 400,
    message: "请求参数错误",
    data: null,
  };
});

// 团队B错误响应格式
Mock.mock("http://localhost:3002/api/team-b/error", "get", () => {
  return {
    status: "error",
    data: null,
    msg: "请求参数错误",
    msgOther: "Invalid request parameters",
  };
});

// ==================== 分页接口示例 ====================
// 团队A分页格式
Mock.mock(
  /http:\/\/localhost:3001\/api\/team-a\/users\/paginated/,
  "get",
  (options: any) => {
    console.log(options);

    const url = new URL(options.url, "http://localhost:3001");
    console.log(url, "url");

    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    console.log("请求了A的分页接口");

    return {
      code: 200,
      message: "mock分页数据获取成功",
      data: {
        records: Array.from({ length: pageSize }, (_, i) => ({
          id: (page - 1) * pageSize + i + 1,
          name: `用户${(page - 1) * pageSize + i + 1}`,
          email: `user${(page - 1) * pageSize + i + 1}@teama.com`,
          role: ["developer", "designer", "manager"][i % 3],
        })),
        pagination: {
          current: page,
          pageSize: pageSize,
          total: 100,
          totalPages: Math.ceil(100 / pageSize),
        },
      },
      // code: 200,
      // message: "请求成功",
      // data: {
      //   teamUserList: [
      //     {
      //       clazz: "计科235",
      //       grade: "2023",
      //       group: "1",
      //       id: 7,
      //       isLeader: false,
      //       name: "侯博然",
      //       studyId: "20231514528",
      //     },
      //   ],
      //   pageInfo: {
      //     current: 1,
      //     optimizeCountSql: true,
      //     orders: [],
      //     pages: 1,
      //     records: [],
      //     searchCount: true,
      //     size: 10,
      //     total: 1,
      //   },
      // },
    };
  },
);

// 团队B分页格式
Mock.mock(
  "http://localhost:3002/api/team-b/users/paginated",
  "get",
  (options: any) => {
    const url = new URL(options.url, "http://localhost:3002");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    return {
      status: "success",
      data: {
        items: Array.from({ length: limit }, (_, i) => ({
          id: (page - 1) * limit + i + 1,
          name: `User${(page - 1) * limit + i + 1}`,
          email: `user${(page - 1) * limit + i + 1}@teamb.com`,
          role: ["senior_developer", "tech_lead", "product_manager"][i % 3],
        })),
        meta: {
          page: page,
          limit: limit,
          total: 100,
          total_pages: Math.ceil(100 / limit),
        },
        msgOther: "评论成功",
      },
      // msg: "分页数据获取成功",
      
    };
  },
);
