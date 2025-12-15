import MarkdownIt from "markdown-it";
import markdownItTaskLists from "markdown-it-task-lists";
import markdownItTexMath from "markdown-it-texmath";
import katex from "katex";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import markdownItMermaid from "markdown-it-mermaid-plugin";
import mermaid from "mermaid";
/**
 * 创建并配置 markdown-it 实例
 * 支持：代码高亮、表格、任务列表、数学公式等
 */
export function createMarkdownRenderer(): MarkdownIt {
  const md = new MarkdownIt({
    html: true, // 允许 HTML 标签
    linkify: true, // 自动转换 URL 为链接
    breaks: false, // 转换换行符为 <br>
    typographer: false, // 启用排版优化（智能引号、省略号等）
    highlight: (str: string, lang: string) => {
      // 代码高亮
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
        } catch (err) {
          console.error("代码高亮错误:", err);
        }
      }
      // 自动检测语言
      return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
    },
  });

  // 启用表格支持
  md.enable(["table"]);

  // 启用任务列表
  md.use(markdownItTaskLists, {
    enabled: true,
    label: true,
    labelAfter: true,
  });

  md.use(markdownItTexMath, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: {
      throwOnError: false,
      strict: false,
      trust: true,
    },
  });
  md.use(markdownItMermaid, {
    mermaid,
  });
  return md;
}

/**
 * 全局共享的 markdown-it 实例
 */
export const markdownRenderer = createMarkdownRenderer();

/**
 * 渲染 Markdown 文本为 HTML
 */
export function renderMarkdown(text: string): string {
  if (!text) return "";
  try {
    return markdownRenderer.render(text);
  } catch (error) {
    console.error("Markdown 渲染错误:", error);
    return text;
  }
}
