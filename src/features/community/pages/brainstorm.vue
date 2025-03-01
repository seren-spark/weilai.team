<script setup lang="ts">
import TheTopNav from "@/components/layouts/AppThirdNav.vue";
import { useTagStore } from "@/store/tagTypeStore";
import { ref } from "vue";
const type = ref(4);
interface TagData {
  type: number;
  tagType: string;
}
// const tagType = ref('blog')
const typeData = ref<TagData>({ type: 4, tagType: "brainstorm" });

const addTagType = useTagStore();
addTagType.addTag(typeData.value);
</script>

<template>
  <TheTopNav></TheTopNav>
  <RouterView></RouterView>
</template>

<style lang="scss" scoped></style>

<route lang="json">
{
  "meta": {
    "title": "头脑风暴",
    "thirdNavItems": [
      {
        "title": "头脑风暴",
        "path": "/community/brainstorm/detail",
        "icon": "i-mdi-file-document-multiple-outline"
      },
      {
        "title": "标签",
        "path": "/community/brainstorm/label/suggest",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
