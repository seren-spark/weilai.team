<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import { useAlert } from "@/composables/useAlert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import apiClient from "@/api/axios";
import { useRequest } from "vue-request";

const props = defineProps<{
  postId: string | number;
  getFirstComment: () => void;
  isComment?: boolean;
  userId: number;
  parentId: number;
  isFormVisible: boolean;
}>();

const { showAlert } = useAlert();
const commentTexts = ref<string>("");
const finalCommentText = ref<string>("");
const maxLength = 1000;
const remaining = computed(() => maxLength - commentTexts.value.length);
const fileInput = ref<HTMLInputElement | null>(null);
const imageTags = ref<string[]>([]);
const photoUrls = ref<string[]>([]);
const emojiVisible = ref<boolean>(false);
const emit = defineEmits(["reply"]);

const onSelectEmoji = (emoji: { i: string }) => {
  commentTexts.value += emoji.i;
  emojiVisible.value = false;
};

// 限制评论长度
watch(commentTexts, (newContent) => {
  if (newContent.length > maxLength) {
    commentTexts.value = newContent.slice(0, maxLength);
  }
});

// 图片上传逻辑
const uploadImg = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.size > 1024 * 1024) {
      showAlert("图片大小不能超过 1MB", "error");
      return;
    }
    if (photoUrls.value.length >= 1) {
      showAlert("只能上传一张图片", "waring");
      return;
    }
    photoUrls.value = [];
    imageTags.value = [];
    finalCommentText.value = "";
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      photoUrls.value.push(url);
      const imgMarkdown = `![${file.name}](${url})`;
      imageTags.value = [imgMarkdown];
      if (!finalCommentText.value.includes(url)) {
        finalCommentText.value += `<!-- IMG_SPLIT -->${url}<!-- IMG_SPLIT -->`;
      }
    };
    reader.readAsDataURL(file);
  }
};

const deleteImage = () => {
  photoUrls.value = [];
  imageTags.value = [];
  finalCommentText.value = "";
};

onMounted(() => {
  fileInput.value?.addEventListener("change", handleFileSelect);
});

onUnmounted(() => {
  if (fileInput.value) {
    fileInput.value.removeEventListener("change", handleFileSelect);
  }
});

// 封装评论请求逻辑（对齐示例中的 useRequest 用法）
const createCommentRequest = (requestData: {
  url: string;
  method: string;
  data: any;
}) => {
  return apiClient({
    url: requestData.url,
    method: requestData.method,
    data: requestData.data,
  });
};

const { data, run: executeRequest } = useRequest(createCommentRequest, {
  manual: true,
});

watch(
  () => data.value,
  (response) => {
    if (!response) return;

    if (response.code === 200) {
      showAlert("评论成功", "pass");
      // 区分一级评论和多级评论的后续操作
      if (props.isComment) {
        props.getFirstComment();
      } else {
        emit("reply", props.parentId);
      }
      // 清空表单
      commentTexts.value = "";
      photoUrls.value = [];
      imageTags.value = [];
      finalCommentText.value = "";
    } else {
      showAlert("评论失败", "error");
    }
  },
);

// 提交一级评论
const submitComment = () => {
  finalCommentText.value += commentTexts.value;
  if (!finalCommentText.value.trim()) {
    showAlert("评论内容不能为空", "error");
    return;
  }

  const requestData = {
    url: `/comment/writePostComment`,
    method: "post",
    data: {
      postId: props.postId,
      commentTxt: finalCommentText.value,
    },
  };
  executeRequest(requestData);
};

// 提交多级评论
const submitReply = () => {
  finalCommentText.value += commentTexts.value;
  if (!finalCommentText.value.trim()) {
    showAlert("评论内容不能为空", "error");
    return;
  }

  const requestData = {
    url: `/comment/replyComment`,
    method: "post",
    data: {
      commentId: props.parentId,
      commentTxt: finalCommentText.value,
      userId: props.userId,
    },
  };
  executeRequest(requestData);
};

const handleButtonClick = () => {
  if (props.isComment) {
    submitComment();
  } else {
    submitReply();
  }
};
</script>

