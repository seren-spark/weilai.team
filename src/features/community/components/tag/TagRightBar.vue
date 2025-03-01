<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommunityTag from "../../composables/CommunityTag";
import { useTagStore } from "@/store/tagTypeStore";
import NoData from "@/components/loading/NoData.vue";
import { Skeleton } from "@/components/ui/skeleton";

const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType;
const { useTagList, getUseTagList } = CommunityTag();

interface UseTagList {
  tagName: string;
  count: number;
}

const loading = ref(true);

const firstUseTagList = ref<UseTagList[]>([]);
getUseTagList();
watch(useTagList, () => {
  loading.value = false;
  if (useTagList.value.length > 10) {
    firstUseTagList.value = useTagList.value.slice(0, 10);
  } else {
    firstUseTagList.value = useTagList.value;
  }
});
</script>

<template>
  <div class="article-rank">
    <div class="rank-top">
      <p>
        <Icon icon="icon-park-outline:tag" class="tagHeadIcon" /> &nbsp;<span
          >标签榜
        </span>
      </p>
    </div>
    <hr />
    <ul>
      <ul v-if="firstUseTagList.length > 0">
        <li v-for="(item, index) in firstUseTagList" :key="index">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <router-link
                  :to="`/community/${tagType}/label/${item.tagName}`"
                >
                  <span class="ranking">{{ index + 1 }}</span
                  ><span>{{ item.tagName }}</span>
                </router-link>
              </TooltipTrigger>
              <TooltipContent class="bg-white">
                <router-link
                  :to="`/community/${tagType}}/label/${item.tagName}`"
                >
                  <span>{{ item.tagName }}</span>
                </router-link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div class="bar">
            <Icon v-if="index < 3" icon="bxs:hot" class="hotIcon"></Icon>
            <span class="rank-num">{{ item.count }}</span>
          </div>
        </li>
      </ul>
      <ul v-else-if="loading">
        <li v-for="(item, index) in 6" :key="index">
          <Skeleton class="h-[30px] w-full" />
        </li>
      </ul>
      <li v-else-if="firstUseTagList.length === 0">
        <NoData />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.article-rank {
  background-color: white;
  border-radius: var(--radius);
  border-radius: 0.25rem;
  box-shadow: 0 0.25rem 1.875rem 0 rgba(232, 232, 237, 0.3);
}

.rank-top {
  height: 3rem;
  padding: 0.3125rem 0.625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tagHeadIcon {
    font-size: 1.25rem;
  }

  p {
    display: flex;
    align-items: center;
    color: var(--secondary-foreground);
    height: 100%;
    font-size: 1rem;
    line-height: 4rem;
  }
}

.ranking {
  font-weight: bold;
  font-size: 1rem;
  font-family: sans-serif;
  background-image: linear-gradient(#e9afa6, #eee0d4, #eadccc);
  -webkit-background-clip: text;
  /* Safari 和 Chrome 需要此属性 */
  color: transparent;
  /* 确保文字是透明的 */
  margin-right: 0.3125rem;
  display: inline-block;
  width: 1.875rem;
  text-align: center;
}

ul {
  padding: 0.625rem 1rem;
  width: 100%;

  .no-data {
    width: 100%;
    text-align: center;
    font-size: 1rem;
  }

  li {
    font-size: 1rem;
    color: var(--secondary-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      cursor: pointer;
    }

    a {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 13.75rem;
    }
  }

  .bar {
    display: flex;
    align-items: center;

    .hotIcon {
      color: #f2731e;
      margin-right: 0.3125rem;
    }
  }
}

@media screen and (max-width: 1200px) {
  .rank-top {
    // font-size: 14px;

    .tagHeadIcon {
      //   font-size: 16px;
    }

    p {
      height: 100%;
      //   font-size: 12px;
      //   line-height: 4rem;
    }
  }

  .ranking {
    // font-size: 12px;
  }

  ul {
    li {
      //   font-size: 12px;
    }
  }
}

@media screen and (max-width: 1040px) {
  .rank-top {
    // font-size: 12px;

    .tagHeadIcon {
      //   font-size: 14px;
    }

    p {
      height: 100%;
      //   font-size: 12px;
      //   line-height: 4rem;
    }
  }

  .ranking {
    // font-size: 12px;
  }

  ul {
    li {
      //   font-size: 11px;
    }
  }
}
</style>
