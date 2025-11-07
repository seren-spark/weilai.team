// src/utils/chatDatabase.ts
import Dexie, {type Table } from "dexie";

/**
 * 聊天会话接口
 */
export interface ChatSession {
  id: string; // 会话ID
  title: string; // 会话标题
  createdAt: number; // 创建时间戳
  updatedAt: number; // 更新时间戳
  sessionId?: string; // 后端会话ID（用于上下文管理）
  messageCount: number; // 消息数量
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  id: string; // 消息ID
  chatId: string; // 所属会话ID
  role: "user" | "assistant"; // 角色
  content: string; // 消息内容
  timestamp: number; // 时间戳
  time: string; // 格式化时间
}

/**
 * AI 聊天数据库类
 */
class ChatDatabase extends Dexie {
  // 定义表
  sessions!: Table<ChatSession, string>;
  messages!: Table<ChatMessage, string>;

  constructor() {
    super("AIChatDatabase");

    // 定义数据库结构（版本1）
    this.version(1).stores({
      // 会话表：主键 id，索引 updatedAt（用于排序）
      sessions: "id, updatedAt",
      // 消息表：主键 id，索引 chatId（用于查询某会话的消息）和 timestamp（用于排序）
      messages: "id, chatId, timestamp, [chatId+timestamp]",
    });
  }

  /**
   * 创建新会话
   */
  async createSession(title: string = "新对话"): Promise<ChatSession> {
    const session: ChatSession = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
    };

    await this.sessions.add(session);
    return session;
  }

  /**
   * 获取所有会话（按更新时间倒序）
   */
  async getAllSessions(): Promise<ChatSession[]> {
    return await this.sessions.orderBy("updatedAt").reverse().toArray();
  }

  /**
   * 获取单个会话
   */
  async getSession(chatId: string): Promise<ChatSession | undefined> {
    return await this.sessions.get(chatId);
  }

  /**
   * 更新会话
   */
  async updateSession(
    chatId: string,
    updates: Partial<ChatSession>,
  ): Promise<void> {
    await this.sessions.update(chatId, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  /**
   * 删除会话及其所有消息
   */
  async deleteSession(chatId: string): Promise<void> {
    await this.transaction("rw", this.sessions, this.messages, async () => {
      await this.sessions.delete(chatId);
      await this.messages.where("chatId").equals(chatId).delete();
    });
  }

  /**
   * 添加消息
   */
  async addMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    await this.transaction("rw", this.messages, this.sessions, async () => {
      await this.messages.add(newMessage);

      // 更新会话的消息数量和更新时间
      const session = await this.sessions.get(message.chatId);
      if (session) {
        await this.sessions.update(message.chatId, {
          messageCount: session.messageCount + 1,
          updatedAt: Date.now(),
        });
      }
    });

    return newMessage;
  }

  /**
   * 获取会话的所有消息（按时间正序）
   */
  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return await this.messages
      .where("chatId")
      .equals(chatId)
      .sortBy("timestamp");
  }

  /**
   * 获取会话的最新 N 条消息
   */
  async getRecentMessages(
    chatId: string,
    limit: number = 50,
  ): Promise<ChatMessage[]> {
    const messages = await this.messages
      .where("chatId")
      .equals(chatId)
      .reverse()
      .sortBy("timestamp");

    return messages.slice(0, limit).reverse();
  }

  /**
   * 分页获取消息
   */
  async getMessagesPaginated(
    chatId: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<ChatMessage[]> {
    return await this.messages
      .where("chatId")
      .equals(chatId)
      .offset(offset)
      .limit(limit)
      .sortBy("timestamp");
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    await this.transaction("rw", this.sessions, this.messages, async () => {
      await this.sessions.clear();
      await this.messages.clear();
    });
  }

  /**
   * 获取数据库统计信息
   */
  async getStats() {
    const sessionCount = await this.sessions.count();
    const messageCount = await this.messages.count();

    return {
      sessionCount,
      messageCount,
      estimatedSize: await this.getEstimatedSize(),
    };
  }

  /**
   * 估算数据库大小（字节）
   */
  private async getEstimatedSize(): Promise<number> {
    const sessions = await this.sessions.toArray();
    const messages = await this.messages.toArray();

    const sessionsSize = JSON.stringify(sessions).length;
    const messagesSize = JSON.stringify(messages).length;

    return sessionsSize + messagesSize;
  }
}

// 导出单例实例
export const chatDB = new ChatDatabase();
