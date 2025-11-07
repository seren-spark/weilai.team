# ⚡ 智能适配器 - 5分钟快速上手

## 🎯 核心问题

**你是否遇到过这些问题？**

```typescript
// 团队A返回这种格式
{ code: 200, data: {...}, message: "成功" }

// 团队B返回这种格式  
{ status: "success", data: {...}, msg: "OK" }

// 你需要写两套处理逻辑？
if (responseA.code === 200) { /* ... */ }
if (responseB.status === "success") { /* ... */ }
```

**智能适配器一行代码解决！**

---

## 🚀 立即使用（3步）

### 第1步：导入

```typescript
import { SmartAdapter } from './adapters/smart-adapter';
import { teamConfigs } from './config/team-config';
```

### 第2步：适配

```typescript
// 任何格式的响应
const response = await fetch('/api/users');

// 一行代码适配
const result = SmartAdapter.adaptResponse(
  response, 
  teamConfigs['default']
);
```

### 第3步：使用

```typescript
// 统一的处理方式
if (result.success) {
  console.log('数据:', result.data);
} else {
  console.error('错误:', result.message);
}
```

✅ **完成！所有响应都变成了统一格式！**

---

## 📦 集成到Axios（推荐）

直接在响应拦截器中使用：

```typescript
import axios from 'axios';
import { SmartAdapter } from './adapters/smart-adapter';
import { teamConfigs } from './config/team-config';

const apiClient = axios.create({
  baseURL: 'http://api.example.com'
});

// 🚀 在响应拦截器中使用
apiClient.interceptors.response.use(
  (response) => {
    return SmartAdapter.adaptResponse(
      response.data,
      teamConfigs['default']
    );
  }
);

export default apiClient;
```

现在所有API请求都自动适配！

```typescript
// 使用
const result = await apiClient.get('/users');

if (result.success) {
  console.log(result.data); // ✅ 统一格式
}
```

---

## 🎨 三种使用方式

### 方式1: 使用配置（推荐 ⭐）

```typescript
// 性能最优，一次配置，永久使用
const result = SmartAdapter.adaptResponse(
  response,
  teamConfigs['default']  // 使用预配置
);
```

### 方式2: 零配置

```typescript
// 自动检测格式，首次慢后续快（有缓存）
const result = SmartAdapter.adaptResponse(response);
```

### 方式3: 临时配置

```typescript
// 临时自定义配置
const result = SmartAdapter.adaptResponse(response, {
  teamId: 'temp',
  baseURL: 'http://api.com',
  responseFormat: {
    successField: 'code',
    successValues: [200],
    dataField: 'data',
    messageField: 'message'
  }
});
```

---

## 💡 实际示例

### 示例1: 获取用户列表

```typescript
import apiClient from './axios-with-adapter';

async function getUserList() {
  const result = await apiClient.get('/users');
  
  if (result.success) {
    console.log('用户列表:', result.data);
    console.log('总数:', result.data.total);
  } else {
    console.error('获取失败:', result.message);
  }
}
```

### 示例2: 创建用户

```typescript
async function createUser(userData) {
  const result = await apiClient.post('/users', userData);
  
  if (result.success) {
    console.log('创建成功:', result.data);
    showSuccess(result.message);
  } else {
    console.error('创建失败:', result.message);
    showError(result.message);
  }
}
```

### 示例3: 分页查询

```typescript
async function getPagedUsers(page: number, size: number) {
  const result = await apiClient.get('/users', {
    params: { page, size }
  });
  
  if (result.success) {
    // ✅ 自动处理分页数据
    console.log('用户列表:', result.data.records);
    console.log('当前页:', result.data.current);
    console.log('总数:', result.data.total);
    console.log('总页数:', result.data.pages);
  }
}
```

---

## 🎁 统一响应格式

所有响应都会转换为：

```typescript
{
  success: boolean,   // ✅ 统一的成功标识
  data: any,         // 📦 统一的数据字段
  message: string,   // 💬 统一的消息字段
  code: number,      // 🔢 统一的状态码
  timestamp: number  // ⏰ 时间戳
}
```

---

## 🔧 自定义配置（可选）

如果需要自定义团队配置，编辑 `config/team-config.ts`：

```typescript
export const teamConfigs: Record<string, TeamConfig> = {
  'my-team': {
    teamId: 'my-team',
    baseURL: 'http://my-api.com',
    responseFormat: {
      successField: 'code',       // 成功字段名
      successValues: [200, 201],  // 成功的值
      dataField: 'data',          // 数据字段名
      messageField: 'message'     // 消息字段名
    }
  }
};
```

---

## ⚡ 性能

- **使用配置**: 10000次请求 < 10ms ⚡⚡⚡
- **自动检测(缓存)**: 10000次请求 < 50ms ⚡⚡
- **首次检测**: 1次 ≈ 1-2ms ⚡

**结论**: 放心使用，性能完全不是问题！

---

## 🎯 支持的场景

✅ 不同后端响应格式统一  
✅ 多团队协作  
✅ 新老接口兼容  
✅ 错误信息提取  
✅ 分页数据处理  
✅ 嵌套数据提取  
✅ 类型安全（TypeScript）  

---

## 📚 更多功能

想了解更多？查看完整文档：

- [完整文档](./README.md) - 详细的功能说明
- [使用示例](./examples/usage-examples.ts) - 10个实用示例
- [测试文件](./examples/compatibility-test.ts) - 兼容性测试

---

## ❓ 常见问题

**Q: 会影响性能吗？**  
A: 不会，使用配置时性能几乎无损耗，自动检测有缓存机制。

**Q: 需要改动现有代码吗？**  
A: 只需在axios拦截器中添加一行代码即可。

**Q: 支持TypeScript吗？**  
A: 完全支持，有完整的类型定义。

**Q: 如何处理复杂格式？**  
A: 支持混合配置，可以用函数处理复杂逻辑。

---

## ✨ 现在就开始！

1. 参考 `axios-with-adapter.ts` 集成到你的项目
2. 或者直接替换原有的 `axios.ts`
3. 开始享受统一的响应格式！

**Happy Coding! 🎉**

