<template>
  <div class="rightbar">
    <div class="details"><HotTag /><ArticleList /></div>
  </div>
</template>

<script setup lang="ts" name="Rightbar">
import ArticleList from "@/components/community/ArticleRank.vue";
import HotTag from "@/features/community/components/tag/HotTag.vue";
</script>

<style scoped lang="scss">
.rightbar {
  width: 32vw;
  position: relative;
}
.details {
  width: 22vw;
  position: fixed;
  margin-left: 0px;
  display: flex;
  flex-direction: column;
  gap: 3vh; /* 设置上下间距 */
}
@media screen and (max-width: 768px) {
  .rightbar {
    display: none;
  }
}
</style>
