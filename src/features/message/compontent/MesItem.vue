<template>
  <div class="mesItem">
    <UserAvatar
      class="avatar"
      :avatar="props.message.headPortrait || ''"
      @click="skipPersonCenter(props.message.senderId)"
    />
    <div class="mesContent">
      <div class="details">
        <div class="name" @click="skipPersonCenter(props.message.senderId)">
          {{ props.message.username }}
          <!-- 大屏幕时显示类型提示 -->
          <span
            v-if="isLargeScreen && props.message.messageType === 1"
            class="type"
            >点赞了你的文章</span
          >
          <span
            v-else-if="isLargeScreen && props.message.messageType === 2"
            class="type"
            >收藏了你的文章</span
          >
          <span
            v-else-if="isLargeScreen && props.message.messageType === 3"
            class="type"
            >评论了你的文章</span
          >
          <span
            v-else-if="isLargeScreen && props.message.messageType === 4"
            class="type"
            >评论了你</span
          >
          <span
            v-else-if="isLargeScreen && props.message.messageType === 5"
            class="hide"
          ></span>
        </div>
        <div class="time">{{ formattedTime }}</div>
      </div>
      <!-- 小屏幕时显示类型提示 -->
      <div v-if="!isLargeScreen" class="type-mobile">
        <span v-if="props.message.messageType === 1" class="type"
          >点赞了你的文章</span
        >
        <span v-else-if="props.message.messageType === 2" class="type"
          >收藏了你的文章</span
        >
        <span v-else-if="props.message.messageType === 3" class="type"
          >评论了你的文章</span
        >
        <span v-else-if="props.message.messageType === 4" class="type"
          >评论了你</span
        >
        <span v-else-if="props.message.messageType === 5" class="hide"></span>
      </div>
      <div v-if="splitResult.texts != null" class="content">
        {{ splitResult.texts }}
      </div>
      <div v-if="splitResult.imgUrls" class="imgCon">
        <img :src="splitResult.imgUrls" />
      </div>
      <div class="postLink">
        <a :href="`/community/post/${props.message.postId}`"
          ># {{ props.message.postTitle }}</a
        >
      </div>
      <Icon
        icon="fluent:delete-24-regular"
        class="deleteIcon"
        @click="deleteMessage()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { computed, defineProps, defineEmits } from "vue";
import { formatPostTime } from "@/utils/formatPostTime";
import UserAvatar from "@/components/avatar/UserAvatar.vue";
import type { SSEMessageData } from "../../../types/sseType";
import { showConfirm } from "@/composables/useConfirm";
import { useAlert } from "@/composables/useAlert";
import apiClient from "@/api/axios";
import { useRequest } from "vue-request";
import { skipPersonCenter } from "@/composables/useCommunity";

const props = defineProps<{
  message: SSEMessageData;
}>();
const emit = defineEmits(["like", "comment", "system"]);
const formattedTime = computed(() => formatPostTime(props.message.createdAt));
const { showAlert } = useAlert();
const deleteMessage = () => {
  showConfirm({
    content: "确定删除此条消息吗？",
  })
    .then(() => {
      run(props.message.messageId);
    })
    .catch(() => {});
};
// 删除单个信息
function deleteOnes(messageId: number) {
  return apiClient.delete(`/message/deleteOneMessage/${messageId}`);
}
const { data, run } = useRequest(deleteOnes, {
  manual: true,
});

watch(
  () => data.value,
  () => {
    if (data.value?.code === 200) {
      if (props.message.messageType === 1 || props.message.messageType === 2) {
        emit("like");
        showAlert("删除成功", "pass");
      } else if (
        props.message.messageType === 3 ||
        props.message.messageType === 4
      ) {
        emit("comment");
        showAlert("删除成功", "pass");
      } else if (props.message.messageType === 5) {
        emit("system");
        showAlert("删除成功", "pass");
      }
    } else if (data.value?.code === 4003) {
      showAlert("未查找到信息", "error");
    } else {
      showAlert("删除失败", "error");
    }
  },
);
const splitResult = computed(() => {
  const content = props.message?.content;
  if (!content) {
    return {
      texts: "",
      imgUrls: "",
    };
  }
  const splitPattern = "<!-- IMG_SPLIT -->";
  const parts = content.split(splitPattern);
  const texts = parts
    .filter((part: string, index: number) => index % 2 === 0)
    .join("");
  const imgUrls = parts
    .filter((part: string, index: number) => index % 2 !== 0)
    .join("");

  return {
    texts,
    imgUrls,
  };
});

// 响应式判断屏幕大小
const isLargeScreen = ref(window.innerWidth > 480);

const handleResize = () => {
  isLargeScreen.value = window.innerWidth > 480;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.hide {
  display: none;
}
.mesItem {
  width: 98%;
  margin-bottom: 10px;
  padding-bottom: 15px;
  background-color: white;
  border-radius: 5px;
  display: flex;

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 18px 15px 15px 15px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .mesContent {
    width: calc(100% - 73px);
    height: 100%;
    padding-right: 3%;
    .details {
      width: 100%;
      height: 20px;
      color: var(--secondary-foreground);
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      margin: 15px 0 4px 0;
      .name {
        color: #636b71;
        cursor: pointer;
        font-size: 14px;
        margin-right: 6px;
        justify-content: flex-start;
        span {
          color: var(--secondary-foreground);
          font-size: 13px;
          margin-left: 7px;
        }
      }
      .name:hover {
        color: #2e9cbe;
      }

      .time {
        // margin-right: 20px;
        color: #868787;
        font-size: 13px;
        justify-content: flex-end;
      }
    }
    .content {
      width: calc(100% - 20px);
      font-size: 14px;
      margin-bottom: 4px;
      word-break: break-all;
      color: var(--foreground);
    }
    .postLink {
      cursor: pointer;
      max-width: calc(100% - 20px);
      font-size: 12px;
      margin-bottom: 6px;
      min-height: 23px;
      border-bottom: 1px solid var(--border);
      color: var(--secondary-foreground);
    }
    .postLink:hover {
      color: #5db0da;
    }
    .imgCon {
      width: 150px;
      height: auto;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin-bottom: 5px;
      }
    }
    .deleteIcon {
      font-size: 16px;
      cursor: pointer;
      color: var(--secondary-foreground);
    }
  }
}

@media screen and (max-width: 768px) {
  .mesItem {
    width: 100%;
    margin-right: 0;
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      margin: 15px 9px 9px 9px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .mesItem {
    .mesContent {
      width: calc(100% - 60px);
      .details {
        .name {
          font-size: 13px;
        }
      }
    }
    .type-mobile {
      margin-bottom: 6px;
      font-size: 13px;
      color: #636b71;
    }
  }
}
</style>
