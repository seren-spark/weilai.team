<template>
  <a
    v-for="item in userList"
    :key="item.userId"
    class="news-item"
    @click="skipPersonCenter(item.userId)"
  >
    <div class="news-writer">
      <div class="avatar">
        <Avatar
          :avatar="item.headPortrait"
          :custom-class="`w-[3rem] h-[3rem]`"
        />
      </div>
      <div class="writer-info">
        <h3 class="name">{{ item.name }}</h3>
        <div class="work-info">
          <span class="origin">原创 {{ item.postCount }}</span>
          <span class="read">阅读 {{ item.viewCount }}</span>
          <!-- <span class="like">点赞</span> -->
        </div>
        <div class="brief">{{ item.userDestination }}</div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/UserAvatar.vue";
import type { UserInfo } from "@/types/community";

import { skipPersonCenter } from "@/composables/useCommunity";
withDefaults(
  defineProps<{
    content: string;
    pageNumber?: number;
    userList: UserInfo[];
  }>(),
  {
    content: "",
    pageNumber: 1,
    userList: () => [],
  },
);
</script>

<style scoped lang="scss">
.news-item {
  display: block;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  cursor: pointer;
  min-height: 5.3rem;
  background-color: var(--background);
  margin-bottom: 1.2rem;
  .news-writer {
    display: flex;
    align-items: center;

    .avatar {
      width: 3rem;
      height: 3rem;
      margin-right: 0.625rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      margin-right: 0.625rem;
    }
    .name {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .work-info,
    .brief {
      font-size: 0.8rem;
      font-weight: 400;
      color: #686570;
      span {
        margin-right: 0.75rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .news-content {
    padding: 10px 55px;
    display: block;
    &:hover {
      background-color: #f8f8fa;
      cursor: pointer;
    }
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
.over {
  text-align: center;
  font-size: 0.7rem;
  color: var(--secondary-foreground);
  font-weight: 500;
}
@media screen and (max-width: 768px) {
  .news-item {
    padding: 5px;
    padding-top: 10px;
    margin-bottom: 8px;
    .news-writer {
      padding-left: 10px;
      .avatar {
        width: 50px;
        height: 50px;
      }

      .work-info,
      .brief {
        font-size: 13px;
        font-weight: 400;
        color: #686570;
        span {
          margin-right: 12px;
          &:last-child {
            margin-right: 0;
          }
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
</style>
