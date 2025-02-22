<script setup lang="ts">
import LoginForm from "@/components/login/LoginForm.vue";
import LoginAnimation from "@/components/login/LoginAnimation.vue";
</script>

<template>
  <div class="login-container">
    <LoginAnimation></LoginAnimation>
    <LoginForm></LoginForm>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image: url("/public/post_background.png");
  background-size: cover;
}
@media screen and (max-width: 1024px) {
  .login-container {
    justify-content: flex-start;
  }
}
</style>
