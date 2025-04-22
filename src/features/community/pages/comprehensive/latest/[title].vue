<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search />
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
.content {
  padding: 0 45px;
  width: 100%;
  height: auto;

  #search {
    margin-bottom: 10px;
    height: 45px;
  }
}

@media screen and (max-width: 768px) {
  #search {
    position: fixed;
    z-index: 5;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
  }
}
</style>
