import openai from "../config/openai.js";
import { contextManager } from "./contextManager.js";
import { sessionStore } from "./sessionStore.js";

/**
 * 反思机制核心服务 - 简化版
 * 所有问题都进行完整反思，不做智能判断
 */

/**
 * 生成初始回答（流式）
 */
const generateInitialAnswer = async (
  userMessage,
  model,
  conversationHistory,
  onToken = null, // 流式输出回调
) => {
  const messages = [
    ...conversationHistory,
    {
      role: "user",
      content: userMessage,
    },
  ];

  const stream = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    stream: true, // 启用流式
  });

  let fullResponse = "";
  
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || "";
    if (delta) {
      fullResponse += delta;
      if (onToken) {
        onToken(delta); // 实时推送每个 token
      }
    }
  }

  return fullResponse;
};

/**
 * 多维度反思（并行执行 + 流式推送）
 */
const generateReflectionDimensions = async (
  initialAnswer,
  userMessage,
  model,
  onReflectionUpdate = null, // 新增：每个维度完成时的回调
) => {
  const dimensions = [
    {
      name: "准确性检查",
      prompt: `请检查以下回答的准确性：\n\n问题：${userMessage}\n\n回答：${initialAnswer}\n\n请指出任何事实错误或不准确的地方。如果准确，请说明理由。`,
    },
    {
      name: "完整性评估",
      prompt: `请评估以下回答是否完整：\n\n问题：${userMessage}\n\n回答：${initialAnswer}\n\n请指出遗漏的重要信息。如果回答完整，请说明涵盖了哪些关键点。`,
    },
    {
      name: "逻辑性分析",
      prompt: `请分析以下回答的逻辑性：\n\n问题：${userMessage}\n\n回答：${initialAnswer}\n\n请指出逻辑漏洞或推理问题。如果逻辑清晰，请说明推理链条。`,
    },
  ];

  // 并行执行所有反思维度，使用流式输出
  const reflectionPromises = dimensions.map(async (dimension, index) => {
    try {
      const stream = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "你是一个严谨的思维评估专家，专注于发现问题和改进空间。请客观、具体地分析。",
          },
          {
            role: "user",
            content: dimension.prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        stream: true, // 启用流式
      });

      let fullReflection = "";
      
      // 流式接收反思内容
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          fullReflection += delta;
          
          // 🔥 实时推送反思内容（流式）
          if (onReflectionUpdate) {
            onReflectionUpdate(
              {
                dimension: dimension.name,
                reflection: fullReflection, // 累积的内容
                timestamp: new Date().toISOString(),
                index,
                streaming: true, // 标记为流式中
              },
              index,
              dimensions.length
            );
          }
        }
      }

      const reflection = {
        dimension: dimension.name,
        reflection: fullReflection,
        timestamp: new Date().toISOString(),
        index,
        streaming: false, // 标记为完成
      };

      // 🔥 最终推送：维度完成
      if (onReflectionUpdate) {
        onReflectionUpdate(reflection, index, dimensions.length);
      }

      return reflection;
    } catch (error) {
      // 错误处理：单个维度失败不影响其他维度
      const reflection = {
        dimension: dimension.name,
        reflection: `反思失败: ${error.message}`,
        error: true,
        timestamp: new Date().toISOString(),
        index,
      };

      if (onReflectionUpdate) {
        onReflectionUpdate(reflection, index, dimensions.length);
      }

      return reflection;
    }
  });

  return await Promise.all(reflectionPromises);
};

/**
 * 基于反思结果生成改进回答（流式）
 */
const generateImprovedAnswer = async (
  initialAnswer,
  reflections,
  userMessage,
  model,
  onToken = null, // 流式输出回调
) => {
  const reflectionSummary = reflections
    .map((r) => `【${r.dimension}】\n${r.reflection}`)
    .join("\n\n");

  const stream = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "你是一个善于综合反思意见并改进回答的AI助手。请基于反思意见，生成更准确、完整、有逻辑的回答。",
      },
      {
        role: "user",
        content: `原问题：${userMessage}\n\n初始回答：${initialAnswer}\n\n反思意见：\n${reflectionSummary}\n\n请基于以上反思，生成改进后的回答：`,
      },
    ],
    temperature: 0.7,
    stream: true, // 启用流式
  });

  let fullResponse = "";
  
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || "";
    if (delta) {
      fullResponse += delta;
      if (onToken) {
        onToken(delta); // 实时推送每个 token
      }
    }
  }

  return fullResponse;
};

/**
 * 流式反思聊天（带可视化）
 * 所有问题都进行完整反思
 */
