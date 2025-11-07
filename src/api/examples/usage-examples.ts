/**
 * 智能适配器使用示例
 * 
 * 这个文件展示了各种使用场景和最佳实践
 */

import { SmartAdapter } from '../adapters/smart-adapter';
import { teamConfigs } from '../config/team-config';
import type { StandardResponse } from '../types';

// ==================== 示例1: 基础使用 ====================
export function example1_BasicUsage() {
  console.log('\n📚 示例1: 基础使用\n');

  // 模拟后端响应
  const response1 = {
    code: 200,
    data: { id: 1, name: 'John' },
    message: '获取成功'
  };

  // 使用团队配置
  const result1 = SmartAdapter.adaptResponse(response1, teamConfigs['team-a']);
  console.log('使用配置:', result1);
  // 输出: { success: true, data: {...}, message: '获取成功', code: 200, timestamp: ... }

  // 零配置（自动检测）
  const result2 = SmartAdapter.adaptResponse(response1);
  console.log('自动检测:', result2);
  // 同样能正确识别格式
}

// ==================== 示例2: 处理不同格式 ====================
export function example2_DifferentFormats() {
  console.log('\n📚 示例2: 处理不同响应格式\n');

  // 格式A: {code, data, message}
  const formatA = {
    code: 200,
    data: [1, 2, 3],
    message: 'Success'
  };

  // 格式B: {status, data, msg}
  const formatB = {
    status: 'success',
    data: { value: 123 },
    msg: 'OK'
  };

  // 格式C: {success, result, message}
  const formatC = {
    success: true,
    result: { items: [] },
    message: 'Completed'
  };

  // 智能适配器能自动识别所有格式
  console.log('格式A:', SmartAdapter.adaptResponse(formatA, teamConfigs['team-a']));
  console.log('格式B:', SmartAdapter.adaptResponse(formatB, teamConfigs['team-b']));
  console.log('格式C:', SmartAdapter.adaptResponse(formatC)); // 自动检测

  // ✨ 所有结果都被统一为标准格式！
}

// ==================== 示例3: 错误处理 ====================
export function example3_ErrorHandling() {
  console.log('\n📚 示例3: 错误处理\n');

  // 场景1: 顶层message
  const error1 = {
    code: 400,
    data: null,
    message: '参数错误'
  };

  // 场景2: data中的message
  const error2 = {
    code: 400,
    data: {
      message: '用户名已存在',
      field: 'username'
    }
  };

  // 场景3: data本身是错误信息
  const error3 = {
    code: 500,
    data: '服务器内部错误'
  };

  // 场景4: 嵌套错误信息
  const error4 = {
    code: 400,
    data: {
      errors: [
        { field: 'email', message: '邮箱格式不正确' },
        { field: 'phone', message: '手机号已被使用' }
      ]
    }
  };

  console.log('错误1:', SmartAdapter.adaptResponse(error1, teamConfigs['team-a']));
  console.log('错误2:', SmartAdapter.adaptResponse(error2, teamConfigs['team-mixed-simple']));
  console.log('错误3:', SmartAdapter.adaptResponse(error3, teamConfigs['team-a']));
  console.log('错误4:', SmartAdapter.adaptResponse(error4, teamConfigs['team-production']));

  // ✨ 所有错误都能正确提取错误信息！
}

// ==================== 示例4: 分页数据处理 ====================
export function example4_PaginationHandling() {
  console.log('\n📚 示例4: 分页数据处理\n');

  // 嵌套分页格式
  const nestedPagination = {
    code: 200,
    data: {
      records: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 100,
        totalPages: 10
      },
      extraInfo: '一些额外信息'
    },
    message: '成功'
  };

  // 扁平分页格式
  const flatPagination = {
    status: 'success',
    data: {
      items: [
        { id: 1, name: 'Item1' },
        { id: 2, name: 'Item2' }
      ],
      page: 2,
      limit: 20,
      total: 50,
      total_pages: 3
    },
    msg: '获取成功'
  };

  const result1 = SmartAdapter.adaptResponse(nestedPagination, teamConfigs['team-a']);
  const result2 = SmartAdapter.adaptResponse(flatPagination, teamConfigs['team-b']);

  console.log('嵌套分页结果:', result1);
  console.log('扁平分页结果:', result2);

  // ✨ 统一返回格式:
  // {
  //   success: true,
  //   data: {
  //     records: [...],
  //     current: 1,
  //     size: 10,
  //     total: 100,
  //     pages: 10,
  //     extraInfo: '...' // 额外数据也会保留
  //   },
  //   message: '...',
  //   code: 200,
  //   timestamp: ...
  // }
}

// ==================== 示例5: 混合配置方案 ====================
export function example5_MixedConfiguration() {
  console.log('\n📚 示例5: 混合配置（声明式 + 函数式）\n');

  // 场景：复杂的错误处理，有多种错误格式
  const complexError = {
    code: 400,
    data: {
      message: '用户名已存在'
    }
  };

  // team-mixed-simple 配置了声明式基础配置 + 自定义错误提取函数
  const result = SmartAdapter.adaptResponse(
    complexError,
    teamConfigs['team-mixed-simple']
  );

  console.log('混合配置结果:', result);
  // ✨ 自定义的 getError 函数会按优先级提取错误信息
}

