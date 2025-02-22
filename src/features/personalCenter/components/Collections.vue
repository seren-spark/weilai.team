<template>
    <div class="myCollections">
        <NoData v-if="userCollect.length == 0" class="mt-[50px] mb-[50px]"></NoData>

        <template v-if="userCollect.length != 0">
            <div class="postsListBox">
                <ul>
                    <li v-for="item in userCollect" :key="item.id">
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
                        <DropdownMenu>
                            <DropdownMenuTrigger class="ellipsis">
                                <Icon icon="lucide:ellipsis" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="p-0 bg-white">
                                <DropdownMenuLabel>操作</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Button class="operationsBtn cancelCollect">取消收藏</Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>
                </ul>
            </div>
            <div class="pageBox">
                <div class="pageBox pagination-container">
                    <Pagination :totalItems="total" :pageSize="pageSize" @update:page="handlePageChange">
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button/Button.vue";
import Pagination from "@/components/recruitment/Pagination.vue";
//引入ref
import { ref } from "vue";

// 引入hooks并使用
import { useRequest } from "@/composables/useRequest";
const { data, error, loading, executeRequest } = useRequest();
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
const { getLocalStorageWithExpire, setLocalStorageWithExpire } =
    useLocalStorageWithExpire();
import { useDateFormatter } from "@/composables/useDateFormatter";
const { formatDateToYYYYMMDD } = useDateFormatter();
import { useUserStore } from '@/store/userStore'
import  NoData  from '@/components/loading/NoData.vue'


const userStore = useUserStore()
console.log('pinia///', userStore);
// 获取userId
let userId = 0
if (userStore.isSelf) {
    userId = getLocalStorageWithExpire('userId')
} else {
    userId = userStore.userId
}

//定义页码信息
let pages = 0;
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
        pages = postData.pageInfo.pages;
        total = postData.pageInfo.total;
        console.log("我的收藏", data.value);
    } else {
        console.log(data.value.message);
    }
}
//打开页面立刻调用一次获取文章
getUserCollect();
</script>
<style lang="scss" scoped>
.operationsBtn {
    width: 100%;
}

.cancelCollect {
    background-color: #97d5ff;
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
        font-size: 10px;
    }
}
</style>