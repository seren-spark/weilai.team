<script setup lang="ts">
import { defineProps } from "vue";
import { Skeleton } from "@/components/ui/skeleton";

defineProps<{
  name: string | number;
  loading?: boolean;
}>();
</script>

<template>
  <Skeleton v-if="loading" class="h-4 w-[32px]"  />
  <RouterLink
    v-else
    class="tag"
    :to="{ name: '/community/blog/label/[tag]', params: { tag: name } }"
  >
    <span class="tag__prefix" :style="{ color: '#747472' }">#</span>
    <span class="tag__name">{{ name }}</span>
  </RouterLink>
</template>

<style lang="scss" scoped>
.tag {
  padding: 0.2rem 0.75rem;
  border-radius: calc(var(--radius) * 2);
  font-size: 0.75rem;
  background-color: #e7f3f9;
  color: #8f8f8f;
  transition: all 0.5s ease;

  &:hover {
    background-color: rgba(41, 7, 152, 0.05);
  }

  &__name {
    font-weight: bold;
  }
}
</style>
