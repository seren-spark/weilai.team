<template>
  <div class="ai-chat-container">
    <ChatSidebar
      :current-feature="currentFeature"
      :features="features"
      :chat-history="chatHistory"
      :current-chat-id="currentChatId"
    />

    <ChatMain
      ref="chatMainRef"
      :greeting="greeting"
      :messages="messages"
      :is-loading="isLoading"
      :user-initial="userInitial"
      :disabled="isBusy"
      :reflection-status="reflectionStatus"
      :reflection-message="reflectionMessage"
      :current-reflections="currentReflections"
      :initial-answer-content="initialAnswerContent"
      @send="handleSendMessage"
      @voice="toggleVoice"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  watch,
  reactive,
  onMounted,
  type Reactive,
} from "vue";
import {
  useAiChat,
  type Message,
  type ReflectionData,
} from "@/composables/useAiChat";
import ChatSidebar from "./components/ChatSidebar.vue";
import ChatMain from "./components/ChatMain.vue";
import type { Feature } from "./components/FeatureList.vue";

// 使用AI聊天composable
const {
  messages,
  chatHistory,
  isLoading,
  currentChatId,
  isBusy,
  currentSessionId,
  // sendMessage, // 不使用普通方式，使用流式
  sendMessageStream, // ✅ 导入流式方法

  // 🔥 持久化存储方法
  initChatStorage,
  createNewChatPersisted,
  loadChatMessagesPersisted,
  saveUserMessage,
  saveAssistantMessage,
  updateStoredSessionId,
} = useAiChat();

// 状态管理
const currentFeature = ref("search");
const chatMainRef = ref<InstanceType<typeof ChatMain> | null>(null);

// 反思功能状态
const useReflection = ref(true); // 是否启用反思功能
const reflectionStatus = ref<string>(""); // 当前反思状态
const reflectionMessage = ref<string>(""); // 反思状态消息
const currentReflections = ref<ReflectionData[]>([]); // 当前反思结果
const initialAnswerContent = ref<string>(""); // 初始回答内容（流式显示）

// 用户信息
const userInitial = computed(() => "侯".charAt(0));
const greeting = computed(() => "晚上好，侯博然");

// 功能列表配置
const features = ref<Feature[]>([
  { id: "search", label: "AI 搜索", icon: "mdi:magnify" },
  { id: "write", label: "帮我写作", icon: "mdi:pencil" },
  { id: "program", label: "AI 编程", icon: "mdi:code-tags" },
  { id: "image", label: "图像生成", icon: "mdi:image" },
  { id: "more", label: "更多", icon: "mdi:dots-horizontal" },
]);

// 切换语音
const toggleVoice = () => {
  console.log("Toggle voice input");
};

// 🔥 反思功能：流式接收反思回答
const handleReflectionMessage = async (message: string) => {
  if (isBusy.value) return;

  try {
    // 步骤1：保存用户消息
    await saveUserMessage(message);
    console.log("✅ 用户消息已保存到本地");

    await nextTick();
    chatMainRef.value?.scrollToBottom();

    // 创建 AI 消息占位
    const aiMessage: Reactive<Message> = reactive({
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: "",
      time: getCurrentTime(),
    });

    messages.value.push(aiMessage);
    isBusy.value = true;
    isLoading.value = true;

    // 步骤2：流式接收反思响应
    const response = await fetch("http://localhost:5005/reflection/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        model: "qwen-plus",
        sessionId: currentSessionId.value || null,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("无法读取响应流");

    let fullResponse = "";
    let reflectionMetadata: any = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));

            console.log("📨 收到事件:", data.type, data.status || "");
            
            switch (data.type) {
              case "status":
                reflectionStatus.value = data.status;
                reflectionMessage.value = data.data?.message || "";

                // 🔥 流式接收初始回答
                if (data.status === "initial_answer_streaming") {
                  initialAnswerContent.value = data.data.answer;
                }

                // 保存初始回答
                if (data.status === "initial_answer") {
                  initialAnswerContent.value = data.data.answer;
                  reflectionMetadata = {
                    initialAnswer: data.data.answer,
                  };
                }

                // 🔥 流式接收单个反思维度
                if (data.status === "reflection_item") {
                  const { reflection, index, total } = data.data;
                  
                  // 动态更新反思数组
                  if (!currentReflections.value[index]) {
                    currentReflections.value[index] = reflection;
                  } else {
                    currentReflections.value[index] = reflection;
                  }
                  
                  // 触发响应式更新
                  currentReflections.value = [...currentReflections.value];
                  
                  // 更新状态消息
                  reflectionMessage.value = `完成 ${index + 1}/${total} 个维度：${reflection.dimension}`;
                }

                // 所有反思完成
                if (data.status === "reflections") {
                  currentReflections.value = data.data.reflections;
                  if (reflectionMetadata) {
                    reflectionMetadata.reflections = data.data.reflections;
                  }
                }
                break;

              case "token":
                fullResponse += data.content;
                aiMessage.content = fullResponse;
                nextTick(() => {
                  chatMainRef.value?.scrollToBottom();
                });
                break;

              case "done":
                console.log("✅ 收到 done 事件，开始清理状态");
                
                // 添加反思元数据
                if (data.result.reflectionUsed && reflectionMetadata) {
                  aiMessage.metadata = {
                    reflectionUsed: true,
                    ...reflectionMetadata,
                  };
                }

                // 保存到 IndexedDB
                await saveAssistantMessage(fullResponse);
                console.log("✅ 反思消息已保存到本地");

                // 保存 sessionId
                if (data.result.sessionId) {
                  currentSessionId.value = data.result.sessionId;
                  await updateStoredSessionId(data.result.sessionId);
                }

                // 清除所有状态
                console.log("🧹 清除反思状态...");
                isLoading.value = false;
                isBusy.value = false;
                reflectionStatus.value = "";
                reflectionMessage.value = "";
                currentReflections.value = [];
                initialAnswerContent.value = "";
                console.log("✅ 状态已清除", {
                  reflectionStatus: reflectionStatus.value,
                  reflectionMessage: reflectionMessage.value,
                });
                break;

              case "error":
                console.error("反思错误:", data.message);
                isLoading.value = false;
                isBusy.value = false;
                reflectionStatus.value = "";
                reflectionMessage.value = "";
                currentReflections.value = [];
                break;
            }
          } catch (e) {
            console.error("解析数据错误:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("反思消息失败:", error);
    isLoading.value = false;
    isBusy.value = false;
    reflectionStatus.value = "";
    reflectionMessage.value = "";
    currentReflections.value = [];

    const errorMsg: Message = {
      id: `msg-${Date.now()}-error`,
      role: "assistant",
      content: "抱歉，发生了错误，请稍后再试。",
      time: getCurrentTime(),
    };
    messages.value.push(errorMsg);
  }

  await nextTick();
  chatMainRef.value?.scrollToBottom();
};

