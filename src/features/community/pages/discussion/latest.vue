<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search :typeId="3" />
      </div>
      <NewsContent :sort="1" :type="3" />
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
@use "@community/styles/community";
</style>
