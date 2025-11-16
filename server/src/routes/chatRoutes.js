/*
 * @Author: serendipity 2843306836@qq.com
 * @Date: 2025-10-17 19:25:42
 * @LastEditors: serendipity 2843306836@qq.com
 * @LastEditTime: 2025-11-10 15:40:59
 * @FilePath: \weilai.team\server\src\routes\chatRoutes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import express from "express";
import { simpleChat, streamChat } from "../services/chatService.js";
// import { chatWithTools } from "../services/functionCallService.js";
const router = express.Router();

/**
 * POST /api/chat
 * 普通聊天接口
 */
// router.post("/", async (req, res) => {
//   try {
//     const { message, systemPrompt, model = "qwen3-max" } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         error: "message 参数不能为空",
//       });
//     }

//     const response = await simpleChat(message, systemPrompt, model);

//     res.json({
//       success: true,
//       response,
//       model,
//     });
//   } catch (error) {
//     console.error("❌ 聊天错误:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "服务器内部错误",
//     });
//   }
// });

/**
 * POST /api/chat/stream
 * 流式聊天接口
 */
router.post("/stream", async (req, res) => {
  try {
    const { message, systemPrompt, model = "qwen3-max" } = req.body;

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