export const streamReflectionChat = async (
  userMessage,
  model = "qwen-plus",
  {
    onStatus, // (status: string, data: any) => void
    onToken, // (delta: string) => void
    onDone, // (result: object) => void
    onError, // (error: Error) => void
    sessionId = null,
    systemPrompt = null,
  } = {},
) => {
  try {
    // ========== 消息历史管理 ==========
    let currentSessionId =
      sessionId ||
      `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 获取或创建会话
    let session = contextManager.getSession(currentSessionId);
    if (!session) {
      try {
        const persisted = await sessionStore.loadSession(currentSessionId);
        if (persisted) {
          contextManager.conversations.set(currentSessionId, persisted);
          session = persisted;
        } else {
          session = contextManager.createSession(
            currentSessionId,
            systemPrompt,
          );
        }
      } catch {
        session = contextManager.createSession(currentSessionId, systemPrompt);
      }
    }

    // 添加用户消息到历史
    await contextManager.addMessage(currentSessionId, {
      role: "user",
      content: userMessage,
    });

    const conversationHistory =
      contextManager.getContextMessages(currentSessionId);

    // ========== 步骤1: 生成初始回答（流式） ==========
    onStatus?.("thinking", { message: "正在生成初始回答..." });

    let initialAnswer = "";
    await generateInitialAnswer(
      userMessage,
      model,
      conversationHistory,
      (delta) => {
        initialAnswer += delta;
        // 🔥 实时推送初始回答的每个 token
        onStatus?.("initial_answer_streaming", { 
          answer: initialAnswer,
          delta 
        });
      }
    );

    onStatus?.("initial_answer", { answer: initialAnswer });

    // ========== 步骤2: 并行反思（多维度 + 流式推送） ==========
    onStatus?.("reflecting", { message: "正在进行多维度反思..." });

    const reflections = await generateReflectionDimensions(
      initialAnswer,
      userMessage,
      model,
      // 🔥 每个反思维度完成时的回调
      (reflection, index, total) => {
        onStatus?.("reflection_item", {
          reflection,
          index,
          total,
          message: `完成 ${index + 1}/${total} 个维度：${reflection.dimension}`,
        });
      },
    );

    onStatus?.("reflections", { reflections });

    // ========== 步骤3: 生成改进回答（流式） ==========
    onStatus?.("improving", { message: "正在基于反思生成改进回答..." });

    let improvedAnswer = "";
    await generateImprovedAnswer(
      initialAnswer,
      reflections,
      userMessage,
      model,
      (delta) => {
        improvedAnswer += delta;
        // 🔥 实时推送改进回答的每个 token
        onToken?.(delta);
      }
    );

    onStatus?.("improved_answer", { answer: improvedAnswer });

    // 添加助手回复到历史
    await contextManager.addMessage(currentSessionId, {
      role: "assistant",
      content: improvedAnswer,
      metadata: {
        reflectionUsed: true,
        initialAnswer,
        reflections,
      },
    });

    // 保存会话
    await sessionStore.saveSession(
      currentSessionId,
      contextManager.getSession(currentSessionId),
    );

    // ========== 完成 ==========
    onDone?.({
      finalAnswer: improvedAnswer,
      initialAnswer,
      reflections,
      sessionId: currentSessionId,
      reflectionUsed: true,
      stats: contextManager.getSessionStats(currentSessionId),
    });
  } catch (error) {
    console.error("❌ 反思流程错误:", error);
    onError?.(error);
  }
};

/**
 * 非流式反思聊天
 */
export const reflectionChat = async (
  userMessage,
  model = "qwen-plus",
  sessionId = null,
  systemPrompt = null,
) => {
  const result = {
    initialAnswer: null,
    reflections: [],
    finalAnswer: null,
    sessionId: null,
    reflectionUsed: true,
  };

  try {
    // 会话管理
    let currentSessionId =
      sessionId ||
      `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let session = contextManager.getSession(currentSessionId);
    if (!session) {
      try {
        const persisted = await sessionStore.loadSession(currentSessionId);
        if (persisted) {
          contextManager.conversations.set(currentSessionId, persisted);
          session = persisted;
        } else {
          session = contextManager.createSession(
            currentSessionId,
            systemPrompt,
          );
        }
      } catch {
        session = contextManager.createSession(currentSessionId, systemPrompt);
      }
    }

    await contextManager.addMessage(currentSessionId, {
      role: "user",
      content: userMessage,
    });

    const conversationHistory =
      contextManager.getContextMessages(currentSessionId);

    // 生成初始回答
    result.initialAnswer = await generateInitialAnswer(
      userMessage,
      model,
      conversationHistory,
    );

    // 执行反思
    result.reflections = await generateReflectionDimensions(
      result.initialAnswer,
      userMessage,
      model,
    );

    // 生成改进回答
    result.finalAnswer = await generateImprovedAnswer(
      result.initialAnswer,
      result.reflections,
      userMessage,
      model,
    );

    result.sessionId = currentSessionId;

    await contextManager.addMessage(currentSessionId, {
      role: "assistant",
      content: result.finalAnswer,
      metadata: {
        reflectionUsed: true,
        initialAnswer: result.initialAnswer,
        reflections: result.reflections,
      },
    });

    await sessionStore.saveSession(
      currentSessionId,
      contextManager.getSession(currentSessionId),
    );

    return result;
  } catch (error) {
    console.error("❌ 反思聊天错误:", error);
    // 错误处理：至少返回初始回答
    if (result.initialAnswer) {
      result.finalAnswer = result.initialAnswer;
      result.error = error.message;
    } else {
      throw error;
    }
    return result;
  }
};
