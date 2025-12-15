<template>
  <div class="chat-main">
    <ChatHeader :greeting="greeting" />

    <VirtualMessageList
      ref="messageListRef"
      :items="messages"
      :is-loading="isLoading"
      :reflection-status="reflectionStatus"
      :reflection-message="reflectionMessage"
      :current-reflections="currentReflections"
      :initial-answer-content="initialAnswerContent"
    >
      <template #default="{ item }">
        <MessageItem
          :message="item"
          :user-initial="userInitial"
          :is-loading="isLoading"
          :reflection-status="reflectionStatus"
          :reflection-message="reflectionMessage"
          :is-latest="messages[messages.length - 1]?.id === item.id"
          @edit-submit="$emit('editSubmit', $event)"
        />
      </template>
    </VirtualMessageList>

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
import VirtualMessageList from "./VirtualMessageList.vue";
import MessageItem from "./MessageItem.vue";
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
  abortReflection: [];
  editSubmit: [payload: { id: string; content: string }];
}>();

const inputMessage = ref("");
const messageListRef = ref<InstanceType<typeof VirtualMessageList> | null>(
  null,
);

const scrollToBottom = () => {
  messageListRef.value?.scrollToBottom();
};

defineExpose({
  scrollToBottom,
  messageListRef, // 暴露内部引用
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
