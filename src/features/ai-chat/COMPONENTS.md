# AI Chat 组件拆分文档

## 概述

原来的 `AiChat.vue` 文件已经被重构为多个纯组件，提高了代码的可维护性和可重用性。

## 组件结构

```
ai-chat/
├── AiChat.vue                    # 主容器组件
├── components/
│   ├── index.ts                  # 组件导出文件
│   ├── SidebarHeader.vue         # 侧边栏头部
│   ├── FeatureList.vue           # 功能列表
│   ├── ChatHistory.vue           # 历史对话列表
│   ├── ChatSidebar.vue           # 侧边栏容器
│   ├── ChatHeader.vue            # 聊天头部
│   ├── MessageItem.vue           # 单条消息
│   ├── MessageList.vue           # 消息列表
│   ├── ChatInput.vue             # 输入区域
│   └── ChatMain.vue              # 主聊天区域容器
```

## 组件详情

### 1. SidebarHeader.vue

**职责**: 侧边栏头部，包含 Logo 和折叠按钮

**Props**: 无

**Events**:

- `collapse`: 折叠侧边栏

**特点**: 纯展示组件

---

### 2. FeatureList.vue

**职责**: 显示功能列表（AI搜索、帮我写作等）

**Props**:

- `currentFeature: string` - 当前选中的功能
- `features: Feature[]` - 功能列表配置

**Events**:

- `select: (featureId: string)` - 选择功能

**类型定义**:

```typescript
interface Feature {
  id: string;
  label: string;
  icon: string;
}
```

---

### 3. ChatHistory.vue

**职责**: 显示历史对话列表

**Props**:

- `chatHistory: ChatHistory[]` - 历史对话数组
- `currentChatId: string | null` - 当前对话ID

**Events**:

- `switch: (chatId: string)` - 切换对话
- `menu: (chatId: string)` - 显示对话菜单

**特点**: 包含自定义滚动条样式

---

### 4. ChatSidebar.vue

**职责**: 侧边栏容器，组合所有侧边栏子组件

**Props**:

- `currentFeature: string` - 当前选中的功能
- `features: Feature[]` - 功能列表
- `chatHistory: ChatHistory[]` - 历史对话
- `currentChatId: string | null` - 当前对话ID

**Events**:

- `collapse`: 折叠
- `new-chat`: 新建对话
- `feature-select: (featureId: string)` - 选择功能
- `chat-switch: (chatId: string)` - 切换对话
- `chat-menu: (chatId: string)` - 对话菜单

---

### 5. ChatHeader.vue

**职责**: 聊天区域头部，包含问候语和操作按钮

**Props**:

- `greeting: string` - 问候语

**Events**:

- `home`: 首页
- `notification`: 通知
- `profile`: 个人资料

---

### 6. MessageItem.vue

**职责**: 单条消息展示

**Props**:

- `message: Message` - 消息对象
- `userInitial: string` - 用户首字母

**特点**:

- 支持用户和助手两种角色
- 包含淡入动画

---

### 7. MessageList.vue

**职责**: 消息列表容器，包含空状态和加载状态

**Props**:

- `messages: Message[]` - 消息数组
- `isLoading: boolean` - 加载状态
- `userInitial: string` - 用户首字母

**暴露方法**:

- `scrollToBottom()` - 滚动到底部

**特点**:

- 自动滚动到底部
- 打字指示器动画
- 自定义滚动条

---

### 8. ChatInput.vue

**职责**: 消息输入区域

**Props**:

- `modelValue: string` - v-model 绑定值

**Events**:

- `update:modelValue: (value: string)` - 更新输入值
- `send: (message: string)` - 发送消息
- `voice`: 语音输入

**特点**:

- 支持 Enter 发送，Shift+Enter 换行
- 禁用状态处理

---

### 9. ChatMain.vue

**职责**: 主聊天区域容器，组合头部、消息列表和输入框

**Props**:

- `greeting: string` - 问候语
- `messages: Message[]` - 消息数组
- `isLoading: boolean` - 加载状态
- `userInitial: string` - 用户首字母

**Events**:

- `home`: 首页
- `notification`: 通知
- `profile`: 个人资料
- `send: (message: string)` - 发送消息
- `voice`: 语音输入

**暴露方法**:

- `scrollToBottom()` - 滚动到底部

---

### 10. AiChat.vue (主组件)

**职责**: 主容器组件，负责状态管理和业务逻辑

**特点**:

- 使用 `useAiChat` composable 管理聊天状态
- 协调所有子组件
- 处理消息发送和对话切换逻辑

## 设计原则

### 1. 单一职责

每个组件只负责一个特定的功能模块

### 2. 纯组件优先

大部分组件都是纯展示组件，通过 props 接收数据，通过 events 向上传递操作

### 3. 可重用性

组件设计考虑了可重用性，可以在其他场景下使用

### 4. 类型安全

使用 TypeScript 确保类型安全，定义清晰的 Props 和 Events 接口

### 5. 样式封装

每个组件的样式都使用 scoped，避免样式污染

## 使用示例

```vue
<template>
  <AiChat />
</template>

<script setup lang="ts">
import AiChat from "@/features/ai-chat/AiChat.vue";
</script>
```

或单独使用某个组件:

```vue
<template>
  <ChatInput v-model="message" @send="handleSend" @voice="handleVoice" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChatInput } from "@/features/ai-chat/components";

const message = ref("");

const handleSend = (msg: string) => {
  console.log("Send:", msg);
};

const handleVoice = () => {
  console.log("Voice input");
};
</script>
```

## 优化建议

### 已实现

- ✅ 组件拆分
- ✅ 类型定义
- ✅ 事件通信
- ✅ 样式封装

### 可继续优化

- 🔲 使用 Pinia 进行状态管理（如果应用变大）
- 🔲 添加单元测试
- 🔲 使用弹窗组件替代 prompt/confirm
- 🔲 添加键盘快捷键支持
- 🔲 添加拖拽调整侧边栏宽度功能
- 🔲 支持 Markdown 渲染
- 🔲 添加代码高亮
- 🔲 消息编辑和删除功能

## 依赖关系图

```
AiChat.vue
├── ChatSidebar
│   ├── SidebarHeader
│   ├── FeatureList
│   └── ChatHistory
└── ChatMain
    ├── ChatHeader
    ├── MessageList
    │   └── MessageItem (循环)
    └── ChatInput
```
