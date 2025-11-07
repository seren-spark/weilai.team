import express from "express";
import { simpleChat, streamChat } from "../services/chatService.js";
import { chatWithTools } from "../services/functionCallService.js";
const router = express.Router();

/**
 * POST /api/chat
 * 普通聊天接口
 */
router.post("/", async (req, res) => {
  try {
    const { message, systemPrompt, model = "qwen-plus" } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "message 参数不能为空",
      });
    }

    const response = await simpleChat(message, systemPrompt, model);

    res.json({
      success: true,
      response,
      model,
    });
  } catch (error) {
    console.error("❌ 聊天错误:", error);
    res.status(500).json({
      success: false,
      error: error.message || "服务器内部错误",
    });
  }
});

/**
 * POST /api/chat/stream
 * 流式聊天接口
 */
router.post("/stream", async (req, res) => {
  try {
    const { message, systemPrompt, model = "qwen-plus" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message 参数不能为空" });
    }

    // 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    console.log("请求了");

    const stream = await streamChat(message, systemPrompt, model);

    // 流式返回
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("❌ 流式聊天错误:", error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

export default router;
