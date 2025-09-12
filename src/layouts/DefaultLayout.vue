<script setup lang="ts">
import TheSidebar from "@/components/layouts/AppSidebar.vue";
import SidebarProvider from "@/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "@/components/ui/sidebar/SidebarTrigger.vue";
import SidebarInset from "@/components/ui/sidebar/SidebarInset.vue";
import { cn } from "@/lib/utils";
const description = "A sidebar that collapses to icons.";
const iframeHeight = "800px";
const containerClass = "w-full h-full";
const open = ref(true);
import { ref } from "vue";
</script>

<template>
  <SidebarProvider v-model:open="open">
    <TheSidebar :open="open" />
    <main
      :class="
        cn(
          'relative flex min-h-svh flex-1 flex-col ',
          'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        )
      "
      style="background-color: #f8f8f9;"
    >
      <div class="default-layout__container">
        <RouterView></RouterView>
      </div>
    </main>
  </SidebarProvider>
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
    padding-left: 0;
  }
}
.sidebar-trigger {
  position: absolute;
  top: 10%;
  left: 0;
}

@media screen and (max-width: 768px) {
  .sidebar-provider {
    width: 0;
  }
  .default-layout__container {
    padding: 0;
  }

  .default-layout {
    width: 100%;
  }
}
@media screen and (min-width: 1800px) {
  // .default-layout__container {
  //   max-width: 80% !important;
  // }
}
</style>
