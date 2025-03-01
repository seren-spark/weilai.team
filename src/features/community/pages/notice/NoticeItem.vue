<script setup lang="ts">
import { formatPostTime } from "@/utils/formatPostTime";
import { Icon } from "@iconify/vue";
import { defineProps, ref, onMounted, nextTick } from "vue";
import { useRequest } from "@/composables/useRequest";
import UserAvatar from "@/components/avatar/UserAvatar.vue";
import { useAlert } from "@/composables/useAlert";
const { data, executeRequest } = useRequest();
import type { SSENoticeData } from "../../../../types/sseType";
import { showConfirm } from "@/composables/useConfirm";
import { skipPersonCenter } from "@/composables/useCommunity";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface NoticeContent {
  type: string;
  content: {
    type: "paragraph";
    content: {
      type: "text";
      text: string;
    }[];
  }[];
}
const noticeContentRef = ref<HTMLElement | null>(null);
const isShow = ref(false);
const userId = ref(JSON.parse(localStorage.getItem("userId") || "{}").value);
console.log(userId.value);
const { showAlert } = useAlert();
// const showText = ref("展开");
// const toggleContent = () => {
//   if (showText.value === "收起") {
//     noticeContentRef.value!.style.overflow = "hidden";
//     noticeContentRef.value!.style.height = "10px";
//     showText.value = "展开";
//   } else {
//     showText.value = isShow.value ? "收起" : "展开";
//     if (isShow.value) {
//       noticeContentRef.value!.style.overflow = "visible";
//       noticeContentRef.value!.style.height = "auto";
//     } else {
//       noticeContentRef.value!.style.overflow = "hidden";
//       noticeContentRef.value!.style.height = "50px";
//     }
//   }
// };
onMounted(() => {
  nextTick(() => {
    if (noticeContentRef.value) {
      const height = noticeContentRef.value.clientHeight;
      if (height > 50) {
        isShow.value = true;
        noticeContentRef.value.style.overflow = "hidden";
        noticeContentRef.value.style.height = "50px";
      }
    }
  });
});

const props = defineProps<{
  notice: SSENoticeData;
  noticeList: Function;
  getNotReadCount: Function;
}>();

const createAt = formatPostTime(props.notice.createAt);

//转换
function handleNotice() {
  let noticeText = "";
  try {
    let jsonObj: NoticeContent = JSON.parse(props.notice.content);
    if (
      jsonObj.content &&
      jsonObj.content.length > 0 &&
      jsonObj.content[0].content &&
      jsonObj.content[0].content.length > 0
    ) {
      let targetText = jsonObj.content[0].content[0].text;
      noticeText = targetText;
    }
  } catch (error) {
    console.error("解析JSON字符串失败:", error);
  }
  return noticeText;
}
let noticeTxt = handleNotice();

//删除单个公告
const deleteNotice = async (noticeId: string) => {
  showConfirm({
    content: "确定删除该公告吗？",
  })
    .then(async () => {
      await executeRequest({
        url: `/notice/deleteNotice/${noticeId}`,
        method: "delete",
      });
      if (data.value?.code === 200) {
        props.noticeList();
        showAlert("删除成功", "pass");
      } else {
        showAlert("删除失败", "error");
      }
    })
    .catch(() => {});
};
//标记单个为已读
const readNotice = async (noticeId: string) => {
  showConfirm({
    content: "确定标记该公告为已读吗？",
  })
    .then(async () => {
      await executeRequest({
        url: `/notice/markUnReadNoticeAsRead/${noticeId}`,
        method: "put",
      });
      console.log(data.value);
      if (data.value?.code === 200) {
        props.noticeList();
        props.getNotReadCount();
        showAlert("标记已读成功", "pass");
      } else {
        console.log(data.value);

        showAlert("标记失败", "error");
      }
    })
    .catch(() => {});
};
</script>

