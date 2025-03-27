<template>
  <div id="news" ref="scrollRef ">
    <div v-if="articleList.length > 0">
      <div v-for="item in articleList" :key="item.id" class="news-item">
        <div class="news-writer">
          <div
            class="avatar"
            @click="skipPersonCenter(item.userId ? item.userId : 0)"
          >
            <UserAvatar
              :avatar="item.headPortrait"
              custom-class="w-[3rem] h-[3rem]"
            />
          </div>
          <div class="writer-info">
            <div class="name">{{ item.name }}</div>
            <div class="time">
              <span>{{ formatPostTime(item.postTime) }}</span>
            </div>
          </div>
        </div>

        <NewsContent :item="item" />

        <NewsLabel :item="item" :tag-type="tagType" />
        <NewsFooter
          :view-count="item.viewCount"
          :likecount="item.likeCount"
          :comment-count="item.commentCount"
        />
      </div>
    </div>

    <div v-else-if="loading" class="loading">
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
    <div v-else-if="!loading && articleList.length === 0">
      <NoData />
    </div>
    <!-- 到底了 -->
    <div v-if="isOver && articleList.length > 0" class="over">已经到底了</div>
  </div>
</template>

<script setup lang="ts">
import { useTagStore } from "@/store/tagTypeStore";
import UserAvatar from "@/components/avatar/UserAvatar.vue";
import NoData from "@/components/loading/NoData.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleList } from "@/types/community";
import { formatPostTime } from "@/utils/formatPostTime";
import {
  checkType,
  getArticle,
  getArticle2,
} from "@community/composables/search";
import { onMounted, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import NewsFooter from "./article-display/NewsFooter.vue";
import { skipPersonCenter } from "@/composables/useCommunity";
import NewsContent from "./article-display/NewsContent.vue";
import NewsLabel from "./article-display/NewsLabel.vue";
const loadinglen = ref(0);
const articleList = ref<ArticleList[]>([]);
const isExsitTag = ref(false);
const loading = ref(false);
const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType;
// 滚动容器
const scrollRef = ref<HTMLDivElement>();

provide("scrollRefFromInner", scrollRef);
const props = defineProps<{
  type?: number | 0;
  page?: number;
  sort?: number | 0;
  condition?: string | "";
  tagPostList?: Array<ArticleList>;
  isTag?: boolean | false;
}>();
const route = useRoute();
const pages = ref<number>(1);
const total = ref<number>(0);
const current = ref<number>(1);
const isOver = ref<boolean>(false);
if (!props.isTag) {
  // 如果不是标签详情页
  watch(
    () => route.params,
    (newVal) => {
      const title = (newVal as Record<string, string>)?.title;
      if (title) {
        const { loading: load, data } = getArticle2(
          props.type,
          title,
          props.page,
          props.sort,
        );
        watch(data, () => {
          pages.value = data.value?.data.pages || 0;
          total.value = data.value?.data.total || 0;
          console.log(data.value);
          loading.value = load.value;
          current.value = data.value?.data.current || 0;
          articleList.value = data.value?.data.records || [];
        });
      }
    },
    {
      immediate: true,
    },
  );
  // 传递数据
  checkType(props.type);
  watch(
    () => props.type,
    (newVal) => {
      console.log(newVal);
      const { loading: load, data } = getArticle2(
        newVal,
        props.condition || (route.params as { title?: string }).title || "",
        props.page,
        props.sort ? props.sort : 0,
      );
      loading.value = load.value;
      watch(data, () => {
        console.log(data.value);
        loading.value = load.value;
        articleList.value = data.value?.data.records;
      });
    },
    { deep: true, immediate: true },
  );
} else {
  watch(
    () => props.tagPostList,
    (newVal) => {
      if (newVal) {
        if (newVal.length > 0) {
          articleList.value = newVal;
          isExsitTag.value = true;
        } else {
          loadinglen.value = 0;
          loading.value = false;
          articleList.value = [];
        }
      }
    },
    { deep: true, immediate: true },
  );
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
      //数据为加载完，继续赋值
      getArticle(props.type, props.condition, current.value).then((res) => {
        loading.value = true;
        if (res.records.length > 0) {
          loadinglen.value = res.records.length;

          res.records.forEach((record) => {
            articleList.value.push(record);
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
#news,
.loading {
  width: 100%;
  .news-item {
    padding: 0.975rem;
    border-radius: 10px;
    min-height: 100px;
    background-color: var(--background);
    margin-bottom: 25px;
    .news-writer {
      margin-bottom: 0.5rem;
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

      .time {
        font-size: 0.825rem;
        color: #909ba6;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  #news {
    padding: 0 10px;
    margin-top: 150px;
    .news-item {
      padding: 5px;
      margin-bottom: 8px;
      .news-writer {
        padding-left: 10px;
        margin: 0rem;
        .writer-info {
          .name {
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
@media screen and (min-width: 900px) and (max-width: 1300px) {
  #news,
  .loading {
    .news-item {
      padding: 10px;
      border-radius: 10px;
      min-height: 100px;

      background-color: var(--background);
      margin-bottom: 1.5rem;
      .news-writer {
        .name {
          font-size: 1vw;
        }
        .avatar {
          cursor: pointer;
        }
      }
      .news-content {
        .news-details {
          p {
            max-height: 30px;
            line-height: 15px;
            font-size: 0.95vw;
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
      .news-label {
        padding: 5px 35px;

        display: flex;
        .labels {
          display: flex;

          color: #909ba6;
          font-size: 14px;
          .label-item {
            display: flex;
            align-items: center;

            margin: 0 5px;
            font-size: 0.8vw;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
