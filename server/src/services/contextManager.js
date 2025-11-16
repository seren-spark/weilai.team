/**
 * 智能上下文管理器
 * 功能：
 * 1. 管理多轮对话的上下文窗口
 * 2. 自动压缩超长对话
 * 3. Token 计数和优化
 * 4. 会话摘要生成
 */

import { encoding_for_model } from "tiktoken";
import openai from "../config/openai.js";

export class ContextManager {
  constructor(options = {}) {
    this.maxTokens = options.maxTokens || 100; // 最大 token 数  4000
    this.maxMessages = options.maxMessages || 10; // 最多保留消息数 20
    this.keepRecentCount = options.keepRecentCount || 3; // 压缩时保留的最近消息数 6
    this.conversations = new Map(); // sessionId -> { messages, summary, stats }
  }

  /**
   * 创建新会话
   */
  createSession(sessionId, systemPrompt = null) {
    const session = {
      id: sessionId,
      messages: [],
      summary: "",
      stats: {
        totalTokens: 0,
        messageCount: 0,
        compressionCount: 0,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      },
    };

    // 如果有系统提示词，添加到开头
    if (systemPrompt) {
      session.messages.push({
        role: "system",
        content: systemPrompt,
      });
      session.stats.totalTokens += this.estimateTokens(systemPrompt);
    }

    this.conversations.set(sessionId, session);
    console.log(`📝 创建会话 [${sessionId}]`);
    return session;
  }

  /**
   * 获取会话
   */
  getSession(sessionId) {
    return this.conversations.get(sessionId);
  }

  /**
   * 添加消息到会话
   */
  async addMessage(sessionId, message) {
    let session = this.getSession(sessionId);

    // 如果会话不存在，自动创建
    if (!session) {
      session = this.createSession(sessionId);
    }

    // 添加消息
    session.messages.push(message);
    session.stats.messageCount++;
    session.stats.lastActive = new Date().toISOString();

    // 计算 token
    console.log(`格式化后的消息: ${this.formatMessage(message)}`);
    const tokens = this.estimateTokens(this.formatMessage(message));
    session.stats.totalTokens += tokens;

    console.log(
      `💬 [${sessionId}] 添加消息 (${tokens} tokens) - 总计: ${session.stats.totalTokens}/${this.maxTokens}`,
    );

    // 检查是否需要压缩
    console.log(`检查是否需要压缩...`, this.needsCompression(session));

    if (this.needsCompression(session)) {
      console.log("需要压缩");

      await this.compressContext(sessionId);
    }

    return session;
  }

  /**
   * 批量添加消息（用于工具调用等场景）
   */
  async addMessages(sessionId, messages) {
    for (const message of messages) {
      await this.addMessage(sessionId, message);
    }
  }

  /**
   * 判断是否需要压缩
   */
  needsCompression(session) {
    return (
      session.stats.totalTokens > this.maxTokens ||
      session.messages.length > this.maxMessages
    );
  }

  /**
   * 压缩上下文（核心算法）
   */
  async compressContext(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return;

    console.log(`🗜️  [${sessionId}] 开始压缩上下文...`);
    const startTime = Date.now();
    // 1. 定义一个函数来判断一条消息是否是系统摘要消息
    const isSummaryMessage = (msg) => {
      return (
        msg.role === "system" && msg.content.startsWith("【对话历史摘要】")
      );
    };

    // 2. 分离出：旧摘要、非摘要系统消息、所有普通消息
    const oldSummaryMessage = session.messages.find(isSummaryMessage);
    const nonSummarySystemMessages = session.messages.filter(
      (m) => m.role === "system" && !isSummaryMessage(m),
    );
    const allRegularMessages = session.messages.filter(
      (m) => m.role !== "system",
    );

    // 如果普通消息太少，不需要压缩
    if (
      allRegularMessages.length <= this.keepRecentCount &&
      session.stats.totalTokens < this.maxTokens
    ) {
      console.log(
        `ℹ️  [${sessionId}] 普通消息数量不足 (${allRegularMessages.length} <= ${this.keepRecentCount})，跳过压缩`,
      );
      return;
    }
    // 3. 准备需要被总结的内容和需要保留的内容
    const recentMessages = allRegularMessages.slice(-this.keepRecentCount);
    const oldMessagesToSummarize = allRegularMessages.slice(
      0,
      -this.keepRecentCount,
    );
    const previousSummary = oldSummaryMessage
      ? oldSummaryMessage.content
          .replace("【对话历史摘要】", "")
          .replace("以上是之前的对话摘要，请基于此继续对话。", "")
          .trim()
      : "";

    try {
      // 3. 为旧消息生成摘要
      const newSummary = await this.summarizeMessages(
        oldMessagesToSummarize,
        previousSummary, // <-- 这是解决重复问题的核心
      );

      // 5. 重构消息列表
      const summaryMessage = {
        role: "system",
        content: `【对话历史摘要】\n${newSummary}\n\n以上是之前的对话摘要，请基于此继续对话。`,
      };

      // 新的消息列表 = 非摘要系统消息 + 最新的综合摘要 + 最近的普通消息
      session.messages = [
        ...nonSummarySystemMessages,
        summaryMessage,
        ...recentMessages,
      ];

      // 更新会话的 summary 字段
      session.summary = newSummary;
      session.stats.compressionCount++;

      // 5. 重新计算 token
      session.stats.totalTokens = session.messages.reduce(
        (sum, msg) => sum + this.estimateTokens(this.formatMessage(msg)),
        0,
      );

      const duration = Date.now() - startTime;
      console.log(
        `✅ [${sessionId}] 压缩完成 (${duration}ms): ${oldMessagesToSummarize.length} 条消息 -> 1 条摘要 | 当前 tokens: ${session.stats.totalTokens}`,
      );
    } catch (error) {
      console.error(`❌ [${sessionId}] 压缩上下文时出错:`, error);
      // 可以在这里添加错误处理逻辑，例如回滚操作或通知用户
    }
  }

