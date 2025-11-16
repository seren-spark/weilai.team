import openai from "../config/openai.js";
import { tools, executeTool } from "../tools/index.js";

/**
 * 通用流式工具调用服务
 * 支持并行工具调用、流式输出、错误处理
 */

/**
 * 流式聊天 + 工具调用（通用版本）
 * @param {Array} messages - 消息历史
 * @param {string} model - 模型名称
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} - 最终回答
 */
export const streamChatWithTools = async (
  messages,
  model = "qwen3-max",
  {
    onToken = null, // (delta: string) => void
    onToolCall = null, // (toolName, args, result) => void
    onAssistantMessage = null, // (message) => void - 每轮助手消息完成时回调
    onToolMessage = null, // (message) => void - 工具消息完成时回调
    temperature = 0.7,
    maxTokens = null,
    enableTools = true,
    token = null, // 用户认证token
  } = {},
) => {
  let currentMessages = [...messages];
  let finalResponse = "";

  try {
    // 🎯 多轮工具调用循环
    while (true) {
      const requestOptions = {
        model,
        messages: currentMessages,
        temperature,
        stream: true,
      };

      // 添加可选参数
      if (maxTokens) requestOptions.max_tokens = maxTokens;
      if (enableTools) {
        requestOptions.tools = tools;
        requestOptions.tool_choice = "auto";
        requestOptions.parallel_tool_calls = true;
      }

      const stream = await openai.chat.completions.create(requestOptions);

      // 聚合流式数据
      const toolCallsMap = new Map();
      let contentBuffer = "";
      let finishReason = null;

      // 🔄 处理流式响应
      for await (const chunk of stream) {
        const choice = chunk.choices?.[0];
        if (!choice) continue;

        // 文本内容处理
        const delta = choice.delta?.content || "";
        if (delta) {
          contentBuffer += delta;
          finalResponse += delta;
          onToken?.(delta);
        }

        // 工具调用处理（仅在启用工具时）
        if (enableTools) {
          const deltaToolCalls = choice.delta?.tool_calls || [];
          for (const tc of deltaToolCalls) {
            const idx = tc.index ?? 0;

            // 初始化工具调用对象
            if (!toolCallsMap.has(idx)) {
              toolCallsMap.set(idx, {
                id: tc.id || "",
                type: "function",
                function: { name: "", arguments: "" },
              });
            }

            // 累积工具调用数据
            const current = toolCallsMap.get(idx);
            if (tc.id) current.id = tc.id;
            if (tc.function?.name) current.function.name += tc.function.name;
            if (tc.function?.arguments)
              current.function.arguments += tc.function.arguments;
          }
        }

        // 记录结束原因
        if (choice.finish_reason) {
          finishReason = choice.finish_reason;
        }
      }

      // 构建助手消息
      const assistantMessage = {
        role: "assistant",
        content: contentBuffer || null,
      };

      const toolCalls = Array.from(toolCallsMap.values()).filter((tc) => tc.id);
      if (toolCalls.length > 0) {
        assistantMessage.tool_calls = toolCalls;
      }

      currentMessages.push(assistantMessage);
      onAssistantMessage?.(assistantMessage);

      // 没有工具调用，结束循环
      if (toolCalls.length === 0) {
        break;
      }

      // 🔧 并行执行所有工具调用
      const toolMessages = await Promise.all(
        toolCalls.map(async (tc) => {
          const funcName = tc.function.name;
          const funcArgs = (() => {
            try {
              return JSON.parse(tc.function.arguments || "{}");
            } catch (error) {
              console.warn(`⚠️ 工具参数解析失败 [${funcName}]:`, error.message);
              return {};
            }
          })();

          try {
            const result = await executeTool(funcName, funcArgs, token);
            const resultStr =
              typeof result === "string" ? result : JSON.stringify(result);

            // 通知工具调用完成
            onToolCall?.(funcName, funcArgs, resultStr);

            const toolMessage = {
              role: "tool",
              tool_call_id: tc.id,
              content: resultStr,
            };

            onToolMessage?.(toolMessage);
            return toolMessage;
          } catch (error) {
            console.error(`❌ 工具调用失败 [${funcName}]:`, error.message);

            const errorMessage = {
              role: "tool",
              tool_call_id: tc.id,
              content: `工具调用失败: ${error.message}`,
            };

            onToolMessage?.(errorMessage);
            return errorMessage;
          }
        }),
      );

      // 添加工具消息到上下文
      currentMessages.push(...toolMessages);

      // 检查是否应该继续
      if (finishReason && finishReason !== "tool_calls") {
        break;
      }
    }

    return finalResponse;
  } catch (error) {
    console.error("❌ 流式工具调用错误:", error);
    throw error;
  }
};

/**
 * 批量消息处理（用于上下文管理）
 * @param {Array} messagesToAdd - 要添加的消息数组
 * @param {Function} addMessagesFn - 批量添加消息的函数
 * @returns {Promise<void>}
 */
export const batchAddMessages = async (messagesToAdd, addMessagesFn) => {
  if (messagesToAdd.length === 0) return;

  try {
    await addMessagesFn(messagesToAdd);
  } catch (error) {
    console.error("❌ 批量添加消息失败:", error);
    // 降级：逐个添加
    for (const message of messagesToAdd) {
      try {
        await addMessagesFn([message]);
      } catch (singleError) {
        console.error("❌ 单个消息添加失败:", singleError);
      }
    }
  }
};

/**
 * 工具调用统计信息
 */
export class ToolCallStats {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalCalls = 0;
    this.successCalls = 0;
    this.failedCalls = 0;
    this.toolUsage = new Map(); // toolName -> count
    this.startTime = Date.now();
  }

  recordCall(toolName, success = true) {
    this.totalCalls++;
    if (success) {
      this.successCalls++;
    } else {
      this.failedCalls++;
    }

    const count = this.toolUsage.get(toolName) || 0;
    this.toolUsage.set(toolName, count + 1);
  }

  getStats() {
    return {
      totalCalls: this.totalCalls,
      successCalls: this.successCalls,
      failedCalls: this.failedCalls,
      successRate:
        this.totalCalls > 0
          ? ((this.successCalls / this.totalCalls) * 100).toFixed(2)
          : 0,
      toolUsage: Object.fromEntries(this.toolUsage),
      duration: Date.now() - this.startTime,
    };
  }
}