// 🔥 使用 SSE 流式发送消息 + 持久化存储
const handleSendMessage = async (message: string) => {
  // 根据是否启用反思功能选择不同的处理方式
  if (useReflection.value) {
    await handleReflectionMessage(message);
  } else {
    // 原有的普通流式处理
    if (isBusy.value) return;

    try {
      // 🔥 步骤1：保存用户消息到 IndexedDB
      await saveUserMessage(message);
      console.log("✅ 用户消息已保存到本地");

      // 滚动到底部
      await nextTick();
      chatMainRef.value?.scrollToBottom();

      // 创建 AI 消息占位
      const aiMessage: Reactive<Message> = reactive({
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: "",
        time: getCurrentTime(),
      });

      messages.value.push(aiMessage);

      // 🔥 步骤2：流式接收 AI 响应
      let fullResponse = "";
      await sendMessageStream(message, (chunk) => {
        fullResponse += chunk;
        console.log(fullResponse, "fullResponse");
        aiMessage.content = fullResponse;

        // 实时滚动到底部
        nextTick(() => {
          chatMainRef.value?.scrollToBottom();
        });
      });

      // 🔥 步骤3：保存完整的 AI 消息到 IndexedDB
      await saveAssistantMessage(fullResponse);
      console.log("✅ AI 消息已保存到本地");

      // 🔥 步骤4：保存 sessionId（用于上下文管理）
      if (currentSessionId.value) {
        await updateStoredSessionId(currentSessionId.value);
        console.log("✅ SessionId 已保存:", currentSessionId.value);
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      // 错误提示
      const errorMsg: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "抱歉，发生了错误，请稍后再试。",
        time: getCurrentTime(),
      };
      messages.value.push(errorMsg);
    }

    await nextTick();
    chatMainRef.value?.scrollToBottom();
  }
};

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
};

// 监听当前聊天ID变化（使用持久化版本）
watch(currentChatId, async (newChatId) => {
  if (newChatId) {
    // 🔥 使用持久化版本加载消息
    await loadChatMessagesPersisted(newChatId);
    await nextTick();
    chatMainRef.value?.scrollToBottom();
  }
});

// 🔥 初始化：从 IndexedDB 加载历史
onMounted(async () => {
  console.log("🚀 初始化 AI 聊天...");

  // 🔥 步骤1：从 IndexedDB 加载所有会话
  await initChatStorage();
  console.log("✅ 已加载", chatHistory.value.length, "个历史会话");

  // 🔥 步骤2：如果有历史记录，加载第一个对话的消息
  if (chatHistory.value.length > 0) {
    const firstChatId = chatHistory.value[0].id;
    await loadChatMessagesPersisted(firstChatId);
    console.log("✅ 已加载会话消息:", messages.value.length, "条");
  } else {
    // 🔥 步骤3：如果没有历史记录，创建一个新对话
    console.log("📝 创建新会话...");
    await createNewChatPersisted("新对话");
  }

  // 滚动到底部
  await nextTick();
  chatMainRef.value?.scrollToBottom();

  console.log("✅ AI 聊天初始化完成");
});
</script>

<style scoped lang="scss">
.ai-chat-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}
</style>
