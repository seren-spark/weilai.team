<script setup lang="ts">
import TheTopNav from "../../../components/layouts/AppThirdNav.vue";
import { useTagStore } from "@/store/tagTypeStore";
import { ref } from "vue";
interface TagData {
  type: number;
  tagType: string;
}
// const tagType = ref('blog')
const typeData = ref<TagData>({ type: 0, tagType: "comprehensive" });

const addTagType = useTagStore();
addTagType.addTag(typeData.value);

// import MyHeader from "../components/MyHeader.vue";
import MyHeader from "@/features/personalCenter/components/myHeader.vue";
import MyTabs from "../components/MyTabs.vue";
import Rightbar from "../../../components/community/Rightbar.vue";
</script>

<template>
  <TheTopNav></TheTopNav>
  <div style="display: flex">
    <div class="content">
      <MyHeader></MyHeader>
      <MyTabs></MyTabs>
    </div>
    <Rightbar></Rightbar>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  padding: 0px 100px 10px 100px;
}

/* 使用媒体查询为手机端修改padding */
@media (max-width: 768px) {
  .content {
    padding: 80px 0 60px 0;
  }
}
</style>

<route lang="json">
{
  "meta": {
    "title": "资料",
    "thirdNavItems": [
      {
        "title": "资料",
        "path": "/personalCenter/userInfo",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
