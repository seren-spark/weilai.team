<template>
  <div style="display: flex">
    <div class="content">
      <div id="search">
        <Search :isUser="true" />
      </div>
      <div id="news">
        <div v-if="userList.length > 0">
          <UserContent :userList="userList" :content="user" />
        </div>
        <div v-else-if="load">
          <div
            class="news-item"
            style="display: flex; align-items: center"
            v-for="index in 10"
          >
            <div>
              <div class="flex items-center space-x-4 bg-[white]">
                <Skeleton class="h-12 w-12 rounded-full bg-[--muted]" />
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px] bg-[--muted]" />
                  <Skeleton class="h-4 w-[200px] bg-[--muted]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else="load && !userList.length">
          <NoData />
        </div>
        <div v-if="isOver && userList.length > 0" class="over">已经到底了</div>
      </div>
    </div>
    <Rightbar />
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
import Rightbar from "@/components/community/Rightbar.vue";
import Search from "@community/components/Search.vue";
import UserContent from "@/features/community/components/user-display/UserContent.vue";
import { useRequest } from "@/composables/useRequest";
import { useRequest as req } from "vue-request";
import { useUserStore } from "@/store/userStore";
import type { UserData, UserInfo } from "@/types/community";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/axios";

const { executeRequest, error, loading, data } = useRequest();
const route = useRoute();
const user = ref("");
const userList = ref<UserInfo[]>([]);
if ("user" in route.params) {
  user.value = String(route.params.user);
} else {
  user.value = "";
}

const current = ref<number>(1);
const pages = ref<number>(1);
const total = ref<number>(0);
const content = ref("");
const isOver = ref(false);
let load = ref(true);
const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  pageNumber: {
    type: Number,
    default: 1,
  },
});

watch(
  () => route.params,
  (newVal) => {
    console.log((newVal as any).user);
    console.log("路由变了");
    let user = (newVal as any).user;
    runGetUserList(user);
  },
);

function runGetUserList(content = "", pageNumber = 1, pageSize = 10) {
  const getUserList = () => {
    return apiClient.get(
      `/user/searchUser?content=${content}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  };
  const { data, loading } = req(getUserList, { loadingKeep: 500 });
  watch(data, () => {
    console.log(data.value);
    let res = data.value as UserData;
    load.value = loading.value;
    current.value = res.data.pageInfo.current;
    pages.value = res.data.pageInfo.pages;
    total.value = res.data.pageInfo.total;
    if (res.data.searchUsers.length > 0 && !content) {
      res.data.searchUsers.forEach((record) => {
        userList.value.push(record);
      });
    } else if (res.data.searchUsers.length > 0 && content) {
      userList.value = res.data.searchUsers;

      if (pageNumber > 1) {
        res.data.searchUsers.forEach((record) => {
          userList.value.push(record);
        });
      }
    }
    if (current.value == pages.value) {
      isOver.value = true;
    }
  });
}
runGetUserList(user.value);

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
      runGetUserList(content.value, pages.value);
    }
  }
};
</script>

<style scoped lang="scss">
@use "@community/styles/community.scss";
.news-item {
  display: block;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  cursor: pointer;
  min-height: 5.3rem;
  background-color: var(--background);
  margin-bottom: 1.2rem;
}

.over {
  text-align: center;
  font-size: 0.7rem;
  color: var(--secondary-foreground);
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  .content {
    .bg {
      position: fixed;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 150px;
      background-color: #fafafa;
      &-top {
        background-image: linear-gradient(#dfe9f3, #ffffff00 100%);
        height: 150px;
      }
    }
  }
  #news {
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
}
</style>
