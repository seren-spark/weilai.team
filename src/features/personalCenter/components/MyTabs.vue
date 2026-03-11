<template>
 <Tabs default-value="posts" class="mt-4">
    <TabsList class="grid w-full " :class="gridColumnsClass">
      <TabsTrigger value="posts">原创</TabsTrigger>
      <TabsTrigger v-if="showSchedule" value="schedule">课表</TabsTrigger>
      <TabsTrigger v-if="showCollections" value="collections">收藏</TabsTrigger>
      <TabsTrigger v-if="showLifePhotos" value="photos">生活照片</TabsTrigger>
    </TabsList>

    <TabsContent value="posts">
      <Posts />
    </TabsContent>
    <TabsContent v-if="showSchedule" value="schedule">
      <Schedule />
    </TabsContent>
    <TabsContent v-if="showCollections" value="collections">
      <Collections />
    </TabsContent>
    <TabsContent value="photos">
      <LifePhotos />
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

import { computed } from "vue";

const isTeacher = computed(() => userStore.isTeacher);
const showSchedule = computed(() => !isTeacher.value);
const showCollections = computed(() => userStore.isSelf);
const showLifePhotos = computed(() => userStore.isSelf);
console.log("userStore", userStore);

const gridColumnsClass = computed(() => {
  if (!userStore.isSelf) {
    return isTeacher.value ? 'grid-cols-1' : 'grid-cols-2'
  }
  return isTeacher.value ? 'grid-cols-3' : 'grid-cols-4'
})
</script>
<style lang="scss" scoped></style>
