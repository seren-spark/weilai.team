# markdown-it 增强插件安装指南

## 当前已支持的特性 ✅

- **代码高亮** - highlight.js 集成
- **自动链接** - linkify
- **GFM 换行** - breaks
- **HTML 标签** - html
- **排版优化** - typographer

## content.ts 中需要插件支持的特性

### 1. ✅ 表格支持 (默认已支持)

markdown-it 默认不启用表格，需要添加配置：

```bash
# 无需安装额外包，只需配置
```

```typescript
const md = new MarkdownIt({
  // ... 其他配置
}).enable(["table"]);
```

### 2. ❌ 任务列表 (Checkbox)

**content.ts 第31-34行**:

```markdown
- [ ] Star this repo
- [x] Fork this repo
```

**安装**:

```bash
pnpm install markdown-it-task-lists
```

**使用**:

```typescript
import markdownItTaskLists from "markdown-it-task-lists";

md.use(markdownItTaskLists, {
  enabled: true,
  label: true,
  labelAfter: true,
});
```

### 3. ❌ 数学公式支持 (LaTeX/KaTeX)

**content.ts 第55行、61-69行等**:

```markdown
$$i\\hbar \\frac{\\partial}{\\partial t} \\Psi...$$
\[f(x) = f(a) + f'(a)(x-a) + ...\]
```

**方案 A: markdown-it-katex (推荐)**

```bash
pnpm install markdown-it-katex katex
pnpm install -D @types/markdown-it-katex
```

```typescript
import markdownItKatex from "markdown-it-katex";
import "katex/dist/katex.min.css";

md.use(markdownItKatex, {
  throwOnError: false,
  errorColor: "#cc0000",
});
```

**方案 B: markdown-it-texmath**

```bash
pnpm install markdown-it-texmath katex
```

```typescript
import texmath from "markdown-it-texmath";
import katex from "katex";

md.use(texmath, {
  engine: katex,
  delimiters: "dollars", // 支持 $...$ 和 $$...$$
  katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
});
```

### 4. 可选增强插件

#### Emoji 支持

```bash
pnpm install markdown-it-emoji
```

```typescript
import markdownItEmoji from "markdown-it-emoji";
md.use(markdownItEmoji);
```

#### 脚注支持

```bash
pnpm install markdown-it-footnote
```

#### 下标/上标

```bash
pnpm install markdown-it-sub markdown-it-sup
```

#### 标记/高亮文本

```bash
pnpm install markdown-it-mark
```

#### 定义列表

```bash
pnpm install markdown-it-deflist
```

#### 缩略语

```bash
pnpm install markdown-it-abbr
```

## 完整配置示例

```typescript
// MessageItem.vue 增强版
import MarkdownIt from "markdown-it";
import markdownItTaskLists from "markdown-it-task-lists";
import markdownItKatex from "markdown-it-katex";
import "katex/dist/katex.min.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (err) {
        console.error("代码高亮错误:", err);
      }
    }
    return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
  },
})
  .enable(["table"]) // 启用表格支持
  .use(markdownItTaskLists, { enabled: true }) // 任务列表
  .use(markdownItKatex, { throwOnError: false }); // 数学公式
```

## 快速安装所有推荐插件

```bash
# 核心功能
pnpm install markdown-it-task-lists markdown-it-katex katex

# CSS（需要在组件中导入）
# import 'katex/dist/katex.min.css'

# 可选增强
pnpm install markdown-it-emoji markdown-it-footnote markdown-it-sub markdown-it-sup markdown-it-mark
```

## 注意事项

1. **KaTeX CSS**: 安装数学公式支持后，需要导入 KaTeX 样式表
2. **类型定义**: TypeScript 项目建议安装对应的 @types 包
3. **性能**: 插件越多，渲染速度越慢，按需安装
4. **兼容性**: 测试所有插件在虚拟滚动环境下的表现

## 测试检查清单

- [ ] 代码高亮正常工作
- [ ] 表格渲染正确
- [ ] 任务列表可交互（可选）
- [ ] 数学公式正确渲染
- [ ] 自动链接生效
- [ ] Emoji 显示正常
- [ ] 虚拟滚动不影响渲染
