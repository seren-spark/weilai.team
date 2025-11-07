/**
 * 兼容性测试 - 验证混合配置方案与现有代码的兼容性
 */

import { SmartAdapter } from '../adapters/smart-adapter';
import { teamConfigs } from '../config/team-config';
import type { StandardResponse } from '../types';

/**
 * 测试用例
 */
interface TestCase {
  name: string;
  response: any;
  teamId?: string;
  expectedSuccess: boolean;
  expectedDataType?: string;
}

const testCases: TestCase[] = [
  // ==================== 基础格式测试 ====================
  {
    name: '标准格式 {code, data, message}',
    response: {
      code: 200,
      data: { id: 1 },
      message: '成功'
    },
    teamId: 'team-a',
    expectedSuccess: true,
    expectedDataType: 'object'
  },
  {
    name: '自定义格式 {status, data, msg}',
    response: {
      status: 'success',
      data: [1, 2, 3],
      msg: '获取成功'
    },
    teamId: 'team-b',
    expectedSuccess: true,
    expectedDataType: 'object'
  },

  // ==================== 错误格式测试 ====================
  {
    name: '错误响应 - message在顶层',
    response: {
      code: 400,
      data: null,
      message: '参数错误'
    },
    teamId: 'team-a',
    expectedSuccess: false
  },
  {
    name: '错误响应 - message在data中',
    response: {
      code: 400,
      data: {
        message: '用户名已存在',
        field: 'username'
      }
    },
    teamId: 'team-mixed-simple',
    expectedSuccess: false
  },
  {
    name: '错误响应 - data为字符串',
    response: {
      code: 500,
      data: '服务器内部错误'
    },
    teamId: 'team-a',
    expectedSuccess: false
  },

  // ==================== 分页格式测试 ====================
  {
    name: '嵌套分页格式',
    response: {
      code: 200,
      data: {
        records: [1, 2, 3],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 100,
          totalPages: 10
        }
      },
      message: '成功'
    },
    teamId: 'team-a',
    expectedSuccess: true,
    expectedDataType: 'object'
  },
  {
    name: '扁平分页格式',
    response: {
      status: 'success',
      data: {
        items: [1, 2, 3],
        page: 1,
        limit: 10,
        total: 100,
        total_pages: 10
      },
      msg: '成功'
    },
    teamId: 'team-b',
    expectedSuccess: true,
    expectedDataType: 'object'
  },

  // ==================== 零配置智能检测测试 ====================
  {
    name: '智能检测 - 标准格式',
    response: {
      code: 200,
      data: { test: true },
      message: 'OK'
    },
    expectedSuccess: true
  },
  {
    name: '智能检测 - 自定义格式',
    response: {
      status: 'success',
      result: { value: 123 },
      msg: '成功'
    },
    expectedSuccess: true
  },

  // ==================== 边界情况测试 ====================
  {
    name: '空数据',
    response: {
      code: 200,
      data: null,
      message: '无数据'
    },
    teamId: 'team-a',
    expectedSuccess: true
  },
  {
    name: '空对象',
    response: {
      code: 200,
      data: {},
      message: '成功'
    },
    teamId: 'team-a',
    expectedSuccess: true
  },
  {
    name: '空数组',
    response: {
      code: 200,
      data: [],
      message: '成功'
    },
    teamId: 'team-a',
    expectedSuccess: true
  }
];

/**
 * 运行单个测试用例
 */
function runTestCase(testCase: TestCase): { passed: boolean; error?: string } {
  try {
    const config = testCase.teamId ? teamConfigs[testCase.teamId] : undefined;
    const result: StandardResponse = SmartAdapter.adaptResponse(testCase.response, config);

    // 验证基本结构
    if (!result.hasOwnProperty('success')) {
      return { passed: false, error: '缺少 success 字段' };
    }
    if (!result.hasOwnProperty('data')) {
      return { passed: false, error: '缺少 data 字段' };
    }
    if (!result.hasOwnProperty('message')) {
      return { passed: false, error: '缺少 message 字段' };
    }
    if (!result.hasOwnProperty('code')) {
      return { passed: false, error: '缺少 code 字段' };
    }
    if (!result.hasOwnProperty('timestamp')) {
      return { passed: false, error: '缺少 timestamp 字段' };
    }

    // 验证类型
    if (typeof result.success !== 'boolean') {
      return { passed: false, error: 'success 必须是 boolean' };
    }
    if (typeof result.message !== 'string') {
      return { passed: false, error: 'message 必须是 string' };
    }
    if (typeof result.code !== 'number') {
      return { passed: false, error: 'code 必须是 number' };
    }
    if (typeof result.timestamp !== 'number') {
      return { passed: false, error: 'timestamp 必须是 number' };
    }

    // 验证预期结果
    if (result.success !== testCase.expectedSuccess) {
      return {
        passed: false,
        error: `success 不匹配: 期望 ${testCase.expectedSuccess}, 实际 ${result.success}`
      };
    }

    // 验证数据类型（如果指定）
    if (testCase.expectedDataType) {
      const actualType = Array.isArray(result.data) ? 'array' : typeof result.data;
      if (actualType !== testCase.expectedDataType && result.data !== null) {
        return {
          passed: false,
          error: `data 类型不匹配: 期望 ${testCase.expectedDataType}, 实际 ${actualType}`
        };
      }
    }

    return { passed: true };
  } catch (error: any) {
    return { passed: false, error: `异常: ${error.message}` };
  }
}

