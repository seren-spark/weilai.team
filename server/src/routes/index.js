import express from "express";
import chatRoutes from "./chatRoutes.js";
import toolRoutes from "./toolRoutes.js";
import sessionRoutes from "./sessionRoutes.js";
import reflectionRoutes from "./reflectionRoutes.js";

const router = express.Router();

// 健康检查
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AI Chat Server with Context Management",
  });
});

// 挂载子路由
router.use("/chat", chatRoutes);
router.use("/tool_call", toolRoutes);
router.use("/sessions", sessionRoutes);
router.use("/reflection", reflectionRoutes);

export default router;
