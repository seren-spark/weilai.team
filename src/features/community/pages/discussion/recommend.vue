<template>
  <div style="display: flex">
    <div class="content">
      <!-- 放搜索框的位置 -->
      <div id="search">
        <Search />
      </div>
      <!-- 放内容 -->

      <NewsContent :type="3" />
    </div>
    <Rightbar :type="type" />
  </div>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue";
import Search from "@/features/community/components/Search.vue";
import { ref } from "vue";
import Rightbar from "../../../../components/community/Rightbar.vue";
import NewsContent from "../../components/News.vue";
let isLike = ref(true);
const type = 3;
</script>
<style scoped lang="scss">
@use "@community/styles/community";

.already {
  color: red !important;
}
</style>