<template>
  <div class="comment-form">
    <!-- 评论输入框 -->
    <textarea
      v-model="commentTexts"
      placeholder="请输入评论......"
      :maxlength="maxLength"
    ></textarea>
    <div class="image-preview">
      <div
        v-for="(imageTag, index) in imageTags"
        :key="index"
        class="image-tag"
      >
        <img :src="imageTag.split('](')[1].slice(0, -1)" alt="uploaded-image" />
        <div class="delete-btn" @click="deleteImage">
          <Icon icon="iconoir:delete-circle" class="deleteIcon" />
        </div>
      </div>
    </div>
    <!-- 尾部操作区域 -->
    <div class="action-bar">
      <div class="letter">
        <span class="remaining">还可输入{{ remaining }} 个字</span>
      </div>
      <div class="icon-group">
        <div class="emoji">
          <Popover>
            <PopoverTrigger>
              <Icon icon="lineicons:emoji-smile" class="emojiIcon" />
            </PopoverTrigger>
            <PopoverContent :style="{ padding: '0rem', width: 'auto' }">
              <EmojiPicker
                class="emoji-picker-float"
                :options-name="optionsName"
                :native="true"
                @select="onSelectEmoji"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div class="image">
          <Icon icon="stash:image-plus" class="imageIcon" @click="uploadImg" />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            hidden
            @change="handleFileSelect"
          />
        </div>
        <!-- 提交按钮 -->
        <button class="submit-btn" @click="handleButtonClick">评论</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popover-content {
  padding: 0;
  width: auto;
}
.comment-form {
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 100%;
  // max-width: 650px;
  border-radius: 5px;
  margin-bottom: 5px;
  background-color: white;
  textarea {
    width: 95%;
    height: 54px;
    resize: none;
    outline: none;
    margin-left: 2.5%;
    margin-top: 5px;
    border-bottom: 1px solid var(--border);
    padding: 14px;
    font-size: 16px;
    color: rgb(83, 82, 82);
  }
  .image-preview {
    margin-left: 15px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    img {
      max-width: 100px;
      max-height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
  .image-tag {
    position: relative;
    margin-right: 10px;
  }
  .delete-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 19px;
    height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 10px;
    display: none;
    cursor: pointer;
    .deleteIcon {
      color: black;
      font-size: 15px;
    }
  }
  .image-tag:hover .delete-btn {
    display: flex;
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    .icon-group {
      display: flex;
      margin-right: 10px;
    }
    .letter {
      justify-content: flex-start;
      font-size: 13px;
      color: var(--secondary-foreground);
      margin-top: 5px;
      margin-left: 25px;
    }
    .emoji {
      position: relative;
    }
    .emojiIcon {
      color: var(--secondary-foreground);
      font-size: 25px;
      cursor: pointer;
      margin-right: 10px;
      //  margin-left: 280px;
      margin-top: 3px;
    }
    .codeIcon {
      color: var(--secondary-foreground);
      font-size: 24px;
      cursor: pointer;
      margin-top: 3px;
      margin-right: 20px;
    }
    .imageIcon {
      color: var(--secondary-foreground);
      font-size: 26px;
      cursor: pointer;
      margin-top: 2px;
      margin-right: 10px;
    }
    .submit-btn {
      width: 70px;
      height: 30px;
      background-color: #5dbee8;
      color: white;
      border: none;
      font-size: 14px;
      border-radius: 15px;
      cursor: pointer;
      margin-bottom: 5px;
      transition: background-color 0.3s ease;
    }
    .submit-btn:hover {
      background-color: #9cdcfe;
    }
  }
}
@media screen and (max-width: 768px) {
  .emoji {
    display: none;
  }
  .comment-form {
    textarea {
      font-size: 15px;
    }
    .action-bar {
      .letter {
        margin-left: 15px;
      }
      .submit-btn {
        width: 60px;
        font-size: 13px;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .comment-form {
    textarea {
      font-size: 14px;
    }
    .action-bar {
      .imageIcon {
        font-size: 26px;
        margin-right: 7px;
      }
      .letter {
        margin-left: 13px;
        margin-right: 2px;
      }
      .submit-btn {
        width: 55px;
        font-size: 13px;
        background-color: #5dbee8;
      }
    }
  }
}
@media screen and (max-width: 445px) {
  .comment-form {
    .action-bar {
      flex-wrap: wrap;
    }
    .icon-group {
      display: flex;
      margin: 0 auto;
    }
  }
}
</style>
