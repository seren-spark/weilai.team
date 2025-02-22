<script setup lang="ts">
import PrimarySidebar from "@/features/post/components/sidebar/PrimarySidebar.vue";
import AppEditor from "@post/components/AppEditor.vue";
import PostHeader from "@post/components/header/index.vue";
import { onBeforeUnmount, reactive, ref, toRaw, watch } from "vue";
import useAppEditor from "@/features/post/composables/useAppEditor";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useRequest } from "vue-request";
import apiClient from "@/api/axios";
import type { ApiResponseData } from "@/types/api-response";
import router from "@/router";

interface PostErrors {
  id: number;
  title: string;
  postTxt: string;
}

interface PostResponse {
  noticeId: number | string;
}

const { editor } = useAppEditor();
const postData = reactive({
  id: "" as unknown as number,
  title: "" as string | number | undefined,
  postTxt: undefined as string | undefined,
});
const filedErrors = ref<z.ZodFormattedError<PostErrors> | undefined>();

const postSchema = z.object({
  postTitle: z
    .string()
    .min(1, { message: "标题不能为空" })
    .max(100, { message: "标题不能超过100个字符" }),
  postContent: z.string().min(1, "内容至少需要10个字符"),
});
postData.id = 66;

const validatePost = () => {
  const parseResult = postSchema.safeParse({
    postTitle: postData.title,
    postContent: JSON.stringify(postData.postTxt),
  });

  if (!parseResult.success) {
    filedErrors.value = parseResult.error.format();
  }

  return parseResult.success;
};

const putNotice = (data: typeof postData) => {
  return apiClient.put("/notice/updateNotice", data);
};

const {
  run: putNoticeRun,
  loading,
  data: putNoticeData,
} = useRequest<ApiResponseData<PostResponse>>(putNotice, {
  manual: true,
});

const getNoticeById = (noticeId: number) => {
  return apiClient.get(`/notice/getNoticeById/${noticeId}`);
};

const { data: NoticeData, run: getNoticeByIdRun } = useRequest(getNoticeById);

const handlePost = async () => {
  if (!validatePost()) {
    return;
  }

  putNoticeRun(toRaw(postData));
  console.log(postData);
};

watch(putNoticeData, (newValue) => {
  if (newValue?.code == 200) {
    toast({
      title: "发布成功",
      description: "您的文章已成功发布",
      duration: 1000,
    });

    if (newValue.data) {
      setTimeout(() => {
        router.push({
          name: "/community/notice",
        });
      });
    }
  } else if (newValue?.code == 2004) {
    toast({
      title: "该帖子不存在",
      description: "您的文章修改失败",
      duration: 1000,
    });
  }
});
getNoticeByIdRun(postData.id);
watch(NoticeData, (newValue) => {
  if (newValue && newValue.code === 200) {
    postData.title = newValue.data?.title || "";
    postData.postTxt = newValue.data?.content || undefined;
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
        <!-- 右侧边栏 -->
        <!-- <SecondarySidebar
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
        ></SecondarySidebar> -->
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
