import express from "express";
import cors from "cors";
import compression from "compression";
import routes from "./routes/index.js";
import { requestLogger } from "./middlewares/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// 中间件
app.use(cors({ origin: "*", credentials: true }));

// 🔥 关键：禁用 SSE 端点的压缩，确保流式数据立即发送
app.use(
  compression({
    filter: (req, res) => {
      // 对 SSE 端点不压缩
      if (req.path.includes("/stream")) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// 挂载路由
app.use(routes);

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
