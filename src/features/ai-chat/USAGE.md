# AI聊天界面使用示例

## 快速开始

### 1. 在路由中添加页面

路由已自动配置，访问 `/aiChat` 即可

### 2. 在组件中使用

#### 方式一：作为独立页面
```vue
<template>
  <AiChat />
</template>

<script setup lang="ts">
import AiChat from '@/features/ai-chat/AiChat.vue';
</script>
```

#### 方式二：在现有页面中嵌入
```vue
<template>
  <div class="page-container">
    <header>我的应用</header>
    <AiChat class="chat-section" />
  </div>
</template>

<script setup lang="ts">
import AiChat from '@/features/ai-chat/AiChat.vue';
</script>

<style>
.chat-section {
  height: calc(100vh - 60px); /* 减去header高度 */
}
</style>
```

## 使用 useAiChat Composable

如果需要自定义UI，可以直接使用 `useAiChat` composable：

```vue
<template>
  <div class="custom-chat">
    <div v-for="msg in messages" :key="msg.id">
      {{ msg.content }}
    </div>
    <input v-model="input" @keyup.enter="send" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAiChat } from '@/composables/useAiChat';

const { messages, sendMessage, isLoading } = useAiChat();
const input = ref('');

const send = async () => {
  if (!input.value.trim()) return;
  
  const userMsg = {
    id: Date.now().toString(),
    role: 'user' as const,
    content: input.value,
    time: new Date().toLocaleTimeString()
  };
  
  messages.value.push(userMsg);
  
  const aiMsg = await sendMessage(input.value);
  if (aiMsg) {
    messages.value.push(aiMsg);
  }
  
  input.value = '';
};
</script>
```

## API调用示例

### 发送消息
```typescript
import apiClient from '@/api/axios';

// 发送消息到AI
const response = await apiClient.request({
  url: '/ai/chat',
  method: 'post',
  data: {
    message: '你好，AI',
    chatId: 'chat-123'
  }
});

console.log(response.data.message);
```

### 创建新对话
```typescript
const response = await apiClient.request({
  url: '/ai/chat/create',
  method: 'post',
  data: {
    title: '新的对话'
  }
});

const chatId = response.data.chatId;
```

### 获取聊天历史
```typescript
const response = await apiClient.request({
  url: '/ai/chat/history',
  method: 'get'
});

const history = response.data.records;
```

## 高级用法

### 自定义消息样式

```vue
<template>
  <div class="message" :class="messageClass(msg)">
    <div class="avatar">
      <img v-if="msg.role === 'user'" :src="userAvatar" />
      <Icon v-else icon="mdi:robot" />
    </div>
    <div class="content">
      <div v-html="formatMessage(msg.content)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked'; // 需要安装

const formatMessage = (content: string) => {
  return marked(content); // 支持Markdown
};

const messageClass = (msg: any) => ({
  'user-message': msg.role === 'user',
  'ai-message': msg.role === 'assistant'
});
</script>
```

### 添加代码高亮

```typescript
import { computed } from 'vue';
import hljs from 'highlight.js'; // 需要安装
import 'highlight.js/styles/github.css';

const highlightCode = (content: string) => {
  return content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const highlighted = lang 
        ? hljs.highlight(code, { language: lang }).value
        : hljs.highlightAuto(code).value;
      
      return `<pre><code class="hljs ${lang}">${highlighted}</code></pre>`;
    }
  );
};
```

### 添加打字机效果

```typescript
const typewriterEffect = async (text: string, callback: (char: string) => void) => {
  for (let i = 0; i < text.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 30));
    callback(text[i]);
  }
};

// 使用
const displayMessage = ref('');
await typewriterEffect(aiMessage.content, (char) => {
  displayMessage.value += char;
});
```

### 流式响应（SSE）

```typescript
const streamResponse = async (message: string) => {
  const response = await fetch('/ai/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  let aiMessage = '';
  
  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    aiMessage += chunk;
    
    // 实时更新UI
    messages.value[messages.value.length - 1].content = aiMessage;
  }
};
```

## 集成第三方AI服务

### OpenAI
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

const sendToOpenAI = async (message: string) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }]
  });
  
  return completion.choices[0].message.content;
};
```

### 文心一言
```typescript
const sendToErnie = async (message: string) => {
  const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }]
    })
  });
  
  const data = await response.json();
  return data.result;
};
```

### 通义千问
```typescript
const sendToQwen = async (message: string) => {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VITE_DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: { messages: [{ role: 'user', content: message }] }
    })
  });
  
  const data = await response.json();
  return data.output.text;
};
```

## 常见问题

### Q: 如何修改聊天界面的颜色主题？
A: 在 `AiChat.vue` 的 `<style>` 部分修改 CSS 变量或直接修改颜色值。

### Q: 如何添加文件上传功能？
A: 在输入区域添加文件上传按钮，使用 FormData 上传文件：
```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.request({
    url: '/ai/chat/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.url;
};
```

### Q: 如何保存聊天记录到本地？
A: 使用 localStorage 或 IndexedDB：
```typescript
import { watch } from 'vue';

watch(messages, (newMessages) => {
  localStorage.setItem('chatMessages', JSON.stringify(newMessages));
}, { deep: true });

// 加载
const savedMessages = localStorage.getItem('chatMessages');
if (savedMessages) {
  messages.value = JSON.parse(savedMessages);
}
```

### Q: 如何实现消息搜索？
A: 添加搜索功能：
```typescript
const searchTerm = ref('');

const filteredMessages = computed(() => {
  if (!searchTerm.value) return messages.value;
  
  return messages.value.filter(msg => 
    msg.content.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
```

