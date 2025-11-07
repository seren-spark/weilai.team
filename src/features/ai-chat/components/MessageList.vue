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
    <!-- 加载中提示 -->
    <div v-if="isLoading" class="message assistant">
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
import type { Message } from "@/composables/useAiChat";
const props = defineProps<{
  messages: Message[];
  isLoading: boolean;
  userInitial: string;
}>();

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
</style>
