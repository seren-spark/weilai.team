<template>
  <div class="chat-main">
    <ChatHeader :greeting="greeting" />

    <MessageList
      ref="messageListRef"
      :messages="messages"
      :is-loading="isLoading"
      :user-initial="userInitial"
      :reflection-status="reflectionStatus"
      :reflection-message="reflectionMessage"
      :current-reflections="currentReflections"
      :initial-answer-content="initialAnswerContent"
    />

    <ChatInput
      v-model="inputMessage"
      :disabled="disabled"
      :is-reflection-running="isReflectionRunning"
      @send="$emit('send', $event)"
      @voice="$emit('voice')"
      @abort-reflection="$emit('abortReflection')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChatHeader from "./ChatHeader.vue";
import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import type { Message, ReflectionData } from "@/composables/useAiChat";

defineProps<{
  greeting: string;
  messages: Message[];
  isLoading: boolean;
  userInitial: string;
  disabled: boolean;
  reflectionStatus?: string;
  reflectionMessage?: string;
  currentReflections?: ReflectionData[];
  initialAnswerContent?: string;
  isReflectionRunning?: boolean; // 🎯 新增：反思是否正在运行
}>();

defineEmits<{
  send: [message: string];
  voice: [];
  abortReflection: []; // 🎯 新增：中断反思事件
}>();

const inputMessage = ref("");
const messageListRef = ref<InstanceType<typeof MessageList> | null>(null);

const scrollToBottom = () => {
  messageListRef.value?.scrollToBottom();
};

defineExpose({
  scrollToBottom,
});
</script>

<style scoped lang="scss">
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
