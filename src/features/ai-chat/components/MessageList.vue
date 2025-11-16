<template>
  <div class="messages-container" ref="messagesContainer">
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon icon="mdi:robot-happy-outline" />
      </div>
      <p>开始新的对话吧!</p>
    </div>
    <MessageItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :user-initial="userInitial"
    />
    <!-- 反思状态显示 -->
    <Transition name="reflection-slide">
      <div v-if="reflectionStatus" class="reflection-status-container">
        <div class="reflection-status">
          <div class="status-header">
            <div class="spinner"></div>
            <div class="status-info">
              <div class="status-title">
                {{ getStatusTitle(reflectionStatus) }}
              </div>
              <div class="status-message">{{ reflectionMessage }}</div>
            </div>
          </div>

          <!-- 初始回答显示（流式） -->
          <div
            v-if="
              initialAnswerContent &&
              (reflectionStatus === 'thinking' ||
                reflectionStatus === 'initial_answer_streaming' ||
                reflectionStatus === 'initial_answer')
            "
            class="initial-answer-preview"
          >
            <h4>💭 初始回答</h4>
            <div
              class="initial-answer-content"
              v-html="renderMarkdown(initialAnswerContent)"
            ></div>
          </div>

          <!-- 反思链可视化 -->
          <div
            v-if="currentReflections && currentReflections.length > 0"
            class="reflection-chain"
          >
            <h4>🧠 思维链</h4>
            <TransitionGroup name="reflection-fade" tag="div">
              <div
                v-for="(ref, idx) in currentReflections"
                :key="`${idx}-${ref.dimension || 'unknown'}`"
                class="chain-item"
                :class="{
                  error: ref.error,
                  'just-added': isNewReflection(idx),
                }"
              >
                <div class="chain-dimension">
                  <span class="dimension-icon">✓</span>
                  {{ ref.dimension }}
                </div>
                <div
                  class="chain-reflection"
                  v-html="renderMarkdown(ref.reflection)"
                ></div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 加载中提示 -->
    <div v-if="isLoading && !reflectionStatus" class="message assistant">
      <div class="message-content load">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import MessageItem from "./MessageItem.vue";
import type { Message, ReflectionData } from "@/composables/useAiChat";
import { marked } from "marked";

const props = defineProps<{
  messages: Message[];
  isLoading: boolean;
  userInitial: string;
  reflectionStatus?: string;
  reflectionMessage?: string;
  currentReflections?: ReflectionData[];
  initialAnswerContent?: string;
}>();

// 记录上次的反思数量，用于动画效果
const previousReflectionCount = ref(0);

// 判断是否是新添加的反思
const isNewReflection = (index: number): boolean => {
  return index >= previousReflectionCount.value;
};

// 监听反思数量变化
watch(
  () => props.currentReflections?.length,
  (newCount) => {
    if (newCount !== undefined) {
      setTimeout(() => {
        previousReflectionCount.value = newCount;
      }, 500); // 动画延迟
    }
  },
);

// 监听反思状态变化（调试用）
watch(
  () => props.reflectionStatus,
  (newStatus, oldStatus) => {
    console.log("🔄 反思状态变化:", oldStatus, "→", newStatus);
  },
);

// 渲染 Markdown
const renderMarkdown = (text: string): string => {
  if (!text) return "";
  try {
    return marked.parse(text) as string;
  } catch (error) {
    console.error("Markdown 渲染错误:", error);
    return text;
  }
};

// 状态标题映射
const getStatusTitle = (status: string): string => {
  const statusMap: Record<string, string> = {
    thinking: "💭 生成初始回答",
    initial_answer: "📝 初始回答完成",
    reflecting: "🔍 多维度反思中",
    reflection_item: "💡 反思维度完成",
    reflections: "✨ 反思完成",
    improving: "🚀 优化回答中",
    improved_answer: "✅ 优化完成",
    streaming: "📤 输出回答",
  };
  console.log("当前状态", statusMap[status], status);
  return statusMap[status] || status;
};

const messagesContainer = ref<HTMLElement | null>(null);
// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 监听消息变化自动滚动
watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  },
);

