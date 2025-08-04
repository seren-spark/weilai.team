<script setup lang="ts">
import Catalog from "./Catalog.vue";
// import Collapsible from "@/components/ui/collapsible/Collapsible.vue";
// import CollapsibleContent from "@/components/ui/collapsible/CollapsibleContent.vue";
// import CollapsibleTrigger from "@/components/ui/collapsible/CollapsibleTrigger.vue";
// import { Icon } from "@iconify/vue/dist/iconify.js";
import { ref } from "vue";
import type { Editor } from "@tiptap/vue-3";
defineProps<{
  editor: Editor | undefined;
}>();
const isOpen = ref(true);
</script>

<template>
  <aside class="primary-sidebar">
    <!-- 原位置为模板 -->
    <!-- <Collapsible v-model:open="isOpen" class="primary-sidebar__group">
      <CollapsibleTrigger class="primary-sidebar__header">
        <Icon icon="carbon:template"></Icon>
        <span class="primary-sidebar__header-text">模板</span>
        <Icon icon="icon-park:down" class="primary-sidebar__header-down"></Icon>
      </CollapsibleTrigger>
      <CollapsibleContent class="primary-sidebar__content">
        <div class="">模板1</div>
      </CollapsibleContent>
    </Collapsible> -->
    <Catalog :editor="editor" />
  </aside>
</template>

<style lang="scss" scoped>
.primary-sidebar {
  flex: 1 0 25%;
  border-radius: 0 0 0 1rem;
  padding: 1rem;

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
}
</style>
