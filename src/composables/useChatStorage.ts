import { ref, watch } from "vue";
import {
  chatDB,
  type ChatSession,
  type ChatMessage,
} from "@/utils/chatDatabase";

// 聊天持久化存储

export function useChatStorage() {
  const sessions = ref<ChatSession[]>([]);
  const currentSession = ref<ChatSession | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);

  /**
   * 初始化：加载所有会话
   */
  const initStorage = async () => {
    try {
      isLoading.value = true;
      sessions.value = await chatDB.getAllSessions();
      console.log("✅ 加载会话列表成功:", sessions.value.length);
    } catch (error) {
      console.error("❌ 加载会话列表失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 创建新会话
   */

  const createSession = async (
    title: string = "新对话",
  ): Promise<ChatSession> => {
    try {
      const session = await chatDB.createSession(title);
      sessions.value.unshift(session);
      currentSession.value = session;
      messages.value = [];
      console.log("创建对话成功", session.id);
      return session;
    } catch (error) {
      console.error("X 创建会话失败", error);
      throw error;
    }
  };

  /**
   * 切换会话
   */
  const switchSession = async (chatId: string) => {
    try {
      isLoading.value = true;
      const session = await chatDB.getSession(chatId);
      if (!session) {
        throw new Error("会话不存在");
      }

      currentSession.value = session;
      messages.value = await chatDB.getMessages(chatId);
      console.log("✅ 切换会话成功:", chatId, "消息数:", messages.value.length);
    } catch (error) {
      console.error("❌ 切换会话失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  /**
   * 删除会话
   */
  const deleteSession = async (chatId: string) => {
    try {
      await chatDB.deleteSession(chatId);
      sessions.value = sessions.value.filter((s) => s.id !== chatId);

      // 如果删除的是当前会话，清空当前状态
      if (currentSession.value?.id === chatId) {
        currentSession.value = null;
        messages.value = [];
      }

      console.log("✅ 删除会话成功:", chatId);
    } catch (error) {
      console.error("❌ 删除会话失败:", error);
      throw error;
    }
  };

  /**
   * 更新会话标题
   */
  const updateSessionTitle = async (chatId: string, title: string) => {
    try {
      await chatDB.updateSession(chatId, { title });

      // 更新本地状态
      const session = sessions.value.find((s) => s.id === chatId);
      if (session) {
        session.title = title;
      }
      if (currentSession.value?.id === chatId) {
        currentSession.value.title = title;
      }

      console.log("✅ 更新会话标题成功:", chatId);
    } catch (error) {
      console.error("❌ 更新会话标题失败:", error);
      throw error;
    }
  };

  /**
   * 保存消息到数据库
   */
  const saveMessage = async (
    chatId: string,
    role: "user" | "assistant",
    content: string,
    time?: string,
  ): Promise<ChatMessage> => {
    try {
      const message = await chatDB.addMessage({
        chatId,
        role,
        content,
        timestamp: Date.now(),
        time: time || getCurrentTime(),
      });

      // 如果是当前会话，添加到消息列表
      if (currentSession.value?.id === chatId) {
        messages.value.push(message);
      }

      // 更新会话列表中的会话位置（移到最前）
      const sessionIndex = sessions.value.findIndex((s) => s.id === chatId);
      if (sessionIndex > 0) {
        const [session] = sessions.value.splice(sessionIndex, 1);
        sessions.value.unshift(session);
      }

      return message;
    } catch (error) {
      console.error("❌ 保存消息失败:", error);
      throw error;
    }
  };

  /**
   * 批量保存消息（用于同步历史消息）
   */
  const saveMessages = async (
    chatId: string,
    msgs: Array<{
      role: "user" | "assistant";
      content: string;
      time?: string;
      timestamp?: number;
    }>,
  ) => {
    try {
      for (const msg of msgs) {
        await chatDB.addMessage({
          chatId,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp || Date.now(),
          time: msg.time || getCurrentTime(),
        });
      }

      // 重新加载当前会话的消息
      if (currentSession.value?.id === chatId) {
        messages.value = await chatDB.getMessages(chatId);
      }

      console.log("✅ 批量保存消息成功:", msgs.length);
    } catch (error) {
      console.error("❌ 批量保存消息失败:", error);
      throw error;
    }
  };

  /**
   * 更新会话的 sessionId（后端会话ID）
   */
  const updateSessionId = async (chatId: string, sessionId: string) => {
    try {
      await chatDB.updateSession(chatId, { sessionId });

      if (currentSession.value?.id === chatId) {
        currentSession.value.sessionId = sessionId;
      }

      console.log("✅ 更新 sessionId 成功:", sessionId);
    } catch (error) {
      console.error("❌ 更新 sessionId 失败:", error);
    }
  };

  /**
   * 清空所有数据
   */
  const clearAllData = async () => {
    try {
      await chatDB.clearAll();
      sessions.value = [];
      currentSession.value = null;
      messages.value = [];
      console.log("✅ 清空所有数据成功");
    } catch (error) {
      console.error("❌ 清空数据失败:", error);
      throw error;
    }
  };

  /**
   * 获取数据库统计信息
   */
  const getStorageStats = async () => {
    try {
      return await chatDB.getStats();
    } catch (error) {
      console.error("❌ 获取统计信息失败:", error);
      return null;
    }
  };

  /**
   * 获取当前时间
   */
  const getCurrentTime = (): string => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  return {
    // 状态
    sessions,
    currentSession,
    messages,
    isLoading,

    // 方法
    initStorage,
    createSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
    saveMessage,
    saveMessages,
    updateSessionId,
    clearAllData,
    getStorageStats,
  };
}
