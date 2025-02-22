<template>
    <div class="myPosts">
        <NoData v-if="userPost.length == 0" class="mt-[50px] mb-[50px]"></NoData>

        <template v-if="userPost.length != 0">
            <div class="postsData">
                <div class="postsNum">
                    <p>{{ userPostAllInfo.allPostCount }}</p>
                    <p>文章</p>
                </div>
                <div class="likeNum">
                    <p>{{ userPostAllInfo.allLikeCount }}</p>
                    <p>点赞</p>
                </div>
                <div class="starNum">
                    <p>{{ userPostAllInfo.allCollectCount }}</p>
                    <p>收藏</p>
                </div>
                <div class="commentNum">
                    <p>{{ userPostAllInfo.allCommentCount }}</p>
                    <p>评论</p>
                </div>
            </div>
            <div class="postsListBox">
                <ul>
                    <li v-for="item in userPost" :key="item.id">
                        <div class="postInfo">
                            <h1 class="postTitle">{{ item.title }}</h1>
                            <p class="postDesc">{{ item.postAbstract }}</p>
                            <p class="postFooter">
                                <span class="postTime">{{ formatDateToYYYYMMDD(item.putTime) }} 发布</span>
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
                                <Icon icon="lucide:ellipsis" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class=" bg-white">
                                <DropdownMenuItem class="text-gray-500 cursor-pointer">
                                    <Icon icon="material-symbols:delete-outline" />
                                    <span @click="deletePost(item.id)">
                                        删除文章
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem class="text-gray-500 cursor-pointer">
                                    <Icon icon="jam:write" />
                                    <span>修改文章</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>
                </ul>
                <div class="pageBox pagination-container">
                    <Pagination :totalItems="total" :pageSize="pageSize" @update:page="handlePageChange">
                    </Pagination>
                    <span class="postsNum">共 {{ total }} 篇文章</span>
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button/Button.vue";
import Pagination from "@/components/recruitment/Pagination.vue";

//引入ref
import { ref } from "vue";

// 引入hooks并使用
import { useRequest } from '@/composables/useRequest'
const { data, error, loading, executeRequest } = useRequest()
import { useLocalStorageWithExpire } from '@/composables/useLocalStorage';
const { getLocalStorageWithExpire, setLocalStorageWithExpire } = useLocalStorageWithExpire()
import { useDateFormatter } from '@/composables/useDateFormatter'
import { get } from '@vueuse/core';
const { formatDateToYYYYMMDD } = useDateFormatter()
import { useUserStore } from '@/store/userStore'
import NoData from '@/components/loading/NoData.vue'
import { showConfirm } from "@/composables/useConfirm"

const userStore = useUserStore()
console.log('pinia///', userStore);
// 获取userId
let userId = 0
if (userStore.isSelf) {
    userId = getLocalStorageWithExpire('userId')
} else {
    userId = userStore.userId
}

//定义userPostAllInfo，储存当前用户的文章数据
let userPostAllInfo = ref({
    allCollectCount: 0,
    allCommentCount: 0,
    allLikeCount: 0,
    allPostCount: 0
});

//定义页码信息
let pages = 0;
let currentPage = 1;
let total = ref<number>();
let pageSize = ref(10);

//定义userPost，储存当前页的文章数据
let userPost = ref([]);

//页码切换
function handlePageChange(newPage: number) {
    currentPage = newPage;
    getPosts();
}

//获取文章函数
async function getPosts() {
    await executeRequest({ url: `/user/getUserPost?userId=${userId}&pageNumber=${currentPage}&pageSize=${pageSize.value}` })
    if (data.value && data.value.code == 200) {
        let postData = data.value.data
        // 将数据赋值给userPostAllInfo及userPost、pages
        Object.assign(userPostAllInfo.value, postData.userPostAllInfo);
        userPost.value = postData.userPost
        console.log('我的文章', userPost.value);

        pages = postData.pageInfo.pages
        total = postData.pageInfo.total
    }
    if (data.value && data.value.code == 6001) {
        console.log('未发表过帖子');

    }

}
//打开页面立刻调用一次获取文章
getPosts()

function deletePost(id: number) {

    showConfirm({
        content: "你确定要删除该文章吗",
        description: "一旦删除文章将不存在",
    }).then(() => {
        executeRequest({ url: `/post/delete/${id}`, method: 'put' }).then(() => {
            console.log(data.value);
            getPosts()
        })
    })
}
</script>
<style lang="scss" scoped>
.myPosts {
    margin-top: 20px;
    width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: 10px;

    .postsData {
        display: flex;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;

        div {
            width: 25%;
            text-align: center;
        }
    }

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

        .pageBox {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;

            .postsNum {
                margin-right: 20px;
                line-height: 40px;
            }
        }
    }
}

@media (max-width: 768px) {
    .myPosts .postsListBox ul li .postInfo .postFooter {
        font-size: 9px;
    }
}
</style>