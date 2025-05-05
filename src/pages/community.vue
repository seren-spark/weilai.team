<script setup lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
</script>

<template>
  <DefaultLayout></DefaultLayout>
</template>

<style lang="scss" scoped></style>

<route lang="json">
{
  "meta": {
    "firNav": "community",
    "subNavItems": [
      {
        "title": "综合",
        "icon": "icon-park-outline:all-application",
        "path": "/community/comprehensive",
        "appPath": "/community/comprehensive/hot",
        "redirect": "/community/comprehensive/hot"
      },
      {
        "title": "博客",
        "icon": "uil:blogger-alt",
        "path": "/community/blog",
        "appPath": "/community/blog/hot",
        "redirect": "/community/blog/hot"
      },
      {
        "title": "公告",
        "icon": "material-symbols:article-outline",
        "appPath": "/community/notice",
        "path": "/community/notice"
      },
      {
        "title": "交流",
        "icon": "lucide-lab:coins-exchange",
        "path": "/community/discussion",
        "appPath": "/community/dicusstion/hot",
        "redirect": "/community/discussion/recommend"
      },
      {
        "title": "头脑风暴",
        "icon": "icon-park-outline:thinking-problem",
        "path": "/community/brainstorm",
        "appPath": "/community/brainstorm/hot",
        "redirect": "/community/brainstorm/hot"
      }
    ]
  }
}
</route>
