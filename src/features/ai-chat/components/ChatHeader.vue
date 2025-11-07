<template>
  <div class="chat-header">
    <h1>{{ greeting }}</h1>
    <div class="header-actions">
      <button class="header-btn">
        <Icon icon="mdi:home" />
      </button>
      <button class="header-btn">
        <Icon icon="mdi:bell-outline" />
      </button>
      <button class="header-btn">
        <Icon icon="mdi:account-circle" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  greeting: string;
}>();
</script>

<style scoped lang="scss">
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;

    .header-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.5rem;
      color: #666;
      transition: color 0.2s;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