/**
 * 运行所有测试
 */
export function runCompatibilityTests(): {
  total: number;
  passed: number;
  failed: number;
  results: Array<{ name: string; passed: boolean; error?: string }>;
} {
  console.log('🧪 开始兼容性测试...\n');

  const results: Array<{ name: string; passed: boolean; error?: string }> = [];
  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`\n[${index + 1}/${testCases.length}] ${testCase.name}`);
    const result = runTestCase(testCase);

    results.push({
      name: testCase.name,
      ...result
    });

    if (result.passed) {
      passed++;
      console.log('✅ 通过');
    } else {
      failed++;
      console.log(`❌ 失败: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log(`📊 测试结果汇总:`);
  console.log(`   总计: ${testCases.length}`);
  console.log(`   通过: ${passed} ✅`);
  console.log(`   失败: ${failed} ❌`);
  console.log(`   通过率: ${((passed / testCases.length) * 100).toFixed(2)}%`);
  console.log('='.repeat(50));

  return {
    total: testCases.length,
    passed,
    failed,
    results
  };
}

/**
 * 性能测试
 */
export function runPerformanceTest() {
  console.log('\n⚡ 性能测试...\n');

  const response = {
    code: 200,
    data: { id: 1, name: 'test' },
    message: '成功'
  };

  const iterations = 10000;

  // 测试1: 使用配置（应该很快）
  console.time('配置模式（10000次）');
  for (let i = 0; i < iterations; i++) {
    SmartAdapter.adaptResponse(response, teamConfigs['team-a']);
  }
  console.timeEnd('配置模式（10000次）');

  // 清除缓存
  SmartAdapter.clearCache();

  // 测试2: 智能检测（第一次会慢，后续有缓存）
  console.time('智能检测模式（10000次）');
  for (let i = 0; i < iterations; i++) {
    SmartAdapter.adaptResponse(response);
  }
  console.timeEnd('智能检测模式（10000次）');

  console.log('\n✅ 性能测试完成');
}

/**
 * 缓存测试
 */
export function runCacheTest() {
  console.log('\n💾 缓存测试...\n');

  const response = {
    code: 200,
    data: { test: true },
    message: 'OK'
  };

  // 清除所有缓存
  SmartAdapter.clearCache();
  console.log('1. 清除所有缓存');
  console.log('   缓存数量:', SmartAdapter.getCacheInfo().size);

  // 第一次请求（会触发检测并缓存）
  const config = { ...teamConfigs['team-c'], enableCache: true };
  SmartAdapter.adaptResponse(response, config);
  console.log('\n2. 第一次请求 team-c（触发检测）');
  console.log('   缓存数量:', SmartAdapter.getCacheInfo().size);

  // 第二次请求（使用缓存）
  SmartAdapter.adaptResponse(response, config);
  console.log('\n3. 第二次请求 team-c（使用缓存）');
  console.log('   缓存数量:', SmartAdapter.getCacheInfo().size);

  // 清除单个缓存
  SmartAdapter.clearCache('team-c');
  console.log('\n4. 清除 team-c 缓存');
  console.log('   缓存数量:', SmartAdapter.getCacheInfo().size);

  console.log('\n✅ 缓存测试完成');
}

/**
 * 主测试函数
 */
export function runAllTests() {
  console.log('🎯 混合配置方案 - 完整测试套件\n');
  console.log('='.repeat(50));

  // 1. 兼容性测试
  const compatibilityResults = runCompatibilityTests();

  // 2. 性能测试
  runPerformanceTest();

  // 3. 缓存测试
  runCacheTest();

  console.log('\n' + '='.repeat(50));
  console.log('🎉 所有测试完成！');
  console.log('='.repeat(50));

  return compatibilityResults;
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

