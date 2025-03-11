<script setup lang="ts">
import { Icon } from "@iconify/vue";
import CommunityTag from "../../composables/CommunityTag";
import { useTagStore } from "@/store/tagTypeStore";
import NoData from "@/components/loading/NoData.vue";
import { Skeleton } from "@/components/ui/skeleton";

const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType;
const { likeTagList, getHotTagList, loading } = CommunityTag();

getHotTagList();
</script>

<template>
  <div class="rightBarTag">
    <div class="rightTagHead">
      <div class="tagHeadTitle">
        <Icon icon="tabler:tag" class="tagIcon"></Icon>
        <span>猜你喜欢</span>
      </div>
    </div>

    <div v-if="likeTagList.length > 0" class="hotTagList">
      <span class="tag" v-for="(tag, index) in likeTagList" :key="index">
        <router-link :to="`/community/${tagType}/label/${tag}`"
          >#{{ tag }}</router-link
        >
      </span>
    </div>
    <div v-else-if="loading" class="tagLoading">
      <div v-for="index in 9" :key="index" class="tagLoadingItem">
        <Skeleton class="h-[10px] w-[70px]" />
      </div>
    </div>
    <div v-else-if="likeTagList.length == 0" class="noMoreTag">
      <NoData />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rightBarTag {
  border: 2px solid #ffffff;
  max-height: 100%;
  overflow: hidden;
  background-color: white;

  .tagLoading {
    display: flex;
    flex-wrap: wrap;

    .tagLoadingItem {
      margin: 10px;
    }
  }

  .rightTagHead {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1.5px solid #e6e6e6;

    .tagHeadTitle {
      display: flex;
      align-items: center;
      color: #6d6d6d;

      .tagIcon {
        color: #4f4e4e;
        font-size: 1.25rem;
        margin-right: 0.625rem;
      }
    }

    .moreTag {
      color: #4f4e4e;
      font-size: 1.375rem;
    }
  }

  .noMoreTag {
    padding: 20px;
    color: #5a5a5a;
    text-align: center;
  }

  .hotTagList {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    .tag {
      color: #747272;
      font-size: 0.75rem;
      padding: 0px 20px;
      margin: 8px 5px;
      background-color: #e7f3f9;
      border-radius: 25px;
    }

    .tag:nth-child(n) {
      background-color: #e7f3f9;
    }

    .tag:nth-child(2n) {
      background-color: #f7e7f9;
    }

    .tag:nth-child(3n) {
      background-color: #e7f9e7;
    }

    .tag:nth-child(4n) {
      background-color: #f8f9e7;
    }

    .tag:nth-child(5n) {
      background-color: #e8e7f9;
    }

    .tag:nth-child(6n) {
      background-color: #f7e3dc;
    }
  }
}
</style>
