<script setup lang="ts">
// import 'iconify-icon';
import { Icon } from "@iconify/vue";
import CommunityTag from "@/features/community/composables/CommunityTag";
import { useTagStore } from "@/store/tagTypeStore";
import NoData from "@/components/loading/NoData.vue";

const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType;
const { hotTagList, getRecommendTag } = CommunityTag();
getRecommendTag();
</script>

<template>
  <div class="rightBarTag">
    <div class="rightTagHead">
      <div class="tagHeadTitle">
        <Icon icon="tabler:tag" class="tagIcon"></Icon>
        <span>热门标签</span>
      </div>
      <router-link
        active-class="active"
        :to="`/community/${tagType}/label/suggest`"
      >
        <Icon icon="icon-park-outline:right" class="moreTag"></Icon>
      </router-link>
    </div>
    <div class="hotTagList">
      <NoData v-if="hotTagList.length === 0" />
      <span v-for="(tag, index) in hotTagList" :key="index" class="tag">
        <router-link
          active-class="active"
          :to="`/community/${tagType}/label/${tag}`"
          >#{{ tag }}</router-link
        >
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rightBarTag {
  background-color: #fff;
  border: 2px solid #ffffff;
  max-height: 300px;
  overflow: hidden;
  box-shadow: 0 4px 30px 0 rgba(232, 232, 237, 0.3);

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
      font-size: 0.9vw;

      .tagIcon {
        color: #4f4e4e;
        font-size: 1vw;
        margin-right: 5px;
      }
    }

    .moreTag {
      color: #4f4e4e;
      font-size: 0.9vw;
      cursor: pointer;
    }
  }

  .hotTagList {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    // max-height: 155px;
    // overflow: hidden;

    .tag {
      color: #747272;
      font-size: 0.9vw;
      padding: 0px 20px;
      margin: 8px 5px;
      // border: 1px solid #88a6dd;
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

@media screen and (max-width: 1200px) {
  .rightBarTag {
    .hotTagList {
      .tag {
        padding: 0px 14px;
        margin: 8px 4px;
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .rightBarTag {
    .hotTagList {
      .tag {
        padding: 0px 12px;
        margin: 8px 3px;
      }
    }
  }
}
</style>
