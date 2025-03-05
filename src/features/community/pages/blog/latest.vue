<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search />
      </div>

      <NewsContent :type="1" :sort="1" />
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
import Rightbar from "../../../../components/community/Rightbar.vue";
import NewsContent from "../../components/News.vue";
import Search from "../../components/Search.vue";
</script>

<style scoped lang="scss">
.content {
  padding: 0 45px;
  width: 100%;
  height: auto;
}

@media screen and (max-width: 768px) {
  .content {
    padding: 0 0;
    .bg {
      position: fixed;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 20%;
      background-color: #fafafa;
      &-top {
        background-image: linear-gradient(#dfe9f3, #ffffff00 100%);
        height: 30%;
      }
    }
  }
}
</style>
