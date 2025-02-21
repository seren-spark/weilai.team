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
import NoData from '@/components/loading/NoData.vue';


const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType
const { useTagList, getUseTagList } = CommunityTag()


interface UseTagList {
    tagName: string;
    count: number
}


const firstUseTagList = ref<UseTagList[]>([]);
getUseTagList()
watch(useTagList, () => {
    if (useTagList.value.length > 10) {
        firstUseTagList.value = useTagList.value.slice(0, 10);
    } else {
        firstUseTagList.value = useTagList.value
    }
})

</script>

<template>
    <div class="article-rank">
        <div class="rank-top">
            <p>
                <Icon icon="icon-park-outline:tag" class="tagHeadIcon" /> &nbsp;<span>标签榜
                </span>
            </p>

        </div>
        <hr />
        <ul>
            <li v-if="firstUseTagList.length === 0">
                <NoData />
            </li>
            <li v-for="(item, index) in firstUseTagList" :key="index">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <router-link :to="`/community/${tagType}/label/${item.tagName}`">
                                <span class="ranking">{{ index + 1 }}</span><span>{{ item.tagName }}</span>
                            </router-link>
                        </TooltipTrigger>
                        <TooltipContent class="bg-white">
                            <router-link :to="`/community/${tagType}}/label/${item.tagName}`">
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
    </div>
</template>

<style scoped lang="scss">
.article-rank {
    background-color: white;
    border-radius: var(--radius);
    border-radius: 4px;
    box-shadow: 0 4px 30px 0 rgba(232, 232, 237, .3);
}

.rank-top {
    height: 3rem;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tagHeadIcon {
        font-size: 20px;
    }

    p {
        display: flex;
        align-items: center;
        color: var(--secondary-foreground);
        height: 100%;
        font-size: 16px;
        line-height: 4rem;
    }
}

.ranking {
    font-weight: bold;
    font-size: 17px;
    font-family: sans-serif;
    background-image: linear-gradient(#e9afa6, #eee0d4, #eadccc);
    -webkit-background-clip: text;
    /* Safari 和 Chrome 需要此属性 */
    color: transparent;
    /* 确保文字是透明的 */
    margin-right: 5px;
    display: inline-block;
    width: 30px;
    text-align: center;
}

ul {
    padding: 10px 15px;
    width: 100%;

    .no-data {
        width: 100%;
        text-align: center;
        font-size: 17px;
    }

    li {
        font-size: 15px;
        color: var(--secondary-foreground);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 8px;
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
            max-width: 220px;
        }
    }

    .bar {
        display: flex;
        align-items: center;

        .hotIcon {
            color: #f2731e;
            margin-right: 5px;
        }
    }
}

@media screen and (max-width: 1200px) {
    .rank-top {
        font-size: 14px;

        .tagHeadIcon {
            font-size: 16px;
        }

        p {
            height: 100%;
            font-size: 12px;
            line-height: 4rem;
        }
    }

    .ranking {
        font-size: 12px;
    }

    ul {
        li {
            font-size: 12px;
        }
    }
}

@media screen and (max-width: 1040px) {
    .rank-top {
        font-size: 12px;

        .tagHeadIcon {
            font-size: 14px;
        }

        p {
            height: 100%;
            font-size: 12px;
            line-height: 4rem;
        }
    }

    .ranking {
        font-size: 12px;
    }

    ul {
        li {
            font-size: 11px;
        }
    }
}
</style>