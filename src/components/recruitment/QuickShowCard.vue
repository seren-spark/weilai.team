<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { defineProps } from "vue";
import { Icon } from "@iconify/vue";

type cardMessage = {
  label: string;
  number: number;
};
const props = defineProps<{ quickShowItem: cardMessage }>();
</script>
<template>
  <Card class="card-message-show">
    <div class="card-message-show-content">
      <div class="card-message-show-content-left">
        <div class="message">{{ props.quickShowItem.label }}</div>
        <div class="number">{{ props.quickShowItem.number }}</div>
      </div>
      <div class="card-message-show-content-right">
        <Icon class="svg" icon="lucide:hand" />
      </div>
    </div>
  </Card>
</template>
<style lang="scss" scoped>
@use "@/assets/styles";

.card-message-show {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px;
  margin: 10px;
  cursor: pointer;
}
.card-message-show-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.card-message-show-content-left {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 10px;
  .message {
    min-width: 50px;
    font-size: 1em;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .number {
    font-size: 1.2em;
    font-weight: 500;
    margin-top: 10px;
  }
}
.card-message-show-content-right {
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .svg {
    position: absolute;
    right: 20px;
  }
}
</style>
