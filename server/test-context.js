/**
 * 快速测试脚本 - 智能上下文管理
 *
 * 使用方法：
 * 1. 启动服务器：npm start
 * 2. 运行测试：node test-context.js
 */

const API_BASE = "http://localhost:5005/api";

async function test() {
  console.log("🧪 开始测试智能上下文管理系统\n");

  let sessionId = null;

  try {
    // ========== 测试 1：多轮对话记忆 ==========
    console.log("📝 测试 1：多轮对话记忆");
    console.log("----------------------------------------");

    // 第一轮：告诉 AI 信息
    console.log("\n👤 用户: 我叫张三，今年25岁，是一名前端工程师");
    let response = await fetch(`${API_BASE}/tool_call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "我叫张三，今年25岁，是一名前端工程师",
        model: "qwen3-max",
      }),
    });

    let result = await response.json();
    sessionId = result.sessionId;
    console.log(`🤖 AI: ${result.response}`);
    console.log(
      `📊 Token: ${result.stats.totalTokens} | 消息数: ${result.stats.messageCount}`,
    );

    // 第二轮：测试记忆
    console.log("\n👤 用户: 我叫什么名字？");
    response = await fetch(`${API_BASE}/tool_call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "我叫什么名字？",
        sessionId,
        model: "qwen3-max",
      }),
    });

    result = await response.json();
    console.log(`🤖 AI: ${result.response}`);
    console.log(
      `📊 Token: ${result.stats.totalTokens} | 消息数: ${result.stats.messageCount}`,
    );

    // 第三轮：继续测试记忆
    console.log("\n👤 用户: 我多大了？做什么工作？");
    response = await fetch(`${API_BASE}/tool_call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "我多大了？做什么工作？",
        sessionId,
        model: "qwen3-max",
      }),
    });

    result = await response.json();
    console.log(`🤖 AI: ${result.response}`);
    console.log(
      `📊 Token: ${result.stats.totalTokens} | 消息数: ${result.stats.messageCount}`,
    );

    // ========== 测试 2：工具调用 ==========
    console.log("\n\n📝 测试 2：工具调用（天气查询）");
    console.log("----------------------------------------");

    console.log("\n👤 用户: 北京今天天气怎么样？");
    response = await fetch(`${API_BASE}/tool_call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "北京今天天气怎么样？",
        sessionId,
        model: "qwen3-max",
      }),
    });

    result = await response.json();
    console.log(`🤖 AI: ${result.response}`);
    console.log(`🔧 工具调用:`, result.needToolCall);
    if (result.toolCallLogs && result.toolCallLogs.length > 0) {
      result.toolCallLogs.forEach((log) => {
        console.log(`   - ${log.tool}(${JSON.stringify(log.args)})`);
      });
    }
    console.log(
      `📊 Token: ${result.stats.totalTokens} | 消息数: ${result.stats.messageCount}`,
    );

    // ========== 测试 3：查看会话详情 ==========
    console.log("\n\n📝 测试 3：查看会话详情");
    console.log("----------------------------------------");

    response = await fetch(`${API_BASE}/sessions/${sessionId}`);
    result = await response.json();

    console.log(`\n会话 ID: ${result.session.id}`);
    console.log(`消息总数: ${result.session.stats.messageCount}`);
    console.log(`Token 使用: ${result.session.stats.totalTokens}`);
    console.log(`压缩次数: ${result.session.stats.compressionCount}`);
    console.log(
      `创建时间: ${new Date(result.session.stats.createdAt).toLocaleString()}`,
    );

    console.log("\n对话历史:");
    result.session.messages.forEach((msg, idx) => {
      if (msg.role === "user") {
        console.log(`  ${idx + 1}. 👤 ${msg.content}`);
      } else if (msg.role === "assistant") {
        console.log(`  ${idx + 1}. 🤖 ${msg.content.substring(0, 50)}...`);
      }
    });

    // ========== 测试 4：会话列表 ==========
    console.log("\n\n📝 测试 4：会话列表");
    console.log("----------------------------------------");

    response = await fetch(`${API_BASE}/sessions`);
    result = await response.json();

    console.log(`\n当前活跃会话数: ${result.count}`);
    result.sessions.forEach((session, idx) => {
      console.log(`  ${idx + 1}. ${session.id}`);
      console.log(
        `     消息数: ${session.messageCount} | Token: ${session.stats.totalTokens}`,
      );
    });

    // ========== 测试 5：导出会话 ==========
    console.log("\n\n📝 测试 5：导出会话（Markdown 格式）");
    console.log("----------------------------------------");

    response = await fetch(
      `${API_BASE}/sessions/${sessionId}/export?format=markdown`,
    );
    const markdown = await response.text();

    console.log("\n导出内容（前 300 字符）:");
    console.log(markdown.substring(0, 300));
    console.log("...\n");

    // ========== 测试完成 ==========
    console.log("\n✅ 所有测试完成！");
    console.log(`\n💡 提示：会话已保存到 data/sessions/${sessionId}.json`);
    console.log(
      `💡 可以通过 API 查看完整会话：GET ${API_BASE}/sessions/${sessionId}`,
    );
  } catch (error) {
    console.error("\n❌ 测试失败:", error.message);
    console.error("\n确保：");
    console.error("1. 服务器已启动（npm start）");
    console.error("2. 端口 5005 未被占用");
    console.error("3. .env 文件中配置了 DASHSCOPE_API_KEY");
  }
}

// 运行测试
test();