watch(
  () => props.isLoading,
  async () => {
    await nextTick();
    scrollToBottom();
  },
);

defineExpose({
  scrollToBottom,
});
</script>

<style scoped lang="scss">
.load {
  background: none !important;
}
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: #ccc;
    }

    p {
      font-size: 1.1rem;
    }
  }

  .message {
    display: flex;
    gap: 1rem;

    &.assistant {
      justify-content: flex-start;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e6f7ff;
      color: #1890ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .message-content {
      max-width: 60%;
      padding: 0.75rem 1rem;
      background: #f0f0f0;
      color: #333;
      border-radius: 18px 18px 18px 4px;

      .typing-indicator {
        display: flex;
        gap: 0.25rem;
        padding: 0.5rem 0;

        span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #999;
          animation: typing 1.4s infinite;

          &:nth-child(2) {
            animation-delay: 0.2s;
          }

          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }
  }
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;

  &:hover {
    background: #bfbfbf;
  }
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

// 反思状态样式
.reflection-status-container {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reflection-status {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;

  .status-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1890ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      flex-shrink: 0;
    }

    .status-info {
      flex: 1;

      .status-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
        font-size: 0.95rem;
      }

      .status-message {
        font-size: 0.85rem;
        color: #666;
      }
    }
  }

  .initial-answer-preview {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;

    h4 {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      color: #333;
      font-weight: 600;
    }

    .initial-answer-content {
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 8px;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #555;
      animation: fadeIn 0.3s ease-out;

      // Markdown 样式
      :deep(p) {
        margin: 0.5em 0;
      }

      :deep(code) {
        background: rgba(0, 0, 0, 0.08);
        padding: 0.15em 0.3em;
        border-radius: 3px;
        font-size: 0.85em;
      }

      :deep(pre) {
        background: #282c34;
        padding: 0.75em;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.5em 0;

        code {
          background: none;
          padding: 0;
          color: #abb2bf;
        }
      }

      :deep(strong) {
        font-weight: 600;
        color: #333;
      }

      :deep(ul),
      :deep(ol) {
        margin: 0.5em 0;
        padding-left: 1.5em;
      }
    }
  }

  .reflection-chain {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;

    h4 {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      color: #333;
      font-weight: 600;
    }

    .chain-item {
      margin-bottom: 0.75rem;
      padding: 0.75rem;
      background: #f0f8ff;
      border-radius: 8px;
      border-left: 3px solid #1890ff;
      animation: slideIn 0.3s ease-out;
      transition: all 0.3s ease;

      &.just-added {
        animation: reflectionPop 0.5s ease-out;
        background: linear-gradient(90deg, #e6f7ff 0%, #f0f8ff 100%);
      }

      &.error {
        background: #fff0f0;
        border-left-color: #ff4444;

        .chain-dimension {
          color: #ff4444;

          .dimension-icon {
            background: #ff4444;
          }
        }
      }

      .chain-dimension {
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .dimension-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: #1890ff;
          color: white;
          border-radius: 50%;
          font-size: 0.7rem;
          flex-shrink: 0;
        }
      }

      .chain-reflection {
        font-size: 0.85rem;
        line-height: 1.5;
        color: #555;

        // Markdown 样式
        :deep(p) {
          margin: 0.3em 0;
        }

        :deep(code) {
          background: rgba(0, 0, 0, 0.08);
          padding: 0.15em 0.3em;
          border-radius: 3px;
          font-size: 0.85em;
        }

        :deep(pre) {
          background: #282c34;
          padding: 0.5em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0.3em 0;

          code {
            background: none;
            padding: 0;
            color: #abb2bf;
            font-size: 0.85em;
          }
        }

        :deep(strong) {
          font-weight: 600;
          color: #333;
        }

        :deep(ul),
        :deep(ol) {
          margin: 0.3em 0;
          padding-left: 1.5em;
        }
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes reflectionPop {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  50% {
    transform: translateY(-2px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Transition 动画
.reflection-fade-enter-active,
.reflection-fade-leave-active {
  transition: all 0.3s ease;
}

.reflection-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.reflection-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
