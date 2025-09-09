<template>
  <div class="aboutUs">
    <HeaderNav :active-link="activeLink" :is-about-page="true" />
    <Environment />
    <Method />
  </div>
</template>

<script setup lang="ts">
import HeaderNav from "@/features/homePage/components/topNav/HeaderNav.vue";
import Environment from "@/features/aboutUs/components/environment-wall/Environment.vue";
import Method from "@/features/aboutUs/components/methods/Method.vue";
import { ref } from "vue";

const activeLink = ref<string>("about");
</script>

<style scoped lang="scss">
.aboutUs {
  width: 100%;
  min-height: 100vh;
  background-color: #eaebfa;
  .content {
    width: 100%;
    height: 100vh;
  }
}
</style>
