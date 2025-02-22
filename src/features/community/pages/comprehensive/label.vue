<script setup lang="ts">
import TagHeadBar from "@/features/community/components/tag/TagHeadBar.vue";
// import TagWordCloud from '../../components/tag/TagWordCloud.vue';
// import RightBar from '../../components/tag/RightBar.vue';
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
