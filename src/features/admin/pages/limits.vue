<script setup lang="ts">
import TheTopNav from "@/components/layouts/AppThirdNav.vue";
</script>

<template>
  <TheTopNav></TheTopNav>
  <RouterView></RouterView>
</template>

<route lang="json">
{
  "meta": {
    "title": "权限管理",
    "roles": "admin_plus",
    "thirdNavItems": [
      {
        "title": "权限",
        "path": "/admin/limits",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
