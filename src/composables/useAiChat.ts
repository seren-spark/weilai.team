import { ref } from "vue";
import apiClient from "@/api/axios";
import axios from "axios";
import { useChatStorage } from "@/composables/useChatStorage";
import { useLocalStorageWithExpire } from "./useLocalStorage";

// 🔧 Polyfill: 在不支持的浏览器中自动加载
if (typeof ReadableStream === "undefined") {
  // 动态导入 polyfill
  import("web-streams-polyfill/polyfill").then((polyfill) => {
    (globalThis as Record<string, unknown>).ReadableStream =
      polyfill.ReadableStream;
    console.log("✅ ReadableStream Polyfill 已加载");
  });
}
//  添加反思类型
export interface ReflectionData {
  dimension: string; // 维度
  reflection: string; // 反思
  error?: boolean; // 是否出错
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  metadata?: {
    reflectionUsed: boolean;
    initialAnswer: string; // 原始回答
    reflections: ReflectionData[]; // 反思数据
  };
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
}

// const AI_SERVICES = {
//   Qwen: {
//     name: "Qwen",
//     client: new OpenAI({
//       // 若没有配置环境变量，请将下行替换为：apiKey:"sk-xxx",
//       // 新加坡和北京地域的API Key不同。获取API Key：https://help.aliyun.com/zh/model-studio/get-api-key
//       apiKey: "sk-da6f76fe6f8e4bc2871be0c57ffa3201",
//       // 以下是北京地域base-url，如果使用新加坡地域的模型，需要将base_url替换为：https://dashscope-intl.aliyuncs.com/compatible-mode/v1
//       baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
//     }),
//   },
// };

