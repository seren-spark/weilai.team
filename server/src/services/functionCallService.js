import { contextManager } from "./contextManager.js";
import { sessionStore } from "./sessionStore.js";
import { streamChatWithTools as streamChatWithToolsCore } from "./streamToolCallService.js";

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

// /**
//  * 带上下文管理的工具调用
//  * @param {string} userMessage - 用户消息
//  * @param {string} model - 模型名称
//  * @param {string} sessionId - 会话 ID（用于多轮对话）
//  * @param {string} systemPrompt - 系统提示词
//  */
// export const chatWithTools = async (
//   userMessage,
//   model = "qwen3-max",
//   sessionId = null,
//   systemPrompt = null
// ) => {
//   // 如果没有 sessionId,生成一个新的
//   if (!sessionId) {
//     sessionId = `session_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;
//   }

//   // 获取或创建/恢复会话
//   let session = await ensureSession(sessionId, systemPrompt);

//   // 添加用户消息到上下文
//   await contextManager.addMessage(sessionId, {
//     role: "user",
//     content: userMessage,
//   });

//   // 获取完整上下文
//   const messages = contextManager.getContextMessages(sessionId);
//   let response = await openai.chat.completions.create({
//     model,
//     messages,
//     tools,
//   });
//   let assistantMessage = response.choices[0].message;

//   // 确保 AI 回复不是null
//   if (!assistantMessage.content) {
//     assistantMessage.content = "";
//   }

//   // 添加助手消息到上下文
//   await contextManager.addMessage(sessionId, assistantMessage);

//   if (!assistantMessage.tool_calls) {
//     console.log(`无需调用工具，直接回复：${assistantMessage.content}`);

//     // 保存会话到文件
//     await sessionStore.saveSession(
//       sessionId,
//       contextManager.getSession(sessionId)
//     );

//     return {
//       needToolCall: false,
//       finalResponse: assistantMessage.content,
//       sessionId,
//       messages: contextManager.getContextMessages(sessionId),
//       stats: contextManager.getSessionStats(sessionId),
//     };
//   }
//   // 工具调用循环
//   const toolCallLogs = [];
//   while (assistantMessage.tool_calls) {
//     const toolCall = assistantMessage.tool_calls[0];
//     const toolCallId = toolCall.id;
//     const funcName = toolCall.function.name;
//     const funcArgs = JSON.parse(toolCall.function.arguments);
//     console.log(`🔧 正在调用工具 [${funcName}]，参数:`, funcArgs);
//     const toolResult = await executeTool(funcName, funcArgs);

//     toolCallLogs.push({
//       tool: funcName,
//       args: funcArgs,
//       result: toolResult,
//     });

//     // 构造工具返回消息
//     const toolMessage = {
//       role: "tool",
//       tool_call_id: toolCallId,
//       content: toolResult,
//     };
//     console.log(`工具返回：${toolMessage.content}`);

//     // 添加工具返回到上下文
//     await contextManager.addMessage(sessionId, toolMessage);

//     // 再次调用模型获取自然语言总结
//     const updatedMessages = contextManager.getContextMessages(sessionId);
//     response = await openai.chat.completions.create({
//       model,
//       messages: updatedMessages,
//       tools,
//     });
//     assistantMessage = response.choices[0].message;
//     if (!assistantMessage.content) {
//       assistantMessage.content = "";
//     }

//     // 添加助手回复到上下文
//     await contextManager.addMessage(sessionId, assistantMessage);
//   }

//   console.log(`助手最终回复：${assistantMessage.content}`);

//   // 保存会话到文件
//   await sessionStore.saveSession(
//     sessionId,
//     contextManager.getSession(sessionId)
//   );

//   return {
//     needToolCall: true,
//     finalResponse: assistantMessage.content,
//     sessionId,
//     toolCallLogs,
/**
 * 流式工具调用（重构版本，使用通用服务）
 * @param {string} userMessage - 用户消息
 * @param {string} model - 模型名称
 * @param {function} onToken - 文本增量回调 (delta: string) => void
 * @param {function} onToolCall - 工具调用回调 (toolName, args, result) => void
 * @param {function} onDone - 完成回调 () => void
 * @param {function} onError - 错误回调 (error) => void
 * @param {string} token - token
 * @param {string} sessionId - 会话 ID
 * @param {string} systemPrompt - 系统提示词
 */
export const streamChatWithTools = async (
  userMessage,
  model = "qwen3-max",
  {
    onToken,
    onToolCall,
    onDone,
    onError,
    token = null,
    sessionId = null,
    systemPrompt = null,
  } = {},
) => {
  try {
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

    console.log("streamChatWithTools - 使用通用工具调用服务");

    // 获取完整上下文消息
    const contextMessages = contextManager.getContextMessages(currentSessionId);

    // 收集所有需要批量添加的消息
    const messagesToAdd = [];

    // 🎯 使用通用工具调用服务
    await streamChatWithToolsCore(contextMessages, model, {
      onToken,
      onToolCall,
      token,

      // 助手消息完成时回调
      onAssistantMessage: (message) => {
        messagesToAdd.push(message);
      },

      // 工具消息完成时回调
      onToolMessage: (message) => {
        messagesToAdd.push(message);
      },
    });

    // 🎯 批量添加所有消息，避免频繁压缩
    if (messagesToAdd.length > 0) {
      await contextManager.addMessages(currentSessionId, messagesToAdd);
    }

    // 持久化会话
    await sessionStore.saveSession(
      currentSessionId,
      contextManager.getSession(currentSessionId),
    );

    onDone?.({
      sessionId: currentSessionId,
      stats: contextManager.getSessionStats(currentSessionId),
    });
  } catch (error) {
    console.error("❌ 流式工具调用错误:", error);
    onError?.(error);
  }
};
