<!--
 * @Author: serendipity 2843306836@qq.com
 * @Date: 2025-09-27 15:44:46
 * @LastEditors: serendipity 2843306836@qq.com
 * @LastEditTime: 2025-11-07 10:06:34
 * @FilePath: \weilai.team\src\features\community\pages\brainstorm\axios-test.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>888 
  <button @click="test()">发起请求</button>
</template>
<script setup lang="ts">
import { smartApiClient } from "@/api/core/smart-api-client";
import { onMounted } from "vue";
//  "http://localhost:3002/api/team-b/users/paginated
function test() {
  smartApiClient
    .get("http://localhost:3002/api/team-b/users/paginated", {
      page: 1,
      pageSize: 10,
    })
    .then((res) => {
      console.log(res);
    });
}

</script>
