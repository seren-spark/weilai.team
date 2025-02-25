<script setup lang="ts">
import TagWordCloud from "@/features/community/components/tag/TagWordCloud.vue";
import { ref } from "vue";
const type = ref(3);
const tagType = ref("discussion");
</script>

<template>
  <div>
    <TagWordCloud :type="type" :tagType="tagType"></TagWordCloud>
  </div>
</template>

<style scoped lang="scss"></style>