// ==================== 示例6: 响应预处理（transform） ====================
export function example6_ResponseTransform() {
  console.log('\n📚 示例6: 响应预处理\n');

  // 场景：后端返回多层嵌套的数据
  const nestedResponse = {
    result: {
      response: {
        code: 200,
        data: { value: 'actual data' },
        message: '成功'
      }
    }
  };

  // team-mixed-transform 配置了 transform 函数来解嵌套
  const result = SmartAdapter.adaptResponse(
    nestedResponse,
    teamConfigs['team-mixed-transform']
  );

  console.log('预处理后结果:', result);
  // ✨ transform 函数会先解嵌套，再进行适配
}

// ==================== 示例7: 缓存机制 ====================
export function example7_CacheUsage() {
  console.log('\n📚 示例7: 缓存机制\n');

  const response = {
    code: 200,
    data: { test: true },
    message: 'OK'
  };

  // 启用调试模式
  SmartAdapter.setDebugMode(true);

  // 清除所有缓存
  SmartAdapter.clearCache();
  console.log('1. 缓存数量:', SmartAdapter.getCacheInfo().size);

  // 第一次请求（触发检测并缓存）
  const config = { ...teamConfigs['team-c'], enableCache: true };
  SmartAdapter.adaptResponse(response, config);
  console.log('2. 第一次请求后，缓存数量:', SmartAdapter.getCacheInfo().size);

  // 第二次请求（使用缓存，性能更好）
  SmartAdapter.adaptResponse(response, config);
  console.log('3. 第二次请求后，缓存数量:', SmartAdapter.getCacheInfo().size);

  // 清除单个团队缓存
  SmartAdapter.clearCache('team-c');
  console.log('4. 清除team-c后，缓存数量:', SmartAdapter.getCacheInfo().size);

  SmartAdapter.setDebugMode(false);
}

// ==================== 示例8: 在实际API中使用 ====================
export function example8_RealWorldUsage() {
  console.log('\n📚 示例8: 实际API使用\n');

  // 模拟API调用
  async function getUserList(page: number, pageSize: number) {
    // 假设这是从后端获取的原始响应
    const rawResponse = {
      code: 200,
      data: {
        records: [
          { id: 1, name: 'User1', email: 'user1@example.com' },
          { id: 2, name: 'User2', email: 'user2@example.com' }
        ],
        pagination: {
          current: page,
          pageSize: pageSize,
          total: 100,
          totalPages: Math.ceil(100 / pageSize)
        }
      },
      message: '获取用户列表成功'
    };

    // 使用智能适配器处理
    const result = SmartAdapter.adaptResponse(rawResponse, teamConfigs['team-a']);

    // 现在可以统一处理结果
    if (result.success) {
      console.log('✅ 获取成功');
      console.log('用户数据:', result.data);
      console.log('总数:', result.data.total);
    } else {
      console.log('❌ 获取失败:', result.message);
    }

    return result;
  }

  // 使用
  getUserList(1, 10);
}

// ==================== 示例9: TypeScript类型安全 ====================
export function example9_TypeSafety() {
  console.log('\n📚 示例9: TypeScript类型安全\n');

  interface User {
    id: number;
    name: string;
    email: string;
  }

  interface UserListData {
    records: User[];
    current: number;
    size: number;
    total: number;
    pages: number;
  }

  const response = {
    code: 200,
    data: {
      records: [
        { id: 1, name: 'Alice', email: 'alice@example.com' }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1
      }
    },
    message: '成功'
  };

  // 类型安全的使用
  const result: StandardResponse<UserListData> = SmartAdapter.adaptResponse(
    response,
    teamConfigs['team-a']
  );

  if (result.success) {
    // TypeScript会提供完整的类型提示
    const users: User[] = result.data.records;
    const total: number = result.data.total;
    
    console.log('✅ 类型安全的访问');
    console.log('用户列表:', users);
    console.log('总数:', total);
  }
}

// ==================== 示例10: 性能对比 ====================
export function example10_PerformanceComparison() {
  console.log('\n📚 示例10: 性能对比\n');

  const response = {
    code: 200,
    data: { id: 1, name: 'test' },
    message: '成功'
  };

  const iterations = 10000;

  // 测试1: 使用声明式配置（最快）
  console.time('声明式配置（10000次）');
  for (let i = 0; i < iterations; i++) {
    SmartAdapter.adaptResponse(response, teamConfigs['team-a']);
  }
  console.timeEnd('声明式配置（10000次）');

  // 清除缓存
  SmartAdapter.clearCache();

  // 测试2: 智能检测（首次慢，后续有缓存）
  console.time('智能检测（10000次，含缓存）');
  for (let i = 0; i < iterations; i++) {
    SmartAdapter.adaptResponse(response, { 
      teamId: 'test-team',
      baseURL: 'http://test.com',
      enableCache: true
    });
  }
  console.timeEnd('智能检测（10000次，含缓存）');

  console.log('\n✨ 结论: 声明式配置性能最优，智能检测首次慢但有缓存');
}

// ==================== 运行所有示例 ====================
export function runAllExamples() {
  console.log('🎯 智能适配器使用示例集\n');
  console.log('='.repeat(60));

  example1_BasicUsage();
  example2_DifferentFormats();
  example3_ErrorHandling();
  example4_PaginationHandling();
  example5_MixedConfiguration();
  example6_ResponseTransform();
  example7_CacheUsage();
  example8_RealWorldUsage();
  example9_TypeSafety();
  example10_PerformanceComparison();

  console.log('\n' + '='.repeat(60));
  console.log('✅ 所有示例运行完成！');
}

// 如果直接运行此文件（Node.js环境）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

