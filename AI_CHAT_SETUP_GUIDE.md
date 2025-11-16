# 🚀 AI Chat 完整部署指南

基于 Express + SSE + Vue 3 的 AI 聊天系统，支持阿里云通义千问流式响应。

## 📋 项目结构

```
weilai.team/
├── src/                          # 前端代码
│   ├── composables/
│   │   └── useAiChat.ts         # ✅ AI 聊天逻辑
│   ├── features/
│   │   └── ai-chat/
│   │       ├── AiChat.vue       # ✅ 主聊天组件
│   │       └── components/      # 拆分的子组件
│   └── ...
├── server/                       # 后端代码
│   ├── server.js                # ✅ Express 服务器
│   ├── package.json             # 后端依赖
│   ├── env.example              # 环境变量示例
│   ├── start.bat                # Windows 启动脚本
│   ├── start.sh                 # Unix 启动脚本
│   └── README.md                # 后端文档
└── AI_CHAT_SETUP_GUIDE.md       # 本文档
```

## 🎯 部署步骤

### 第一步：启动后端服务器

#### 方式 A：自动启动（推荐）

**Windows:**

```bash
cd server
start.bat
```

**Mac/Linux:**

```bash
cd server
chmod +x start.sh
./start.sh
```

#### 方式 B：手动启动

```bash
cd server

# 1. 安装依赖
npm install

# 2. 配置环境变量
cp env.example .env
# 编辑 .env 文件，填入你的 API Key

# 3. 启动服务器
npm start

# 或使用开发模式（自动重启）
npm run dev
```

**成功启动后会看到：**

```
╔═══════════════════════════════════════╗
║   🚀 AI Chat Server Started!          ║
║                                       ║
║   📡 Server: http://localhost:5005    ║
║   📝 Health: http://localhost:5005/health ║
║   💬 Chat:   POST /api/chat           ║
║   🌊 Stream: POST /api/chat/stream    ║
║                                       ║
║   ✨ Ready to serve AI requests!      ║
╚═══════════════════════════════════════╝
```

### 第二步：启动前端

在另一个终端窗口：

```bash
# 回到项目根目录
cd ..

# 启动前端
npm run dev
```

访问 `http://localhost:5173` 即可使用！

## ✅ 验证部署

### 1. 测试后端接口

**健康检查:**

```bash
curl http://localhost:5005/health
```

**普通聊天:**

```bash
curl -X POST http://localhost:5005/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好"}'
```

**SSE 流式聊天:**

```bash
curl -X POST http://localhost:5005/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"写一首诗"}' \
  --no-buffer
```

### 2. 测试前端

1. 打开浏览器访问 `http://localhost:5173`
2. 进入 AI Chat 页面
3. 输入消息，观察是否有流式响应（文字逐字显示）

## 🔧 配置说明

### 后端配置 (server/.env)

```env
# 必填：阿里云 API Key
DASHSCOPE_API_KEY=sk-your-api-key-here

# 可选：服务器端口（默认 5005）
PORT=5005

# 可选：API 基础 URL（默认北京地域）
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

### 前端配置

修改 `src/composables/useAiChat.ts` 中的后端地址：

```typescript
// 如果后端不是 localhost:5005，修改这里
const response = await fetch("http://localhost:5005/api/chat/stream", {
  // ...
});
```

## 📡 API 接口文档

### 1. SSE 流式聊天（前端正在使用）

```http
POST http://localhost:5005/api/chat/stream
Content-Type: application/json

{
  "message": "你好，介绍一下你自己",
  "systemPrompt": "You are a helpful assistant.",
  "model": "qwen3-max"
}
```

**响应格式（SSE）:**

```
data: {"content":"你"}
data: {"content":"好"}
data: {"content":"！"}
...
data: [DONE]
```

### 2. 普通聊天（非流式）

```http
POST http://localhost:5005/api/chat
Content-Type: application/json

