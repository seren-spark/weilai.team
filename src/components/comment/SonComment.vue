<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRequest } from "@/composables/useRequest";
import CommentForm from "./CommentForm.vue";
import { createUserInfo, getUserInfo } from "./index";
import { useAlert } from "@/composables/useAlert";
import UserAvatar from "../avatar/UserAvatar.vue";
import { formatPostTime } from "@/utils/formatPostTime";
import { showConfirm } from "@/composables/useConfirm";
import { skipPersonCenter } from "@/composables/useCommunity";
const props = defineProps({
  son: {
    type: Object,
    required: true,
  },
  isReply: {
    type: Boolean,
    required: true,
  },
  parentId: {
    type: Number,
    required: true,
  },
});
const { data, executeRequest } = useRequest();
const isFormVisible = ref(false);
const userInfos = ref(createUserInfo());
const emit = defineEmits(["liked", "deleted"]);
const { showAlert } = useAlert();

const commentTime = computed(() => {
  return formatPostTime(props.son.commentTime);
});
// 展开回复输入框
const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value;
};
onMounted(async () => {
  await getUserInfo(props.son.userId, userInfos.value);
});

// 将子评论id变成负数
const transformId = (id: number) => -id;
// 点赞/取消点赞评论
const likeComment = async (commentId: number) => {
  const CommentIded = transformId(commentId);
  await executeRequest({
    url: `/comment/likeOption/${CommentIded}`,
    method: "put",
  });
  if (data.value?.code === 200) {
    if (props.isReply && CommentIded < 0) {
      emit("liked", props.parentId);
      if (props.son.isLike) {
        showAlert("取消点赞成功", "pass");
      } else {
        showAlert("点赞成功", "pass");
      }
    }
  } else {
    showAlert("点赞失败", "error");
  }
};
//删除子评论
const deleteComment = async (commentId: number) => {
  const CommentIded = transformId(commentId);
  showConfirm({
    content: "确定删除该评论吗？",
  })
    .then(async () => {
      await executeRequest({
        url: `/comment/deleteComment/${CommentIded}`,
        method: "delete",
      });
      if (data.value?.code === 200) {
        showAlert("删除成功", "pass");
        emit("deleted", props.parentId);
      } else {
        showAlert("删除失败", "error");
      }
    })
    .catch(() => {});
};

const handleReply = () => {
  emit("liked", props.parentId);
};
</script>

<template>
  <div class="comment-item" :class="{ 'is-reply': isReply }">
    <UserAvatar
      class="avatar"
      :avatar="userInfos.headPortrait"
      @click="skipPersonCenter(son.userId)"
    />
    <div class="content-box">
      <div class="user-info">
        <span class="nickname" @click="skipPersonCenter(son.userId)">{{
          userInfos.name
        }}</span>
        <span class="time">{{ commentTime }}</span>
      </div>
      <div class="comment-text">
        <span
          v-if="isReply"
          :key="son.pointUser"
          class="reply-to"
          @click="skipPersonCenter(son.pointUser)"
          >{{ `@${son.userInfo?.name}` }}</span
        >
        {{ son.texts }}
      </div>
      <div v-if="son.imgUrls" class="image">
        <img :src="son.imgUrls" />
      </div>
      <div class="action-box">
        <div class="btnBox">
          <span class="reply-btn" @click="toggleForm">
            <Icon icon="fontisto:comment" class="replyIcon" />回复
          </span>
          <span
            v-if="son.isMyComment"
            class="delete-btn"
            @click="deleteComment(son.commentId)"
          >
            <Icon icon="fluent:delete-24-regular" class="deleteIcon" />删除
          </span>
          <span
            class="like-btn"
            :class="{ liked: son.isLike }"
            @click="likeComment(son.commentId)"
          >
            <Icon icon="uiw:like-o" class="likeIcon" />
            {{ son.likeCount }}
          </span>
        </div>
      </div>
      <CommentForm
        v-show="isFormVisible"
        :parent-id="props.parentId"
        :is-comment="false"
        :user-id="son.userId"
        @reply="handleReply"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.son-comments {
  width: 100%;
  flex-shrink: 0;
}
.image {
  width: 100%;
  height: auto;
  margin: 3px 0;
  img {
    width: 150px;
    height: auto;
    object-fit: cover;
    cursor: pointer;
  }
}

