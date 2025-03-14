<template>
  <!-- 用于手机端背景 -->
  <div>
    <div class="bg">
      <div class="bg-top"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .bg {
    position: fixed;
    top: 0;
    z-index: 0;
    width: 100%;
    height: 150px;
    background-color: #fafafa;
    &-top {
      background-image: linear-gradient(#dfe9f3, #ffffff00 100%);
      height: 150px;
    }
  }
}
</style>
