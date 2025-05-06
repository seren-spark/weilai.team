<template>
  <Title :type-id="tagStore.tagType.type" :sort="1" />
</template>

<script setup lang="ts">
import Title from "@community/components/Title.vue";
import { useTagStore } from "@/store/tagTypeStore";
const tagStore = useTagStore();
</script>

<style scoped></style>
