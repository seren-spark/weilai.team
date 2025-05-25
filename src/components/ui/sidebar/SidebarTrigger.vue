<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-vue-next";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import { useSidebar } from "./utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { toggleSidebar, open } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
    class="right-[-4%]"
    v-if="open"
  >
    <ChevronLeft class="text-base" />
  </Button>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
    class="right-[-8%]"
    v-else
  >
    <ChevronRight class="font-weigth-bold" />
  </Button>
</template>
