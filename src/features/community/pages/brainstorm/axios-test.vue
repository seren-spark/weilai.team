
<template>888 
  <button @click="test()">发起请求</button>
</template>
<script setup lang="ts">
import apiClient from '@/api/axios-with-adapter';

// import { smartApiClient } from "@/api/core/smart-api-client";

//  "http://localhost:3002/api/team-b/users/paginated
function test() {
  apiClient
    .get("http://localhost:3002/api/team-b/users/paginated", {
      page: 1,
      pageSize: 10,
    })
    .then((res) => {
      console.log(res);
    });
}

</script>
