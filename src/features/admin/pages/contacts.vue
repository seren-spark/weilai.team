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
    "title": "通讯录",
    "roles": "team_admin",
    "thirdNavItems": [
      {
        "title": "成员管理",
        "path": "/admin/contacts/member",
        "icon": "i-mdi-file-document-multiple-outline"
      }
    ]
  }
}
</route>