{
  "message": "你好",
  "systemPrompt": "You are a helpful assistant.",
  "model": "qwen3-max"
}
```

**响应格式（JSON）:**

```json
{
  "success": true,
  "response": "你好！我是通义千问...",
  "model": "qwen3-max",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}
```

## 🎨 前端使用示例

### 在组件中使用

```vue
<script setup lang="ts">
import { useAiChat } from "@/composables/useAiChat";

const { sendMessageStream, isLoading } = useAiChat();

const handleSend = async (message: string) => {
  let response = "";

  await sendMessageStream(message, (chunk) => {
    response += chunk;
    console.log("收到:", chunk);
  });

  console.log("完整响应:", response);
};
</script>
```

## 🐛 常见问题

### Q1: 前端提示 "Failed to fetch"

**A:** 检查后端是否启动，访问 http://localhost:5005/health 验证

### Q2: 后端提示 "API Key 无效"

**A:** 检查 `server/.env` 文件中的 `DASHSCOPE_API_KEY` 是否正确

### Q3: 流式响应不工作

**A:**

- 确认使用的是 `/api/chat/stream` 接口
- 检查浏览器控制台是否有错误
- 确认后端日志中有 "流式请求" 相关输出

### Q4: 跨域错误 (CORS)

**A:**

- 确认后端 `server.js` 中已配置 CORS
- 如果前端不是 localhost:5173，需要修改 CORS 配置

### Q5: 消息不显示或显示不完整

**A:**

- 检查浏览器控制台的网络请求
- 查看后端日志是否有错误
- 确认 `useAiChat.ts` 中的 URL 正确

## 🔒 安全建议

### 开发环境

- ✅ 使用 `.env` 文件存储 API Key
- ✅ 将 `.env` 添加到 `.gitignore`
- ✅ 不要将 API Key 提交到代码仓库

### 生产环境

1. **配置严格的 CORS:**

```javascript
app.use(
  cors({
    origin: "https://your-domain.com",
    credentials: true,
  }),
);
```

2. **添加请求限流:**

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 分钟
  max: 10, // 限制 10 次请求
});

app.use("/api/", limiter);
```

3. **添加用户认证:**

```javascript
// 验证用户 token
app.use("/api/", authenticateUser);
```

## 📊 架构说明

```
┌─────────────────┐         SSE Stream        ┌──────────────────┐
│   Vue 前端      │ ────────────────────────► │  Express 后端    │
│  (浏览器)       │ ◄──────────────────────── │  (Node.js)       │
│                 │   实时推送 AI 响应          │                  │
└─────────────────┘                           └──────────────────┘
                                                       │
                                                       │ OpenAI SDK
                                                       ↓
                                              ┌──────────────────┐
                                              │  阿里云通义千问   │
                                              │  API             │
                                              └──────────────────┘
```

**优势：**

1. ✅ API Key 安全（后端存储）
2. ✅ 流式响应（打字机效果）
3. ✅ 完全可控（访问控制、限流、计费）
4. ✅ 易于扩展（可添加多个 AI 服务）

## 📚 相关文档

- [阿里云模型服务](https://help.aliyun.com/zh/model-studio/)
- [获取 API Key](https://help.aliyun.com/zh/model-studio/get-api-key)
- [OpenAI SDK](https://github.com/openai/openai-node)
- [Server-Sent Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events)

## 🎓 技术栈

### 后端

- Express 4.x
- OpenAI SDK 4.x
- CORS
- dotenv

### 前端

- Vue 3
- TypeScript
- Fetch API (SSE)

## 📝 更新日志

### v1.0.0 (2024-01-15)

- ✅ 创建 Express 后端服务器
- ✅ 实现 SSE 流式接口
- ✅ 集成阿里云通义千问
- ✅ 完成前端 SSE 对接
- ✅ 添加完整文档

## 📄 许可证

MIT

---

**遇到问题？** 查看日志或提交 Issue。

**需要帮助？** 参考 `server/README.md` 获取更多详细信息。
