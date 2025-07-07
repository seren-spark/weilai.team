import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  SSEMessageData,
  SSENoticeData,
  SSEEventType,
} from "../types/sseType";
import { useMessageStore } from "./messageStore";
import { useNoticeStore } from "@/store/UseNoticeStore";
import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";

const messageStore = useMessageStore();
const noticeStore = useNoticeStore();
type Observer<T> = (data: T) => void;
export const useSseStore = defineStore("sse", () => {
  const sseUrl = ref<string>("");
  const isConnected = ref<boolean>(false);
  const observers: Record<
    SSEEventType,
    Observer<SSEMessageData | SSENoticeData>[]
  > = {
    message: [],
    notice: [],
    open: [],
    error: [],
  };
  let reconnectAttempts = 0;
  const reconnectInterval = 5000; // 初始重连间隔
  const maxReconnectAttempts = 10; // 最大重连次数

  // 连接 SSE
  const connect = () => {
    if (!navigator.onLine) {
      console.error("当前设备未联网，请检查网络连接后重试");
      return;
    }
    // sseUrl.value = "http://49.232.183.67:8087/message/sse/addClient";
    sseUrl.value = " http://49.235.191.34:8087/message/sse/addClient";
    try {
      reconnectAttempts = 0; // 重置重试次数
      fetchEventSource(sseUrl.value, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        onopen: async () => {
          console.log("SSE连接已打开");
          isConnected.value = true;
          notify("open");
          return Promise.resolve();
        },
        onmessage: handleMessage,
        onerror: (error) => {
          console.error("SSE连接出错", error);
          isConnected.value = false;
          handleReconnect();
          notify("error", error);
        },
      });
    } catch (error) {
      console.error("连接SSE失败", error);
      isConnected.value = false;
      handleReconnect();
    }
  };

  // 处理接收到的消息
  const handleMessage = (event: EventSourceMessage) => {
    console.log("收到SSE消息:", event.data);
    try {
      const data = JSON.parse(event.data);
      if (
        !data.hasOwnProperty("messageId") &&
        !data.hasOwnProperty("noticeId")
      ) {
        console.error("接收到的SSE消息数据格式不正确，缺少必要字段");
        return;
      }

      if (data.hasOwnProperty("messageType")) {
        const messageType = data.messageType;
        switch (messageType) {
          case 1:
          case 2:
            messageStore.setLikeStatus(true);
            break;
          case 3:
            messageStore.setCommentStatus(true);
            break;
          case 4:
            messageStore.setNotificationStatus(true);
            break;
          default:
            console.warn(`接收到未知类型的messageType: ${messageType}`);
            break;
        }
      }

      if (data.hasOwnProperty("noticeId")) {
        const newNotice: SSENoticeData = data;
        notify("notice", newNotice);
        noticeStore.setHasUnreadNotice(true);
      } else if (data.hasOwnProperty("messageId")) {
        const newMessage: SSEMessageData = data;
        notify("message", newMessage);
      }
    } catch (error) {
      console.error("解析SSE消息数据失败", error);
    }
  };

  // 订阅事件
  const subscribe = (
    eventType: SSEEventType,
    callback: Observer<SSEMessageData | SSENoticeData>,
  ) => {
    observers[eventType].push(callback);
  };

  // 取消订阅事件
  const unsubscribe = (
    eventType: SSEEventType,
    callback: Observer<SSEMessageData | SSENoticeData>,
  ) => {
    const index = observers[eventType].indexOf(callback);
    if (index > -1) observers[eventType].splice(index, 1);
  };

  // 通知所有订阅者
  const notify = (
    eventType: SSEEventType,
    data?: SSEMessageData | SSENoticeData,
  ) => {
    observers[eventType].forEach((observer) => {
      if (data) {
        observer(data);
      } else {
        // observer(new Event(eventType));
      }
    });
  };

  // 处理重连逻辑
  const handleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error("最大重试次数已达，停止重试");
      return;
    }

    reconnectAttempts++;
    const interval = Math.min(
      reconnectInterval * Math.pow(2, reconnectAttempts),
      60000,
    ); // 指数退避
    setTimeout(() => {
      const token = getToken();
      if (token) {
        connect();
      }
    }, interval);
  };

  // 获取 token
  const getToken = (): string => {
    const tokenValue = localStorage.getItem("token");
    if (tokenValue) {
      try {
        const tokenObject = JSON.parse(tokenValue);
        return tokenObject?.value || "";
      } catch (error) {
        console.error("解析token字符串失败", error);
      }
    }
    return "";
  };

  // 断开连接
  const disconnect = () => {
    isConnected.value = false;
    console.log("SSE连接已断开");
  };

  // 初始化时检查用户是否登录
  const init = () => {
    const token = getToken();
    if (token && !isConnected.value) {
      connect();
    }
  };

  // 初始化
  init();

  return {
    isConnected,
    connect,
    subscribe,
    unsubscribe,
    disconnect,
    notify,
  };
});
