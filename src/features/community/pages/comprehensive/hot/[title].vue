<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search />
      </div>
      <!-- 放内容 -->
      <NewsContent :condition="title" />
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue";
import Rightbar from "@/components/community/Rightbar.vue";
import NewsContent from "@/features/community/components/News.vue";
import Search from "@community/components/Search.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const title = ref("");
watch(
  () => title.value,
  () => {
    console.log("title changed");

    if ("title" in route.params) {
      console.log("title", route.params.title);
      title.value = route.params.title as string;
    } else {
      console.error("title is not in route.params");
      title.value = "";
    }
  },
);
console.log("route", route);
if ("title" in route.params) {
  console.log("title", route.params.title);
  title.value = route.params.title as string;
} else {
  console.error("title is not in route.params");
  title.value = "";
}
</script>

<style scoped lang="scss">
@use "@community/styles/community";
</style>
