<script setup lang="ts">
import TagHeadBar from "@/features/community/components/tag/TagHeadBar.vue";
import { ref } from "vue";
</script>

<template>
  <div>
    <TagHeadBar></TagHeadBar>
    <router-view />
    <!-- <RightBar /> -->
    <!-- <TagWordCloud></TagWordCloud> -->
  </div>
</template>

<style scoped></style>
