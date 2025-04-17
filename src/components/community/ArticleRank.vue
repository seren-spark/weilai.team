<template>
  <div class="article-rank">
    <div class="rank-top">
      <p>
        <Icon icon="lucide:scroll" font-size="20px" /> &nbsp;<span
          style="width: 5em"
          >文章榜
        </span>
      </p>
      <Icon
        icon="material-symbols-light:navigate-next"
        style="font-size: 25px; float: right; font-weight: bold"
      />
    </div>
    <hr />
    <div class="rank-list">
      <ul v-if="RankList.length > 0">
        <li v-for="(item, index) in RankList" :key="index">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a href="/community/comprehensive"
                  ><span class="ranking">{{ index + 1 }}</span
                  ><span>{{ item.title }}</span></a
                ></TooltipTrigger
              >
              <TooltipContent class="bg-white font-[0.9vw]">
                <a href=""
                  ><span>{{ item.title }}</span>
                </a></TooltipContent
              >
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
      <ul v-else-if="loading">
        <li v-for="index in 6" :key="index">
          <Skeleton class="h-[30px] w-full" />
        </li>
      </ul>
      <div v-else-if="!loading ">
        <NoData />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/loading/NoData.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getArticle2 } from "@/features/community/composables/search";
import { useTagStore } from "@/store/tagTypeStore";
import type { ArticleList, Data } from "@/types/community";
import { Icon } from "@iconify/vue";
import { ref, watch } from "vue";

const tagStore = useTagStore();
const type = tagStore.tagType.type;

const RankList = ref<ArticleList[]>([]);

const { data, loading } = getArticle2(type);
watch(data, () => {
  const res = data.value as Data;
  RankList.value = res.data.records.slice(0, 6);
});
</script>

<style scoped lang="scss">
.article-rank {
  background-color: white;
  border-radius: var(--radius);
}
.rank-top {
  height: 6vh;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    display: flex;
    align-items: center;
    color: var(--secondary-foreground);
    height: 100%;
    font-size: 0.9vw;
    line-height: 4rem;
  }
  svg {
    font-size: 1rem !important;
  }
}
.ranking {
  font-weight: bold;
  font-size: 1vw;
  font-family: sans-serif;
  background-image: linear-gradient(#e9afa6, #eee0d4, #eadccc);
  -webkit-background-clip: text; /* Safari 和 Chrome 需要此属性 */
  color: transparent; /* 确保文字是透明的 */
  margin-right: 5px;
  display: inline-block;
  width: 1vw;
  text-align: center;
}
ul {
  width: 100%;
  li {
    font-size: 0.9vw;
    color: var(--secondary-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 1.4vh;
    button {
      width: 100%;
    }
    &:hover {
      cursor: pointer;
    }
    a {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: left;
    }
  }
}
.rank-list {
  padding: 10px 15px;
}
</style>
