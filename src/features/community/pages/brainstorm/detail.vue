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
// import { Icon } from "@iconify/vue";
import Search from "@/features/community/components/Search.vue";
import { ref } from "vue";
import Rightbar from "../../../../components/community/Rightbar.vue";
import NewsContent from "../../components/NewsContent.vue";
let isLike = ref(true);
</script>
<style scoped lang="scss">
.content {
  padding: 0 45px;
  width: 100%;
  height: auto;
}
.already {
  color: red !important;
}
#news {
  width: 100%;
  .news-item {
    padding: 15px;
    border-radius: 10px;
    min-height: 100px;
    background-color: var(--background);
    margin-bottom: 25px;
    .news-writer {
      display: flex;
      align-items: center;
      .avatar {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        margin-right: 5px;
      }
      .time {
        font-size: 13px;
        color: #909ba6;
      }
    }
    .news-content {
      padding: 10px 55px;
      .news-details {
        font-size: 14.5px;

        p {
          max-height: 40px;
          line-height: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2; //行数
          text-overflow: ellipsis; //省略号
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: normal;
          word-break: break-all;
        }
      }
      .news-label {
        margin-top: 10px;
        display: flex;
        .type {
          width: 50px;
          font-size: 14px;
          color: #909ba6;
          text-align: center;
          border-radius: 15px;
          border: 2px solid #e1edf8;
          margin-right: 8px;
        }

        .labels {
          display: flex;

          color: #909ba6;
          font-size: 14px;
          .label-item {
            margin: 0 5px;
          }
        }
      }
    }
    .news-footer {
      display: flex;
      align-items: center;
      padding: 5px 55px;
      & > div {
        color: var(--secondary-foreground);
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-right: 10px;
      }
      &-icon {
        color: var(--secondary-foreground);
        font-size: 17px;
        margin-right: 5px;
      }
    }
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
}
</style>
