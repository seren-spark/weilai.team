<template>
  <div class="message" :class="message.role">
    <div v-if="message.role === 'assistant'" class="message-avatar">
      <Icon icon="mdi:robot" />
    </div>
    <div class="message-content">
      <div class="message-text typing">{{ message.content }}</div>
      <div class="message-time">{{ message.time }}</div>
    </div>
    <div v-if="message.role === 'user'" class="message-avatar user">
      {{ userInitial }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Message } from "@/composables/useAiChat";

defineProps<{
  message: Message;
  userInitial: string;
}>();
</script>

<style scoped lang="scss">
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.message {
  display: flex;
  gap: 1rem;
  animation: fadeIn 0.3s ease-in;

  &.user {
    justify-content: flex-end;

    .message-content {
      background: #1890ff;
      color: white;
      border-radius: 18px 18px 4px 18px;
    }

    .message-time {
      text-align: right;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  &.assistant {
    justify-content: flex-start;

    .message-content {
      background: #f0f0f0;
      color: #333;
      border-radius: 18px 18px 18px 4px;
    }

    .message-time {
      color: #999;
    }
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

    &.user {
      background: #1890ff;
      color: white;
      font-size: 1rem;
      font-weight: 500;
    }
  }

  .message-content {
    max-width: 60%;
    padding: 0.75rem 1rem;

    .message-text {
      line-height: 1.6;
      word-wrap: break-word;
      // &.typing {

      //   &::after {
      //     content: "|";
      //     animation: blink 0.7s infinite;
      //   }
      // }
    }

    .message-time {
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
