# 🚀 智能适配器 - 完整使用指南

## 📋 目录

1. [概述](#概述)
2. [快速开始](#快速开始)
3. [核心特性](#核心特性)
4. [使用方式](#使用方式)
5. [配置说明](#配置说明)
6. [最佳实践](#最佳实践)
7. [常见问题](#常见问题)
8. [API文档](#api文档)

---

## 概述

智能适配器是一个强大的响应数据统一处理方案，能够将不同格式的后端响应自动转换为统一的标准格式。

### ✨ 为什么需要智能适配器？

在多团队协作或对接多个后端系统时，常常遇到这些问题：

```typescript
// 团队A的响应格式
{
  code: 200,
  data: {...},
  message: "成功"
}

// 团队B的响应格式
{
  status: "success",
  data: {...},
  msg: "OK"
}

// 团队C的响应格式
{
  success: true,
  result: {...},
  message: "完成"
}
```

每种格式都需要不同的处理逻辑，导致代码冗余且难以维护。

### 💡 智能适配器的解决方案

```typescript
// 所有格式统一转换为：
{
  success: boolean,  // 统一的成功标识
  data: any,        // 统一的数据字段
  message: string,  // 统一的消息字段
  code: number,     // 统一的状态码
  timestamp: number // 时间戳
}
```

---

## 快速开始

### 1️⃣ 基础使用（推荐 ⭐）

```typescript
import { SmartAdapter } from './adapters/smart-adapter';
import { teamConfigs } from './config/team-config';

// 后端响应
const response = {
  code: 200,
  data: { id: 1, name: 'John' },
  message: '获取成功'
};

// 使用团队配置（性能最优）
const result = SmartAdapter.adaptResponse(response, teamConfigs['default']);

console.log(result);
// 输出: {
//   success: true,
//   data: { id: 1, name: 'John' },
//   message: '获取成功',
//   code: 200,
//   timestamp: 1699999999999
// }
```

### 2️⃣ 零配置使用（自动检测）

```typescript
// 不提供配置，自动检测格式
const result = SmartAdapter.adaptResponse(response);

// ✅ 同样能正确识别并转换！
```

### 3️⃣ 在Axios中集成

```typescript
import axios from 'axios';
import { SmartAdapter } from './adapters/smart-adapter';
import { teamConfigs } from './config/team-config';

const apiClient = axios.create({
  baseURL: 'http://api.example.com'
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 🚀 使用智能适配器
    return SmartAdapter.adaptResponse(
      response.data,
      teamConfigs['default']
    );
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 核心特性

### 🎯 1. 三种配置方式

#### ① 声明式配置（推荐）

适用于90%的场景，性能最优

```typescript
const config: TeamConfig = {
  teamId: 'my-team',
  baseURL: 'http://api.example.com',
  responseFormat: {
    successField: 'code',
    successValues: [200, 201],
    dataField: 'data',
    messageField: 'message'
  }
};
```

#### ② 函数式配置（灵活）

适用于复杂场景，完全自定义

```typescript
const config: TeamConfig = {
  teamId: 'complex-team',
  baseURL: 'http://api.example.com',
  customHandlers: {
    isSuccess: (res) => res.status === 1 || res.code === 200,
    getData: (res) => res.result || res.data,
    getError: (res) => res.errorMsg || res.message
  }
};
```

#### ③ 混合配置（推荐 ⭐）

声明式为主，关键逻辑用函数增强

```typescript
const config: TeamConfig = {
  teamId: 'mixed-team',
  baseURL: 'http://api.example.com',
  // 基础配置用声明式
  responseFormat: {
    successField: 'code',
    successValues: [200],
    dataField: 'data',
    messageField: 'message'
  },
  // 复杂逻辑用函数式
  customHandlers: {
    getError: (res) => {
      if (res.message) return res.message;
      if (res.data?.message) return res.data.message;
      return '未知错误';
    }
  }
};
```

### 🔄 2. 智能错误处理

自动识别多种错误格式：

```typescript
// 场景1: 顶层message
{ code: 400, data: null, message: '参数错误' }

// 场景2: data中的message
{ code: 400, data: { message: '用户名已存在' } }

// 场景3: data本身是错误信息
{ code: 500, data: '服务器内部错误' }

// 场景4: 嵌套错误
{ 
  code: 400, 
  data: { 
    errors: [
      { field: 'email', message: '邮箱格式不正确' }
    ]
  }
}

// ✅ 所有格式都能正确提取错误信息！
```

### 📊 3. 智能分页处理

自动识别嵌套和扁平两种分页格式：

```typescript
// 嵌套分页
{
  code: 200,
  data: {
    records: [...],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 100
    }
  }
}

// 扁平分页
{
  code: 200,
  data: {
    list: [...],
    page: 1,
    limit: 10,
    total: 100
  }
}

// ✅ 统一转换为标准分页格式！
// {
//   success: true,
//   data: {
//     records: [...],
//     current: 1,
//     size: 10,
//     total: 100,
//     pages: 10
//   }
// }
```

### ⚡ 4. 性能优化

- **配置缓存**: 首次检测后缓存，后续零开销
- **声明式优先**: 直接取值，无需遍历
- **智能兜底**: 只在必要时才进行深度检测

性能对比：

```
声明式配置:   10000次 < 10ms  ⚡⚡⚡
智能检测(缓存): 10000次 < 50ms  ⚡⚡
智能检测(首次): 1次 ≈ 1-2ms    ⚡
```

---

## 使用方式

### 方式1: 直接使用（最简单）

```typescript
import { SmartAdapter } from './adapters/smart-adapter';

const result = SmartAdapter.adaptResponse(apiResponse);

if (result.success) {
  console.log('成功:', result.data);
} else {
  console.error('失败:', result.message);
}
```

### 方式2: 结合Axios（推荐 ⭐）

参考 `axios-with-adapter.ts` 文件

### 方式3: 封装为Hook（Vue推荐）

```typescript
import { ref } from 'vue';
import { SmartAdapter } from './adapters/smart-adapter';
import { teamConfigs } from './config/team-config';

export function useApi(teamId = 'default') {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function request<T>(apiCall: Promise<any>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall;
      const result = SmartAdapter.adaptResponse(
        response,
        teamConfigs[teamId]
      );

      if (result.success) {
        return result.data as T;
      } else {
        error.value = result.message;
        throw new Error(result.message);
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    request,
    loading,
    error
  };
}

// 使用
const { request, loading, error } = useApi('team-a');

async function fetchUsers() {
  const users = await request(axios.get('/users'));
  console.log(users);
}
```

---

## 配置说明

### 完整配置结构

```typescript
interface TeamConfig {
  // 基础配置
  teamId: string;
  teamName?: string;
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  
  // 声明式配置（可选）
  responseFormat?: {
    successField: string;
    successValues: (string | number | boolean)[];
    dataField: string;
    messageField: string | string[];
    
    // 错误配置
    errorConfig?: {
      errorDataType?: 'string' | 'object' | 'null';
      errorMessageField?: string | string[];
      nestedMessagePath?: string | string[];
    };
    
    // 分页配置
    paginationConfig?: {
      type: 'nested' | 'flat';
      recordsField: string;
      paginationField?: string;
      currentField?: string;
      sizeField?: string;
      totalField?: string;
      pagesField?: string;
    };
  };
  
  // 函数式配置（可选）
  customHandlers?: {
    match?: (config: any) => boolean;
    isSuccess?: (response: any) => boolean;
    getData?: (response: any) => any;
    getError?: (response: any) => string;
    getMessage?: (response: any, isSuccess: boolean) => string;
    transform?: (response: any) => any;
    errorTransform?: (error: any, originalResponse?: any) => any;
    getPagination?: (response: any) => PaginationData | null;
  };
  
  // 其他配置
  enableCache?: boolean;
  description?: string;
}
```

### 配置模板

系统提供了常用模板：

```typescript
import {
  TEMPLATE_CODE_DATA_MESSAGE,
  TEMPLATE_STATUS_DATA_MSG,
  TEMPLATE_SUCCESS_RESULT_MESSAGE,
  PAGINATION_NESTED_TEMPLATE,
  PAGINATION_FLAT_TEMPLATE
} from './config/team-config';

// 使用模板
const myConfig: TeamConfig = {
  teamId: 'my-team',
  baseURL: 'http://api.example.com',
  responseFormat: TEMPLATE_CODE_DATA_MESSAGE
};
```

---

## 最佳实践

### ✅ DO (推荐做法)

1. **优先使用声明式配置**
   ```typescript
   // ✅ 好
   responseFormat: {
     successField: 'code',
     successValues: [200],
     dataField: 'data',
     messageField: 'message'
   }
   ```

2. **混合使用处理复杂场景**
   ```typescript
   // ✅ 好：基础用声明式，复杂逻辑用函数
   responseFormat: { ... },
   customHandlers: {
     getError: (res) => { /* 复杂错误提取逻辑 */ }
   }
   ```

3. **启用缓存提升性能**
   ```typescript
   // ✅ 好
   const config = {
     ...teamConfigs['my-team'],
     enableCache: true
   };
   ```

4. **使用TypeScript类型**
   ```typescript
   // ✅ 好
   const result: StandardResponse<User[]> = 
     SmartAdapter.adaptResponse(response, config);
   ```

### ❌ DON'T (不推荐)

1. **不要过度使用函数式**
   ```typescript
   // ❌ 不好：简单场景没必要用函数
   customHandlers: {
     isSuccess: (res) => res.code === 200,  // 声明式就够了
     getData: (res) => res.data             // 声明式就够了
   }
   ```

2. **不要禁用缓存（除非必要）**
   ```typescript
   // ❌ 不好
   const config = {
     ...teamConfigs['my-team'],
     enableCache: false  // 会影响性能
   };
   ```

3. **不要忽略错误处理**
   ```typescript
   // ❌ 不好
   const result = SmartAdapter.adaptResponse(response);
   const data = result.data;  // 没检查success
   
   // ✅ 好
   const result = SmartAdapter.adaptResponse(response);
   if (result.success) {
     const data = result.data;
   }
   ```

---

## 常见问题

### Q1: 如何添加新的团队配置？

在 `config/team-config.ts` 中添加：

```typescript
export const teamConfigs: Record<string, TeamConfig> = {
  // 添加新团队
  'new-team': {
    teamId: 'new-team',
    baseURL: 'http://new-api.com',
    responseFormat: TEMPLATE_CODE_DATA_MESSAGE
  }
};
```

### Q2: 如何处理多层嵌套的错误信息？

使用 `errorConfig.nestedMessagePath`：

```typescript
responseFormat: {
  // ...
  errorConfig: {
    nestedMessagePath: ['data', 'error', 'message']  // 支持深层路径
  }
}
```

或使用函数式：

```typescript
customHandlers: {
  getError: (res) => res.data?.error?.message || '未知错误'
}
```

### Q3: 如何调试适配器？

启用调试模式：

```typescript
SmartAdapter.setDebugMode(true);

// 现在会输出详细日志
const result = SmartAdapter.adaptResponse(response, config);

SmartAdapter.setDebugMode(false);
```

### Q4: 如何清除缓存？

```typescript
// 清除所有缓存
SmartAdapter.clearCache();

// 清除指定团队缓存
SmartAdapter.clearCache('team-a');

// 查看缓存信息
const cacheInfo = SmartAdapter.getCacheInfo();
console.log('缓存数量:', cacheInfo.size);
```

### Q5: 零配置性能如何？

- 首次请求：1-2ms（自动检测）
- 后续请求：< 0.1ms（使用缓存）
- 建议：已知格式的团队最好配置，性能更优

---

## API文档

### SmartAdapter.adaptResponse()

核心方法，适配响应数据

```typescript
static adaptResponse(
  response: any,
  teamConfig?: TeamConfig
): StandardResponse
```

**参数:**
- `response`: 原始响应数据
- `teamConfig`: 团队配置（可选）

**返回:**
```typescript
{
  success: boolean,
  data: any,
  message: string,
  code: number,
  timestamp: number
}
```

### SmartAdapter.setDebugMode()

设置调试模式

```typescript
static setDebugMode(enabled: boolean): void
```

### SmartAdapter.clearCache()

清除缓存

```typescript
static clearCache(teamId?: string): void
```

### SmartAdapter.getCacheInfo()

获取缓存信息

```typescript
static getCacheInfo(): Map<string, any>
```

---

## 测试

### 运行兼容性测试

```bash
npm run test:compatibility
```

### 运行使用示例

```bash
npm run examples:usage
```

---

## 文件结构

```
src/api/
├── adapters/
│   └── smart-adapter.ts        # 核心适配器
├── config/
│   └── team-config.ts          # 团队配置
├── examples/
│   ├── compatibility-test.ts   # 兼容性测试
│   └── usage-examples.ts       # 使用示例
├── axios.ts                    # 原始axios实例
├── axios-with-adapter.ts       # 集成适配器的axios
├── types.ts                    # 类型定义
└── README.md                   # 本文档
```

---

## 总结

智能适配器提供了一套完整的响应数据处理方案：

✅ **易用性**: 零配置即可使用，智能检测格式  
✅ **灵活性**: 声明式 + 函数式，适应所有场景  
✅ **性能**: 配置缓存机制，后续请求零开销  
✅ **类型安全**: 完整的TypeScript支持  
✅ **可维护**: 配置化管理，新团队接入只需加配置  

---

## 更新日志

- **v1.0.0** (2024-11): 初始版本，支持混合配置方案
- 支持声明式、函数式、混合配置
- 智能检测响应格式
- 分页数据自动处理
- 性能优化和缓存机制

---

## 联系与支持

如有问题或建议，请联系开发团队或提交Issue。

**Happy Coding! 🎉**
