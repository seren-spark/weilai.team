<script setup lang="ts">
import { ref, watch, reactive, defineProps } from "vue";
import CommentItem from "./CommentItem.vue";
import CommentForm from "./CommentForm.vue";
import apiClient from "@/api/axios";
import { useRequest } from "vue-request";

const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);
const comments = reactive<any[]>([]);
const props = defineProps<{
  postId: string | number;
}>();

const getFirstComment = () => {
  return apiClient.get(
    `/comment/getCommentOne?postId=${props.postId}&pageSize=${pageSize.value}&pageNumber=${pageNumber.value}`,
  );
};
const { data: commentData, loading, run } = useRequest(getFirstComment);
watch(
  () => commentData.value,
  (newValue) => {
    if (newValue) {
      if (newValue.code == 200) {
        //console.log(newValue);

        comments.length = 0;
        const commentList = newValue.data.postCommentOne;
        commentList.forEach((comment: any) => {
          const { commentTxt } = comment;
          const splitPattern = "<!-- IMG_SPLIT -->";
          const parts = commentTxt.split(splitPattern);
          const texts = parts
            .filter((part: string, index: number) => index % 2 === 0)
            .join("");
          const imgUrls = parts
            .filter((part: string, index: number) => index % 2 !== 0)
            .join("");

          comments.push({
            ...comment,
            texts,
            imgUrls,
          });
        });
      } else {
        comments.length = 0;
      }
    }
  },
);
</script>

<template>
  <div class="comment-list">
    <CommentForm
      :post-id="props.postId"
      class="comment-list__comment"
      :is-comment="true"
      :get-first-comment="run"
    ></CommentForm>
    <CommentItem
      v-for="comment in comments"
      :key="comment.commentId"
      :comment="comment"
      :get-first-comment="run"
      :post-id="props.postId"
    />
  </div>
</template>

<style scoped lang="scss">
.comment-list {
  width: 100%;
  padding: 10px 18px 10px 18px;
  background-color: white;
  border-radius: 5px;
  &__comment {
    margin-bottom: 10px;
  }
}
</style>
