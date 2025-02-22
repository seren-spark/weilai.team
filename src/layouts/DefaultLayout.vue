<script setup lang="ts">
import TheSidebar from "@/components/layouts/AppSidebar.vue";
import SidebarProvider from "@/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "@/components/ui/sidebar/SidebarTrigger.vue";
</script>

<template>
  <div class="default-layout">
    <SidebarProvider
      class="w-auto h-full max-md:w-auto 2xl:w-[17%] sidebar-provider"
    >
      <TheSidebar style="background-color: white">
        <main>
          <SidebarTrigger></SidebarTrigger>
        </main>
      </TheSidebar>
    </SidebarProvider>
    <div class="default-layout__container">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  background-color: #fafafa;
  width: calc(100vw - var(--scrollbar-width));
  &__container {
    flex: 1;
    padding: 1rem;
    padding-top: 4rem;
  }
}

@media screen and (max-width: 768px) {
  .sidebar-provider {
    width: 0;
  }
  .default-layout__container {
    padding: 0;
  }
}
@media screen and (min-width: 1800px) {
  .default-layout__container {
    max-width: 80% !important;
  }
}
</style>
