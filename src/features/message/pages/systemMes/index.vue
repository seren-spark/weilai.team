<template>
  <div class="" style="display: flex">
    <div class="commentCon">
      <div class="titleOptions">
        <Icon icon="ant-design:clear-outlined" class="clearIcon" />
        <div class="clearAll" @click="deleteAll">
          清空所有({{ totalCount }})
        </div>
      </div>
      <div class="messageCon">
        <NoData v-if="totalCount === 0" />
        <div v-else-if="loading" class="loading-item">
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
        <div v-else class="messageList">
          <div
            v-for="message in messages"
            :key="message.messageId"
            class="mess"
          >
            <MesItem :message="message" @comment="run()" />
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
import { onMounted, ref, watch } from "vue";
import { useSseStore } from "../../../../store/useSseStore";
import { useMessageStore } from "@/store/messageStore";
import type { SSEMessageData, SSENoticeData } from "../../../../types/sseType";
import { useAlert } from "@/composables/useAlert";
import apiClient from "@/api/axios";
import { useRequest } from "vue-request";
const { showAlert } = useAlert();
const messageStore = useMessageStore();
const sseStore = useSseStore();
const messages = ref<SSEMessageData[]>([]);
const messageType = 5;
const pageSize = 10;
const pageNumber = 1;
const totalCount = ref(0);
onMounted(() => {
  sseStore.subscribe("message", (data: SSENoticeData | SSEMessageData) => {
    if ("messageId" in data && data.messageType === messageType) {
      messages.value.unshift(data as SSEMessageData);
      console.log(data);
      messageStore.setNotificationStatus(true);
    }
  });
  run();
});

//渲染消息列表
const messageList = () => {
  return apiClient.get(
    `/message/getMessageInfo?messageType=${messageType}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
  );
};
const { data, run, loading } = useRequest(messageList, {
  loadingKeep: 650,
});
watch(
  () => data.value,
  () => {
    if (data.value?.code == 200) {
      totalCount.value = data.value?.data.PageInfo.totalCount;
      const allMessages = data.value?.data.AllMessages || [];
      messages.value = allMessages;
      console.log(allMessages);
      messageStore.setNotificationStatus(false);
    } else if (data.value?.code == 401) {
      showAlert("请先登录", "waring");
    } else {
      showAlert("获取失败", "error");
      console.log(data.value);
    }
  },
);
//清空所有
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
    content: "确定清空所有系统通知吗？",
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
      showAlert("删除成功", "pass");
      run();
    } else {
      showAlert("删除失败", "error");
    }
  },
);
</script>

<style scoped lang="scss">
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
.comments {
  width: 690px;
}
.mess {
  width: 95%;
}
.messageList {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
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
