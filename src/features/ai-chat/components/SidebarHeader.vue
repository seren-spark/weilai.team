<template>
  <div class="sidebar-header">
    <div class="logo">
      <Icon icon="carbon:cloud" class="logo-icon" />
      <span class="logo-text">智汇云舟</span>
    </div>
    <button class="collapse-btn" @click="$emit('collapse')">
      <Icon icon="mdi:dock-left" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineEmits<{
  collapse: [];
}>();
</script>

<style scoped lang="scss">
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .logo-icon {
      font-size: 1.5rem;
      color: #1890ff;
    }

    .logo-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1890ff;
    }
  }

  .collapse-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #666;
    font-size: 1.2rem;

    &:hover {
      color: #1890ff;
    }
  }
}
</style>
