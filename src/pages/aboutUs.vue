<template>
  <div class="aboutUs">
    <HeaderNav :active-link="activeLink" :is-about-page="true" />
    <Environment />
    <div class="aboutUs-container">
      <Method />
      <AboutVideo />
    </div>
    <Bottom />
  </div>
</template>

<script setup lang="ts">
import HeaderNav from "@/features/homePage/components/topNav/HeaderNav.vue";
import Environment from "@/features/aboutUs/components/environment-wall/Environment.vue";
import Method from "@/features/aboutUs/components/methods/Method.vue";
import AboutVideo from "@/features/aboutUs/components/aboutVideo/AboutVideo.vue";
import Bottom from "@/features/homePage/components/bottom/Bottom.vue";
import { ref } from "vue";

const activeLink = ref<string>("about");
</script>

<style scoped lang="scss">
.aboutUs {
  width: 100%;
  .content {
    width: 100%;
  }
  .aboutUs-container {
    background-image: url(/public/post_background.png);
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
