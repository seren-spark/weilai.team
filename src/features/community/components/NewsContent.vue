<template>
  <div id="news" ref="scrollRef ">
    <div v-if="articleList.length > 0">
      <div class="news-item" v-for="item in articleList">
        <div class="news-writer">
          <div
            class="avatar"
            @click="skipPersonCenter(item.userId ? item.userId : 0)"
          >
            <UserAvatar
              :avatar="item.headPortrait"
              customClass="w-[3rem] h-[3rem]"
            />
          </div>
          <div class="writer-info">
            <div class="name">{{ item.name }}</div>
            <div class="time">
              <span>{{ formatPostTime(item.postTime) }}</span>
            </div>
          </div>
        </div>
        <RouterLink
          :to="{ name: '/community/post/[id]', params: { id: item.id } }"
          target="_blank"
          class="news-content"
        >
          <div class="news-title">{{ item.title }}</div>
          <div class="news-details">
            <p>
              {{ item.postAbstract }}
            </p>
          </div>
        </RouterLink>
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
        <NewsFooter
          :viewCount="item.viewCount"
          :likeCount="item.likeCount"
          :commentCount="item.commentCount"
        />
      </div>
    </div>

    <div v-else-if="loading" class="loading">
      <div class="news-item" v-for="index in 6">
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
    <div v-else="!loading && !articleList.length">
      <NoData />
    </div>
    <!-- 到底了 -->
    <div v-if="isOver && articleList.length > 0" class="over">已经到底了</div>
  </div>

  <!-- <div v-if="loading">加载中</div> -->
</template>

<script setup lang="ts">
import { useTagStore } from "@/store/tagTypeStore";

import UserAvatar from "@/components/avatar/UserAvatar.vue";
// @ts-ignore
import NoData from "@/components/loading/NoData.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/userStore";
import type { ArticleList } from "@/types/Community";
import { formatPostTime } from "@/utils/formatPostTime";
import {
  // articleList,
  checkType,
  getArticle,
  getArticle2,
} from "@community/composables/search";
import { onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import NewsFooter from "./NewsFooter.vue";
import { alertVariants } from "../../../components/ui/alert/index";
import { skipPersonCenter } from "@/composables/useCommunity";
const loadinglen = ref(0);
const articleList = ref<ArticleList[]>([]);
const isTag = ref(false);
const loading = ref(false);
const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType;
// 滚动容器
const scrollRef = ref<HTMLDivElement>();
const userStore = useUserStore();
const router = useRouter();
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

//跳转个人中心;
// function skipPersonCenter(id: number) {
//   console.log((userStore.getMyId() as number) == id);
//   if (!((userStore.getMyId() as number) == id)) {
//     userStore.userId = id;
//     userStore.isSelf = false;
//   } else {
//     userStore.isSelf = true;
//   }

//   router.push({
//     path: `/personalCenter/userInfo`,
//   });
// }
console.log(route.params);
if (!props.isTag) {
  // 搜索数据要用的
  watch(
    () => route.params,
    (newVal, oldVal) => {
      console.log("综合");
      console.log(newVal, oldVal);
      let title = (newVal as any).title;
      console.log(title, "title");
      // getArticle(props.type, title, props.page, undefined, props.sort).then(
      //   (res) => {
      //     loading.value = true;
      //     console.log(res);
      //     pages.value = res.pages;
      //     total.value = res.total;
      //     loadinglen.value = res.records.length;
      //     current.value = res.current;
      //     setTimeout(() => {
      //       loading.value = false;
      //       articleList.value = res.records;
      //     }, 400);
      //   },
      // );
      const { loading: load, data } = getArticle2(
        props.type,
        title,
        props.page,
        props.sort,
      );
      watch(data, () => {
        pages.value = data.value?.data.pages;
        total.value = data.value?.data.total;
        console.log(data.value);
        loading.value = load.value;
        current.value = data.value?.data.current;
        articleList.value = data.value?.data.records;
      });
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

      // getArticle(
      //   newVal,
      //   props.condition,
      //   props.page,
      //   undefined,
      //   props.sort ? props.sort : 0,
      // ).then((res) => {
      //   pages.value = res.pages;
      //   total.value = res.total;
      //   loadinglen.value = res.records.length;
      //   current.value = res.current;
      //   setTimeout(() => {
      //     loading.value = false;
      //     articleList.value = res.records;
      //   }, 400);
      // });
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
          isTag.value = true;
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

const handleScroll = async (e: any) => {
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
        padding: 5px 55px;
        .news-title {
          font-weight: 540;
          display: -webkit-box;
          -webkit-line-clamp: 1; //行数
          text-overflow: ellipsis; //省略号
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: normal;
          word-break: break-all;
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
      }
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
