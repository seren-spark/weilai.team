<template>
  <div class="sidebar">
    <SidebarHeader />

    <!-- 新增对话按钮 -->
    <button class="new-chat-btn">
      <Icon icon="mdi:plus" />
      新增对话
    </button>

    <FeatureList :current-feature="currentFeature" :features="features" />

    <ChatHistory
      :chat-history="chatHistory"
      :current-chat-id="currentChatId"
      @switch="$emit('chat-switch', $event)"
    />
    <button @click="triggerReflection((isreflection = !isreflection))">
      反思机制 {{ isreflection }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import SidebarHeader from "./SidebarHeader.vue";
import FeatureList, { type Feature } from "./FeatureList.vue";
import ChatHistory from "./ChatHistory.vue";
import { ref } from "vue";
import type { ChatHistory as ChatHistoryType } from "@/composables/useAiChat";
const isreflection = ref(true);
const trigRefle = () => {
  isreflection.value = !isreflection;
  triggerReflection(isreflection.value);
};
defineProps<{
  currentFeature: string;
  features: Feature[];
  chatHistory: ChatHistoryType[];
  currentChatId: string | null;
  triggerReflection: boolean;
}>();
</script>

<style scoped lang="scss">
.sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .new-chat-btn {
    margin: 1rem;
    padding: 0.75rem 1rem;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s;

    &:hover {
      background: #0070dd;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }
  }
}
</style>
