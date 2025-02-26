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
  <Menubar class="toggle-show p-3">
    <MenubarMenu>
      <MenubarTrigger v-for="item in toggleItems" :key="item.index">
        <Button
          ref="activeButton"
          :class="item.isActive ? 'active' : 'not-active'"
          @click="(event) => toggleActive(item.index, event)"
        >
          {{ item.title }}
        </Button>
        <div v-show="item.isActive" class="active-indicator"></div>
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
  position: relative;
}
.active {
  color: skyblue;
  background-color: white;
}
.not-active {
  color: black;
  border: none;
  background-color: white;
}
.active-indicator {
  width: 80px;
  position: absolute;
  bottom: 0;
  left: 10px;
  height: 4px;
  background-color: skyblue;
}

</style>
