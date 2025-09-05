<script setup lang="ts">
import Collapsible from "@/components/ui/collapsible/Collapsible.vue";
import CollapsibleContent from "@/components/ui/collapsible/CollapsibleContent.vue";
import CollapsibleTrigger from "@/components/ui/collapsible/CollapsibleTrigger.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import Toc from "./Toc.vue";
import type { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
defineProps<{
  editor: Editor | undefined;
}>();
const isTocOpen = ref(true);
</script>

<template>
  <Collapsible v-model:open="isTocOpen" class="secondary-sidebar__group">
    <CollapsibleTrigger class="secondary-sidebar__header">
      <Icon icon="lucide:table-of-contents"></Icon>
      <span class="secondary-sidebar__header-text">目录</span>
      <Icon icon="icon-park:down" class="secondary-sidebar__header-down"></Icon>
    </CollapsibleTrigger>
    <CollapsibleContent class="secondary-sidebar__content">
      <Toc :editor="editor"></Toc>
    </CollapsibleContent>
  </Collapsible>
</template>

<style lang="scss" scoped>
.secondary-sidebar {
  flex: 1 0 25%;
  border-radius: 0 0 0 1rem;
  padding: 1rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }

  &__group {
    margin-bottom: 1rem;
  }

  &__header {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    margin-bottom: 1rem;

    &-text {
      margin-left: 0.5rem;
      color: var(--secondary-foreground);
      font-size: 0.85rem;
    }

    &-down {
      color: var(--secondary-foreground);
      position: absolute;
      right: 0;
    }
  }

  &__content {
    &-item {
      margin-bottom: 1rem;
      color: var(--secondary-foreground);
      font-size: 0.85rem;
    }
  }

  &__error {
    color: var(--destructive-foreground);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
}

.filed--error {
  border: 1px solid var(--destructive-foreground);
}
</style>