.comment-item {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 5px;
  min-height: 90px;
  overflow: hidden;
  border-top: 1px solid #e7e6e6;

  .avatar {
    width: 45px;
    height: 45px;
    margin-right: 10px;
    border-radius: 50%;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e2e2;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .content-box {
    width: calc(100% - 70px);
    margin-top: 10px;

    .user-info {
      display: flex;
      margin-bottom: 1px;

      .nickname {
        color: #585858;
        font-weight: bold;
        margin-right: 15px;
      }
      .time {
        margin-top: 4px;
        color: #999;
        font-size: 13px;
      }
    }

    .comment-text {
      color: #484747;
      font-size: 14px;
      line-height: 1.4;
      max-width: 550px;
      // margin-bottom: 5px;
      word-break: break-all;

      .reply-to {
        color: #ef8a0f;
        // font-style: italic;
      }
    }

    .action-box {
      width: 100%;
      height: 35px;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;

      .btnBox {
        display: flex;
        margin-top: 5px;
      }

      .reply-btn {
        display: flex;
        margin-right: 10px;
        font-size: 14px;
        color: gray;
        cursor: pointer;

        .replyIcon {
          color: gray;
          margin-top: 3px;
          margin-right: 5px;
        }
      }
      .likeIcon.liked {
        color: #3995d3;
        filter: drop-shadow(0 0 10px rgba(0, 187, 255, 0.8));
      }
      .like-btn.liked {
        color: #3995d3;
        text-shadow: 0 0 10px rgba(0, 187, 255, 0.8);
      }

      .like-btn {
        display: flex;
        font-size: 14px;
        color: gray;
        cursor: pointer;

        .likeIcon {
          display: inline-block;
          transition: box-shadow 0.3s ease-in-out;
          font-size: 17px;
          margin-top: 2px;
          margin-right: 5px;
        }
      }
      .delete-btn {
        display: flex;
        font-size: 14px;
        color: gray;
        cursor: pointer;
        margin-right: 10px;
        .deleteIcon {
          color: gray;
          font-size: 18px;
          margin-top: 2px;
          margin-right: 3px;
        }
      }
    }
  }
  .more-comments {
    width: 100%;
    display: flex;
  }
  .lookComment {
    height: 30px;
    margin-bottom: 5px;
    border-radius: 3px;
    padding: 5px 10px 0 10px;
    background-color: #e7f3f9;
    font-size: 14px;
    color: #5db0da;
    display: flex;
    margin-left: 75px;
    justify-content: flex-start;
    cursor: pointer;
    flex-grow: 0;
    .arrowIcon {
      margin-left: 7px;
      font-size: 21px;
      color: #5db0da;
    }
    .arrowsIcon {
      font-size: 21px;
    }
  }

  &.is-reply {
    width: 85%;
    min-height: 80px;
    overflow: hidden;
    // border-top: 1px solid #d9d7d7;
    .avatar {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 50%;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e2e2e2;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .content-box {
      width: calc(100% - 60px);
      margin-top: 9px;
      .comment-text {
        color: #777;
        font-size: 14px;
        margin-top: 3px;
        margin-bottom: 2px;
      }

      .nickname {
        color: #141414;
        font-weight: 500;
        font-size: 14.5px;
        margin-right: 13px;
      }
      .time {
        font-size: 12px;
      }
      .action-box {
        margin-bottom: 0px;
        height: 33px;
        .reply-btn {
          display: flex;
          margin-right: 9px;
          font-size: 13px;
          color: gray;
          cursor: pointer;

          .replyIcon {
            color: gray;
            font-size: 13px;
            margin-top: 3px;
            margin-right: 4px;
          }
        }
        .delete-btn {
          display: flex;
          font-size: 13px;
          color: gray;
          cursor: pointer;
          margin-top: 1px;
          margin-right: 10px;
          .deleteIcon {
            color: gray;
            font-size: 16px;
            margin-top: 1px;
            margin-right: 2px;
          }
        }
        .liked {
          color: #3995d3;
          filter: drop-shadow(0 0 15px rgba(0, 187, 255, 0.8));
        }

        .like-btn {
          display: flex;
          font-size: 13px;
          margin-top: 1px;
          cursor: pointer;
          .likeIcon {
            font-size: 15px;
            margin-top: 1px;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .comment-item {
    .is-reply {
      .content-box {
        .user-info {
          flex-wrap: wrap;
        }
        .nickname {
          font-size: 14px;
        }
      }
    }
  }
}
@media screen and (max-width: 360px) {
  .comment-item {
    .is-reply {
      .content-box {
        .user-info {
          flex-wrap: wrap;
        }
        .nickname {
          font-size: 14px;
        }
        .action-box {
          .reply-btn {
            font-size: 12px;
            .replyIcon {
              font-size: 12px;
            }
          }
          .delete-btn {
            font-size: 12px;
            .deleteIcon {
              font-size: 15px;
            }
          }
          .like-btn {
            font-size: 12px;
            .likeIcon {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
