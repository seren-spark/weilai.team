<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search :type-id="typeId" />
      </div>
      <!-- 放内容 -->
      <NewsContent :condition="title" :sort="sort" />
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts" name="Title">
import Rightbar from "@/components/community/Rightbar.vue";
import NewsContent from "@/features/community/components/News.vue";
import Search from "@community/components/Search.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = ref("");
interface Props {
  sort?: number;
  typeId?: number;
}


withDefaults(defineProps<Props>(), {
  sort: 0,
});
watch(
  () => title.value,
  () => {
    if ("title" in route.params) {
      title.value = route.params.title as string;
    } else {
      title.value = "";
    }
  },
);
</script>

<style scoped lang="scss">
@use "@community/styles/community";
</style>
