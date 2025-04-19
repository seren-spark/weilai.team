<template>
  <div class="news-label">
    <div class="type">{{ checkType(item.type) }}</div>
    <ul class="labels">
      <RouterLink
        v-for="tags in item.postTags"
        :key="tags"
        class="label-item"
        :to="`/community/${tagType}/label/${tags}`"
      >
        #{{ tags }}
      </RouterLink>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { checkType } from "../../composables/search";
import type { ArticleList } from "@/types/community";
defineProps<{
  item: ArticleList;
  tagType: string;
}>();
</script>

<style scoped lang="scss">
.news-label {
  padding: var(--padding);

  display: flex;
  .type {
    min-width: 3rem;
    width: max-content;
    padding: 0 8px;
    font-size: 0.875rem;
    color: #909ba6;
    text-align: center;
    border-radius: 0.975rem;
    border: 0.12rem solid #e1edf8;
    margin-right: 8px;
  }

  .labels {
    display: flex;
    color: #909ba6;
    font-size: 0.82rem;
    .label-item {
      display: flex;
      align-items: center;
      margin: 0 5px;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: 768px) {
  .news-label {
    display: flex;
    padding: var(--mobile-padding);
    padding-top: 0rem;
    .type {
      width: 3rem;
      padding: 0;
      font-size: 0.8em;
      color: #909ba6;
      text-align: center;
      border-radius: 15px;
      border: 0.1rem solid #e1edf8;
      margin-right: 8px;
    }

    .labels {
      display: flex;
      color: #909ba6;
      font-size: 0.8rem;
      .label-item {
        display: flex;
        align-items: center;
        margin: 0 5px;
      }
    }
  }
}
</style>
