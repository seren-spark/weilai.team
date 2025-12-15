/**
 * 会话管理 API 路由
 */

import express from "express";
import { contextManager } from "../services/contextManager.js";
import { sessionStore } from "../services/sessionStore.js";

const router = express.Router();

/**
 * GET /api/sessions
 * 获取所有会话列表
 */
router.get("/", (req, res) => {
  try {
    const sessions = contextManager.getAllSessions();
    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/sessions/:sessionId
 * 获取指定会话详情
 */
router.get("/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = contextManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "会话不存在",
      });
    }

    res.json({
      success: true,
      session: {
        id: session.id,
        messages: session.messages,
        summary: session.summary,
        stats: session.stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/sessions/:sessionId/stats
 * 获取会话统计信息
 */
router.get("/:sessionId/stats", (req, res) => {
  try {
    const { sessionId } = req.params;
    const stats = contextManager.getSessionStats(sessionId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: "会话不存在",
      });
    }

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/sessions
 * 创建新会话
 */
router.post("/", (req, res) => {
  try {
    const { sessionId, systemPrompt } = req.body;

    // 如果没有提供 sessionId，自动生成
    const newSessionId =
      sessionId ||
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = contextManager.createSession(newSessionId, systemPrompt);

    res.json({
      success: true,
      sessionId: newSessionId,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * 删除会话
 */
router.delete("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 从内存中删除
    const deleted = contextManager.clearSession(sessionId);

    // 从文件中删除
    await sessionStore.deleteSession(sessionId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "会话不存在",
      });
    }

    res.json({
      success: true,
      message: "会话已删除",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/sessions/:sessionId/compress
 * 手动压缩会话上下文
 */
router.post("/:sessionId/compress", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = contextManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "会话不存在",
      });
    }

    await contextManager.compressContext(sessionId);

    res.json({
      success: true,
      message: "上下文已压缩",
      stats: contextManager.getSessionStats(sessionId),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/sessions/:sessionId/export
 * 导出会话历史
 */
router.get("/:sessionId/export", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { format = "json" } = req.query;

    const exported = await sessionStore.exportSession(sessionId, format);

    if (!exported) {
      return res.status(404).json({
        success: false,
        error: "会话不存在",
      });
    }

    if (format === "markdown") {
      res.setHeader("Content-Type", "text/markdown");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="session_${sessionId}.md"`,
      );
      res.send(exported);
    } else {
      res.json({
        success: true,
        data: exported,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/sessions/:sessionId/restore
 * 从文件恢复会话
 */
router.post("/:sessionId/restore", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionData = await sessionStore.loadSession(sessionId);

    if (!sessionData) {
      return res.status(404).json({
        success: false,
        error: "会话文件不存在",
      });
    }

    // 恢复到内存
    contextManager.conversations.set(sessionId, sessionData);

    res.json({
      success: true,
      message: "会话已恢复",
      session: sessionData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/sessions/cleanup
 * 清理过期会话
 */
router.post("/cleanup", async (req, res) => {
  try {
    const { hours = 24, days = 30 } = req.body;

    // 清理内存中的过期会话
    const memoryCleanedCount = contextManager.cleanupExpiredSessions(hours);

    // 清理文件中的旧会话
    const fileCleanedCount = await sessionStore.cleanupOldSessions(days);

    res.json({
      success: true,
      message: "清理完成",
      memoryCleanedCount,
      fileCleanedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/sessions/delete-messages
 * 删除指定消息之后的所有消息（用于编辑功能）
 * Body:
 *   - sessionId: 会话 ID（必需）
 *   - fromIndex: 从哪个索引开始删除（可选）
 *   - messageContent: 要查找的消息内容（可选）
 *   - role: 消息角色 user/assistant（可选，默认 user）
 */
router.post("/delete-messages", (req, res) => {
  try {
    const { sessionId, fromIndex, messageContent, role = "user" } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "sessionId 不能为空",
      });
    }

    let result;
    if (typeof fromIndex === "number") {
      // 按索引删除
      result = contextManager.deleteMessagesFrom(sessionId, fromIndex);
    } else if (messageContent) {
      // 按内容查找并删除
      result = contextManager.deleteMessagesAfter(
        sessionId,
        messageContent,
        role,
      );
    } else {
      return res.status(400).json({
        success: false,
        error: "必须提供 fromIndex 或 messageContent 参数",
      });
    }

    if (result) {
      const session = contextManager.getSession(sessionId);
      res.json({
        success: true,
        message: "消息删除成功",
        stats: session ? session.stats : null,
        remainingMessages: session ? session.messages.length : 0,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "删除失败，会话或消息不存在",
      });
    }
  } catch (error) {
    console.error("❌ 删除消息失败:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
