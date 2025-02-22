<script setup lang="ts">
import { ref, onMounted, reactive, defineProps } from "vue";
import { useRequest } from "@/composables/useRequest";
import CommentItem from "./CommentItem.vue";
import CommentForm from "./CommentForm.vue";

const { data, error, executeRequest } = useRequest();
const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);
const comments = reactive<any[]>([]);
const props = defineProps<{
  postId: string | number;
}>();

// 获取一级评论
const getFirstComment = async () => {
  await executeRequest({
    url: `/comment/getCommentOne?postId=${props.postId}&pageSize=${pageSize.value}&pageNumber=${pageNumber.value}`,
    method: "get",
  });

  if (data.value?.code === 200) {
    comments.length = 0;
    const commentList = data.value.data.postCommentOne;
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
    // comments.push(...data.value.data.postCommentOne);
  } else {
    console.log(error);
    comments.length = 0;
  }
};
console.log(comments);

//分割图片和文本

// 在组件挂载后调用获取评论
onMounted(() => {
  getFirstComment();
});
</script>

<template>
  <div class="comment-list">
    <CommentForm
      :post-id="props.postId"
      class="comment-list__comment"
      :is-comment="true"
      :get-first-comment="getFirstComment"
    ></CommentForm>
    <CommentItem
      v-for="comment in comments"
      :key="comment.commentId"
      :comment="comment"
      :get-first-comment="getFirstComment"
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
