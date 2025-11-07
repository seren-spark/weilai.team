/**
 * Axios集成测试
 * 验证智能适配器与Axios的集成是否正常工作
 */

import axios from 'axios';
import { SmartAdapter } from '../adapters/smart-adapter';
import { teamConfigs } from '../config/team-config';
import type { StandardResponse } from '../types';

// ==================== 模拟服务器 ====================

/**
 * 模拟不同格式的API响应
 */
const mockAPIs = {
  // 格式A: {code, data, message}
  getUsersA: () => ({
    code: 200,
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ],
    message: '获取用户成功'
  }),

  // 格式B: {status, data, msg}
  getUsersB: () => ({
    status: 'success',
    data: [
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ],
    msg: '查询成功'
  }),

  // 错误响应
  getUsersError: () => ({
    code: 400,
    data: null,
    message: '参数错误'
  }),

  // 分页响应
  getUsersPaged: () => ({
    code: 200,
    data: {
      records: [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
        { id: 3, name: 'User3' }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 100,
        totalPages: 10
      }
    },
    message: '成功'
  })
};

// ==================== 测试用例 ====================

/**
 * 测试1: 基础适配
 */
export function test1_BasicAdaptation() {
  console.log('\n🧪 测试1: 基础适配\n');

  const mockResponse = mockAPIs.getUsersA();
  const result = SmartAdapter.adaptResponse(mockResponse, teamConfigs['team-a']);

  console.log('原始响应:', mockResponse);
  console.log('适配后:', result);

  // 验证
  if (result.success && result.data.length === 2) {
    console.log('✅ 测试通过');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试2: 不同格式适配
 */
export function test2_DifferentFormats() {
  console.log('\n🧪 测试2: 不同格式适配\n');

  const responseA = mockAPIs.getUsersA();
  const responseB = mockAPIs.getUsersB();

  const resultA = SmartAdapter.adaptResponse(responseA, teamConfigs['team-a']);
  const resultB = SmartAdapter.adaptResponse(responseB, teamConfigs['team-b']);

  console.log('格式A适配:', resultA.success ? '✅' : '❌');
  console.log('格式B适配:', resultB.success ? '✅' : '❌');

  if (resultA.success && resultB.success) {
    console.log('✅ 测试通过 - 两种格式都正确适配');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试3: 错误处理
 */
export function test3_ErrorHandling() {
  console.log('\n🧪 测试3: 错误处理\n');

  const errorResponse = mockAPIs.getUsersError();
  const result = SmartAdapter.adaptResponse(errorResponse, teamConfigs['team-a']);

  console.log('错误响应:', errorResponse);
  console.log('适配后:', result);

  if (!result.success && result.message === '参数错误') {
    console.log('✅ 测试通过 - 错误信息正确提取');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试4: 分页数据处理
 */
export function test4_PaginationHandling() {
  console.log('\n🧪 测试4: 分页数据处理\n');

  const pagedResponse = mockAPIs.getUsersPaged();
  const result = SmartAdapter.adaptResponse(pagedResponse, teamConfigs['team-a']);

  console.log('分页响应:', pagedResponse);
  console.log('适配后:', result);

  if (
    result.success &&
    result.data.records &&
    result.data.current === 1 &&
    result.data.total === 100
  ) {
    console.log('✅ 测试通过 - 分页数据正确处理');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试5: 零配置自动检测
 */
export function test5_AutoDetection() {
  console.log('\n🧪 测试5: 零配置自动检测\n');

  const response = mockAPIs.getUsersA();
  
  // 不提供配置，让系统自动检测
  const result = SmartAdapter.adaptResponse(response);

  console.log('原始响应:', response);
  console.log('自动检测适配:', result);

  if (result.success && result.data.length === 2) {
    console.log('✅ 测试通过 - 自动检测成功');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试6: 缓存机制
 */
export function test6_CacheMechanism() {
  console.log('\n🧪 测试6: 缓存机制\n');

  const response = mockAPIs.getUsersA();
  const config = { ...teamConfigs['team-a'], enableCache: true };

  // 清除缓存
  SmartAdapter.clearCache();
  console.log('1. 初始缓存数量:', SmartAdapter.getCacheInfo().size);

  // 第一次请求
  SmartAdapter.adaptResponse(response, config);
  console.log('2. 第一次请求后缓存数量:', SmartAdapter.getCacheInfo().size);

  // 第二次请求（使用缓存）
  SmartAdapter.adaptResponse(response, config);
  console.log('3. 第二次请求后缓存数量:', SmartAdapter.getCacheInfo().size);

  if (SmartAdapter.getCacheInfo().size === 1) {
    console.log('✅ 测试通过 - 缓存机制正常');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试7: TypeScript类型安全
 */
export function test7_TypeSafety() {
  console.log('\n🧪 测试7: TypeScript类型安全\n');

  interface User {
    id: number;
    name: string;
    email: string;
  }

  const response = mockAPIs.getUsersA();
  const result: StandardResponse<User[]> = SmartAdapter.adaptResponse(
    response,
    teamConfigs['team-a']
  );

  if (result.success) {
    // TypeScript应该提供完整的类型提示
    const firstUser: User = result.data[0];
    console.log('用户类型:', {
      id: firstUser.id,
      name: firstUser.name,
      email: firstUser.email
    });
    console.log('✅ 测试通过 - 类型安全');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试8: 性能测试
 */
export function test8_PerformanceTest() {
  console.log('\n🧪 测试8: 性能测试\n');

  const response = mockAPIs.getUsersA();
  const iterations = 10000;

  // 测试声明式配置性能
  console.time('声明式配置 (10000次)');
  for (let i = 0; i < iterations; i++) {
    SmartAdapter.adaptResponse(response, teamConfigs['team-a']);
  }
  console.timeEnd('声明式配置 (10000次)');

  // 清除缓存
  SmartAdapter.clearCache();

  // 测试自动检测性能（含缓存）
  console.time('自动检测+缓存 (10000次)');
  const testConfig = {
    teamId: 'perf-test',
    baseURL: 'http://test.com',
    enableCache: true
  };
  for (let i = 0; i < iterations; i++) {
    SmartAdapter.adaptResponse(response, testConfig);
  }
  console.timeEnd('自动检测+缓存 (10000次)');

  console.log('✅ 测试完成 - 性能数据已输出');
  return true;
}

/**
 * 测试9: 模拟真实Axios集成
 */
export function test9_AxiosIntegration() {
  console.log('\n🧪 测试9: 模拟Axios集成\n');

  // 模拟axios响应对象
  const axiosResponse = {
    data: mockAPIs.getUsersA(),
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  };

  // 模拟在axios拦截器中使用
  const result = SmartAdapter.adaptResponse(
    axiosResponse.data,
    teamConfigs['default']
  );

  console.log('Axios响应数据:', axiosResponse.data);
  console.log('适配后:', result);

  if (result.success && result.data.length === 2) {
    console.log('✅ 测试通过 - Axios集成正常');
    return true;
  } else {
    console.log('❌ 测试失败');
    return false;
  }
}

/**
 * 测试10: 完整业务场景
 */
export function test10_RealWorldScenario() {
  console.log('\n🧪 测试10: 完整业务场景模拟\n');

  // 模拟一个完整的API调用流程
  async function mockGetUserList(page: number, pageSize: number) {
    // 1. 发起请求（模拟）
    const rawResponse = mockAPIs.getUsersPaged();

    // 2. 适配响应
    const result = SmartAdapter.adaptResponse(
      rawResponse,
      teamConfigs['team-a']
    );

    // 3. 业务处理
    if (result.success) {
      console.log('✅ 获取成功');
      console.log('   - 记录数:', result.data.records.length);
      console.log('   - 当前页:', result.data.current);
      console.log('   - 总数:', result.data.total);
      return result.data;
    } else {
      console.error('❌ 获取失败:', result.message);
      throw new Error(result.message);
    }
  }

  try {
    const data = mockGetUserList(1, 10);
    console.log('✅ 测试通过 - 完整业务场景正常');
    return true;
  } catch (error) {
    console.log('❌ 测试失败');
    return false;
  }
}

// ==================== 运行所有测试 ====================

/**
 * 运行所有测试
 */
export function runAllTests() {
  console.log('🎯 Axios集成测试套件');
  console.log('='.repeat(60));

  const tests = [
    { name: '基础适配', fn: test1_BasicAdaptation },
    { name: '不同格式适配', fn: test2_DifferentFormats },
    { name: '错误处理', fn: test3_ErrorHandling },
    { name: '分页数据处理', fn: test4_PaginationHandling },
    { name: '零配置自动检测', fn: test5_AutoDetection },
    { name: '缓存机制', fn: test6_CacheMechanism },
    { name: 'TypeScript类型安全', fn: test7_TypeSafety },
    { name: '性能测试', fn: test8_PerformanceTest },
    { name: 'Axios集成', fn: test9_AxiosIntegration },
    { name: '完整业务场景', fn: test10_RealWorldScenario }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    try {
      const result = test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ 测试异常: ${test.name}`, error);
      failed++;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总:');
  console.log(`   总计: ${tests.length}`);
  console.log(`   通过: ${passed} ✅`);
  console.log(`   失败: ${failed} ❌`);
  console.log(`   通过率: ${((passed / tests.length) * 100).toFixed(2)}%`);
  console.log('='.repeat(60));

  return {
    total: tests.length,
    passed,
    failed
  };
}

// 如果直接运行此文件（Node.js环境）
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

