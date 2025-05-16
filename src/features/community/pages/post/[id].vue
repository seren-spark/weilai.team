<script setup lang="ts">
import CommentList from "@/components/comment/CommentList.vue";
import { useRequest } from "vue-request";
import useAppEditor from "@/features/post/composables/useAppEditor";
import { EditorContent } from "@tiptap/vue-3";
import { useRoute } from "vue-router";
import ArticleHeader from "../../components/article/ArticleHeader.vue";
import { type AxiosResponse } from "axios";
import { computed, watch, ref } from "vue";
import apiClient from "@/api/axios";
import { formatPostTime } from "@/utils/formatPostTime";
import { likeData, likeRun } from "../../composables/Like";
import { collectRun, collectData } from "../../composables/Collect";
import { useAlert } from "@/composables/useAlert";
import router from "@/router";

export interface PostDetailResponse {
  userId: number;
  name: string;
  headPortrait: any;
  collectCount: number;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  postTime: string;
  title: string;
  postTxt: string;
  postTags: string[];
  isLike: boolean;
  isCollect: boolean;
}

// 从路由获取参数
const route = useRoute<"/community/post/[id]">();
const postId = route.params.id;
const uniqueId = ref<number | null>(null);

if (route.query.uniqueId) {
  const queryUniqueId = Array.isArray(route.query.uniqueId)
    ? route.query.uniqueId[0]
    : route.query.uniqueId;
  if (typeof queryUniqueId === "string") {
    const parsedUniqueId = parseInt(queryUniqueId, 10);
    uniqueId.value = isNaN(parsedUniqueId) ? null : parsedUniqueId;
  } else {
    uniqueId.value = null;
  }
}

const { showAlert } = useAlert();
const getPost = () => {
  return apiClient.get(`/post/selectOne/${postId}`);
};
const { data, loading, run } =
  useRequest<AxiosResponse<PostDetailResponse>>(getPost);
const formattedPostTime = computed(() => {
  if (data.value?.data.postTime) {
    return formatPostTime(data.value?.data.postTime);
  }
  return "";
});

const { editor } = useAppEditor(false);
const isCollect = ref(data.value?.data.isCollect);
const isLike = ref(data.value?.data.isLike);
const likeCount = ref<number>(data.value?.data.likeCount || 0);
watch(
  () => data.value,
  () => {
    if (data.value?.data.postTxt) {
      editor.value?.commands.setContent(JSON.parse(data.value?.data.postTxt));
    }

    isCollect.value = data.value?.data.isCollect;
    isLike.value = data.value?.data.isLike;
    likeCount.value = data.value?.data.likeCount || 0;
    //帖子不存在
    if (data.value?.code == 2004) {
      router.push("/community/nothing");
    }
  },
  { immediate: true },
);

//点赞
const handleLike = () => {
  likeRun(postId);
};
watch(
  () => likeData.value,
  (newLikeData) => {
    console.log("点赞请求的响应数据:", newLikeData);
    if (newLikeData && newLikeData.code === 2009) {
      showAlert("点赞成功", "pass");
      isLike.value = true;
      likeCount.value += 1;
    } else if (newLikeData && newLikeData.code === 2011) {
      showAlert("取消点赞成功", "pass");
      isLike.value = false;
      likeCount.value -= 1;
    } else {
      showAlert("点赞失败", "error");
    }
  },
);
//收藏
const handleCollect = () => {
  collectRun(postId);
};
watch(
  () => collectData.value,
  (newCollectData) => {
    if (newCollectData && newCollectData.code === 2013) {
      showAlert("收藏成功", "pass");
      isCollect.value = true;
    } else if (newCollectData && newCollectData.code === 2016) {
      showAlert("取消收藏成功", "pass");
      isCollect.value = false;
    } else {
      showAlert("收藏失败", "error");
    }
  },
);
</script>

<template>
  <div class="article-detail">
    <ArticleHeader
      :tags="data?.data.postTags"
      :title="data?.data.title"
      :view-count="data?.data.viewCount"
      :like-count="likeCount"
      :comment-count="data?.data.commentCount"
      :is-loading="loading"
      :author="data?.data.name"
      :avatar="data?.data.headPortrait"
      :post-time="formattedPostTime"
      :is-like="isLike"
      :is-collect="isCollect"
      :handle-like-click="handleLike"
      :handle-collect="handleCollect"
      :unique-id="uniqueId"
    ></ArticleHeader>
    <EditorContent
      class="article-detail__content"
      :editor="editor"
    ></EditorContent>
  </div>
  <div v-if="uniqueId != 1" class="article-Form">
    <CommentList :post-id="postId"></CommentList>
  </div>
</template>

<style lang="scss">
@use "/src/assets/styles/editor/index.scss";
.article-detail {
  background-color: #fff;
  box-sizing: border-box;
  padding: 1rem 3rem;
  &__content {
    margin-top: 2rem;
  }
}

.news-footer {
  display: flex;
  align-items: center;
  & > div {
    color: var(--secondary-foreground);
    display: flex;
    align-items: center;
    font-size: 13px;
    margin-right: 10px;
  }
  &-icon {
    color: var(--secondary-foreground);
    font-size: 17px;
    margin-right: 5px;
  }
  .already {
    color: red;
  }
}
.article-Form {
  width: 100%;
  background-color: white;
  margin-top: 20px;
  padding-bottom: 50px;
}
</style>
