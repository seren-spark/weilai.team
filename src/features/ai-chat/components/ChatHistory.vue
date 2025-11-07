<template>
  <div class="history-section">
    <div class="history-header">历史对话</div>
    <div class="history-list">
      <div
        v-for="chat in chatHistory"
        :key="chat.id"
        class="history-item"
        :class="{ active: currentChatId === chat.id }"
        @click="$emit('switch', chat.id)"
      >
        <Icon icon="mdi:message-text-outline" class="history-icon" />
        <span class="history-title">{{ chat.title }}</span>
        <button class="history-more" @click.stop="$emit('menu', chat.id)">
          <Icon icon="mdi:dots-horizontal" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { ChatHistory } from "@/composables/useAiChat";

defineProps<{
  chatHistory: ChatHistory[];
  currentChatId: string | null;
}>();

defineEmits<{
  switch: [chatId: string];
  menu: [chatId: string];
}>();
</script>

<style scoped lang="scss">
.history-section {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .history-header {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #999;
    font-weight: 500;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem;

    .history-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.25rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;

      &:hover {
        background: #f0f0f0;

        .history-more {
          opacity: 1;
        }
      }

      &.active {
        background: #e6f7ff;
        color: #1890ff;
      }

      .history-icon {
        font-size: 1.2rem;
        color: #999;
      }

      .history-title {
        flex: 1;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .history-more {
        opacity: 0;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        color: #666;
        transition: opacity 0.2s;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;

  &:hover {
    background: #bfbfbf;
  }
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