export function useAiChat() {
  const messages = ref<Message[]>([]);
  const chatHistory = ref<ChatHistory[]>([]);
  const isLoading = ref(false);
  const currentChatId = ref<string>("");
  const isBusy = ref(false);
  const currentSessionId = ref<string>("");

  // 🔥 集成持久化存储
  const storage = useChatStorage();
  // 🔍 浏览器能力检测
  const capabilities = {
    streaming:
      typeof ReadableStream !== "undefined" && typeof fetch !== "undefined",
    xhr: typeof XMLHttpRequest !== "undefined",
    eventSource: typeof EventSource !== "undefined",
  };

  // 📊 记录降级信息
  if (!capabilities.streaming) {
    console.warn("⚠️ 浏览器不支持 Fetch Streaming，将使用降级方案");
    if (capabilities.xhr) {
      console.log("🔄 降级方案：XHR onprogress");
    } else {
      console.error("❌ 浏览器太老，无法支持流式传输");
    }
  }
  /**
   * 发送消息到AI
   */
  /**
   * 普通发送消息（非流式）
   */
  const sendMessage = async (content: string): Promise<Message | null> => {
    try {
      isLoading.value = true;
      isBusy.value = true;

      const requestData: any = {
        message: content,
        systemPrompt: "You are a helpful assistant.",
      };
      if (currentSessionId.value) {
        requestData.sessionId = currentSessionId.value;
      }
      // ✅ 调用自己的后端 API
      const response = await axios.post(
        "http://localhost:5005/api/tool-call/stream",
        requestData,
      );

      if (response.data.success && response.data.response) {
        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: response.data.response,
          time: getCurrentTime(),
        };

        return aiMessage;
      }

      return null;
    } catch (error) {
      console.error("发送消息失败:", error);
      return null;
    } finally {
      isLoading.value = false;
      isBusy.value = false;
    }
  };

  /**
   * 🔧 XHR 降级方案：用 XMLHttpRequest 读取 SSE 流
   */
  // const sendWithXHRPolyfill = async (
  //   content: string,
  //   onChunk: (chunk: string) => void,
  // ): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       isBusy.value = true;
  //       isLoading.value = true;

  //       const xhr = new XMLHttpRequest();
  //       let lastIndex = 0;
  //       let buffer = '';

  //       const requestData: Record<string, unknown> = {
  //         message: content,
  //         systemPrompt: "You are a helpful assistant.",
  //       };
  //       if (currentSessionId.value) {
  //         requestData.sessionId = currentSessionId.value;
  //       }

  //       xhr.open('POST', 'http://localhost:5005/tool_call/stream');
  //       xhr.setRequestHeader('Content-Type', 'application/json');

  //       // 🔥 关键：监听 progress 事件
  //       xhr.onprogress = () => {
  //         const newData = xhr.responseText.slice(lastIndex);
  //         lastIndex = xhr.responseText.length;

  //         if (newData) {
  //           buffer += newData;
  //           const lines = buffer.split('\n');
  //           buffer = lines.pop() || '';

  //           for (const line of lines) {
  //             if (line.startsWith('data: ')) {
  //               const data = line.slice(6).trim();

  //               if (data === '[DONE]') {
  //                 console.log('✅ SSE 流式传输完成 (XHR)');
  //                 resolve();
  //                 return;
  //               }

  //               try {
  //                 const parsed = JSON.parse(data);

  //                 if (parsed.type === 'done' && parsed.sessionId) {
  //                   console.log('✅ 获取到 sessionId:', parsed.sessionId);
  //                   currentSessionId.value = parsed.sessionId;
  //                   resolve();
  //                   return;
  //                 }

  //                 if (parsed.content) {
  //                   onChunk(parsed.content);
  //                 }
  //               } catch {
  //                 console.warn('Failed to parse SSE data:', data);
  //               }
  //             }
  //           }
  //         }
  //       };

  //       xhr.onload = () => {
  //         if (xhr.status >= 200 && xhr.status < 300) {
  //           if (buffer) {
  //             const lines = buffer.split('\n');
  //             for (const line of lines) {
  //               if (line.startsWith('data: ')) {
  //                 try {
  //                   const parsed = JSON.parse(line.slice(6).trim());
  //                   if (parsed.content) onChunk(parsed.content);
  //                   if (parsed.sessionId) currentSessionId.value = parsed.sessionId;
  //                 } catch {
  //                   // ignore
  //                 }
  //               }
  //             }
  //           }
  //           resolve();
  //         } else {
  //           reject(new Error(`HTTP error! status: ${xhr.status}`));
  //         }
  //       };

  //       xhr.onerror = () => {
  //         console.error('XHR 请求失败');
  //         reject(new Error('Network error'));
  //       };

  //       xhr.ontimeout = () => reject(new Error('Request timeout'));
  //       xhr.send(JSON.stringify(requestData));
  //     } catch (error) {
  //       console.error('XHR 流式发送失败:', error);
  //       reject(error);
  //     } finally {
  //       isLoading.value = false;
  //       isBusy.value = false;
  //     }
  //   });
  // };
  const sendWithXHRPolyfill = async (
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        isBusy.value = true;
        isLoading.value = true;

        const xhr = new XMLHttpRequest();
        let lastIndex = 0;
        let buffer = "";

        const requestData: Record<string, unknown> = {
          message: content,
          systemPrompt: "You are a helpful assistant.",
        };
        if (currentSessionId.value) {
          requestData.sessionId = currentSessionId.value;
        }

        // ✅ 修复1：使用正确的 URL
        xhr.open("POST", "http://localhost:5005/tool_call/stream", true);

        // ✅ 修复2：设置必要的请求头
        xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.setRequestHeader("Accept", "text/event-stream");
        // xhr.setRequestHeader("Cache-Control", "no-cache");

        // ✅ 修复3：关键！禁用缓冲
        xhr.responseType = ""; // 或 'text'，但不要用 'json'
        xhr.seenBytes = 0; // 自定义属性追踪已处理字节

        // 🔥 关键：监听 progress 事件
        xhr.onprogress = () => {
          const newData = xhr.responseText.slice(lastIndex);
          console.log(newData);
          lastIndex = xhr.responseText.length;

          if (newData) {
            buffer += newData;
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // 保留不完整的行

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();

                if (data === "[DONE]") {
                  console.log("✅ SSE 流式传输完成 (XHR)");
                  return;
                }

                try {
                  const parsed = JSON.parse(data);

                  if (parsed.type === "done" && parsed.sessionId) {
                    console.log("✅ 获取到 sessionId:", parsed.sessionId);
                    currentSessionId.value = parsed.sessionId;
                    return;
                  }

                  if (parsed.content) {
                    onChunk(parsed.content);
                  }
                } catch (e) {
                  console.warn("Failed to parse SSE data:", data, e);
                }
              }
            }
          }
        };

        // ✅ 修复4：readystatechange 作为备用（IE10+ 必需）
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 3) {
            // LOADING 状态
            // 触发 onprogress 相同的逻辑
            xhr.onprogress();
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // 处理剩余的 buffer
            if (buffer) {
              const lines = buffer.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  try {
                    const parsed = JSON.parse(line.slice(6).trim());
                    if (parsed.content) onChunk(parsed.content);
                    if (parsed.sessionId)
                      currentSessionId.value = parsed.sessionId;
                  } catch {
                    // ignore
                  }
                }
              }
            }
            resolve();
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error("XHR 请求失败");
          reject(new Error("Network error"));
        };

        xhr.ontimeout = () => reject(new Error("Request timeout"));

        // ✅ 设置超时时间（可选）
        xhr.timeout = 60000; // 60秒

        xhr.send(JSON.stringify(requestData));
      } catch (error) {
        console.error("XHR 流式发送失败:", error);
        reject(error);
      } finally {
        isLoading.value = false;
        isBusy.value = false;
      }
    });
  };
  /**
   * 🚀 Fetch Streaming 方案（现代浏览器）
   */
  const { getLocalStorageWithExpire } = useLocalStorageWithExpire();
  const sendWithFetchStreaming = async (
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> => {
    let rafBuffer = "";
    let rafTicking = false;
    let flushCount = 0;
    let totalCharsFlushed = 0;

    // 📊 性能监控
    const perfStart = performance.now();
    let chunkReceiveCount = 0; // 接收到的数据块数
    let renderCallCount = 0; // 实际 UI 渲染次数
    const frameTimes: number[] = []; // 记录每次渲染的时间

    const rafFlush = () => {
      if (!rafBuffer) return;
      const out = rafBuffer;

      rafBuffer = "";
      const frameStart = performance.now();
      onChunk(out); // 一次性把本帧累计的内容提交给 UI
      const frameEnd = performance.now();
      // 记录性能数据
      renderCallCount++;
      frameTimes.push(frameEnd - frameStart);
      flushCount++;
      totalCharsFlushed += out.length;
    };

    const rafSchedule = () => {
      if (rafTicking) return;
      rafTicking = true;
      const cb = () => {
        rafFlush();
        rafTicking = false;
        if (rafBuffer) rafSchedule(); // 若 flush 后仍有新内容，继续下一帧
      };
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(cb);
      } else {
        // 降级：老浏览器无 RAF，用 16ms 近似一帧
        setTimeout(cb, 16);
      }
    };

    try {
      isBusy.value = true;
      isLoading.value = true;
      // 构建请求数据，包含 sessionId（如果存在）
      const requestData: any = {
        message: content,
        systemPrompt: "You are a helpful assistant.",
      };
      // 如果有 sessionId，添加到请求中
      if (currentSessionId.value) {
        requestData.sessionId = currentSessionId.value;
      }
      const token = getLocalStorageWithExpire<string>("token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // 如果有 token，添加 Authorization header（和 apiClient 一致）
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      // ✅ 调用后端 SSE 流式接口
      const response = await fetch("http://localhost:5005/tool_call/stream", {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // rafFlush(); // 确保最后的内容被提交
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            // {"content":"Hello"}
            console.log(data, "data");

            if (data === "[DONE]") {
              rafFlush(); // 确保最后的内容被提交
              console.log("✅ SSE 流式传输完成");
              return;
            }

            try {
              const parsed = JSON.parse(data);

              // 检查是否是完成消息，包含 sessionId
              if (parsed.type === "done" && parsed.sessionId) {
                rafFlush(); // 确保最后的内容被提交

                // 📊 性能报告
                const perfEnd = performance.now();
                const totalTime = perfEnd - perfStart;
                const avgFrameTime =
                  frameTimes.length > 0
                    ? (
                        frameTimes.reduce((a, b) => a + b, 0) /
                        frameTimes.length
                      ).toFixed(2)
                    : 0;
                const compressionRatio =
                  chunkReceiveCount > 0
                    ? ((1 - renderCallCount / chunkReceiveCount) * 100).toFixed(
                        1,
                      )
                    : "0";

                console.group("🚀 RAF 渲染性能报告");
                console.log("📊 总耗时:", totalTime.toFixed(2), "ms");
                console.log("📦 接收数据块:", chunkReceiveCount, "次");
                console.log("🎨 UI 渲染次数:", renderCallCount, "次");
                console.log(
                  "⚙️ 渲染压缩比:",
                  compressionRatio,
                  "%",
                  `(减少了 ${chunkReceiveCount - renderCallCount} 次渲染)`,
                );
                console.log("⏱️ 平均渲染时间:", avgFrameTime, "ms/帧");
                console.log("📝 总字符数:", totalCharsFlushed);
                console.groupEnd();

                console.log("✅ 获取到 sessionId:", parsed.sessionId);
                currentSessionId.value = parsed.sessionId;
                return;
              }

              // 直接调用（未优化）
              // if (parsed.content) {
              //   chunkReceiveCount++;
              //   onChunk(parsed.content);
              //   renderCallCount++;
              // }

              // ✅ RAF 批处理优化
              if (parsed.content) {
                chunkReceiveCount++; // 统计接收数据块
                rafBuffer += parsed.content; // 累进到缓冲区
                rafSchedule(); // 安排本帧提交
              }
            } catch {
              console.warn("Failed to parse SSE data:", data);
            }
          }
        }
      }
    } catch (error) {
      rafFlush(); // 错误时也要 flush
      console.error("流式发送失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
      isBusy.value = false;
    }
  };

  /**
   * 🎯 主入口：自动选择最佳方案
   */
  const sendMessageStream = async (
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> => {
    // 🔍 第一优先：Fetch Streaming（最现代）
    if (capabilities.streaming) {
      console.log("✅ 使用 Fetch Streaming");
      return sendWithFetchStreaming(content, onChunk);
    }

    // 🔧 第二优先：XHR Polyfill（兼容 IE10+）
    if (capabilities.xhr) {
      console.log("🔄 使用 XHR Polyfill 降级方案");
      return sendWithXHRPolyfill(content, onChunk);
    }

    // ❌ 浏览器太老，无法支持
    throw new Error("浏览器不支持流式传输，请升级浏览器");
  };

  /**
   * 创建新对话
   */
  // const createNewChat = async (
  //   title: string = "新对话",
  // ): Promise<string | null> => {
  //   try {
  //     const response = await apiClient.request({
  //       url: "/ai/chat/create",
  //       method: "post",
  //       data: { title },
  //     });

  //     if (response.success && response.data) {
  //       const chatId = response.data.chatId || response.data.id;

  //       const newChat: ChatHistory = {
  //         id: chatId,
  //         title: title,
  //         lastMessage: "",
  //         updatedAt: new Date().toISOString(),
  //       };

  //       chatHistory.value.unshift(newChat);
  //       currentChatId.value = chatId;
  //       // 重置 sessionId
  //       currentSessionId.value = "";
  //       return chatId;
  //     }

  //     return null;
  //   } catch (error) {
  //     console.error("创建对话失败:", error);
  //     // 本地创建
  //     const chatId = `chat-${Date.now()}`;
  //     const newChat: ChatHistory = {
  //       id: chatId,
  //       title: title,
  //       lastMessage: "",
  //       updatedAt: new Date().toISOString(),
  //     };
  //     // 在历史记录开头添加新聊天
  //     chatHistory.value.unshift(newChat);
  //     currentChatId.value = chatId;
  //     // 重置 sessionId
  //     currentSessionId.value = "";
  //     return chatId;
  //   }
  // };

  /**
   * 加载聊天历史
   */
  const loadChatHistory = async () => {
    try {
      const response = await apiClient.request({
        url: "/ai/chat/history",
        method: "get",
      });

      if (response.success && response.data) {
        chatHistory.value =
          response.data.records || response.data.list || response.data;
      }
    } catch (error) {
      console.error("加载历史记录失败:", error);
      // 使用本地模拟数据
      chatHistory.value = [
        {
          id: "chat-1",
          title: "关于历史对话的讨论",
          lastMessage: "抱歉，我无法回答与编程无关的问题...",
          updatedAt: "2024-01-15",
        },
        {
          id: "chat-2",
          title: "关于历史对话的询问",
          lastMessage: "关于历史对话的功能...",
          updatedAt: "2024-01-14",
        },
        {
          id: "chat-3",
          title: "关于历史对话的探讨",
          lastMessage: "让我们讨论一下...",
          updatedAt: "2024-01-13",
        },
        {
          id: "chat-4",
          title: "图片处理",
          lastMessage: "关于图片处理的问题...",
          updatedAt: "2024-01-12",
        },
      ];
    }
  };

  /**
   * 加载对话消息
   */
  const loadChatMessages = async (chatId: string) => {
    try {
      const response = await apiClient.request({
        url: `/ai/chat/${chatId}/messages`,
        method: "get",
      });

      if (response.success && response.data) {
        messages.value =
          response.data.records || response.data.list || response.data;
      } else {
        messages.value = [];
      }
    } catch (error) {
      console.error("加载消息失败:", error);
      messages.value = [];
    }
  };

  /**
   * 删除对话
   */
  const deleteChat = async (chatId: string) => {
    try {
      await apiClient.request({
        url: `/ai/chat/${chatId}`,
        method: "delete",
      });

      chatHistory.value = chatHistory.value.filter(
        (chat) => chat.id !== chatId,
      );

      if (currentChatId.value === chatId) {
        currentChatId.value = chatHistory.value[0]?.id || "";
        if (currentChatId.value) {
          await loadChatMessages(currentChatId.value);
        } else {
          messages.value = [];
        }
      }
    } catch (error) {
      console.error("删除对话失败:", error);
    }
  };

  /**
   * 更新对话标题
   */
  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      await apiClient.request({
        url: `/ai/chat/${chatId}`,
        method: "put",
        data: { title },
      });

      const chat = chatHistory.value.find((c) => c.id === chatId);
      if (chat) {
        chat.title = title;
      }
    } catch (error) {
      console.error("更新标题失败:", error);
    }
  };

  /**
   * 获取当前时间
   */
  const getCurrentTime = (): string => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  /**
   * 💾 持久化存储相关方法
   */

  // 初始化存储（从 IndexedDB 加载历史）
  const initChatStorage = async () => {
    await storage.initStorage();
    // 将 IndexedDB 的会话同步到 chatHistory
    chatHistory.value = storage.sessions.value.map((session) => ({
      id: session.id,
      title: session.title,
      lastMessage: "",
      updatedAt: new Date(session.updatedAt).toISOString(),
    }));
  };

  // 创建新会话（持久化版本）
  const createNewChatPersisted = async (title: string = "新对话") => {
    const session = await storage.createSession(title);
    currentChatId.value = session.id;
    currentSessionId.value = "";
    messages.value = [];

    // 同步到 chatHistory
    chatHistory.value.unshift({
      id: session.id,
      title: session.title,
      lastMessage: "",
      updatedAt: new Date(session.updatedAt).toISOString(),
    });

    return session.id;
  };

  // 加载会话消息（持久化版本）
  const loadChatMessagesPersisted = async (chatId: string) => {
    await storage.switchSession(chatId);
    currentChatId.value = chatId;

    // 将 IndexedDB 的消息转换为 Message 格式
    messages.value = storage.messages.value.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      time: msg.time,
    }));

    // 恢复 sessionId
    const session = await storage.currentSession.value;
    if (session?.sessionId) {
      currentSessionId.value = session.sessionId;
    }
  };

  // 保存用户消息
  const saveUserMessage = async (content: string) => {
    if (!currentChatId.value) {
      // 如果没有当前会话，创建一个
      await createNewChatPersisted();
    }

    const time = getCurrentTime();
    await storage.saveMessage(currentChatId.value, "user", content, time);

    // 同步到 messages
    messages.value.push({
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      time,
    });
  };

  // 保存 AI 消息
  const saveAssistantMessage = async (content: string) => {
    if (!currentChatId.value) return;

    const time = getCurrentTime();
    await storage.saveMessage(currentChatId.value, "assistant", content, time);
  };

  // 更新会话的 sessionId
  const updateStoredSessionId = async (sessionId: string) => {
    if (currentChatId.value) {
      await storage.updateSessionId(currentChatId.value, sessionId);
    }
  };

  return {
    messages,
    chatHistory,
    isLoading,
    currentChatId,
    isBusy,
    currentSessionId, // 导出 sessionId 供外部使用
    sendMessage,
    sendMessageStream, // ✅ 导出流式方法
    // createNewChat,
    loadChatHistory,
    loadChatMessages,
    deleteChat,
    updateChatTitle,

    // 🔥 持久化存储方法
    storage,
    initChatStorage,
    createNewChatPersisted,
    loadChatMessagesPersisted,
    saveUserMessage,
    saveAssistantMessage,
    updateStoredSessionId,
  };
}
