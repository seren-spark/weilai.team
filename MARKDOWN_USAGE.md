# Markdown 流式渲染使用指南

## 概述

项目已集成 `marked` + `highlight.js` 实现 Markdown 格式的流式输出显示。

## 已安装的库

- **marked** (v15.0.12): Markdown 解析器
- **highlight.js** (v11.11.1): 代码语法高亮

## 使用方式

### 方式1: 使用 MarkdownRenderer 组件（推荐）

```vue
<template>
  <MarkdownRenderer :content="markdownContent" :streaming="true" />
</template>

<script setup>
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import { ref } from 'vue';

const markdownContent = ref('# Hello\n\nThis is **markdown**!');
</script>
```

### 方式2: 在 MessageItem 中自动渲染

`MessageItem.vue` 已经集成了 Markdown 渲染，所有 AI 消息都会自动渲染为 Markdown 格式。

## 支持的 Markdown 特性

### 1. 标题
```markdown
# H1 标题
## H2 标题
### H3 标题
```

### 2. 文本样式
```markdown
**粗体文本**
*斜体文本*
~~删除线~~
```

### 3. 列表
```markdown
- 无序列表项1
- 无序列表项2

1. 有序列表项1
2. 有序列表项2
```

### 4. 代码

行内代码：`const x = 1;`

代码块：
\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`

### 5. 引用
```markdown
> 这是一段引用文本
```

### 6. 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
```

### 7. 链接和图片
```markdown
[链接文本](https://example.com)
![图片描述](image-url.jpg)
```

## 代码高亮支持的语言

支持所有 highlight.js 支持的语言，包括：
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- SQL
- HTML/CSS
- Shell
- 等等...

## 流式输出原理

当 AI 流式返回内容时：
1. 每次接收到新的文本片段
2. 追加到现有内容
3. `computed` 属性自动触发重新渲染
4. 用户看到实时更新的 Markdown 内容

```typescript
// 流式更新示例
let fullResponse = "";
await sendMessageStream(message, (chunk) => {
  fullResponse += chunk;  // 追加新内容
  aiMessage.content = fullResponse;  // 触发重新渲染
});
```

## 自定义样式

### 修改代码高亮主题

在组件中更改导入的主题：

```typescript
// 可选主题：
import "highlight.js/styles/github.css";        // GitHub 风格
import "highlight.js/styles/github-dark.css";   // GitHub 暗色
import "highlight.js/styles/monokai.css";       // Monokai
import "highlight.js/styles/atom-one-dark.css"; // Atom One Dark
```

### 自定义 Markdown 样式

修改 `src/assets/styles/markdown.scss` 文件来自定义样式。

## 性能优化建议

1. **使用 computed 属性**：自动缓存渲染结果
2. **避免频繁渲染**：流式输出时可以考虑节流
3. **懒加载代码高亮**：只在需要时加载特定语言的高亮

## 安全性

- 使用 `v-html` 渲染，需要确保内容来源可信
- 如需额外安全保护，可以集成 `DOMPurify` 进行 HTML 净化

## 示例效果

### 输入
```markdown
# AI 助手

我可以帮你：
- 回答问题
- 编写代码
- 分析数据

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`
```

### 输出
渲染后的 HTML 会包含：
- 格式化的标题
- 带样式的列表
- 语法高亮的代码块

## 故障排查

### 代码块不高亮
- 检查语言标识是否正确
- 确认 highlight.js 已正确导入
- 查看浏览器控制台是否有错误

### 样式不生效
- 确认 CSS 文件已导入
- 检查 scoped 样式是否使用了 `:deep()` 选择器
- 清除浏览器缓存

### 流式输出卡顿
- 考虑使用节流函数
- 减少渲染频率
- 优化 computed 属性的计算逻辑
