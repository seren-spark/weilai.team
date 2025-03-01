<template>
  <div class="news-label">
    <div class="type">{{ checkType(item.type) }}</div>
    <ul class="labels">
      <RouterLink
        class="label-item"
        v-for="tags in item.postTags"
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
const props = defineProps<{
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
    .type {
      width: 50px;
      padding: 0;
      font-size: 12px;
      color: #909ba6;
      text-align: center;
      border-radius: 15px;
      border: 2px solid #e1edf8;
      margin-right: 8px;
    }

    .labels {
      display: flex;
      color: #909ba6;
      font-size: 12px;
      .label-item {
        display: flex;
        align-items: center;
        margin: 0 5px;
      }
    }
  }
}
</style>
