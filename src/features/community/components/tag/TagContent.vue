<script setup lang="ts">
import TagRightBar from "@/features/community/components/tag/TagRightBar.vue";
import TagSuggest from "@/features/community/components/tag/TagSuggest.vue";
import NewsContent from "@/features/community/components/News.vue";
import CommunityTag from "@/features/community/composables/CommunityTag";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { tagPostList, getPostList } = CommunityTag();
const props = defineProps({
  tag: {
    type: String,
    default: "",
  },
});
function getTag() {
  // if ("tag" in route.params) {
  //     tag.value = route.params.tag as string;
  // } else {
  //     tag.value = "";
  // }
  getPostList(props.tag);
}
getTag();

watch(props, (newVal) => {
  getTag();
});
</script>

<template>
  <div class="tag-container">
    <!-- <div>标签</div> -->
    <!-- <tag-word-cloud></tag-word-cloud> -->
    <div class="all-article">
      <NewsContent :tagPostList="tagPostList" :isTag="true" />
    </div>
    <div class="right-bar">
      <tag-suggest style="margin: 0 0 30px 0"></tag-suggest>
      <!-- <HotTag style="width: 350px;"></HotTag> -->
      <tag-right-bar></tag-right-bar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-container {
  margin-top: 110px;
  display: flex;

  .all-article {
    width: calc(100% - 350px);
  }

  .right-bar {
    width: 330px;
    margin-left: 20px;
  }
}

@media screen and (max-width: 1200px) {
  .tag-container {
    margin-top: 100px;

    .all-article {
      width: calc(100% - 300px);
    }

    .right-bar {
      width: 300px;
      margin-left: 20px;
    }
  }
}

@media screen and (max-width: 1040px) {
  .tag-container {
    margin-top: 110px;

    .all-article {
      width: calc(100% - 250px);
    }

    .right-bar {
      width: 250px;
      margin-left: 20px;
    }
  }
}

@media screen and (max-width: 1040px) {
  .tag-container {
    margin-top: 100px;

    .all-article {
      width: 100%;
    }

    .right-bar {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .tag-container {
    margin-top: 130px;

    .all-article {
      width: 100%;
    }

    .right-bar {
      display: none;
    }
  }
}
</style>
