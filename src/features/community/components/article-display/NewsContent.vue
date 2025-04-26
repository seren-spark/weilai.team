<template>
  <RouterLink
    :to="{ name: '/community/post/[id]', params: { id: item.id } }"
    target="_blank"
    class="news-content"
  >
    <div class="news-title" v-if="!noTitle">{{ item.title }}</div>
    <div class="news-details" v-if="!noContent">
      <p>
        {{ item.postAbstract }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps({
  noTitle: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  noContent: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<style scoped lang="scss">
.news-content {
  padding: var(--padding);
  display: block;
  &:hover {
    background-color: #f8f8fa;
    cursor: pointer;
  }
  .news-details {
    font-size: 0.87rem;
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
}
@media screen and (max-width: 768px) {
  .news-content {
    padding: var(--mobile-padding);
    .news-title {
      font-weight: 540;
      font-size: 1.1rem;
      display: -webkit-box;
      -webkit-line-clamp: 1; //行数
      text-overflow: ellipsis; //省略号
      -webkit-box-orient: vertical;
      overflow: hidden;
      white-space: normal;
      word-break: break-all;
    }
    .news-details {
      font-size: 0.9rem;
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
  }
}
</style>
