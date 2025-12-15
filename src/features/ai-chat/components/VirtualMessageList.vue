<template>
  <div ref="containerRef" class="virtual-list-container" @scroll="handleScroll">
    <div v-if="items.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon icon="mdi:robot-happy-outline" />
      </div>
      <p>开始新的对话吧!</p>
    </div>

    <div class="virtual-list-content" :style="{ height: `${totalHeight}px` }">
      <div
        class="virtual-list-items"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="item in visibleItems"
          :key="item.id"
          :ref="(el) => setItemRef(el as HTMLElement, item.index)"
          class="virtual-list-item"
          :data-index="item.index"
        >
          <slot :item="item" :index="item.index"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  type PropType,
} from "vue";
import { Icon } from "@iconify/vue";
import type { ReflectionData } from "@/composables/useAiChat";
import { renderMarkdown } from "@/utils/markdown";

export interface ListItem {
  id: number | string;
  content?: string;
  [key: string]: any;
}

const props = defineProps({
  items: {
    type: Array as PropType<ListItem[]>,
    required: true,
  },
  estimatedItemHeight: {
    type: Number,
    default: 80,
  },
  containerHeight: {
    type: Number,
    default: 600,
  },
  bufferSize: {
    type: Number,
    default: 10,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  reflectionStatus: {
    type: String,
    default: "",
  },
  reflectionMessage: {
    type: String,
    default: "",
  },
  currentReflections: {
    type: Array as PropType<ReflectionData[]>,
    default: () => [],
  },
  initialAnswerContent: {
    type: String,
    default: "",
  },
});

// 核心数据结构
const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const heightMap = new Map<string | number, number>();
const itemRefs = new Map<number, HTMLElement>();
const ITEM_MARGIN_BOTTOM = 24;
const estimatedHeight = ref(props.estimatedItemHeight + ITEM_MARGIN_BOTTOM);
const previousReflectionCount = ref(0);

// 自动滚动状态机
enum AutoScrollState {
  FOLLOW_BOTTOM = "FOLLOW_BOTTOM",
  USER_SCROLLING = "USER_SCROLLING",
}
const autoScrollState = ref<AutoScrollState>(AutoScrollState.FOLLOW_BOTTOM);
const scrollThreshold = 20;

// 可视区范围
const visibleRange = ref({ start: 0, end: 0, offsetY: 0 });

// RAF 和防抖
let rafId: number | null = null;
let scrollDebounceTimer: number | null = null;

// 计算总高度（使用 heightMap + estimated fallback）
const calcTotalHeight = (): number => {
  let total = 0;
  for (let i = 0; i < props.items.length; i++) {
    const id = props.items[i].id;
    total += heightMap.get(id) ?? estimatedHeight.value;
  }
  return total;
};

const totalHeight = computed(() => {
  if (props.items.length === 0) return 0;
  return calcTotalHeight();
});

// 计算可视区范围（核心算法）
const calcVisibleRange = (scrollTop: number) => {
  if (props.items.length === 0) {
    return { start: 0, end: 0, offsetY: 0 };
  }

  const viewportHeight = props.containerHeight;
  let acc = 0; //用于累计距离
  let start = 0;

  // 找到第一个可见项
  for (let i = 0; i < props.items.length; i++) {
    const h = heightMap.get(props.items[i].id) ?? estimatedHeight.value;
    if (acc + h > scrollTop) {
      start = i;
      break;
    }
    acc += h;
  }

  // 计算可见范围的结束索引(从0开始加到滚动容器的高度 )
  let end = start;
  let visibleHeight = 0;

  while (visibleHeight < viewportHeight && end < props.items.length) {
    visibleHeight +=
      heightMap.get(props.items[end].id) ?? estimatedHeight.value;
    end++;
  }

  // 添加 overscan
  start = Math.max(0, start - props.bufferSize);
  end = Math.min(props.items.length, end + props.bufferSize);

  // 重新计算 offsetY（考虑 overscan）
  let finalOffsetY = 0;
  for (let i = 0; i < start; i++) {
    finalOffsetY += heightMap.get(props.items[i].id) ?? estimatedHeight.value;
  }

  return { start, end, offsetY: finalOffsetY };
};

// 判断最后一条是否是流式消息
const isLastItemStreaming = computed(() => {
  return props.isLoading || props.reflectionStatus;
});

// 可见消息列表（最后一条流式消息永远渲染）
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value;
  const items = props.items.slice(start, end).map((item, idx) => ({
    ...item,
    index: start + idx,
  }));

  // 如果最后一条是流式消息且不在可视区，强制添加
  if (isLastItemStreaming.value && props.items.length > 0) {
    const lastIndex = props.items.length - 1;
    if (lastIndex >= end) {
      items.push({
        ...props.items[lastIndex],
        index: lastIndex,
      });
    }
  }

  return items;
});

const offsetY = computed(() => visibleRange.value.offsetY);

