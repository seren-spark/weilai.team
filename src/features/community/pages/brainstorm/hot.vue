<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search />
      </div>
      <!-- 放内容 -->
      <NewsContent :type="4" />
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
import Search from "@/features/community/components/Search.vue";

import Rightbar from "../../../../components/community/Rightbar.vue";
import NewsContent from "../../components/News.vue";
</script>
<style scoped lang="scss">
@use "@community/styles/community";

.already {
  color: red !important;
}
</style>
