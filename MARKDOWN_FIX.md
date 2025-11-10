# Markdown 历史记录渲染修复

## 问题描述

历史记录加载后，消息内容没有进行 Markdown 解析，显示为纯文本。

## 问题原因

在 `MessageItem.vue` 组件中，消息内容使用了 `{{ message.content }}`（纯文本插值），而不是 `v-html="renderedContent"`（HTML 渲染）。

## 解决方案

### 1. 修改消息显示逻辑

```vue
<!-- 修改前 -->
<div class="message-text typing">{{ message.content }}</div>

<!-- 修改后 -->
<div 
  class="message-text typing" 
  v-if="message.role === 'assistant'"
  v-html="renderedContent"
></div>
<div 
  class="message-text typing" 
  v-else
>{{ message.content }}</div>
```

**说明**：
- AI 消息使用 `v-html` 渲染 Markdown
- 用户消息保持纯文本显示

### 2. 添加初始回答的 Markdown 渲染

```vue
<!-- 修改前 -->
<p>{{ message.metadata.initialAnswer }}</p>

<!-- 修改后 -->
<div class="reflection-answer" v-html="renderedInitialAnswer"></div>
```

```typescript
// 添加计算属性
const renderedInitialAnswer = computed(() => {
  if (!props.message.metadata?.initialAnswer) return '';
  try {
    return marked.parse(props.message.metadata.initialAnswer) as string;
  } catch (error) {
    console.error('初始回答 Markdown 渲染错误:', error);
    return props.message.metadata.initialAnswer;
  }
});
```

### 3. 添加反思答案的 Markdown 样式

```scss
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
```

## 数据流说明

### 保存流程
```
AI 响应（Markdown 文本）
  ↓
fullResponse += data.content
  ↓
aiMessage.content = fullResponse
  ↓
saveAssistantMessage(fullResponse)  // 保存原始 Markdown
  ↓
IndexedDB（存储原始 Markdown 文本）
```

### 加载和渲染流程
```
IndexedDB
  ↓
loadChatMessagesPersisted(chatId)
  ↓
messages.value（原始 Markdown 文本）
  ↓
MessageItem 组件
  ↓
computed: renderedContent
  ↓
marked.parse(message.content)
  ↓
v-html 渲染（显示格式化的 HTML）
```

## 关键点

1. **存储格式**：始终存储原始 Markdown 文本
2. **渲染时机**：在组件渲染时才转换为 HTML
3. **用户消息**：保持纯文本，不进行 Markdown 渲染
4. **AI 消息**：自动进行 Markdown 渲染
5. **反思详情**：初始回答也支持 Markdown 渲染

## 测试验证

### 测试步骤
1. 发送包含 Markdown 格式的消息
2. 等待 AI 回复（应该正确渲染）
3. 刷新页面或切换会话
4. 检查历史消息是否正确渲染 Markdown

### 测试用例

```markdown
# 测试标题

这是**粗体**和*斜体*文本。

- 列表项1
- 列表项2

\`\`\`javascript
function test() {
  console.log('Hello');
}
\`\`\`

| 列1 | 列2 |
|-----|-----|
| A   | B   |
```

## 注意事项

1. **安全性**：使用 `v-html` 需要确保内容来源可信
2. **性能**：`computed` 属性会自动缓存，避免重复渲染
3. **样式隔离**：使用 `:deep()` 选择器穿透 scoped 样式
4. **错误处理**：Markdown 解析失败时回退到原始文本

## 相关文件

- `src/features/ai-chat/components/MessageItem.vue` - 消息显示组件
- `src/features/ai-chat/AiChat.vue` - 主聊天逻辑
- `src/composables/useAiChat.ts` - 聊天数据管理
- `src/composables/useChatStorage.ts` - 持久化存储
