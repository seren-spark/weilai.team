<template>
  <TopNav :title="`${checkType(type)} · 文章榜`" />
  <div style="display: flex" class="container">
    <div class="content">
      <div id="news" ref="scrollRef ">
        <div v-if="RankList.length > 0">
          <div
            v-for="(item, index) in RankList"
            :key="item.id"
            class="news-item"
            @click="skipPostDetails(item.id, $event)"
          >
            <div class="rank-wrap">
              <div class="rank-left">
                <div
                  :class="
                    index <= 3
                      ? `rank-number rank-${index + 1}  `
                      : 'rank-number'
                  "
                >
                  {{ index + 1 }}
                </div>
              </div>
              <div class="ranl-right">
                <NewsContent :item="item" noContent class="news-content" />

                <div class="news-writer">
                  <div class="writer-info">
                    <div
                      class="writer-avatar"
                      @click="skipPersonCenter(item.userId ? item.userId : 0)"
                    >
                      <UserAvatar
                        :avatar="item.headPortrait"
                        :custom-class="customClass"
                      />

                      <div class="name">{{ item.name }}</div>
                    </div>

                    <NewsFooter
                      :view-count="item.viewCount"
                      :likecount="item.likeCount"
                      :comment-count="item.commentCount"
                      class="news-footer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="loading" class="news-loading">
          <div v-for="index in 6" :key="index" class="news-item">
            <div class="news-writer">
              <div class="flex items-center space-x-4">
                <Skeleton class="h-12 w-12 rounded-full bg-[--muted]" />
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px] bg-[--muted]" />
                  <Skeleton class="h-4 w-[200px] bg-[--muted]" />
                </div>
              </div>
            </div>
            <a class="news-content loading-content">
              <Skeleton class="h-12 w-full bg-[--muted]" />
            </a>
          </div>
        </div>
        <div v-else-if="!loading && RankList.length === 0">
          <NoData />
        </div>
        <!-- 到底了 -->
        <div v-if="isOver && RankList.length > 0" class="over">已经到底了</div>
      </div>
    </div>
    <Rightbar noArticleList />
  </div>
</template>

<script setup lang="ts">
import TopNav from "@/components/layouts/AppThirdNav.vue";
import Rightbar from "@/components/community/Rightbar.vue";
import { useTagStore } from "@/store/tagTypeStore";
import UserAvatar from "@/components/avatar/UserAvatar.vue";

import {
  checkType,
  getArticle,
  getArticle2,
} from "@community/composables/search";
import { onMounted, provide, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import NewsFooter from "@community/components/article-display/NewsFooter.vue";
import { skipPersonCenter } from "@/composables/useCommunity";
import NewsContent from "@community/components/article-display/NewsContent.vue";

import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/loading/NoData.vue";

const router = useRouter();
const customClass = computed(() => {
  return isMobile.value ? "w-[2rem] h-[2rem]" : "w-[1.5rem] h-[1.5rem]";
});
const isMobile = ref(window.innerWidth <= 768);
const loadinglen = ref(0);
import type { ArticleList, Data } from "@/types/community";

const isOver = ref<boolean>(false);
const tagStore = useTagStore();
const type = tagStore.tagType.type;

const RankList = ref<ArticleList[]>([]);

const { data, loading } = getArticle2(type);
watch(data, () => {
  const res = data.value as Data;
  RankList.value = res.data.records;
  console.log(RankList.value);
});
const current = ref<number>(1);
const pages = ref<number>(1);
function skipPostDetails(id: number, event: Event) {
  let target = event.target as HTMLElement;
  if (target && !target.classList.contains("name")) {
    router.push({ name: "/community/post/[id]", params: { id: id } });
  }
}
onMounted(async () => {
  window.addEventListener("scroll", handleScroll, true);
});
const handleScroll = async () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  let scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100) {
    if (current.value < pages.value) {
      current.value++;
      //数据没加载完，继续赋值
      getArticle(type, "", current.value).then((res) => {
        loading.value = true;
        if (res.records.length > 0) {
          loadinglen.value = res.records.length;

          res.records.forEach((record) => {
            RankList.value.push(record);
          });
        }
      });
    } else {
      isOver.value = true;
    }
  }
};
</script>

<style scoped lang="scss">
@use "@community/styles/community";

@mixin gradient-text {
  -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
  background-clip: text;
  -webkit-text-fill-color: transparent; /*给文字设置成透明*/
}
.rank {
  &-number {
    font-size: 1.2rem;
    font-weight: 550;
    line-height: 2rem;
    color: #515767;
    margin-right: 1.66rem;
    min-width: 2rem;
    text-align: center;
    flex-shrink: 0;
  }
  &-1 {
    @include gradient-text;
    background-image: linear-gradient(
      180deg,
      #f64242 10%,
      rgba(246, 66, 66, 0.4) 40%
    );
  }
  &-2 {
    @include gradient-text;
    background-image: linear-gradient(
      180deg,
      #ff7426 10%,
      rgba(255, 116, 38, 0.4) 40%
    );
  }
  &-3 {
    @include gradient-text;
    background-image: linear-gradient(
      180deg,
      #ffac0c 10%,
      rgba(255, 172, 12, 0.4) 50%
    );
  }

  &-wrap {
    padding: var(--padding);
    padding-left: 2rem;
    padding-bottom: 0.1rem;
    padding-top: 0.1rem;
    display: flex;
  }
  &-left {
    width: 2rem;
    margin-right: 0.5rem;
  }
}
#news,
.news-loading {
  width: 100%;
  .news-item {
    &:hover {
      background-color: #f8f8fa;
      cursor: pointer;
    }
    padding: 0.5rem;
    border-radius: 10px;
    min-height: max-content;
    background-color: var(--background);
    margin-bottom: 1rem;
    .news-content {
      padding: 0;
    }
    .news-writer {
      display: flex;
      align-items: center;

      .avatar {
        cursor: pointer;
        width: 3.125rem;
        height: 3.125rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        margin-right: 5px;
      }
      .writer-info {
        display: flex;
        align-items: center;

        .writer-avatar {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;

          &:hover {
            color: var(--primary-foreground);
          }
        }
        .name {
          font-size: 0.8rem;
          margin-left: 0.2rem;
        }
        .time {
          font-size: 0.825rem;
          color: #909ba6;
        }
      }
    }
    .news-footer {
      padding: 0 0.2rem;
    }
  }
}

@media screen and (max-width: 768px) {
  #news {
    padding: 0 0.6rem;
    margin-top: 5rem;
    .news-item {
      padding: 5px;
      margin-bottom: 8px;
      .news-writer {
        padding: 0;
        .writer-info {
          margin: 0;
          .name {
            margin-left: 0.2rem;
            color: var(--secondary-foreground);
            font-size: 0.9em;
          }
          .time {
            display: none;
          }
        }
      }
    }
  }
}
.over {
  text-align: center;
  font-size: 0.825rem;
  color: var(--secondary-foreground);
  font-weight: 500;
}
</style>

<route lang="json">
{
  "meta": {
    "title": "公告",
    "thirdNavItems": [
      {
        "title": "公告",
        "path": "/community/notice",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
