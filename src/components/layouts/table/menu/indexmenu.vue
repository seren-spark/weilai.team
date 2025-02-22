<template>
  <div class="relative inline-block menuItem">
    <Button @click="props.option.handler" class="optionClass">
      <div class="flex gap-2 items-center">
        <component :is="props.option.icon" />
        <span>{{ props.option.label }}</span>
      </div>
      <ChevronRight v-if="props.option.options" />
    </Button>
    <div
      v-if="props.option.options"
      :class="[extraClass ? 'appear' : '', 'extraOptions']"
      @mouseenter="toggleExtra(true)"
      @mouseleave="toggleExtra(false)"
    >
      <div
        class="menu"
        v-for="(item, index) in props.option.options"
        :key="index"
      >
        <Button @click="item.handler">
          <div class="flex gap-2 items-center">
            <component :is="item.icon" />
            <span v-if="!(item.extra && item.extra.component)">{{
              item.label
            }}</span>
            <component
              v-else
              :is="item.extra.component"
              v-bind="item.extra.props"
            />
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { type DefineComponent, FunctionalComponent, ref } from "vue";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-vue-next";
interface IOption {
  label: string;
  icon: DefineComponent | FunctionalComponent;
  handler?: (event: number[], ...args: any) => any;
  options?: IOption[];
  extra?: any;
}
const props = defineProps({
  option: {
    type: Object as () => IOption,
    required: true,
  },
});
const extraClass = ref(false);
const toggleExtra = (visible: boolean) => {
  extraClass.value = visible;
};
console.log(props);
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
svg {
  width: 18px;
  height: 18px;
}
.menuItem:hover .extraOptions {
  visibility: visible;
  transform: translateX(0);
}
button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--jjext-color-layout-title);
  width: 180px;
  height: 35px;
  background: var(--jjext-color-layer-4);
  padding: 0 10px;
  transition-duration: 0.3s;
  outline: none;
}
button:hover {
  background: var(--jjext-color-shadow);
}
.extraOptions {
  position: absolute;
  visibility: hidden;
  top: 0;
  left: 110%;
  transform: translateX(10px);
  transition-duration: 250ms;
  background: var(--jjext-color-layer-4);
  border: 1px solid var(--jjext-color-shadow);
  border-radius: 4px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  button {
    height: 30px;
  }
}
.appear {
  visibility: visible;
}
</style>
