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
    "subNavItems": [
      {
        "title": "概况",
        "icon": "material-symbols-light:overview-key-outline",
        "path": "/admin/profile",
        "redirect": "/admin/profile"
      },
      {
        "title": "通讯录",
        "icon": "ph:address-book-tabs-light",
        "path": "/admin/contacts",
        "redirect": "/admin/contacts/member"
      },
      {
        "title": "社区管理",
        "icon": "material-symbols:article-outline",
        "path": "/admin/community"
      },
      {
        "title": "招新管理",
        "icon": "arcticons:studentid",
        "path": "/admin/recruitment/recruitment"
      },
      {
        "title": "考勤管理",
        "icon": "weui:time-outlined",
        "path": "/admin/attendance"
      },
      {
        "title": "权限管理",
        "icon": "material-symbols-light:shield-lock-outline",
        "path": "/admin/limits"
      }
    ]
  }
}
</route>
