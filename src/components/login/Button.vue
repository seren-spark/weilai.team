<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from "@/components/ui/button";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});

// 关键修改：直接暴露底层 DOM 元素
const root = ref<HTMLElement>();
defineExpose({
  getElement: () => root.value?.$el ?? root.value // 兼容 Radix Vue 的 Primitive
});
</script>

<template>
  <Primitive
    ref="root"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>