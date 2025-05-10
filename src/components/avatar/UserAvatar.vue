<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
const props = defineProps<{
  avatar?: string | undefined;
  isLoading?: boolean | undefined;
  customClass?: string | undefined;
}>();

</script>

<template>
  <div :class="` avatar-container ` + customClass ? customClass : ''">
    <div v-if="isLoading" class="flex items-center space-x-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>

    <div v-else :class="'avatar-info ' + customClass ? customClass : ''">
      <Avatar :class="customClass ? customClass : 'w-full h-full'" >
        <AvatarImage
          :src="avatar ? avatar : ''"
          alt="@radix-vue"
          id="avatarImage"
          class="h-full w-full"
        />
        <AvatarFallback>
          <img src="/public/defaultAvatar.png" class="default-avatar" />
        </AvatarFallback>
      </Avatar>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#avatarImage {
  width: 100%;
  min-height: 100%;

  object-fit: cover !important;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 30px;
  width: 100%;
  height: 100%;

  .avatar-info {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    gap: 10px;
  }
  .default-avatar {
    display: block;

    width: var(--avatar);
    height: 100%;
    height: var(--avatar);
    object-fit: cover;
  }
}
</style>
