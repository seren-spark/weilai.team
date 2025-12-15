# 虚拟滚动测试指南

## 🧪 测试方法

### 方法 1: 浏览器控制台测试（最快）

1. 打开浏览器开发者工具 (F12)
2. 在 Console 中运行以下代码生成 100 条测试消息：

```javascript
// 获取 Vue 应用实例并生成测试消息
const testVirtualScroll = () => {
  // 模拟生成大量消息
  const messages = [];
  for (let i = 0; i < 100; i++) {
    messages.push({
      id: `test-msg-${i}`,
      role: i % 2 === 0 ? "user" : "assistant",
      content: `测试消息 ${i + 1}\n\n这是用于测试虚拟滚动的消息内容。包含一些 **Markdown** 格式和代码：\n\n\`\`\`javascript\nconst test = ${i};\nconsole.log(test);\n\`\`\``,
      time: new Date().toLocaleTimeString(),
    });
  }
  console.log("✅ 生成了", messages.length, "条测试消息");
  return messages;
};

// 运行测试
testVirtualScroll();
```

### 方法 2: 修改 content.ts 文件

修改 `src/features/ai-chat/const/content.ts`，将内容重复多次：

```typescript
export const streamContent = `原内容`.repeat(20); // 重复20次
```

### 方法 3: 添加调试日志

在 `MessageList.vue` 中已经准备好了虚拟化相关的状态，可以在浏览器控制台中查看：

```javascript
// 检查虚拟化是否启用
// 当消息数量 > 50 时应该自动启用
```

## 🔍 验证检查项

### 1. 虚拟化是否启用

- **检查**: 打开 Vue DevTools，查看 `MessageList` 组件
- **预期**: 当 messages.length > 50 时，`virtualizationEnabled` = true

### 2. DOM 节点数量

- **检查**: 在开发者工具 Elements 面板中，展开消息容器
- **预期**:
  - 消息数 < 50: 全部渲染
  - 消息数 > 50: 只渲染约 50-70 个消息节点
  - 应该看到 `message-spacer` 占位元素

### 3. 滚动性能

- **检查**: 快速上下滚动消息列表
- **预期**:
  - 滚动流畅，无卡顿
  - 消息动态加载/卸载
  - 占位空间高度变化

### 4. 智能滚动

- **检查**:
  1. 在流式渲染时向上滚动查看历史
  2. 观察是否被强制拉回底部
- **预期**:
  - 向上查看时不应该被打断
  - 回到底部附近时恢复自动滚动

### 5. 高度测量

- **检查**: 在控制台运行

```javascript
// 查看 MessageList 组件实例
// messageHeights 应该记录了各消息的高度
// heightStats 应该有统计信息
```

## 📊 性能对比

### 测试场景: 1000 条消息

| 指标         | 无虚拟滚动 | 有虚拟滚动 |
| ------------ | ---------- | ---------- |
| DOM 节点     | ~1000      | ~70        |
| 初始渲染时间 | 慢         | 快         |
| 滚动 FPS     | <30        | 60         |
| 内存占用     | 高         | 低         |

## 🐛 常见问题排查

### 问题1: 虚拟化未启用

- **检查**: messages.length 是否 > 50
- **解决**: 生成更多测试消息

### 问题2: 滚动跳动

- **检查**: 消息高度是否正确测量
- **解决**: 确保 `setMessageContentRef` 正常工作

### 问题3: 占位空间高度不准确

- **检查**: `averageMessageHeight` 的值
- **解决**: 调整默认高度估算值（当前120px）

### 问题4: 新消息不自动滚动

- **检查**: `focusIndex` 是否更新到最后
- **解决**: 确保 watch messages.length 正常触发

## 🎯 关键代码位置

### 虚拟化配置

- 文件: `MessageList.vue:198-200`
- 可调参数: `MAX_LIVE_MESSAGES`, `LIVE_MESSAGE_BUFFER`

### 高度测量

- 函数: `recordMessageHeight` (line 250)
- 函数: `setMessageContentRef` (line 351)

### 滚动同步

- 函数: `syncFocusToScroll` (line 310)
- 函数: `scheduleScrollSync` (line 323)

### 渲染窗口

- 函数: `updateLiveRange` (line 293)
- 计算属性: `visibleMessages` (line 368)

## 🚀 快速测试命令

```bash
# 启动开发服务器
npm run dev

# 或者使用 pnpm
pnpm dev
```

打开浏览器后：

1. 进入 AI 聊天页面
2. 等待自动流式渲染完成（这会生成第一条消息）
3. 使用浏览器控制台生成更多测试消息（见方法1）
4. 观察虚拟滚动效果

## ✅ 预期结果

1. **消息数 < 50**: 正常渲染所有消息
2. **消息数 > 50**:
   - 只渲染可见区域的消息（约50-70条）
   - 顶部和底部有占位空间
   - 滚动时动态加载新消息
   - 性能流畅，无卡顿
3. **流式渲染**: 自动聚焦到最新消息
4. **用户滚动**: 向上查看时不被打断
