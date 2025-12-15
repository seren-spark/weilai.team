<template>
  <div
    class="message"
    :class="[message.role, message.status === 'superseded' ? 'superseded' : '']"
  >
    <div v-if="message.role === 'assistant'" class="message-avatar">
      <Icon icon="mdi:robot" />
    </div>

    <div class="message-content">
      <!-- 编辑模式 -->
      <div v-if="isEditing" class="edit-mode-container">
        <textarea
          v-model="editContent"
          class="edit-textarea"
          rows="3"
          @keydown.enter.ctrl.prevent="handleConfirmEdit"
        ></textarea>
        <div class="edit-actions">
          <button class="btn-cancel" @click="handleCancelEdit">取消</button>
          <button class="btn-submit" @click="handleConfirmEdit">
            发送 <Icon icon="mdi:send" />
          </button>
        </div>
      </div>

      <!-- 正常显示模式 -->
      <template v-else>
        <div class="message-header" v-if="showThinkingBadge">
          <div class="spinner"></div>
          <span class="thinking-text">正在思考中...</span>
        </div>
        <div
          class="message-text typing"
          v-if="message.role === 'assistant'"
          v-html="renderedContent"
        />

        <div class="message-text typing" v-else>{{ message.content }}</div>

        <!-- 操作栏 -->
        <div
          v-if="message.role === 'user' && message.status !== 'superseded'"
          class="message-actions"
        >
          <button
            class="action-btn"
            @click="handleStartEdit"
            title="编辑并重新发送"
          >
            <Icon icon="mdi:pencil-outline" />
          </button>
        </div>

        <!-- 已失效标记 -->
        <div v-if="message.status === 'superseded'" class="superseded-badge">
          <Icon icon="mdi:history" /> 已根据新内容重新生成
        </div>

        <div class="message-time">{{ message.time }}</div>

        <!-- 反思详情 -->
        <div v-if="message.metadata?.reflectionUsed" class="reflection-details">
          <button
            @click="toggleReflectionDetails"
            class="toggle-reflection-btn"
          >
            {{ showReflectionDetails ? "隐藏" : "查看" }}反思过程
          </button>

          <div v-if="showReflectionDetails" class="reflection-content">
            <!-- 初始回答 -->
            <div class="reflection-section">
              <h4>💭 初始回答</h4>
              <div
                class="reflection-answer"
                v-html="renderedInitialAnswer"
              ></div>
            </div>

            <!-- 反思维度 -->
            <div class="reflection-section">
              <h4>🔍 反思分析</h4>
              <div
                v-for="(ref, idx) in message.metadata.reflections"
                :key="idx"
                class="reflection-item"
              >
                <div class="reflection-dimension">
                  {{ ref.dimension }}
                </div>
                <div class="reflection-text">{{ ref.reflection }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="message.role === 'user'" class="message-avatar user">
      {{ userInitial }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { Icon } from "@iconify/vue";
import type { Message } from "@/composables/useAiChat";
import { renderMarkdown } from "@/utils/markdown";
import mermaid from "mermaid";
import MarkdownRender from "markstream-vue";
import "markstream-vue/index.css";
const props = defineProps<{
  message: Message;
  userInitial: string;
  isLoading?: boolean;
  reflectionStatus?: string;
  reflectionMessage?: string;
  isLatest?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit-start", id: string): void;
  (e: "edit-submit", payload: { id: string; content: string }): void;
}>();

const showReflectionDetails = ref(false);
const isEditing = ref(false);
const editContent = ref("");

const toggleReflectionDetails = () => {
  showReflectionDetails.value = !showReflectionDetails.value;
};

// 开始编辑
const handleStartEdit = () => {
  editContent.value = props.message.content;
  isEditing.value = true;
  emit("edit-start", props.message.id);
};

// 取消编辑
const handleCancelEdit = () => {
  isEditing.value = false;
  editContent.value = "";
};

// 确认编辑
const handleConfirmEdit = () => {
  if (
    !editContent.value.trim() ||
    editContent.value === props.message.content
  ) {
    handleCancelEdit();
    return;
  }
  emit("edit-submit", { id: props.message.id, content: editContent.value });
  isEditing.value = false;
};

// 使用统一的 markdown 渲染器
const renderedContent = computed(() => renderMarkdown(props.message.content));

const showThinkingBadge = computed(() => {
  if (props.message.role !== "assistant") return false;
  if (!props.isLatest) return false;
  return Boolean(props.isLoading || props.reflectionStatus);
});

// 渲染初始回答
const renderedInitialAnswer = computed(() =>
  renderMarkdown(props.message.metadata?.initialAnswer || ""),
);

// 初始化 Mermaid
onMounted(() => {
  mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
  });
  renderMermaid();
});

