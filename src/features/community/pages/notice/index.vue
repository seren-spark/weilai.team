<template>
  <div class="outCon" style="display: flex">
    <div class="noticeCon">
      <div class="actionCon">
        <div class="allNotice">
          全部({{ total }})
          <div v-if="noticeStore.hasUnreadNotice" class="dot"></div>
        </div>
        <div class="noRead">
          未读({{ notReadCount }})
          <div v-if="noticeStore.hasUnreadNotice" class="dot"></div>
        </div>
        <div class="settings">
          <DropdownMenu :style="{ width: '80px' }">
            <DropdownMenuTrigger>
              <Icon icon="carbon:settings-adjust" class="settingIcon"
            /></DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-[--radix-dropdown-menu-trigger-width] rounded-lg p-0"
              side="bottom"
              :side-offset="1"
            >
              <DropdownMenuSeparator />
              <DropdownMenuItem class="drop-menu-item" @click="readAllNotice"
                >全部已读</DropdownMenuItem
              >
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="noticeItemCon">
        <NoData v-if="notices.length === 0" />
        <div v-else class="noticeList">
          <div
            v-for="notice in notices"
            :key="notice.noticeId"
            class="noticess"
          >
            <NoticeItem
              :notice="notice"
              :notice-list="noticeList"
              :get-not-read-count="getNotReadCount"
            />
          </div>
        </div>
      </div>
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
import { useAlert } from "@/composables/useAlert";
import NoData from "../../../../components/loading/NoData.vue";
import { Icon } from "@iconify/vue";
import Rightbar from "../../../../components/community/Rightbar.vue";
import NoticeItem from "./NoticeItem.vue";
import { onMounted, ref } from "vue";
import { useRequest } from "@/composables/useRequest";
import { useSseStore } from "../../../../store/useSseStore";
import { useNoticeStore } from "@/store/UseNoticeStore";
import { showConfirm } from "@/composables/useConfirm";
import type { SSENoticeData, SSEMessageData } from "../../../../types/sseType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notices = ref<SSENoticeData[]>([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const sseStore = useSseStore();
const noticeStore = useNoticeStore();
const { showAlert } = useAlert();
const { data, executeRequest } = useRequest();
let total = ref(0);
let notReadCount = ref(0);

onMounted(() => {
  sseStore.subscribe("notice", (data: SSENoticeData | SSEMessageData) => {
    if ("noticeId" in data) {
      notices.value.unshift(data as SSENoticeData);
      console.log(data);
    }
  });
  noticeList();
});

//获取公告列表
const noticeList = async () => {
  await executeRequest({
    url: `/notice/getNoticeInfo?pageSize=${pageSize.value}&pageNumber=${pageNumber.value}`,
    method: "get",
  });
  if (data.value?.code == 200) {
    const allNotices = data.value?.data.AllMessages || [];
    notices.value = allNotices;
    total.value = data.value?.data.PageInfo.totalCount;
    console.log("获取的全部公告数据：", allNotices);
  } else if (data.value?.code == 401) {
    console.log("请先登录");
  } else {
    console.log("获取失败");
    console.log(data.value);
  }
};
//获取未读公告数量
const getNotReadCount = async () => {
  await executeRequest({
    url: `/notice/getNotReadCount`,
    method: "get",
  });
  if (data.value?.code == 200) {
    notReadCount.value = data.value.data;
    if (notReadCount.value > 0) {
      noticeStore.setHasUnreadNotice(true);
    } else {
      noticeStore.setHasUnreadNotice(false);
    }
  }
};
getNotReadCount();
//全部已读
const readAllNotice = async () => {
  await showConfirm({
    content: "确定将所有未读消息标记为已读吗？",
  })
    .then(() => {
      executeRequest({
        url: `notice/markAllUnReadNoticeAsRead`,
        method: "put",
      });
      console.log(data.value);

      if (data.value?.code === 200) {
        showAlert("全部已读成功", "pass");
        noticeList();
        getNotReadCount();
      } else {
        showAlert("全部已读失败", "error");
      }
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.drop-menu-item {
  width: 100%;
  background-color: white;
  &:hover {
    background-color: var(--secondary);
  }
}
.aaa {
  width: 95%;
}
.noticess {
  width: 95%;
}
.noticeList {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.noticeItemCon {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.noticeCon {
  width: 100%;
  height: auto;
}
.actionCon {
  height: 50px;
  display: flex;
  font-size: 15px;
  .allNotice {
    min-width: 60px;
    height: 30px;
    color: gray;
    cursor: pointer;
    position: relative;
    margin-left: 20px;
    margin-right: 15px;
    padding-right: 13px;
    .dot {
      width: 6px;
      height: 6px;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 50%;
      background-color: rgb(220, 4, 4);
    }
  }
  .noRead {
    min-width: 60px;
    height: 30px;
    color: gray;
    cursor: pointer;
    margin-right: 100px;
    position: relative;
    .dot {
      width: 6px;
      height: 6px;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 50%;
      background-color: rgb(220, 4, 4);
    }
  }
  .settings {
    width: 30px;
    height: 30px;
    margin-left: auto;
    margin-right: 50px;
    .settingIcon {
      font-size: 22px;
      margin-top: 5px;
      color: gray;
    }
  }
}

@media screen and (max-width: 768px) {
  .outCon {
    margin-top: 100px;
    width: 100%;
  }
  .actionCon {
    .settings {
      margin-right: 20px;
    }
  }
}
</style>
