<template>
  <Tabs default-value="posts" class="mt-4">
    <TabsList class="grid w-full grid-cols-3">
      <TabsTrigger value="posts"> 博客 </TabsTrigger>
      <TabsTrigger value="schedule"> 课表 </TabsTrigger>
      <TabsTrigger value="collections"> 收藏 </TabsTrigger>
    </TabsList>
    <TabsContent value="posts">
      <Posts></Posts>
    </TabsContent>
    <TabsContent value="schedule">
      <Schedule></Schedule>
    </TabsContent>
    <TabsContent value="collections">
      <Collections></Collections>
    </TabsContent>
  </Tabs>
</template>
<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Posts from "./Posts.vue";
import Schedule from "./Schedule.vue";
import Collections from "./Collections.vue";
</script>
<style lang="scss" scoped></style>
