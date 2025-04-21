<template>
  <div class="myCollections">
    <NoData v-if="userCollect.length == 0" class="mt-[50px] mb-[50px]"></NoData>

    <template v-if="userCollect.length != 0">
      <div class="postsListBox">
        <ul>
          <router-link
            v-for="item in userCollect"
            :key="item.postId"
            :to="`/community/post/${item.postId}`"
            target="_blank"
          >
            <li>
              <div class="postInfo">
                <h1 class="postTitle">{{ item.title }}</h1>
                <p class="postDesc">{{ item.postAbstract }}</p>
                <div v-if="item.tags.length != 0" class="mb-2">
                  <TagItem
                    v-for="tag in item.tags"
                    :key="tag"
                    :name="tag"
                    class="mr-2"
                    :tag="tag"
                  ></TagItem>
                </div>
                <p class="postFooter">
                  <span class="postTime"
                    >{{ formatPostTime(item.putTime) }} 发布</span
                  >
                  ·
                  <span class="likesNum">{{ item.postLikeCount }} 点赞</span>
                  ·
                  <span class="commentsNum">{{ item.commentCount }} 评论</span>
                  ·
                  <span class="collectNum">{{ item.collectCount }} 收藏</span>
                  ·
                  <span class="viewNum">{{ item.viewCount }} 阅读</span>
                </p>
              </div>
              <DropdownMenu v-if="userStore.isSelf">
                <DropdownMenuTrigger class="ellipsis h-4">
                  <Icon icon="lucide:ellipsis" class="text-2xl" />
                </DropdownMenuTrigger>
                <DropdownMenuContent class="bg-white">
                  <DropdownMenuItem class="text-gray-500 cursor-pointer">
                    <Icon icon="mdi:star-off" />
                    <span @click="cancelCollect(item.postId)"> 取消收藏 </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </router-link>
        </ul>
      </div>
      <div class="pageBox">
        <div class="pageBox pagination-container">
          <Pagination
            :total-items="total"
            :page-size="pageSize"
            @update:page="handlePageChange"
          >
          </Pagination>
          <span class="collectionsNum">共 {{ total }} 收藏</span>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
//引入组件
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagItem from "@/features/community/components/tag/TagItem.vue";
import Pagination from "@/components/recruitment/Pagination.vue";
//引入ref
import { ref, watch } from "vue";
import { showConfirm } from "@/composables/useConfirm";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
// 引入hooks并使用
import { useRequest } from "@/composables/useRequest";
const { data, executeRequest } = useRequest();
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
const { getLocalStorageWithExpire } = useLocalStorageWithExpire();
import { formatPostTime } from "@/utils/formatPostTime";
import { useUserStore } from "@/store/userStore";
import NoData from "@/components/loading/NoData.vue";

const userStore = useUserStore();
console.log("pinia///", userStore);
// 获取userId
let userId = 0;
if (userStore.isSelf) {
  userId = getLocalStorageWithExpire("userId");
} else {
  userId = userStore.userId;
}
watch(
  () => userStore,
  () => {
    if (userStore.isSelf) {
      userId = getLocalStorageWithExpire("userId");
    } else {
      userId = userStore.userId;
    }
    getUserCollect();
  },
  {
    deep: true,
  },
);
//定义页码信息
let currentPage = 1;
let total = 0;
let pageSize = ref<number>(10);
//定义userPost，储存当前页的文章数据
let userCollect = ref([]);

//页码切换
function handlePageChange(newPage: number) {
  currentPage = newPage;
  getUserCollect();
}

//获取文章函数
async function getUserCollect() {
  await executeRequest({
    url: `/user/getUserCollect?userId=${userId}&pageNumber=${currentPage}&pageSize=${pageSize.value}`,
  });
  if (data.value && data.value.code == 200) {
    let postData = data.value.data;
    // 将数据赋值给userCollect、pages
    userCollect.value = postData.userCollect;
    total = postData.pageInfo.total;
    console.log("我的收藏", data.value);
  }else if(data.value && data.value.code == 6002){
    userCollect.value = [];
    total = 0;
  } else {
    console.log(data.value.message);
  }
}
const cancelCollect = async (postId: number) => {
  showConfirm({
    content: "你确定要取消收藏该文章吗"
  }).then(() => {
    executeRequest({ url: `/post/collect/${postId}`, method: "post" }).then(() => {
      console.log('取消收藏结果',data.value);
      showAlert("取消收藏成功", "pass");
      getUserCollect();
    });
  });
};
//打开页面立刻调用一次获取文章
getUserCollect();
</script>
<style lang="scss" scoped>
.operationsBtn {
  width: 100%;
}

.myCollections {
  margin-top: 20px;
  width: 100%;
  background-color: white;
  padding: 10px;
  border-radius: 10px;

  .postsListBox {
    width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    ul {
      li {
        margin-top: 20px;
        display: flex;
        border-radius: 10px;
        background-color: white;
        padding: 10px;
        border: 1px solid #d9d9d9;
        align-items: center;

        .postInfo {
          margin-left: 20px;
          width: 100%;
          color: #666;

          .postTitle {
            color: black;
            font-size: larger;
          }

          .postDesc {
            font-size: small;
            width: 90%;
            margin: 10px 0px;
          }

          .postFooter {
            font-size: xx-small;
          }
        }
      }
    }
  }

  .pageBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;

    .collectionsNum {
      margin-right: 20px;
      line-height: 40px;
    }
  }
}

@media (max-width: 768px) {
  .myCollections .postsListBox ul li .postInfo .postFooter {
    font-size: 9px;
  }
}
</style>
