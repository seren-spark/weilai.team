import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

/**
 * 获取可用模型列表
 */
app.get("/api/models", (req, res) => {
  res.json({
    success: true,
    models: [
      { id: "qwen3-max", name: "通义千问 Plus", description: "通用对话模型" },
      { id: "qwen-turbo", name: "通义千问 Turbo", description: "快速响应模型" },
      { id: "qwen-max", name: "通义千问 Max", description: "高级对话模型" },
    ],
  });
});

// 原有的测试接口
app.get("/person", (req, res) => {
  res.send({ name: "zhangsan", age: 18 });
});

// 上传接口（示例）
app.post("/api/upload", (req, res) => {
  res.json({ success: true, message: "上传功能待实现" });
});

// ============= 启动服务器 =============
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 AI Chat Server Started!          ║
║                                       ║
║   📡 Server: http://localhost:${PORT}    ║
║   📝 Health: GET  /health             ║
║   💬 Chat:   POST /api/chat           ║
║   🌊 Stream: POST /api/chat/stream    ║
║   🔧 Tools:  POST /api/tool-call      ║
║                                       ║
║   ✨ Ready to serve AI requests!      ║
╚═══════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on("SIGTERM", () => {
  console.log("收到 SIGTERM 信号，正在关闭服务器...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n收到 SIGINT 信号，正在关闭服务器...");
  process.exit(0);
});
