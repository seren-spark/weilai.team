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
    "title": "招新管理",
    "roles": "recruit_admin",
    "thirdNavItems": [
      {
        "title": "首页",
        "path": "/admin/recruitment/recruitment",
        "icon": "bitcoin-icons:home-outline"
      },
      {
        "title": "候选人",
        "path": "/admin/recruitment/candidates",
        "icon": "la:user-tie"
      },
      {
        "title": "面试",
        "path": "/admin/recruitment/interview",
        "icon": "heroicons:calendar-date-range"
      }
    ]
  }
}
</route>
