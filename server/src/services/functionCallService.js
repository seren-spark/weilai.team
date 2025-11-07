import openai from "../config/openai.js";
import { tools, executeTool } from "../tools/index.js";
import { contextManager } from "./contextManager.js";
import { sessionStore } from "./sessionStore.js";

// 确保获取到会话：优先从内存，其次尝试从磁盘恢复，最后创建
const ensureSession = async (sessionId, systemPrompt) => {
  let session = contextManager.getSession(sessionId);
  if (session) return session;

  // 尝试从持久化存储恢复
  try {
    const persisted = await sessionStore.loadSession(sessionId);
    if (persisted) {
      contextManager.conversations.set(sessionId, persisted);
      console.log(`📂 从存储恢复会话 [${sessionId}]`);
      return persisted;
    }
  } catch {}

  // 新建
  return contextManager.createSession(sessionId, systemPrompt);
};

/**
 * 带上下文管理的工具调用
 * @param {string} userMessage - 用户消息
 * @param {string} model - 模型名称
 * @param {string} sessionId - 会话 ID（用于多轮对话）
 * @param {string} systemPrompt - 系统提示词
 */
export const chatWithTools = async (
  userMessage,
  model = "qwen-plus",
  sessionId = null,
  systemPrompt = null
) => {
  // 如果没有 sessionId,生成一个新的
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  // 获取或创建/恢复会话
  let session = await ensureSession(sessionId, systemPrompt);

  // 添加用户消息到上下文
  await contextManager.addMessage(sessionId, {
    role: "user",
    content: userMessage,
  });

  // 获取完整上下文
  const messages = contextManager.getContextMessages(sessionId);
  let response = await openai.chat.completions.create({
    model,
    messages,
    tools,
  });
  let assistantMessage = response.choices[0].message;

  // 确保 AI 回复不是null
  if (!assistantMessage.content) {
    assistantMessage.content = "";
  }

  // 添加助手消息到上下文
  await contextManager.addMessage(sessionId, assistantMessage);

  if (!assistantMessage.tool_calls) {
    console.log(`无需调用工具，直接回复：${assistantMessage.content}`);

    // 保存会话到文件
    await sessionStore.saveSession(
      sessionId,
      contextManager.getSession(sessionId)
    );

    return {
      needToolCall: false,
      finalResponse: assistantMessage.content,
      sessionId,
      messages: contextManager.getContextMessages(sessionId),
      stats: contextManager.getSessionStats(sessionId),
    };
  }
  // 工具调用循环
  const toolCallLogs = [];
  while (assistantMessage.tool_calls) {
    const toolCall = assistantMessage.tool_calls[0];
    const toolCallId = toolCall.id;
    const funcName = toolCall.function.name;
    const funcArgs = JSON.parse(toolCall.function.arguments);
    console.log(`🔧 正在调用工具 [${funcName}]，参数:`, funcArgs);
    const toolResult = await executeTool(funcName, funcArgs);

    toolCallLogs.push({
      tool: funcName,
      args: funcArgs,
      result: toolResult,
    });

    // 构造工具返回消息
    const toolMessage = {
      role: "tool",
      tool_call_id: toolCallId,
      content: toolResult,
    };
    console.log(`工具返回：${toolMessage.content}`);

    // 添加工具返回到上下文
    await contextManager.addMessage(sessionId, toolMessage);

    // 再次调用模型获取自然语言总结
    const updatedMessages = contextManager.getContextMessages(sessionId);
    response = await openai.chat.completions.create({
      model,
      messages: updatedMessages,
      tools,
    });
    assistantMessage = response.choices[0].message;
    if (!assistantMessage.content) {
      assistantMessage.content = "";
    }

    // 添加助手回复到上下文
    await contextManager.addMessage(sessionId, assistantMessage);
  }

  console.log(`助手最终回复：${assistantMessage.content}`);

  // 保存会话到文件
  await sessionStore.saveSession(
    sessionId,
    contextManager.getSession(sessionId)
  );

  return {
    needToolCall: true,
    finalResponse: assistantMessage.content,
    sessionId,
    toolCallLogs,
    messages: contextManager.getContextMessages(sessionId),
    stats: contextManager.getSessionStats(sessionId),
  };
};

/**
 * 流式工具调用（支持多工具并行）
 * @param {string} userMessage - 用户消息
 * @param {string} model - 模型名称
 * @param {function} onToken - 文本增量回调 (delta: string) => void
 * @param {function} onToolCall - 工具调用回调 (toolName, args, result) => void
 * @param {function} onDone - 完成回调 () => void
 * @param {function} onError - 错误回调 (error) => void
 */
