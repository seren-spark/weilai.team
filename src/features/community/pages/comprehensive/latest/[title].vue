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
.content {
  padding: 0 45px;
  width: 100%;
  height: auto;

  #search {
    margin-bottom: 10px;
    height: 45px;
    // .search {
    //   float: right;
    //   position: relative;
    // }
    // input {
    //   width: 200px;
    //   height: 45px;
    //   border: 1px solid #d0d9e4;
    //   border-radius: 25px;
    //   padding: 5px 10px;
    //   padding-left: 30px;
    // }
    // .search-icon {
    //   position: absolute;
    //   top: 50%;
    //   left: 2%;
    //   transform: translateY(-50%);
    // }
  }
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

  #search {
    position: fixed;
    z-index: 5;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    // .search {
    //   width: 100%;
    //   input {
    //     width: 100%;
    //   }
    // }
  }
}
</style>
