<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  rootMargin?: string; // 例如 "0px 0px 100px 0px"（底部提前100px加载）
}>();

const target = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target); // 触发后停止观察
      }
    },
    { rootMargin: props.rootMargin || "0px" },
  );

  if (target.value) observer.observe(target.value);
  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <div ref="target" class="lazy-container">
    <slot v-if="isVisible" />
    <div v-else class="loading-placeholder" style="height: 300px"></div>
  </div>
</template>