// 监听内容变化，重新渲染 Mermaid
watch(
  () => props.message.content,
  () => {
    nextTick(() => {
      renderMermaid();
    });
  },
);

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  await nextTick();
  const mermaidElements = document.querySelectorAll(".mermaid");
  if (mermaidElements.length > 0) {
    try {
      await mermaid.run({
        nodes: mermaidElements as any,
      });
    } catch (error) {
      console.error("Mermaid 渲染错误:", error);
    }
  }
};
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

    .message-actions {
      position: absolute;
      bottom: -28px;
      right: 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .message-actions {
      opacity: 1;
    }

    .message-time {
      text-align: right;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  // 失效消息样式
  &.superseded {
    opacity: 0.6;

    .message-content {
      background: #f0f0f0;
      color: #999;
      border: 1px dashed #d9d9d9;
    }

    &.user .message-content {
      background: #e6f7ff;
      color: #666;
      border: 1px dashed #91d5ff;
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
    position: relative;

    // 编辑模式样式
    .edit-mode-container {
      min-width: 300px;

      .edit-textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: inherit;
        font-family: inherit;
        font-size: 0.9rem;
        resize: vertical;
        outline: none;

        &:focus {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }
      }

      .edit-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;

        button {
          padding: 6px 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;

          &.btn-cancel {
            background: rgba(255, 255, 255, 0.2);
            color: white;

            &:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          }

          &.btn-submit {
            background: white;
            color: #1890ff;
            font-weight: 500;

            &:hover {
              background: #f0f0f0;
            }
          }
        }
      }
    }

    // 消息操作栏
    .message-actions {
      .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        font-size: 1.1rem;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #1890ff;
        }
      }
    }

    // 失效标记
    .superseded-badge {
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .message-header {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0.5rem;
      padding: 0.4rem 0.6rem;
      background: rgba(24, 144, 255, 0.08);
      border-radius: 999px;
      color: #1890ff;
      font-size: 0.85rem;

      .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid #e6f4ff;
        border-top: 2px solid #1890ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .thinking-text {
        white-space: nowrap;
      }
    }

    .message-text {
      line-height: 1.6;
      word-wrap: break-word;

      // Markdown 样式
      :deep(h1),
      :deep(h2),
      :deep(h3),
      :deep(h4),
      :deep(h5),
      :deep(h6) {
        margin: 0.5em 0;
        font-weight: 600;
      }

      :deep(h1) {
        font-size: 1.5em;
      }
      :deep(h2) {
        font-size: 1.3em;
      }
      :deep(h3) {
        font-size: 1.1em;
      }

      :deep(p) {
        margin: 0.5em 0;
      }

      :deep(ul),
      :deep(ol) {
        margin: 0.5em 0;
        padding-left: 1.5em;
      }

      :deep(li) {
        margin: 0.25em 0;
      }

      :deep(code) {
        background: rgba(0, 0, 0, 0.05);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: "Consolas", "Monaco", "Courier New", monospace;
        font-size: 0.9em;
      }

      :deep(pre) {
        background: #282c34;
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
        margin: 0.5em 0;

        code {
          background: none;
          padding: 0;
          color: #abb2bf;
        }
      }

      :deep(blockquote) {
        border-left: 3px solid #1890ff;
        padding-left: 1em;
        margin: 0.5em 0;
        color: #666;
      }

      :deep(table) {
        border-collapse: collapse;
        width: 100%;
        margin: 0.5em 0;

        th,
        td {
          border: 1px solid #ddd;
          padding: 0.5em;
          text-align: left;
        }

        th {
          background: #f5f5f5;
          font-weight: 600;
        }
      }

      :deep(a) {
        color: #1890ff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      :deep(img) {
        max-width: 100%;
        border-radius: 6px;
      }

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

    // 反思详情样式
    .reflection-details {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      .toggle-reflection-btn {
        padding: 0.4rem 0.75rem;
        background: rgba(24, 144, 255, 0.1);
        border: 1px solid rgba(24, 144, 255, 0.3);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        color: #1890ff;
        transition: all 0.2s;

        &:hover {
          background: rgba(24, 144, 255, 0.2);
          border-color: rgba(24, 144, 255, 0.5);
        }
      }

      .reflection-content {
        margin-top: 0.75rem;
        animation: expandDown 0.3s ease-out;

        .reflection-section {
          margin-bottom: 0.75rem;

          h4 {
            margin: 0 0 0.5rem 0;
            font-size: 0.85rem;
            color: #555;
            font-weight: 600;
          }

          p,
          .reflection-answer {
            margin: 0;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.03);
            border-radius: 6px;
            font-size: 0.8rem;
            line-height: 1.5;
            color: #666;
          }

          // 反思答案的 Markdown 样式
          .reflection-answer {
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
          }

          .reflection-item {
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.03);
            border-radius: 6px;
            border-left: 3px solid #1890ff;

            .reflection-dimension {
              font-weight: 600;
              color: #1890ff;
              margin-bottom: 0.4rem;
              font-size: 0.8rem;
            }

            .reflection-text {
              font-size: 0.8rem;
              line-height: 1.5;
              color: #666;
            }
          }
        }
      }
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

@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}
</style>
