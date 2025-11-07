/**
 * 会话持久化存储服务
 * 功能：
 * 1. 将会话数据保存到文件系统
 * 2. 支持会话恢复
 * 3. 导出/导入会话历史
 */

import fs from "fs/promises";
import path from "path";

export class SessionStore {
  constructor(dataDir = "./data/sessions") {
    this.dataDir = dataDir;
    this.init();
  }

  /**
   * 初始化数据目录
   */
  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      console.log(`📁 会话存储目录: ${this.dataDir}`);
    } catch (error) {
      console.error("初始化存储目录失败:", error);
    }
  }

  /**
   * 保存会话
   */
  async saveSession(sessionId, sessionData) {
    try {
      const filepath = this.getSessionPath(sessionId);
      await fs.writeFile(filepath, JSON.stringify(sessionData, null, 2));
      console.log(`💾 保存会话 [${sessionId}]`);
      return true;
    } catch (error) {
      console.error(`保存会话失败 [${sessionId}]:`, error);
      return false;
    }
  }

  /**
   * 加载会话
   */
  async loadSession(sessionId) {
    try {
      const filepath = this.getSessionPath(sessionId);
      const data = await fs.readFile(filepath, "utf-8");
      console.log(`📂 加载会话 [${sessionId}]`);
      return JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(`加载会话失败 [${sessionId}]:`, error);
      }
      return null;
    }
  }

  /**
   * 删除会话
   */
  async deleteSession(sessionId) {
    try {
      const filepath = this.getSessionPath(sessionId);
      await fs.unlink(filepath);
      console.log(`🗑️  删除会话文件 [${sessionId}]`);
      return true;
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(`删除会话失败 [${sessionId}]:`, error);
      }
      return false;
    }
  }

  /**
   * 获取所有会话列表
   */
  async getAllSessionIds() {
    try {
      const files = await fs.readdir(this.dataDir);
      return files
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""));
    } catch (error) {
      console.error("读取会话列表失败:", error);
      return [];
    }
  }

  /**
   * 导出会话历史
   */
  async exportSession(sessionId, format = "json") {
    const sessionData = await this.loadSession(sessionId);
    if (!sessionData) return null;

    if (format === "markdown") {
      return this.toMarkdown(sessionData);
    }

    return sessionData;
  }

  /**
   * 转换为 Markdown 格式
   */
  toMarkdown(sessionData) {
    let md = `# 会话记录: ${sessionData.id}\n\n`;
    md += `**创建时间**: ${sessionData.stats.createdAt}\n`;
    md += `**最后活跃**: ${sessionData.stats.lastActive}\n`;
    md += `**消息数量**: ${sessionData.stats.messageCount}\n`;
    md += `**压缩次数**: ${sessionData.stats.compressionCount}\n\n`;

    if (sessionData.summary) {
      md += `## 对话摘要\n\n${sessionData.summary}\n\n`;
    }

    md += `## 对话内容\n\n`;

    for (const msg of sessionData.messages) {
      if (msg.role === "system") {
        md += `> **系统**: ${msg.content}\n\n`;
      } else if (msg.role === "user") {
        md += `### 👤 用户\n\n${msg.content}\n\n`;
      } else if (msg.role === "assistant") {
        md += `### 🤖 助手\n\n${msg.content}\n\n`;
        if (msg.tool_calls) {
          md += `**工具调用**: ${msg.tool_calls
            .map((t) => t.function.name)
            .join(", ")}\n\n`;
        }
      } else if (msg.role === "tool") {
        md += `**工具返回**: \`\`\`\n${msg.content}\n\`\`\`\n\n`;
      }
    }

    return md;
  }

  /**
   * 获取会话文件路径
   */
  getSessionPath(sessionId) {
    return path.join(this.dataDir, `${sessionId}.json`);
  }

  /**
   * 清理旧会话文件（超过指定天数）
   */
  async cleanupOldSessions(days = 30) {
    try {
      const sessionIds = await this.getAllSessionIds();
      const now = Date.now();
      const maxAge = days * 24 * 60 * 60 * 1000;
      let cleaned = 0;

      for (const sessionId of sessionIds) {
        const sessionData = await this.loadSession(sessionId);
        if (!sessionData) continue;

        const lastActive = new Date(sessionData.stats.lastActive).getTime();
        if (now - lastActive > maxAge) {
          await this.deleteSession(sessionId);
          cleaned++;
        }
      }

      console.log(`🧹 清理了 ${cleaned} 个超过 ${days} 天的会话文件`);
      return cleaned;
    } catch (error) {
      console.error("清理会话失败:", error);
      return 0;
    }
  }
}

// 创建全局实例
export const sessionStore = new SessionStore();
