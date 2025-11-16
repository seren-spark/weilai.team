import express from "express";
import {
  streamReflectionChat,
  reflectionChat,
} from "../services/reflectionService.js";

const router = express.Router();

/**
 * POST /api/reflection/stream
 * 流式反思聊天接口（带可视化 + 中断支持）
 */
router.post("/stream", async (req, res) => {
  console.log("请求到反思接口了");

  // 创建 AbortController 用于中断控制
  const abortController = new AbortController();

  // 监听客户端断开连接
  res.on("close", () => {
    console.log("客户端断开连接，中断反思流程");
    abortController.abort();
  });

  try {
    const {
      message,
      model = "qwen3-max",
      sessionId = null,
      systemPrompt = null,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message 参数不能为空" });
    }

    console.log(`🤖 收到反思请求: ${message}`);

    // 设置 SSE 头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Transfer-Encoding", "chunked");

    // 立即发送响应头
    res.flushHeaders();

    // 发送初始数据
    res.write(":ok\n\n");
    if (res.socket) res.socket.write("");

    await streamReflectionChat(message, model, {
      // 状态更新回调
      onStatus: (status, data) => {
        // console.log(`💡 状态: ${status}`, data?.message || "");
        const eventData = `data: ${JSON.stringify({ type: "status", status, data })}\n\n`;
        res.write(eventData);
        if (res.socket) res.socket.write("");
      },

      // 文本流式输出回调
      onToken: (delta) => {
        const eventData = `data: ${JSON.stringify({ type: "token", content: delta })}\n\n`;
        res.write(eventData);
        if (res.socket) res.socket.write("");
      },

      // 🎯 工具调用回调
      onToolCall: (toolName, args, result) => {
        console.log(`🔧 反思中调用工具 [${toolName}]:`, args);
        const eventData = `data: ${JSON.stringify({
          type: "tool_call",
          toolName,
          args,
          result: result.substring(0, 200) + "...", // 截取前200字符避免过长
        })}\n\n`;
        res.write(eventData);
        if (res.socket) res.socket.write("");
      },

      // 完成回调
      onDone: (result) => {
        console.log(`✅ 反思完成`);
        res.write(`data: ${JSON.stringify({ type: "done", result })}\n\n`);
        res.end();
      },

      // 错误回调
      onError: (error) => {
        console.error(`❌ 反思错误:`, error);
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: error.message,
          })}\n\n`,
        );
        res.end();
      },

      sessionId,
      systemPrompt,
      token: req.headers.authorization, // 传递用户token
      abortSignal: abortController.signal, // 🎯 传递中断信号
    });
  } catch (error) {
    console.error("❌ 反思流式聊天错误:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || "服务器内部错误",
      });
    }
  }
});

/**
 * POST /api/reflection
 * 非流式反思聊天接口
 */
router.post("/", async (req, res) => {
  try {
    const {
      message,
      model = "qwen3-max",
      sessionId = null,
      systemPrompt = null,
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "message 参数不能为空",
      });
    }

    console.log(`🤖 收到反思请求 [会话: ${sessionId || "新建"}]: ${message}`);

    const result = await reflectionChat(
      message,
      model,
      sessionId,
      systemPrompt,
    );

    console.log(
      `✅ 反思完成，最终回复: ${result.finalAnswer.substring(0, 100)}...`,
    );

    res.json({
      success: true,
      ...result,
      model,
    });
  } catch (error) {
    console.error("❌ 反思聊天错误:", error);
    res.status(500).json({
      success: false,
      error: error.message || "服务器内部错误",
    });
  }
});

export default router;
