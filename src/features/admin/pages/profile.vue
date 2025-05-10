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
    "title": "概况",
    "roles": "profile_admin",
    "thirdNavItems": [
      {
        "title": "概况",
        "path": "/admin/profile",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
