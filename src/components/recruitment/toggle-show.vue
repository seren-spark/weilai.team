<script setup lang="ts">
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { defineProps, ref, defineEmits, watch} from "vue";

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
const activeButton = ref<HTMLElement | null>(null);
// 切换组件的样式控制
function toggleActive(index: number, event: Event) {
  status.value = index;
  props.toggleItems.forEach((item) => {
    item.isActive = item.index === index;
  });
  activeButton.value = event.currentTarget as HTMLElement;
}

watch(status, (newValue) => {
  // 发送事件
  emit("transferToggleShowStatus", newValue);
});
</script>

<template>
  <Menubar class="toggle-show">
    <MenubarMenu>
      <MenubarTrigger v-for="item in toggleItems" :key="item.title">
        <Button
        style="transition: box-shadow 0.5s ease;"
          :class="item.isActive ? 'active' : 'not-active'"
          @click="(event:any) => toggleActive(item.index, event)"
        >
          {{ item.title }}
        </Button>
      </MenubarTrigger>

    </MenubarMenu>
  </Menubar>
</template>

<style lang="scss" scoped>

.toggle-show {
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.active {
  color: var(--primary-foreground);
  background-color: white;
  box-shadow:0 3px 0 var(--primary-foreground), 0 -1px 0 var(--primary-foreground);
}
.not-active {
  color: black;
  border: none;
  background-color: white;
  box-shadow: 0 2px 0 transparent;
}
</style>
