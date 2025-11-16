import openai from "../config/openai.js";
import { tools } from "../tools/index.js";
/**
 * 普通聊天（无工具调用）
 */
export const simpleChat = async (
  message,
  systemPrompt,
  model = "qwen3-max",
) => {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt || "You are a helpful assistant.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content;
};

/**
 * 流式聊天
 */
export const streamChat = async (
  message,
  systemPrompt,
  model = "qwen3-max",
) => {
  console.log("请求了");

  const stream = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt || "You are a helpful assistant.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    tools,
    stream: true,
  });
  return stream;
};
