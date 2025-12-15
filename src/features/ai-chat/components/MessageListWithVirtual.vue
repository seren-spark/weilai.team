<template>
  <VirtualMessageList
    :items="messages"
    :estimated-item-height="150"
    :container-height="600"
    :buffer-size="5"
    :is-loading="isLoading"
    :reflection-status="reflectionStatus"
    :reflection-message="reflectionMessage"
    :current-reflections="currentReflections"
    :initial-answer-content="initialAnswerContent"
    ref="virtualListRef"
  >
    <template #default="{ item }">
      <MessageItem :message="item" :user-initial="userInitial" />
    </template>
  </VirtualMessageList>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VirtualMessageList from "./VirtualMessageList.vue";
import MessageItem from "./MessageItem.vue";
import type { Message, ReflectionData } from "@/composables/useAiChat";

const props = defineProps<{
  messages: Message[];
  isLoading: boolean;
  userInitial: string;
  reflectionStatus?: string;
  reflectionMessage?: string;
  currentReflections?: ReflectionData[];
  initialAnswerContent?: string;
}>();

const virtualListRef = ref<InstanceType<typeof VirtualMessageList> | null>(
  null,
);

const scrollToBottom = () => {
  virtualListRef.value?.scrollToBottom();
};

const smartScrollToBottom = () => {
  virtualListRef.value?.smartScrollToBottom();
};

defineExpose({
  scrollToBottom,
  smartScrollToBottom,
});
</script>
