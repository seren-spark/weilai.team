<template>
  <div class="feature-list">
    <div
      v-for="feature in features"
      :key="feature.id"
      class="feature-item"
      :class="{ active: currentFeature === feature.id }"
      @click="$emit('select', feature.id)"
    >
      <Icon :icon="feature.icon" />
      <span>{{ feature.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

export interface Feature {
  id: string;
  label: string;
  icon: string;
}

defineProps<{
  currentFeature: string;
  features: Feature[];
}>();

defineEmits<{
  select: [featureId: string];
}>();
</script>

<style scoped lang="scss">
.feature-list {
  padding: 0 1rem;
  margin-bottom: 1rem;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.25rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #333;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #e6f7ff;
      color: #1890ff;
    }

    span {
      font-size: 0.9rem;
    }
  }
}
</style>
