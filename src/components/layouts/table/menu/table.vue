<!-- 自定义右键样式 -->
<template>
  <div class="contextMenu">
    <div class="contextTop">
      <Button
        v-for="(items, index) in quickOptions"
        :key="index"
        :title="items.label"
        @click="items.handler"
        class="menuItem relative"
      >
        <div v-if="items.extra" class="extraOptions">
          <component :is="items.extra.component" v-bind="items.extra.props" />
        </div>
        <component :is="items.icon" />
      </Button>
    </div>
    <Separator class="bg-slate-300 my-1 h-[0.5px]" />
    <div v-for="(items, index) in options">
      <OptionIndex :option="items" :key="index" />
    </div>
  </div>
</template>
<script setup lang="ts">
import OptionIndex from "@/components/layouts/table/menu/indexmenu.vue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DefineComponent, FunctionalComponent } from "vue";
interface IExtraOption {
  label: string;
  icon: DefineComponent | FunctionalComponent;
  handler?: (event: number[]) => any;
  extra?: any;
}
interface IOption {
  label: string;
  icon: DefineComponent | FunctionalComponent;
  handler?: (event: number[], ...args: any) => any;
  options?: IOption[];
  extra?: any;
}
defineProps({
  options: {
    type: Array as () => IOption[],
    required: true,
  },
  quickOptions: {
    type: Array as () => IExtraOption[],
    required: true,
  },
});
</script>
<style lang="scss" scoped>
.menuItem:hover .extraOptions {
  visibility: visible;
  transform: translateX(0);
}
.contextMenu {
  border: 1px solid var(--jjext-color-shadow);
  display: inline-block;
  border-radius: 4px;
  padding: 5px;
}
.extraComponent {
  position: absolute;
  top: -150%;
  left: 0;
}
.extraOptions {
  position: absolute;
  visibility: hidden;
  bottom: 130%;
  left: 0;
  transform: translateX(10px);
  transition-duration: 250ms;
  background: var(--jjext-color-layer-4);
  border: 1px solid var(--jjext-color-shadow);
  border-radius: 4px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.appear {
  visibility: visible;
}
.contextTop {
  display: flex;
  gap: 3px;

  svg {
    width: 18px;
    height: 18px;
  }
  button {
    color: var(--jjext-color-layout-title);
    width: 35px;
    height: 35px;
    background: var(--jjext-color-layer-4);
    padding: 0 10px;
    transition-duration: 0.3s;
    outline: none;
  }
  button:hover {
    background: var(--jjext-color-shadow);
  }
}
</style>