// ResizeObserver 增量修正（核心优化）
const resizeObserver = new ResizeObserver((entries) => {
  const shouldAutoScroll =
    autoScrollState.value === AutoScrollState.FOLLOW_BOTTOM;

  entries.forEach((entry) => {
    const index = Number(entry.target.getAttribute("data-index"));
    if (index < 0 || index >= props.items.length) return;

    const id = props.items[index].id;
    const newHeight = entry.contentRect.height + ITEM_MARGIN_BOTTOM;
    const oldHeight = heightMap.get(id);

    if (oldHeight !== newHeight) {
      // 增量修正：只更新 heightMap,totalHeight 会自动重算
      heightMap.set(id, newHeight);

      // 如果是最后一条流式消息且需要自动滚动
      if (shouldAutoScroll && index === props.items.length - 1) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    }
  });
});

const setItemRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    el.setAttribute("data-index", String(index));
    resizeObserver.observe(el);
    itemRefs.set(index, el);
  }
};

// 滚动处理(RAF 优化 + 状态机）
const handleScroll = (event: Event) => {
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    const target = event.target as HTMLElement;
    const currentScrollTop = target.scrollTop;

    scrollTop.value = currentScrollTop;

    // 更新可视区
    visibleRange.value = calcVisibleRange(currentScrollTop);

    // 更新自动滚动状态机
    if (scrollDebounceTimer !== null) {
      clearTimeout(scrollDebounceTimer);
    }

    if (isNearBottom()) {
      scrollDebounceTimer = window.setTimeout(() => {
        autoScrollState.value = AutoScrollState.FOLLOW_BOTTOM;
        scrollDebounceTimer = null;
      }, 150);
    } else {
      autoScrollState.value = AutoScrollState.USER_SCROLLING;
    }

    rafId = null;
  });
};

const isNearBottom = (): boolean => {
  if (!containerRef.value) return true;

  const { scrollTop: st, scrollHeight, clientHeight } = containerRef.value;
  const distanceFromBottom = scrollHeight - st - clientHeight;

  return distanceFromBottom <= scrollThreshold;
};

const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
    autoScrollState.value = AutoScrollState.FOLLOW_BOTTOM;
  }
};

const smartScrollToBottom = () => {
  if (autoScrollState.value === AutoScrollState.FOLLOW_BOTTOM) {
    scrollToBottom();
  }
};

const isNewReflection = (index: number): boolean => {
  return index >= previousReflectionCount.value;
};

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
  return statusMap[status] || status;
};

// 清理不可见的 itemRefs
watch(
  () => visibleItems.value,
  (newItems) => {
    const newIndexSet = new Set(newItems.map((item) => item.index));

    itemRefs.forEach((el, index) => {
      if (!newIndexSet.has(index)) {
        resizeObserver.unobserve(el);
        itemRefs.delete(index);
      }
    });
  },
  { deep: true },
);

// 监听消息变化（新增消息触发滚动）
watch(
  () => props.items.length,
  async (newLength, oldLength) => {
    if (newLength > (oldLength || 0)) {
      // 新消息添加
      await nextTick();

      // 更新可视区
      visibleRange.value = calcVisibleRange(scrollTop.value);

      // 如果处于自动滚动状态，滚动到底部
      if (autoScrollState.value === AutoScrollState.FOLLOW_BOTTOM) {
        await nextTick();
        scrollToBottom();
      }
    }
  },
);

// 监听加载状态
watch(
  () => props.isLoading,
  async (newLoading) => {
    await nextTick();
    smartScrollToBottom();
  },
);

// 监听反思状态变化，确保显示时滚动到底部
watch(
  () => props.reflectionStatus,
  async (newStatus) => {
    if (newStatus) {
      await nextTick();
      await nextTick();
      smartScrollToBottom();
    }
  },
);

watch(
  () => props.currentReflections?.length,
  (newCount) => {
    if (newCount !== undefined) {
      setTimeout(() => {
        previousReflectionCount.value = newCount;
      }, 500);
    }
  },
);

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.style.height = `${props.containerHeight}px`;
  }

  // 初始化可视区
  visibleRange.value = calcVisibleRange(0);

  nextTick(() => {
    if (props.items.length > 0) {
      scrollToBottom();
    }
  });
});

onUnmounted(() => {
  resizeObserver.disconnect();
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  if (scrollDebounceTimer !== null) {
    clearTimeout(scrollDebounceTimer);
  }
});

defineExpose({
  scrollToBottom,
  smartScrollToBottom,
});
</script>

<style scoped lang="scss">
.virtual-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  contain: layout;

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
}

.virtual-list-content {
  position: relative;
  width: 100%;
}

.virtual-list-items {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  will-change: transform;
}

.virtual-list-item {
  width: 100%;
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

.virtual-list-container::-webkit-scrollbar {
  width: 6px;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;

  &:hover {
    background: #bfbfbf;
  }
}

.virtual-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.load {
  background: none !important;
}

.message {
  display: flex;
  gap: 1rem;

  &.assistant {
    justify-content: flex-start;
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

.reflection-status-container {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  animation: slideIn 0.3s ease-out;
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.98) 80%,
    transparent
  );
  backdrop-filter: blur(8px);
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
