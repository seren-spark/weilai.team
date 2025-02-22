<script setup lang="ts">
import TagWordCloud from "@/features/community/components/tag/TagWordCloud.vue";
import { ref } from "vue";
const type = ref(1);
const tagType = ref("blog");
</script>

<template>
  <div>
    <TagWordCloud :type="type" :tagType="tagType"></TagWordCloud>
  </div>
</template>

<style scoped lang="scss"></style>