<template>
  <div style="display: flex" class="noticeBox">
    <!-- 公告模板 -->
    <div class="noticeItem">
      <!-- 个人信息以及编辑操作 -->
      <div class="userInfo">
        <div class="action">
          <div
            class="publish-avatar"
            @click="skipPersonCenter(props.notice.senderId)"
          >
            <UserAvatar :avatar="props.notice.headPortrait" />
          </div>
          <div
            class="nickName"
            @click="skipPersonCenter(props.notice.senderId)"
          >
            {{ props.notice.username }}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RouterLink to="/noticeEdit">
                  <span v-if="userId === props.notice.senderId" class="edit"
                    ><Icon icon="mage:edit-pen" class="editIcon"
                  /></span>
                </RouterLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>编辑</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span
                  v-if="userId === props.notice.senderId"
                  class="delete"
                  @click="deleteNotice(props.notice.noticeId)"
                  ><Icon icon="fluent:delete-24-regular" class="deleteIcon"
                /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>删除</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider v-if="props.notice.status === 0">
            <Tooltip>
              <TooltipTrigger
                v-if="userId != props.notice.senderId"
                class="tooltip_trigger"
              >
                <span class="alRead" @click="readNotice(props.notice.noticeId)"
                  ><Icon
                    icon="material-symbols:mark-email-read-outline-rounded"
                    style="color: #7b8287"
                    class="alReadIcon"
                /></span>
                <span class="dot"></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>标记为已读</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div class="publish-time">{{ createAt }}</div>
      </div>
      <!-- 公告内容 -->
      <RouterLink
        :to="{
          path: `/community/post/${props.notice.noticeId}`,
          query: { uniqueId: 1 },
        }"
      >
        <div class="noticeDetalis">
          <div class="notice-title">{{ props.notice.title }}</div>
          <div ref="noticeContentRef" class="notice-content">
            {{ noticeTxt }}
          </div>
          <!-- <div class="notice-urls">
              <div v-for="url in props.notice.noticeUrls" :key="url">
                <img :src="url">
              </div>
            </div> -->
        </div>
      </RouterLink>
      <!-- <div class="show" v-show="isShow" @click="toggleContent">
        {{ showText
        }}<Icon icon="cuida:caret-down-outline" class="arrowsIcon" />
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.noticeBox {
  width: 100%;
  flex-wrap: wrap;
}
.tooltip_trigger {
  position: relative;
}
.noticeItem {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  .userInfo {
    display: flex;
    padding-bottom: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    .action {
      display: flex;
    }
    .publish-avatar {
      width: 50px;
      height: 50px;
      cursor: pointer;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .nickName {
      margin: 15px;
    }
    .editIcon {
      font-size: 17px;
      color: var(--secondary-foreground);
      margin: 2px 10px 0 0;
      cursor: pointer;
    }
    .deleteIcon {
      font-size: 17px;
      color: var(--secondary-foreground);
      margin: 2px 10px 0 0;
      cursor: pointer;
    }
    .alReadIcon {
      font-size: 18px;
      color: var(--secondary-foreground);
      margin: 2px 10px 0 0;
      cursor: pointer;
    }
    .dot {
      width: 6px;
      height: 6px;
      position: absolute;
      top: 30%;
      right: 10%;
      border-radius: 50%;
      background-color: rgb(220, 4, 4);
    }
    .publish-time {
      margin-top: 17px;
      justify-content: flex-end;
      font-size: 13px;
      margin-right: 10px;
      color: var(--secondary-foreground);
    }
  }
  .noticeDetalis {
    width: 100%;
    padding: 10px 5px;
    .notice-urls {
      width: 100%;
      display: flex;
      img {
        width: auto;
        height: 150px;
        object-fit: cover;
        margin-right: 5px;
      }
    }
    .notice-title {
      width: 100%;
      font-weight: bold;
      font-size: 15px;
      margin: 0px 0 10px 0px;
      color: rgb(66, 65, 65);
    }
    .notice-content {
      color: #767575;
      font-size: 14px;
      line-height: 1.5;
      overflow: hidden;
      white-space: normal;
      word-break: break-word;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    }
  }
  .noticeDetalis:hover {
    background-color: rgb(248, 248, 250);
  }
  .show {
    cursor: pointer;
    display: flex;
    font-size: 15px;
    justify-content: flex-end;
    .arrowsIcon {
      margin: 5px 0 0 3px;
    }
  }
}
</style>
