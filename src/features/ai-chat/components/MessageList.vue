<template>
  <div
    class="messages-container"
    ref="messagesContainer"
    @scroll="handleScrollEnhanced"
  >
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon icon="mdi:robot-happy-outline" />
      </div>
      <p>开始新的对话吧!</p>
    </div>

    <!-- 虚拟滚动：顶部占位空间 -->
    <div
      v-if="virtualizationEnabled"
      class="message-spacer"
      :style="{ height: `${topSpacerHeight}px` }"
      aria-hidden="true"
    />

    <!-- 渲染可见消息 -->
    <template v-for="item in visibleMessages" :key="item.message.id">
      <div
        :ref="
          (el) => setMessageSlotElement(item.index, el as HTMLElement | null)
        "
        class="message-slot"
        :data-message-index="item.index"
      >
        <div
          :ref="
            (el) => setMessageContentRef(item.index, el as HTMLElement | null)
          "
          class="message-content-wrapper"
        >
          <MessageItem :message="item.message" :user-initial="userInitial" />
        </div>
      </div>
    </template>

    <!-- 虚拟滚动：底部占位空间 -->
    <div
      v-if="virtualizationEnabled"
      class="message-spacer"
      :style="{ height: `${bottomSpacerHeight}px` }"
      aria-hidden="true"
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
import { ref, watch, nextTick, computed, reactive, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";
import MessageItem from "./MessageItem.vue";
import type { Message, ReflectionData } from "@/composables/useAiChat";
import { renderMarkdown } from "@/utils/markdown";

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

// 使用统一的 markdown 渲染器（已从 @/utils/markdown 导入）

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

// ============= 虚拟滚动配置 =============
const MAX_LIVE_MESSAGES = 50; // 最大同时渲染的消息数
const LIVE_MESSAGE_BUFFER = 10; // 视口前后缓冲区大小
const virtualizationEnabled = computed(
  () => props.messages.length > MAX_LIVE_MESSAGES,
);

// ============= 用户滚动状态 =============
const isUserScrolling = ref(false); // 用户是否手动滚动
const scrollThreshold = 50; // 距离底部的阈值（像素）

// ============= 虚拟化核心状态 =============
const focusIndex = ref(0); // 当前视口中心的消息索引
const liveRange = reactive({ start: 0, end: 0 }); // 当前活跃渲染范围
const messageHeights = reactive<Record<number, number>>({}); // 消息高度记录
const heightStats = reactive({ total: 0, count: 0 }); // 高度统计
const messageSlotElements = new Map<number, HTMLElement | null>(); // 消息槽位元素
const messageContentElements = new Map<number, HTMLElement | null>(); // 消息内容元素

// ============= 滚动监听 =============
let scrollListenerActive = false;
let pendingScrollSync: number | null = null;
// 检测用户是否在底部
const isNearBottom = (): boolean => {
  if (!messagesContainer.value) return true;

  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

  return distanceFromBottom <= scrollThreshold;
};
// 监听滚动事件
const handleScroll = () => {
  if (!messagesContainer.value) return;

  // 如果用户向上滚动（不在底部），标记为手动滚动
  isUserScrolling.value = !isNearBottom();
};

// 智能滚动：只在用户位于底部时才自动滚动
const smartScrollToBottom = () => {
  if (!isUserScrolling.value || isNearBottom()) {
    scrollToBottom();
    isUserScrolling.value = false; // 重置标记
  }
};

// ============= 虚拟滚动核心函数 =============

// 工具函数：限制数值范围
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// 记录消息高度
function recordMessageHeight(index: number, height: number) {
  if (!Number.isFinite(height) || height <= 0) return;

  const previous = messageHeights[index];
  messageHeights[index] = height;

  if (previous) {
    heightStats.total += height - previous;
  } else {
    heightStats.total += height;
    heightStats.count++;
  }
}

// 计算平均消息高度
const averageMessageHeight = computed(() => {
  return heightStats.count > 0
    ? Math.max(60, heightStats.total / heightStats.count)
    : 120;
});

// 估算指定范围的总高度
function estimateHeightRange(start: number, end: number) {
  if (start >= end) return 0;
  let total = 0;
  for (let i = start; i < end; i++) {
    total += messageHeights[i] ?? averageMessageHeight.value;
  }
  return total;
}

// 根据偏移量估算消息索引
function estimateIndexForOffset(offsetPx: number) {
  if (offsetPx <= 0) return 0;
  let remaining = offsetPx;
  const messages = props.messages;
  for (let i = 0; i < messages.length; i++) {
    const height = messageHeights[i] ?? averageMessageHeight.value;
    if (remaining <= height) return i;
    remaining -= height;
  }
  return Math.max(0, messages.length - 1);
}

// 更新活跃渲染范围
function updateLiveRange() {
  const total = props.messages.length;
  if (!virtualizationEnabled.value || total === 0) {
    liveRange.start = 0;
    liveRange.end = total;
    return;
  }

  const windowSize = Math.min(MAX_LIVE_MESSAGES, total);
  const buffer = LIVE_MESSAGE_BUFFER;
  const desiredStart = clamp(
    focusIndex.value - buffer,
    0,
    Math.max(0, total - windowSize),
  );

  liveRange.start = desiredStart;
  liveRange.end = Math.min(total, desiredStart + windowSize);
}

// 同步焦点到滚动位置
function syncFocusToScroll() {
  if (!virtualizationEnabled.value || !messagesContainer.value) return;

  const container = messagesContainer.value;
  const scrollTop = container.scrollTop;
  const viewportHeight = container.clientHeight;
  const targetOffset = scrollTop + viewportHeight * 0.5;

  const estimated = estimateIndexForOffset(targetOffset);
  focusIndex.value = clamp(
    estimated,
    0,
    Math.max(0, props.messages.length - 1),
  );
}

// 调度滚动同步（使用 RAF 优化）
function scheduleScrollSync() {
  if (!virtualizationEnabled.value) return;
  if (pendingScrollSync !== null) return;

  pendingScrollSync = requestAnimationFrame(() => {
    pendingScrollSync = null;
    syncFocusToScroll();
  });
}

// 监听滚动事件（增强版）
const handleScrollEnhanced = () => {
  handleScroll(); // 原有的用户滚动检测
  if (virtualizationEnabled.value) {
    scheduleScrollSync(); // 虚拟滚动同步
  }
};

// 设置消息槽位元素引用
function setMessageSlotElement(index: number, el: HTMLElement | null) {
  if (el) {
    messageSlotElements.set(index, el);
  } else {
    messageSlotElements.delete(index);
  }
}

// 设置消息内容元素引用并测量高度
function setMessageContentRef(index: number, el: HTMLElement | null) {
  if (!el) {
    messageContentElements.delete(index);
    return;
  }

  messageContentElements.set(index, el);

  // 使用 microtask 延迟测量，确保 DOM 渲染完成
  queueMicrotask(() => {
    if (el.offsetHeight > 0) {
      recordMessageHeight(index, el.offsetHeight);
    }
  });
}

// 计算可见消息列表
const visibleMessages = computed(() => {
  if (!virtualizationEnabled.value) {
    return props.messages.map((msg, index) => ({ message: msg, index }));
  }

  const total = props.messages.length;
  const start = clamp(liveRange.start, 0, total);
  const end = clamp(liveRange.end, start, total);

  return props.messages.slice(start, end).map((msg, idx) => ({
    message: msg,
    index: start + idx,
  }));
});

// 计算顶部占位高度
const topSpacerHeight = computed(() => {
  if (!virtualizationEnabled.value) return 0;
  return estimateHeightRange(
    0,
    Math.min(liveRange.start, props.messages.length),
  );
});

// 计算底部占位高度
const bottomSpacerHeight = computed(() => {
  if (!virtualizationEnabled.value) return 0;
  const total = props.messages.length;
  const end = Math.min(liveRange.end, total);
  return estimateHeightRange(end, total);
});

// 设置滚动监听
function setupScrollListener() {
  if (
    scrollListenerActive ||
    !virtualizationEnabled.value ||
    !messagesContainer.value
  )
    return;
  scrollListenerActive = true;
}

// 清理滚动监听
function cleanupScrollListener() {
  scrollListenerActive = false;
  if (pendingScrollSync !== null) {
    cancelAnimationFrame(pendingScrollSync);
    pendingScrollSync = null;
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 监听消息变化自动滚动
watch(
  () => props.messages.length,
  async (newLength, oldLength) => {
    await nextTick();

    // 如果是新增消息且启用虚拟化，自动聚焦到最后
    if (virtualizationEnabled.value && newLength > (oldLength || 0)) {
      focusIndex.value = Math.max(0, newLength - 1);
      updateLiveRange();
    }

    smartScrollToBottom(); // 使用智能滚动
  },
);

watch(
  () => props.isLoading,
  async () => {
    await nextTick();
    // scrollToBottom();
    smartScrollToBottom(); // 使用智能滚动
  },
);

// 监听虚拟化状态变化
watch(
  () => virtualizationEnabled.value,
  (enabled) => {
    if (enabled) {
      setupScrollListener();
      syncFocusToScroll();
    } else {
      cleanupScrollListener();
    }
  },
  { immediate: true },
);

// 监听焦点索引变化，更新渲染范围
watch(
  [focusIndex, () => props.messages.length],
  () => {
    updateLiveRange();
  },
  { immediate: true },
);

// 组件卸载时清理
onBeforeUnmount(() => {
  cleanupScrollListener();
  messageSlotElements.clear();
  messageContentElements.clear();
});

defineExpose({
  scrollToBottom,
  smartScrollToBottom, // 暴露智能滚动方法
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
  /* 虚拟滚动优化 */
  position: relative;
  contain: layout;
  content-visibility: auto;

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

/* 虚拟滚动样式 */
.message-spacer {
  width: 100%;
  flex-shrink: 0;
}

.message-slot {
  width: 100%;
}

.message-content-wrapper {
  width: 100%;
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
