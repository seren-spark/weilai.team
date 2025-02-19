<script setup lang="ts">
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

import { defineProps, ref, defineEmits, watch } from "vue";

const emit = defineEmits(["transferToggleShowStatus"]);

type Item = {
  index: number;
  title: string;
  isActive: boolean;
};

const props = defineProps<{
  toggleItems: Item[];
}>();
const status = ref<number>(0);
// 切换组件的样式控制
function toggleActive(index: number) {
  status.value = index;
  props.toggleItems.forEach((item) => {
    item.isActive = item.index === index;
  });
}

watch(status, (newValue) => {
  // 发送事件
  emit("transferToggleShowStatus", newValue);
});
</script>

<template>
  <Menubar class="toggle-show p-3">
    <MenubarMenu>
      <MenubarTrigger v-for="item in toggleItems" :key="item.index">
        <Button
          :class="item.isActive ? 'active' : 'not-active'"
          @click="toggleActive(item.index)"
        >
          {{ item.title }}</Button
        >
      </MenubarTrigger>
    </MenubarMenu>
  </Menubar>
</template>

<style lang="scss" scoped>
@use "@/assets/styles";
$undertone: #647499;

.toggle-show {
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--accent);
}
.active {
  background-color: white;
  color: var(--white);
}
.not-active {
  background-color: var(--accent);
  color: $undertone;
  border: none;
}
</style>
