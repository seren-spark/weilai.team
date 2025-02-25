<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import TagContent from "@/features/community/components/tag/TagContent.vue";

const route = useRoute();
const tag = ref("");
function getTag() {
  if ("tag" in route.params) {
    tag.value = route.params.tag as string;
  } else {
    tag.value = "";
  }
}
getTag();

watch(route, (newVal) => {
  getTag();
});
</script>

<template>
  <TagContent :tag="tag" />
</template>

<style scoped></style>
