<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import TitleInput from "./TitleInput.vue";
import Button from "@/components/ui/button/Button.vue";
import { Loader2 } from "lucide-vue-next";
import { watch } from "vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostErrors {
  postTitle: string;
  postContent: string;
  postTags: string[];
  postCategories: string;
  postSummary: string;
}

const props = defineProps<{
  postTitle: string | number | undefined;
  isPublishing: boolean;
  isTitleTooltip: boolean;
  errors: Zod.ZodFormattedError<PostErrors> | undefined;
}>();

watch(
  () => props.isPublishing,
  (newValue) => {
    console.log(newValue);
  },
);

defineEmits<{
  (e: "update:postTitle", value: string | number | undefined): void;
  (e: "published:post", value: () => void): void;
}>();
</script>

<template>
  <header class="post-header">
    <div class="post-header__profile">头像</div>
    <div class="post-header__message">消息</div>
    <div class="post-header__title">
      <TooltipProvider :disable-hoverable-content="true">
        <Tooltip :open="!!errors?.postTitle">
          <TooltipTrigger>
            <TitleInput
              class="post-header__title-input w-auto"
              type="text"
              placeholder="🎉  输入文章标题"
              :model-value="props.postTitle"
              @update:model-value="(val) => $emit('update:postTitle', val)"
            ></TitleInput>
          </TooltipTrigger>
          <TooltipContent class="text-destructive-foreground">
            <p>{{ errors?.postTitle?._errors[0] }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <Button
      class="post-header__publish"
      @click="
        () => {
          $emit('published:post', () => {});
        }
      "
    >
      <Loader2 v-if="isPublishing" class="w-4 h-4 mr-2 animate-spin" />
      <Icon
        v-else
        icon="lets-icons:circle-right-light"
        width="1.6rem"
        height="1.6rem"
      ></Icon>
      <span>发布</span>
    </Button>
  </header>
  <hr />
</template>

<style lang="scss" scoped>
.post-header {
  width: 100%;
  flex: 1 0 3rem;
  backdrop-filter: blur(16px);
  border-radius: 1rem 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 1rem;
  box-shadow: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);

  &__title {
    background-color: transparent;

    &-input {
      height: 100%;
      background-color: transparent;

      &:focus {
        outline: none;
      }
    }
  }

  &__publish {
    color: var(--primary-foreground);
    background-color: var(--primary);
    border-radius: 1rem;
    padding: 0.25rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    transition: all 0.5s ease;

    span {
      font-size: 0.85rem;
    }
  }

  &__title {
    margin: 0 auto;
  }
}
</style>