  /**
   * 使用 AI 生成对话摘要
   */
  async summarizeMessages(messages, previousSummary = "") {
    // 格式化消息内容
    const content = messages
      .map((m) => {
        if (m.role === "tool") {
          return `[工具返回] ${m.content.substring(0, 100)}...`;
        }
        return `${m.role === "user" ? "用户" : "助手"}: ${m.content}`;
      })
      .join("\n");

    const prompt = previousSummary
      ? `之前的摘要：\n${previousSummary}\n\n新的对话内容：\n${content}\n\n请将以上内容整合成简洁的摘要，保留关键信息、重要上下文和用户意图。`
      : `以下是对话内容：\n${content}\n\n请总结成简洁的要点，保留关键信息、重要上下文和用户意图。`;

    try {
      const response = await openai.chat.completions.create({
        model: "qwen3-max",
        messages: [
          {
            role: "system",
            content:
              "你是一个专业的对话摘要助手。请将对话总结成简洁的要点，保留关键信息和上下文。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3, // 降低温度，使摘要更稳定
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("❌ 生成摘要失败:", error.message);
      // 降级：简单截取
      return content.substring(0, 500) + "...";
    }
  }

  /**
   * 获取会话的完整上下文（用于发送给 AI）
   */
  getContextMessages(sessionId) {
    const session = this.getSession(sessionId);
    return session ? session.messages : [];
  }

  /**
   * 估算文本的 token 数量
   * 规则：
   * - 中文：约 1.5 字符 = 1 token
   * - 英文：约 4 字符 = 1 token
   * - 标点和空格：1 字符 = 0.5 token
   */
  estimateTokens(text) {
    if (!text) return 0;

    try {
      // 🎯 面试亮点1: 使用 tiktoken 精确计算
      const encoding = encoding_for_model("gpt-3.5-turbo");
      const tokens = encoding.encode(text).length;

      // 🎯 面试亮点2: 释放内存，防止内存泄漏
      encoding.free();

      return tokens;
    } catch (error) {
      // 🎯 面试亮点3: 优雅的降级机制
      console.warn("⚠️ tiktoken 计算失败，使用估算算法:", error.message);
      return this.estimateTokensFallback(text);
    }
  }

  /**
   * 降级的 token 估算算法（面试亮点：系统健壮性）
   */
  estimateTokensFallback(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const otherChars = text.length - chineseChars;

    return Math.ceil(
      chineseChars / 1.5 + // 中文
        englishWords * 1.3 + // 英文单词
        (otherChars - englishWords * 5) * 0.5, // 其他字符
    );
  }

  /**
   * 格式化消息内容（用于 token 计算）
   */
  formatMessage(message) {
    let content = "";

    if (message.role === "tool") {
      content = `tool: ${message.content}`;
    } else if (message.tool_calls) {
      content = `assistant: ${message.content || ""} [calls ${
        message.tool_calls.length
      } tools]`;
    } else {
      content = `${message.role}: ${message.content || ""}`;
    }

    // 🎯 关键修复：计算 metadata 中的反思数据 token
    if (message.metadata && message.metadata.reflections) {
      const reflectionText = message.metadata.reflections
        .map((r) => r.reflection)
        .join(" ");
      content += ` [metadata: ${reflectionText.substring(0, 500)}...]`;
    }

    return content;
  }

  /**
   * 获取会话统计信息
   */
  getSessionStats(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    return {
      ...session.stats,
      currentMessages: session.messages.length,
      hasSummary: !!session.summary,
      utilizationRate: (
        (session.stats.totalTokens / this.maxTokens) *
        100
      ).toFixed(2),
    };
  }

  /**
   * 清除会话
   */
  clearSession(sessionId) {
    const deleted = this.conversations.delete(sessionId);
    if (deleted) {
      console.log(`🗑️  清除会话 [${sessionId}]`);
    }
    return deleted;
  }

  /**
   * 获取所有会话列表
   */
  getAllSessions() {
    return Array.from(this.conversations.entries()).map(([id, session]) => ({
      id,
      messageCount: session.messages.length,
      stats: session.stats,
    }));
  }

  /**
   * 清理过期会话（超过 24 小时未活跃）
   */
  cleanupExpiredSessions(maxAgeHours = 24) {
    const now = new Date().getTime();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    let cleaned = 0;

    for (const [sessionId, session] of this.conversations) {
      const lastActive = new Date(session.stats.lastActive).getTime();
      if (now - lastActive > maxAge) {
        this.clearSession(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 清理了 ${cleaned} 个过期会话`);
    }

    return cleaned;
  }
}

// 创建全局实例
export const contextManager = new ContextManager({
  maxTokens: 1000,
  maxMessages: 10,
  keepRecentCount: 2,
});

// 定期清理过期会话（每小时执行一次）
setInterval(
  () => {
    contextManager.cleanupExpiredSessions(24);
  },
  60 * 60 * 1000,
);
