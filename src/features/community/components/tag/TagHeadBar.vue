<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Icon } from "@iconify/vue";
import CommunityTag from '@/features/community/composables/CommunityTag';
import { useTagStore } from "@/store/tagTypeStore";

const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType
const { allTagList, getAllTagList } = CommunityTag()
getAllTagList()
</script>

<template>
    <div>
        <div class="tag-head-bar">
            <div class="tagHeadNone"></div>
            <div class="tag-head-bar-item">
                <router-link active-class="active" :to="`/community/${tagType}/label/suggest`">推荐</router-link>
            </div>
            <div v-for="(item, index) in allTagList" :key="index" class="tag-head-bar-item">
                <router-link active-class="active" :to="`/community/${tagType}/label/${item}`">{{ item }}</router-link>
            </div>
            <span class="tag-head-bar-more">
                <Icon icon="bytesize:chevron-bottom"></Icon>
            </span>

            <span class="tag-head-bar-few">
                <Icon icon="bytesize:chevron-top"></Icon>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.active {
    color: var(--primary-foreground);
}

.tag-head-bar {
    max-width: 1336px;
    position: absolute;
    top: 60px;
    display: flex;
    flex-wrap: wrap;
    background-color: #ffffff;
    box-shadow: 0 4px 30px 0 rgba(232, 232, 237, .5);
    border-radius: 4px;
    padding: 10px;
    margin-right: 15px;
    max-height: 65px;
    overflow: hidden;
    z-index: 1;

    &:hover {
        transition: all .5s;
        max-height: 500px;
        -webkit-box-shadow: 0 4px 30px 0 rgba(223, 223, 229, 0.4);
        box-shadow: 0 4px 30px 0 rgba(223, 223, 229, 0.4);
        border-radius: 4px;
    }

    .tag-head-bar-item {
        font-size: 16px;
        margin: 10px 20px;
        color: #676767;
    }

    .tag-head-bar-more,
    .tag-head-bar-few {
        position: absolute;
        right: 50%;
        bottom: 0;
        display: block;
        width: 30px;
        height: 15px;
        background-color: #f4f4f4;
        border-radius: 5px 5px 0 0;
        text-align: center;
        padding: 0 8px;
        font-size: 14px;
        color: #8a8a8a;
    }

    .tag-head-bar-more {
        opacity: 1;
    }

    .tag-head-bar-few {
        opacity: 0;
    }

    &:hover .tag-head-bar-more {
        opacity: 0;
    }

    &:hover .tag-head-bar-few {
        opacity: 1;
    }

    // &:active .tag-head-bar-more {
    //     opacity: 0;
    // }

    // &:active .tag-head-bar-few {
    //     opacity: 1;
    // }
}

@media screen and (min-width: 1800px) {
    .tag-head-bar {
        max-width: 100%;
        margin-right: 70px;
    }
}

@media screen and (max-width: 1200px) {
    .tag-head-bar {
        max-height: 60px;
        top: 50px;

        .tag-head-bar-item {
            font-size: 12px;
        }

        .tag-head-bar-more,
        .tag-head-bar-few {
            width: 25px;
            height: 10px;
            background-color: #f4f4f4;
            border-radius: 3px 3px 0 0;
            text-align: center;
            padding: 0 6px;
            font-size: 12px;
            color: #8a8a8a;
        }
    }
}

@media screen and (max-width: 1024px) {
    .tag-head-bar {
        max-height: 55px;
        top: 60px;

        .tag-head-bar-item {
            font-size: 10px;
        }

        .tag-head-bar-more,
        .tag-head-bar-few {
            width: 25px;
            height: 10px;
            background-color: #f4f4f4;
            border-radius: 3px 3px 0 0;
            text-align: center;
            padding: 0 6px;
            font-size: 12px;
            color: #8a8a8a;
        }
    }
}

@media screen and (max-width: 765px) {
    .tag-head-bar {
        max-height: 67px;
        top: 60px;
        padding: 10px 10px 5px 10px;
        display: flex;
        /* 使用 Flex 布局 */
        align-items: center;
        /* 垂直居中 */
        white-space: nowrap;
        flex-wrap: nowrap;
        /* 禁止换行 */
        width: 100%;
        /* 容器宽度为 100%，也可以设置为固定宽度 */
        overflow-x: auto;
        /* 启用水平滚动 */

        .tag-head-bar-item {
            font-size: 16px;
        }
        /* 设置滚动条的宽度 */
        &::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        /* 设置滚动条轨道的样式 */
        &::-webkit-scrollbar-track {
            background-color: #f1f1f1;
            border-radius: 10px;
        }

        /* 设置滚动条滑块的样式 */
        &::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
            border: 3px solid #f1f1f1;
        }

        /* 滑块悬停时的样式 */
        &::-webkit-scrollbar-thumb:hover {
            background-color: #555;
        }

        /* 设置滚动条的角部分 */
        &::-webkit-scrollbar-corner {
            background-color: #f1f1f1;
        }

        .tag-head-bar-item {
            display: inline-block;
            /* 横向排列每个标签项 */
            margin-right: 15px;
            /* 标签项之间的间距 */
        }

        .tag-head-bar-more,
        .tag-head-bar-few {
            display: none;
        }
    }


}
</style>