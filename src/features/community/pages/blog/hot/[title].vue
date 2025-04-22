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
import { ref } from "vue";
import { useRoute } from "vue-router";
import NewsContent from "@/features/community/components/News.vue";
import Search from "@community/components/Search.vue";
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
    .search {
      float: right;
      position: relative;
    }
    input {
      width: 200px;
      height: 45px;
      border: 1px solid #d0d9e4;
      border-radius: 25px;
      padding: 5px 10px;
      padding-left: 30px;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      left: 2%;
      transform: translateY(-50%);
    }
  }
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
        color: #a7a7a7;
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
  }
}
@media screen and (max-width: 768px) {
 

  #news {
    margin-top: 180px;
    .news-item {
      padding: 5px;
      margin-bottom: 8px;
      .news-writer {
        padding-left: 10px;
        .avatar {
          width: 40px;
          height: 40px;
        }
        .writer-info {
          .name {
            color: var(--secondary-foreground);
            font-size: 0.9em;
            margin-left: 5px;
          }
          .time {
            display: none;
          }
        }
      }
      .news-content {
        padding: 10px 55px;
        .news-title {
          font-weight: 540;
        }
        .news-details {
          font-size: 14.5px;
          color: #a7a7a7;
          p {
            max-height: 40px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 1; //行数
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
    }
  }
  #search {
    position: fixed;
    z-index: 5;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    .search {
      width: 100%;
      input {
        width: 100%;
      }
    }
  }
}
</style>
