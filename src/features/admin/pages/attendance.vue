<script setup lang="ts">
import TheTopNav from "@/components/layouts/AppThirdNav.vue";
</script>

<template>
  <TheTopNav></TheTopNav>
  <RouterView></RouterView>
</template>

<style lang="scss" scoped>

</style>

<route lang="json">
{
  "meta": {
    "title": "考勤管理",
    "roles": "attendance_admin",
    "thirdNavItems": [
      {
        "title": "考勤概览",
        "path": "/admin/attendance/overview",
        "icon": "i-mdi-file-document-multiple-outline"
      },
      {
        "title": "考勤统计",
        "path": "/admin/attendance/statistics",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