export const streamChatWithTools = async (
  userMessage,
  model = "qwen-plus",
  {
    onToken,
    onToolCall,
    onDone,
    onError,
    sessionId = null,
    systemPrompt = null,
  } = {}
) => {
  // ========= 上下文管理：准备会话 =========
  let currentSessionId =
    sessionId ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  let session = await ensureSession(currentSessionId, systemPrompt);

  // 添加用户消息到上下文
  await contextManager.addMessage(currentSessionId, {
    role: "user",
    content: userMessage,
  });

  console.log("streamChatWithTools");

  try {
    // 可能发生多轮：模型产生 tool_calls -> 执行工具 -> 继续流式总结
    while (true) {
      // 从上下文获取完整消息
      const contextMessages =
        contextManager.getContextMessages(currentSessionId);

      const stream = await openai.chat.completions.create({
        model,
        messages: contextMessages,
        tools,
        tool_choice: "auto",
        parallel_tool_calls: true, // 支持并行工具调用
        stream: true,
      });

      // 聚合流式增量：按 index 累积 tool_calls
      const toolCallsMap = new Map(); // 用来拼接工具调用的增量 index -> { id, type, function: { name, arguments } }
      let contentBuffer = ""; //用来拼接文本的增量
      let finishReason = null; // 用来记录结束原因

      for await (const chunk of stream) {
        /* 
          //  chunk
          {
          choices: [
            {
              delta: {
                content: null,
                tool_calls: [
                  {
                    index: 0,
                    id: "call_6ca671c32574424e87a953",
                    type: "function",
                    function: {
                      name: "get_current_weather",
                      arguments: "{\"location\":",
                    },
                  },
                ],
                role: "assistant",
              },
              finish_reason: null,
              index: 0,
              logprobs: null,
            },
          ],
          object: "chat.completion.chunk",
          usage: null,
          created: 1760451319,
          system_fingerprint: null,
          model: "qwen-plus",
          id: "chatcmpl-4f71fa26-40de-4383-8d7b-a3ce644316ab",
         }

         工具函数名称：仅在第一个流式返回的对象（delta）中出现。
        */
        const choice = chunk.choices?.[0];
        if (!choice) continue;
        // 文本增量
        const delta = choice.delta?.content || "";
        console.log(choice.delta, "choice.delta");

        if (delta) {
          contentBuffer += delta;
          onToken?.(delta);
        }

        // 工具调用增量（OpenAI 风格：按 index 累积）
        const deltaToolCalls = choice.delta?.tool_calls || [];
        for (const tc of deltaToolCalls) {
          const idx = tc.index ?? 0;

          //   先创建后赋值
          // 如果是这个工具的第一次出现，初始化空对象
          if (!toolCallsMap.has(idx)) {
            toolCallsMap.set(idx, {
              id: tc.id || "",
              type: "function",
              function: { name: "", arguments: "" },
            });
          }
          // 获取当前工具的累积对象
          const current = toolCallsMap.get(idx);
          // 拼接 ID（通常只在第一个 chunk 有）
          if (tc.id) current.id = tc.id;
          // 拼接函数名（可能分多次推送："get" + "_current" + "_weather"）
          if (tc.function?.name) current.function.name += tc.function.name;
          // 拼接参数（JSON 字符串分多次推送：'{"loc' + 'ation":"北京"}'）
          if (tc.function?.arguments)
            current.function.arguments += tc.function.arguments;
        }

        // 结束原因
        if (choice.finish_reason) {
          finishReason = choice.finish_reason;
        }
      }

      // 本轮流式结束，若有内容则加入消息
      const assistantMessage = {
        role: "assistant",
        content: contentBuffer || null,
      };
      const toolCalls = Array.from(toolCallsMap.values()).filter((tc) => tc.id);
      if (toolCalls.length > 0) {
        assistantMessage.tool_calls = toolCalls;
      }
      // 将助手回复加入上下文
      await contextManager.addMessage(currentSessionId, assistantMessage);

      // 没有工具调用，流程结束
      if (toolCalls.length === 0) {
        break;
      }

      // 并行执行所有工具
      const toolMessages = await Promise.all(
        toolCalls.map(async (tc) => {
          const funcName = tc.function.name;
          const funcArgs = (() => {
            try {
              return JSON.parse(tc.function.arguments || "{}");
            } catch {
              return {};
            }
          })();

          const result = await executeTool(funcName, funcArgs);
          const resultStr =
            typeof result === "string" ? result : JSON.stringify(result);

          // 通知前端工具调用结果
          onToolCall?.(funcName, funcArgs, resultStr);

          const toolMsg = {
            role: "tool",
            tool_call_id: tc.id,
            content: resultStr,
          };

          // 工具消息加入上下文
          await contextManager.addMessage(currentSessionId, toolMsg);

          return toolMsg;
        })
      );

      // 工具消息已加入上下文

      // 如果模型明确 finish_reason !== 'tool_calls'，不再继续
      if (finishReason && finishReason !== "tool_calls") {
        break;
      }
    }

    // 持久化会话
    await sessionStore.saveSession(
      currentSessionId,
      contextManager.getSession(currentSessionId)
    );

    onDone?.({
      sessionId: currentSessionId,
      stats: contextManager.getSessionStats(currentSessionId),
    });
  } catch (error) {
    onError?.(error);
  }
};
