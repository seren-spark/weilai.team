<script setup lang="ts">
import PrimarySidebar from "@/features/post/components/sidebar/PrimarySidebar.vue";
import SecondarySidebar from "@/features/post/components/sidebar/SecondarySidebar.vue";
import AppEditor from "@post/components/AppEditor.vue";
import PostHeader from "@post/components/header/index.vue";
import { onBeforeUnmount, reactive, ref, toRaw, watch } from "vue";
import type { AcceptableInputValue } from "node_modules/radix-vue/dist/TagsInput/TagsInputRoot";
import useAppEditor from "@/features/post/composables/useAppEditor";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useRequest } from "vue-request";
import apiClient from "@/api/axios";
import type { ApiResponseData } from "@/types/api-response";
import router from "@/router";

interface PostErrors {
  title: string;
  postTxt: string;
  tags: string[];
  type: string;
  postAbstract: string;
}

interface PostResponse {
  postId: number | string;
}

const { editor } = useAppEditor();
const postData = reactive({
  title: "" as string | number | undefined,
  tags: [] as AcceptableInputValue[],
  type: "",
  postAbstract: "" as string | number | undefined,
  postTxt: undefined as string | undefined,
});
const filedErrors = ref<z.ZodFormattedError<PostErrors> | undefined>();

const postSchema = z.object({
  postTitle: z
    .string()
    .min(1, { message: "博文标题不能为空" })
    .max(100, { message: "博文标题不能超过100个字符" }),
  postContent: z.string().min(1, "博文内容至少需要10个字符"),
  postTags: z.array(z.string()).min(1, "请至少选择一个标签"),
  postCategories: z.string().min(1, "请选择一个分类"),
  postSummary: z
    .string()
    .min(10, { message: "摘要至少需要10个字符" })
    .max(200, { message: "摘要不能超过200个字符" }),
});

const validatePost = () => {
  const parseResult = postSchema.safeParse({
    postTitle: postData.title,
    postContent: JSON.stringify(postData.postTxt),
    postTags: postData.tags,
    postCategories: postData.type,
    postSummary: postData.postAbstract,
  });

  if (!parseResult.success) {
    filedErrors.value = parseResult.error.format();
  }

  return parseResult.success;
};

const putPost = (data: typeof postData) => {
  return apiClient.post("/post/put", data);
};

const { run, loading, data } = useRequest<ApiResponseData<PostResponse>>(
  putPost,
  {
    manual: true,
  },
);

const handlePost = async () => {
  if (!validatePost()) {
    return;
  }

  run(toRaw(postData));
};

watch(data, (newValue) => {
  if (newValue?.code == 2000) {
    toast({
      title: "发布成功",
      description: "您的文章已成功发布",
      duration: 1000,
    });

    if (newValue.data) {
      setTimeout(() => {
        router.push({
          name: "/community/post/[id]",
          params: { id: newValue?.data.postId },
        });
      });
    }
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <Toaster />
  <div class="post-layout">
    <div class="post-layout__wrapper">
      <PostHeader
        :is-title-tooltip="true"
        :errors="filedErrors"
        :is-publishing="loading"
        :post-title="postData.title"
        @published:post="handlePost"
        @update:post-title="
          (val) => {
            postData.title = val;
            const parseResult = postSchema.pick({ postTitle: true }).safeParse({
              postTitle: val,
            });

            if (filedErrors) {
              filedErrors.title = parseResult.error?.format().postTitle;
            }
          }
        "
      ></PostHeader>
      <main class="post-layout__content">
        <PrimarySidebar></PrimarySidebar>
        <AppEditor
          :editor="editor"
          :post-content="postData.postTxt"
          @update:post-content="
            (val) => {
              postData.postTxt = val;
            }
          "
        />
        <SecondarySidebar
          :editor="editor"
          :errors="filedErrors"
          :post-tags="postData.tags"
          :post-categories="postData.type"
          :post-summary="postData.postAbstract"
          @update:post-tags="
            (val) => {
              postData.tags = val;
              const parseResult = postSchema
                .pick({ postTags: true })
                .safeParse({
                  postTags: val,
                });

              if (filedErrors) {
                filedErrors.tags = parseResult.error?.format().postTags;
              }
            }
          "
          @update:post-categories="
            (val) => {
              postData.type = val;
              const parseResult = postSchema
                .pick({ postCategories: true })
                .safeParse({
                  postCategories: val,
                });

              if (filedErrors) {
                filedErrors.type = parseResult.error?.format().postCategories;
              }
            }
          "
          @update:post-summary="
            (val) => {
              postData.postAbstract = val;
              const parseResult = postSchema
                .pick({ postSummary: true })
                .safeParse({
                  postSummary: val,
                });

              if (filedErrors) {
                filedErrors.postAbstract =
                  parseResult.error?.format().postSummary;
              }
            }
          "
        ></SecondarySidebar>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-layout {
  box-sizing: border-box;
  height: 100vh;
  padding: 1.5rem;
  background-image: url(/public/post_background.png);
  background-size: cover;

  &__wrapper {
    background-color: rgba(255, 255, 255, 0.5);
    height: 100%;
    border-radius: 1rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  &__content {
    display: flex;
    flex: 1 1 calc(100vh - 3rem);
    overflow: auto;
    box-sizing: border-box;
  }
}
</style>
