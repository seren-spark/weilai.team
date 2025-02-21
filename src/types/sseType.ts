// 定义SSE事件类型
export type SSEEventType = "message" | "open" | "error" | "notice";

// 定义消息数据类型
export type SSEMessageData = {
  messageId: number;
  messageType: number;
  senderId: number;
  username: string;
  headPortrait: string | null;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
};

// 定义通知数据类型
export type SSENoticeData = {
  noticeId: string;
  title: string;
  content: string;
  createAt: string;
  senderId: number;
  username: string;
  headPortrait: string;
  status: number | null;
};
