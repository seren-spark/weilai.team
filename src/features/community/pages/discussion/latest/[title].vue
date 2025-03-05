<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search :typeId="3" />
      </div>
      <!-- 放内容 -->
      <NewsContent :condition="title" :sort="1" />
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue";
import Rightbar from "@/components/community/Rightbar.vue";
import NewsContent from "@/features/community/components/News.vue";
import Search from "@community/components/Search.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const title = ref("");
if ("title" in route.params) {
  title.value = route.params.title as string;
} else {
  title.value = "";
}
</script>

<style scoped lang="scss">
@use "@community/styles/community";
</style>
