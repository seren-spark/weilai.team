<template>
  <Tabs default-value="posts" class="mt-4">
   <template v-if="!userStore.isSelf">
     <TabsList class="grid w-full grid-cols-3">
      <TabsTrigger value="posts"> 原创 </TabsTrigger>
      <TabsTrigger value="schedule"> 课表 </TabsTrigger>
      <TabsTrigger value="photos"> 生活照片 </TabsTrigger>
    </TabsList>
   </template>
   <template v-else>
     <TabsList class="grid w-full grid-cols-4">
      <TabsTrigger value="posts"> 原创 </TabsTrigger>
      <TabsTrigger value="schedule"> 课表 </TabsTrigger>
      <TabsTrigger value="collections"> 收藏 </TabsTrigger>
      <TabsTrigger value="photos"> 生活照片 </TabsTrigger>
    </TabsList>
   </template>
    <TabsContent value="posts">
      <Posts></Posts>
    </TabsContent>
    <TabsContent value="schedule">
      <Schedule></Schedule>
    </TabsContent>
    <TabsContent value="collections">
      <Collections></Collections>
    </TabsContent>
    <TabsContent value="photos">
      <LifePhotos></LifePhotos>
    </TabsContent>
  </Tabs>
</template>
<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Posts from "./Posts.vue";
import Schedule from "./Schedule.vue";
import Collections from "./Collections.vue";
import LifePhotos from "./LifePhotos.vue";

import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
</script>
<style lang="scss" scoped></style>
