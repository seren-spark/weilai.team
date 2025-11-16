/**
 * 智能上下文管理使用示例
 *
 * 演示：
 * 1. 单轮对话
 * 2. 多轮对话（带记忆）
 * 3. 超长对话自动压缩
 * 4. 会话恢复
 */

import fetch from "node-fetch";

const API_BASE = "http://localhost:5005/api";

// ========== 示例 1：单轮对话 ==========
async function example1_singleTurn() {
  console.log("\n========== 示例 1：单轮对话 ==========\n");

  const response = await fetch(`${API_BASE}/tool_call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "北京今天天气怎么样？",
      model: "qwen3-max",
    }),
  });

  const result = await response.json();
  console.log("回复:", result.response);
  console.log("会话ID:", result.sessionId);
  console.log("统计:", result.stats);
}

// ========== 示例 2：多轮对话（带记忆）==========
async function example2_multiTurn() {
  console.log("\n========== 示例 2：多轮对话（带记忆）==========\n");

  let sessionId = null;

  // 第一轮
  console.log("👤 用户: 我叫张三，今年25岁");
  let response = await fetch(`${API_BASE}/tool_call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "我叫张三，今年25岁",
      model: "qwen3-max",
    }),
  });
  let result = await response.json();
  sessionId = result.sessionId; // 保存会话ID
  console.log("🤖 AI:", result.response);
  console.log("📊 Token使用:", result.stats.totalTokens);

  // 第二轮（AI 应该记得前面的信息）
  console.log("\n👤 用户: 我多大了？");
  response = await fetch(`${API_BASE}/tool_call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "我多大了？",
      sessionId, // 传入会话ID
      model: "qwen3-max",
    }),
  });
  result = await response.json();
  console.log("🤖 AI:", result.response);
  console.log("📊 Token使用:", result.stats.totalTokens);

  // 第三轮
  console.log("\n👤 用户: 我的名字是什么？");
  response = await fetch(`${API_BASE}/tool_call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "我的名字是什么？",
      sessionId,
      model: "qwen3-max",
    }),
  });
  result = await response.json();
  console.log("🤖 AI:", result.response);
  console.log("📊 Token使用:", result.stats.totalTokens);

  return sessionId;
}

// ========== 示例 3：查看会话详情 ==========
async function example3_sessionDetails(sessionId) {
  console.log("\n========== 示例 3：查看会话详情 ==========\n");

  const response = await fetch(`${API_BASE}/sessions/${sessionId}`);
  const result = await response.json();

  console.log("会话ID:", result.session.id);
  console.log("消息数量:", result.session.messages.length);
  console.log("创建时间:", result.session.stats.createdAt);
  console.log("总消息数:", result.session.stats.messageCount);
  console.log("压缩次数:", result.session.stats.compressionCount);

  console.log("\n对话历史:");
  result.session.messages.forEach((msg, idx) => {
    if (msg.role === "user") {
      console.log(`${idx + 1}. 👤 用户: ${msg.content}`);
    } else if (msg.role === "assistant") {
      console.log(`${idx + 1}. 🤖 AI: ${msg.content}`);
    } else if (msg.role === "system") {
      console.log(`${idx + 1}. ⚙️  系统: ${msg.content.substring(0, 50)}...`);
    }
  });
}

// ========== 示例 4：触发上下文压缩 ==========
async function example4_compression(sessionId) {
  console.log("\n========== 示例 4：触发上下文压缩 ==========\n");

  // 发送多条消息，触发自动压缩
  const messages = [
    "给我讲个笑话",
    "再讲一个",
    "这个笑话好冷啊",
    "来个更有趣的",
    "你知道什么成语故事吗？",
    "讲讲刻舟求剑",
    "这个故事的寓意是什么？",
    "还有类似的故事吗？",
  ];

  for (const msg of messages) {
    console.log(`\n👤 发送: ${msg}`);
    const response = await fetch(`${API_BASE}/tool_call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        sessionId,
        model: "qwen3-max",
      }),
    });
    const result = await response.json();
    console.log(`🤖 回复: ${result.response.substring(0, 80)}...`);
    console.log(
      `📊 Token: ${result.stats.totalTokens}/${result.stats.utilizationRate}`,
    );

    if (result.stats.compressionCount > 0) {
      console.log("🗜️  上下文已被压缩！");
    }
  }
}

// ========== 示例 5：手动压缩 ==========
async function example5_manualCompression(sessionId) {
  console.log("\n========== 示例 5：手动压缩 ==========\n");

  const response = await fetch(`${API_BASE}/sessions/${sessionId}/compress`, {
    method: "POST",
  });
  const result = await response.json();

  console.log("压缩结果:", result.message);
  console.log("压缩后统计:", result.stats);
}

// ========== 示例 6：导出会话 ==========
async function example6_export(sessionId) {
  console.log("\n========== 示例 6：导出会话 ==========\n");

  // 导出为 JSON
  let response = await fetch(
    `${API_BASE}/sessions/${sessionId}/export?format=json`,
  );
  let result = await response.json();
  console.log("JSON 导出成功，消息数:", result.data.messages.length);

  // 导出为 Markdown
  response = await fetch(
    `${API_BASE}/sessions/${sessionId}/export?format=markdown`,
  );
  const markdown = await response.text();
  console.log("Markdown 导出 (前200字符):");
  console.log(markdown.substring(0, 200));
}

// ========== 示例 7：会话列表 ==========
async function example7_listSessions() {
  console.log("\n========== 示例 7：会话列表 ==========\n");

  const response = await fetch(`${API_BASE}/sessions`);
  const result = await response.json();

  console.log(`共有 ${result.count} 个活跃会话:\n`);
  result.sessions.forEach((session, idx) => {
    console.log(`${idx + 1}. ${session.id}`);
    console.log(`   消息数: ${session.messageCount}`);
    console.log(`   最后活跃: ${session.stats.lastActive}`);
  });
}

// ========== 示例 8：自定义系统提示词 ==========
async function example8_customSystemPrompt() {
  console.log("\n========== 示例 8：自定义系统提示词 ==========\n");

  const response = await fetch(`${API_BASE}/tool_call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "你好，介绍一下自己",
      systemPrompt:
        "你是一个专业的前端工程师，擅长 Vue 和 React。请用专业的口吻回答问题。",
      model: "qwen3-max",
    }),
  });

  const result = await response.json();
  console.log("🤖 AI:", result.response);
  console.log("会话ID:", result.sessionId);
}

// ========== 主函数：运行所有示例 ==========
async function main() {
  console.log("🚀 智能上下文管理系统 - 使用示例\n");

  try {
    // 示例 1：单轮对话
    await example1_singleTurn();

    // 示例 2：多轮对话
    const sessionId = await example2_multiTurn();

    // 示例 3：查看会话详情
    await example3_sessionDetails(sessionId);

    // 示例 4：触发压缩
    // await example4_compression(sessionId);

    // 示例 5：手动压缩
    // await example5_manualCompression(sessionId);

    // 示例 6：导出会话
    await example6_export(sessionId);

    // 示例 7：会话列表
    await example7_listSessions();

    // 示例 8：自定义提示词
    await example8_customSystemPrompt();

    console.log("\n✅ 所有示例运行完成！");
  } catch (error) {
    console.error("❌ 错误:", error.message);
  }
}

// 运行示例
// main();

// 导出各个示例函数
export {
  example1_singleTurn,
  example2_multiTurn,
  example3_sessionDetails,
  example4_compression,
  example5_manualCompression,
  example6_export,
  example7_listSessions,
  example8_customSystemPrompt,
};
