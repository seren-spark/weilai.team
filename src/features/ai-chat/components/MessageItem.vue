<template>
  <div class="message" :class="message.role">
    <div v-if="message.role === 'assistant'" class="message-avatar">
      <Icon icon="mdi:robot" />
    </div>
    <div class="message-content">
      <div 
        class="message-text typing" 
        v-if="message.role === 'assistant'"
        v-html="renderedContent"
      ></div>
      <div 
        class="message-text typing" 
        v-else
      >{{ message.content }}</div>
      <div class="message-time">{{ message.time }}</div>

      <!-- 反思详情 -->
      <div v-if="message.metadata?.reflectionUsed" class="reflection-details">
        <button @click="toggleReflectionDetails" class="toggle-reflection-btn">
          {{ showReflectionDetails ? "隐藏" : "查看" }}反思过程
        </button>

        <div v-if="showReflectionDetails" class="reflection-content">
          <!-- 初始回答 -->
          <div class="reflection-section">
            <h4>💭 初始回答</h4>
            <div class="reflection-answer" v-html="renderedInitialAnswer"></div>
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
    </div>
    <div v-if="message.role === 'user'" class="message-avatar user">
      {{ userInitial }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import type { Message } from "@/composables/useAiChat";
import { marked, Renderer } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // 代码高亮主题

const props = defineProps<{
  message: Message;
  userInitial: string;
}>();

const showReflectionDetails = ref(false);

const toggleReflectionDetails = () => {
  showReflectionDetails.value = !showReflectionDetails.value;
};

// 创建自定义渲染器
const renderer = new Renderer();

// 自定义代码块渲染
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang || '';
  if (language && hljs.getLanguage(language)) {
    try {
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    } catch (err) {
      console.error('代码高亮错误:', err);
    }
  }
  const highlighted = hljs.highlightAuto(text).value;
  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

// 配置 marked
marked.use({
  renderer,
  gfm: true,
  breaks: true,
});

// 使用 marked 渲染 Markdown
const renderedContent = computed(() => {
  if (!props.message.content) return '';
  try {
    return marked.parse(props.message.content) as string;
  } catch (error) {
    console.error('Markdown 渲染错误:', error);
    return props.message.content;
  }
});

// 渲染初始回答
const renderedInitialAnswer = computed(() => {
  if (!props.message.metadata?.initialAnswer) return '';
  try {
    return marked.parse(props.message.metadata.initialAnswer) as string;
  } catch (error) {
    console.error('初始回答 Markdown 渲染错误:', error);
    return props.message.metadata.initialAnswer;
  }
});
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
      
      // Markdown 样式
      :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
        margin: 0.5em 0;
        font-weight: 600;
      }
      
      :deep(h1) { font-size: 1.5em; }
      :deep(h2) { font-size: 1.3em; }
      :deep(h3) { font-size: 1.1em; }
      
      :deep(p) {
        margin: 0.5em 0;
      }
      
      :deep(ul), :deep(ol) {
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
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
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
        
        th, td {
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

          p, .reflection-answer {
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
