/*
 * @Author: serendipity 2843306836@qq.com
 * @Date: 2025-10-17 19:25:42
 * @LastEditors: serendipity 2843306836@qq.com
 * @LastEditTime: 2025-11-10 15:03:14
 * @FilePath: \weilai.team\server\src\routes\toolRoutes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import express from "express";
import {
  // chatWithTools,
  streamChatWithTools,
} from "../services/functionCallService.js";

const router = express.Router();

/**
 * POST /api/tool-call
 * 支持工具调用的聊天接口
 */
// router.post("/", async (req, res) => {
//   try {
//     const {
//       message,
//       model = "qwen-plus",
//       sessionId = null,
//       systemPrompt = null,
//     } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         error: "message 参数不能为空",
//       });
//     }

//     console.log(
//       `🤖 收到工具调用请求 [会话: ${sessionId || "新建"}]: ${message}`,
//     );

//     const result = await chatWithTools(message, model, sessionId, systemPrompt);

//     console.log(`✅ 工具调用完成，最终回复: ${result.finalResponse}`);

//     res.json({
//       success: true,
//       response: result.finalResponse,
//       sessionId: result.sessionId,
//       needToolCall: result.needToolCall,
//       toolCallLogs: result.toolCallLogs || [],
//       stats: result.stats, // 返回会话统计信息
//       model,
//     });
//   } catch (error) {
//     console.error("❌ 工具调用错误:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "服务器内部错误",
//     });
//   }
// });
/**
 * POST /api/tool-call/stream
 * 流式：工具调用 + 自然语言结果，SSE 推送
 * 事件类型：
 *  - { type: "token", content: "文本增量" }
 *  - { type: "tool", name, args, result }
 *  - { type: "done" }
 */
router.post("/stream", async (req, res) => {
  console.log("工具调佣");

  try {
    const {
      message,
      model = "qwen-plus",
      sessionId = null,
      systemPrompt = null,
    } = req.body;
    const token = req.headers.authorization;

    if (!message) {
      return res.status(400).json({ error: "message 参数不能为空" });
    }

    // 设置 SSE 头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Transfer-Encoding", "chunked"); // 强制分块传输

    // 立即发送响应头
    res.flushHeaders();

    // 发送初始数据，触发 XHR onprogress
    res.write(":ok\n\n");
    if (res.socket) res.socket.write("");

    await streamChatWithTools(message, model, {
      onToken: (delta) => {
        console.log(delta, "token delta");

        const data = `data: ${JSON.stringify({ type: "token", content: delta })}\n\n`;
        res.write(data);

        // 🔥 关键：强制刷新 TCP 缓冲区
        if (res.socket) {
          res.socket.write("");
        }
      },
      onToolCall: (name, args, result) => {
        console.log({ name, args, result }, "tool delta");

        const data = `data: ${JSON.stringify({ type: "tool", name, args, result })}\n\n`;
        res.write(data);

        // 🔥 关键：强制刷新 TCP 缓冲区
        if (res.socket) {
          res.socket.write("");
        }
      },
      onDone: ({ sessionId: sid, stats }) => {
        console.log("onDone");
        res.write(
          `data: ${JSON.stringify({ type: "done", sessionId: sid, stats })}\n\n`,
        );
        res.end();
      },
      onError: (error) => {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: error.message,
          })}\n\n`,
        );
        res.end();
      },
      token,
      sessionId,
      systemPrompt,
    });
  } catch (error) {
    console.error("❌ 工具流式聊天错误:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || "服务器内部错误",
      });
    }
  }
});

export default router;
