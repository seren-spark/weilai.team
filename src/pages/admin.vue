<script setup lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
let haide = false;
</script>

<template>
  <DefaultLayout></DefaultLayout>
</template>

<style lang="scss" scoped></style>

<route lang="json">
{
  "name": "admin",
  "meta": {
    "subNavItems": [
      {
        "name": "profile",
        "title": "概况",
        "icon": "material-symbols:overview-key-outline",
        "path": "/admin/profile",
        "redirect": "/admin/profile",

        "roles": "team_admin"
      },
      {
        "name": "contacts",
        "title": "通讯录",
        "icon": "ph:address-book-tabs",
        "path": "/admin/contacts",
        "redirect": "/admin/contacts/member",
        "roles": "team_admin"
      },
      {
        "name": "community",
        "title": "社区管理",
        "icon": "material-symbols:article-outline",
        "path": "/admin/community",
        "roles": "community_admin"
      },
      {
        "name": "recruitment",
        "title": "招新管理",
        "icon": "ph:student",
        "path": "/admin/recruitment/recruitment",
        "roles": "recruit_admin"
      },
      {
        "name": "attendance",
        "title": "考勤管理",
        "icon": "tdesign:time",
        "path": "/admin/attendance/overview",
        "roles": "attendance_admin"
      },
      {
        "name": "permission",
        "title": "权限管理",
        "icon": "material-symbols:shield-lock-outline-rounded",
        "path": "/admin/limits",
        "roles": "admin_plus"
      }
    ]
  }
}
</route>
