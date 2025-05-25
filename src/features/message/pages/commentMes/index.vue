<template>
  <div class="" style="display: flex">
    <div class="commentCon">
      <div class="titleOptions">
        <Icon icon="ant-design:clear-outlined" class="clearIcon" />
        <div class="clearAll" @click="deleteAll">
          清空所有({{ totalCount }})
        </div>
      </div>
      <div ref="scrollRef" class="messageCon">
        <div v-if="loading && pageNumber === 1" class="loading-item">
          <div
            v-for="index in 6"
            :key="index"
            class="flex items-center space-x-4"
          >
            <Skeleton class="h-12 w-12 rounded-full bg-[--muted]" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-[250px] bg-[--muted]" />
              <Skeleton class="h-4 w-[200px] bg-[--muted]" />
            </div>
          </div>
        </div>
        <NoData v-else-if="totalCount === 0" />
        <div v-else class="messageList">
          <div
            v-for="message in messages"
            :key="message.messageId"
            class="mess"
          >
            <MesItem :message="message" @comment="run()" />
          </div>
          <!-- 加载更多时的骨架屏 -->
          <div v-if="loadingMore" class="loading-more">
            <div class="flex items-center space-x-4">
              <Skeleton class="h-12 w-12 rounded-full bg-[--muted]" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-[250px] bg-[--muted]" />
                <Skeleton class="h-4 w-[200px] bg-[--muted]" />
              </div>
            </div>
          </div>
          <!-- 已经到底了 -->
          <div v-if="isOver && messages.length > 6" class="over">
            已经到底了
          </div>
        </div>
      </div>
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
import { showConfirm } from "@/composables/useConfirm";
import NoData from "../../../../components/loading/NoData.vue";
import Rightbar from "@/components/community/Rightbar.vue";
import { Icon } from "@iconify/vue";
import MesItem from "../../compontent/MesItem.vue";
import type { SSEMessageData, SSENoticeData } from "../../../../types/sseType";
import { useSseStore } from "../../../../store/useSseStore";
import { onMounted, ref, watch, onUnmounted } from "vue";
import { useMessageStore } from "@/store/messageStore";
import { useAlert } from "@/composables/useAlert";
import apiClient from "@/api/axios";
import { useRequest } from "vue-request";

const { showAlert } = useAlert();
const sseStore = useSseStore();
const messageStore = useMessageStore();
const messages = ref<SSEMessageData[]>([]);
const messageType = 3;
const pageSize = 10;
const pageNumber = ref(1); // 改为ref实现响应式
const totalCount = ref(0);
const scrollRef = ref<HTMLElement>();
const loadingMore = ref(false);
const isOver = ref(false);

onMounted(() => {
  sseStore.subscribe("message", (data: SSEMessageData | SSENoticeData) => {
    if ("messageId" in data && data.messageType === messageType) {
      messages.value.unshift(data as SSEMessageData);
      messageStore.setCommentStatus(true);
    }
  });
  run();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

//渲染消息列表
const messageList = () => {
  return apiClient.get(
    `/message/getMessageInfo?messageType=${messageType}&pageSize=${pageSize}&pageNumber=${pageNumber.value}`,
  );
};

const { data, loading, run } = useRequest(messageList, {
  loadingKeep: 650,
});

watch(
  () => data.value,
  () => {
    if (data.value?.code == 200) {
      totalCount.value = data.value?.data.PageInfo.totalCount;
      const allMessages = data.value?.data.AllMessages || [];

      if (pageNumber.value === 1) {
        messages.value = allMessages;
      } else {
        messages.value = [...messages.value, ...allMessages];
      }

      if (
        allMessages.length < pageSize ||
        messages.value.length >= totalCount.value
      ) {
        isOver.value = true;
      }

      messageStore.setCommentStatus(false);
      loadingMore.value = false;
    } else if (data.value?.code == 401) {
      showAlert("请先登录", "waring");
    } else {
      showAlert("获取失败", "error");
    }
  },
);

// 滚动加载更多
const handleScroll = async () => {
  if (loadingMore.value || isOver.value) return;

  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadingMore.value = true;
    pageNumber.value++;
    await run();
  }
};

//删除所有评论消息
function deleteAllMes(messageType: number) {
  return apiClient.delete(
    `/message/deleteAllMessages?messageType=${messageType}`,
  );
}
const { data: deleteData, run: deleteRun } = useRequest(deleteAllMes, {
  manual: true,
});

function deleteAll() {
  showConfirm({
    content: "确定清空所有评论消息吗？",
  })
    .then(() => {
      deleteRun(messageType);
    })
    .catch(() => {});
}

watch(
  () => deleteData.value,
  () => {
    if ((deleteData.value as any).code == 200) {
      showAlert("清除成功", "pass");
      // 清空后重置状态并重新加载第一页
      pageNumber.value = 1;
      isOver.value = false;
      messages.value = [];
      run();
    } else {
      showAlert("清除失败", "error");
    }
  },
);
</script>

<style scoped lang="scss">
.commentCon {
  width: 100%;
  padding-bottom: 60px;
  .titleOptions {
    width: 100%;
    height: 50px;
    padding-left: 20px;
    display: flex;
    cursor: pointer;
    .clearAll {
      width: 130px;
      font-size: 15px;
    }
    .clearIcon {
      margin: 2px 4px 0 0px;
      font-size: 19px;
    }
  }
  .messageCon {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.loading-item {
  width: 94%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 45px;
  .items-center {
    width: 100%;
    min-height: 100px;
    margin-bottom: 10px;
  }
}

.messageList {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.mess {
  width: 95%;
}

.loading-more {
  width: 100%;
  padding: 10px;
  .flex {
    width: 100%;
    min-height: 80px;
  }
}

.over {
  text-align: center;
  font-size: 0.825rem;
  color: var(--secondary-foreground);
  font-weight: 500;
  width: 100%;
  padding: 10px;
}

@media screen and (max-width: 768px) {
  .commentCon {
    margin-top: 40px;
    width: 100%;
    .titleOptions {
      width: 100%;
      margin-top: 15px;
      height: 30px;
      .clearIcon {
        margin: 2px 4px 0 5px;
        font-size: 19px;
      }
    }
    .messageCon {
      width: 100%;
      .mesItem {
        width: 100%;
        margin-right: 0;
      }
    }
  }
}
</style>
