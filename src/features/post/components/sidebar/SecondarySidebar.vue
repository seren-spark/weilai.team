<script setup lang="ts">
import Collapsible from "@/components/ui/collapsible/Collapsible.vue";
import CollapsibleContent from "@/components/ui/collapsible/CollapsibleContent.vue";
import CollapsibleTrigger from "@/components/ui/collapsible/CollapsibleTrigger.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import Toc from "./Toc.vue";
import type { Editor } from "@tiptap/vue-3";
import type { AcceptableInputValue } from "node_modules/radix-vue/dist/TagsInput/TagsInputRoot";
import { ref } from "vue";

interface PostErrors {
  postTitle: string;
  postContent: string;
  postTags: string[];
  postCategories: string;
  postSummary: string;
}

defineProps<{
  editor: Editor | undefined;
  postCategories: string | undefined;
  postTags: AcceptableInputValue[] | undefined;
  postSummary: string | number | undefined;
  errors: Zod.ZodFormattedError<PostErrors> | undefined;
}>();

defineEmits<{
  (e: "update:postCategories", value: string): void;
  (e: "update:postTags", value: AcceptableInputValue[]): void;
  (e: "update:postSummary", value: string | number | undefined): void;
}>();

const isAttributeOpen = ref(true);
const isTocOpen = ref(true);
</script>

<template>
  <aside class="secondary-sidebar">
    <Collapsible
      v-model:open="isAttributeOpen"
      class="secondary-sidebar__group"
    >
      <CollapsibleTrigger class="secondary-sidebar__header">
        <Icon icon="carbon:template"></Icon>
        <span class="secondary-sidebar__header-text">属性</span>
        <Icon
          icon="icon-park:down"
          class="secondary-sidebar__header-down"
        ></Icon>
      </CollapsibleTrigger>
      <CollapsibleContent class="secondary-sidebar__content">
        <Select
          :model-value="postCategories"
          class="outline-none"
          @update:model-value="
            (val) => {
              $emit('update:postCategories', val);
            }
          "
        >
          <div
            v-if="errors?.postCategories?._errors"
            class="secondary-sidebar__error"
          >
            <Icon icon="fluent:line-horizontal-5-error-20-regular"></Icon>
            <span>{{ errors.postCategories?._errors[0] }}</span>
          </div>
          <SelectTrigger
            class="secondary-sidebar__content-item"
            :class="{ 'filed--error': errors?.postCategories?._errors }"
          >
            <SelectValue placeholder="设置分类" class="" />
          </SelectTrigger>
          <SelectContent class="bg-white">
            <SelectGroup>
              <SelectLabel>分类：</SelectLabel>
              <SelectItem value="1" class="cursor-pointer"> 博客 </SelectItem>
              <SelectItem value="2" class="cursor-pointer"> 公告 </SelectItem>
              <SelectItem value="3" class="cursor-pointer"> 交流 </SelectItem>
              <SelectItem value="4" class="cursor-pointer">
                头脑风暴
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div v-if="errors?.postTags?._errors" class="secondary-sidebar__error">
          <Icon icon="fluent:tag-error-16-regular"></Icon>
          <span>{{ errors.postTags?._errors[0] }}</span>
        </div>
        <TagsInput
          class="secondary-sidebar__content-item"
          :class="{ 'filed--error': errors?.postTags?._errors }"
          :model-value="postTags"
          @update:model-value="
            (value) => {
              $emit('update:postTags', value);
            }
          "
        >
          <TagsInputItem
            v-for="(item, index) in postTags"
            :key="index"
            :value="item"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="标签..." />
        </TagsInput>
        <div
          v-if="errors?.postSummary?._errors"
          class="secondary-sidebar__error"
        >
          <Icon icon="fluent:document-error-16-regular"></Icon>
          <span>{{ errors.postSummary?._errors[0] }}</span>
        </div>
        <Textarea
          class="secondary-sidebar__content-item bg-transparent"
          :class="{ 'filed--error': errors?.postSummary?._errors }"
          placeholder="文章摘要"
          :model-value="postSummary"
          @update:model-value="
            (val) => {
              $emit('update:postSummary', val);
            }
          "
        />
      </CollapsibleContent>
    </Collapsible>
    <!-- 目录 -->
    <!-- <Collapsible v-model:open="isTocOpen" class="secondary-sidebar__group">
      <CollapsibleTrigger class="secondary-sidebar__header">
        <Icon icon="lucide:table-of-contents"></Icon>
        <span class="secondary-sidebar__header-text">目录</span>
        <Icon
          icon="icon-park:down"
          class="secondary-sidebar__header-down"
        ></Icon>
      </CollapsibleTrigger>
      <CollapsibleContent class="secondary-sidebar__content">
        <Toc :editor="editor"></Toc>
      </CollapsibleContent>
    </Collapsible> -->
  </aside>
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
