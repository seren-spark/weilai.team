<template>
  <div class="markdown-renderer" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { marked, Renderer } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "@/assets/styles/markdown.scss";

const props = defineProps<{
  content: string;
  streaming?: boolean; // 是否流式输出
}>();

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

// 渲染 Markdown
const renderedContent = computed(() => {
  if (!props.content) return '';
  try {
    return marked.parse(props.content) as string;
  } catch (error) {
    console.error('Markdown 渲染错误:', error);
    return props.content;
  }
});
</script>

<style scoped lang="scss">
.markdown-renderer {
  line-height: 1.6;
  word-wrap: break-word;
  color: #333;

  // 标题样式
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin: 1em 0 0.5em;
    font-weight: 600;
    line-height: 1.3;
  }

  :deep(h1) { font-size: 1.8em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
  :deep(h2) { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
  :deep(h3) { font-size: 1.3em; }
  :deep(h4) { font-size: 1.1em; }
  :deep(h5) { font-size: 1em; }
  :deep(h6) { font-size: 0.9em; color: #666; }

  // 段落
  :deep(p) {
    margin: 0.8em 0;
  }

  // 列表
  :deep(ul), :deep(ol) {
    margin: 0.8em 0;
    padding-left: 2em;
  }

  :deep(li) {
    margin: 0.3em 0;
  }

  // 行内代码
  :deep(code) {
    background: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    color: #e83e8c;
  }

  // 代码块
  :deep(pre) {
    background: #282c34;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;
    
    code {
      background: none;
      padding: 0;
      color: #abb2bf;
      font-size: 0.9em;
      line-height: 1.5;
    }
  }

  // 引用
  :deep(blockquote) {
    border-left: 4px solid #1890ff;
    padding-left: 1em;
    margin: 1em 0;
    color: #666;
    background: rgba(24, 144, 255, 0.05);
    padding: 0.5em 1em;
    border-radius: 0 4px 4px 0;

    p {
      margin: 0.5em 0;
    }
  }

  // 表格
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    display: block;
    overflow-x: auto;

    th, td {
      border: 1px solid #ddd;
      padding: 0.6em 1em;
      text-align: left;
    }

    th {
      background: #f6f8fa;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: #f9f9f9;
    }
  }

  // 链接
  :deep(a) {
    color: #1890ff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  // 图片
  :deep(img) {
    max-width: 100%;
    border-radius: 6px;
    margin: 0.5em 0;
  }

  // 分隔线
  :deep(hr) {
    border: none;
    border-top: 2px solid #eee;
    margin: 2em 0;
  }

  // 强调
  :deep(strong) {
    font-weight: 600;
  }

  :deep(em) {
    font-style: italic;
  }

  // 删除线
  :deep(del) {
    text-decoration: line-through;
    color: #999;
  }

  // 任务列表
  :deep(input[type="checkbox"]) {
    margin-right: 0.5em;
  }
}
</style>
