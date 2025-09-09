<template>
  <div class="method">
    <div class="content">
      <div class="title">
        学习模式<span class="titles">开启高效学习之旅</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 在这里编写组件逻辑
</script>

<style scoped lang="scss">
.method {
  width: 100%;
  height: 680px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(/public/post_background.png);
  background-repeat: no-repeat;
  background-size: cover;
  .content {
    width: 1000px;
    height: 600px;
    .title {
      width: 100%;
      height: 60px;
      font-size: 22px;
      font-family: "Times New Roman", Times, serif;
      font-weight: bold;
      background-image: url(../../../../assets/img/bgColor.png);
      background-repeat: no-repeat;
      background-size: contain;
      .titles {
        font-weight: 300;
        font-size: 14px;
        margin-left: 30px;
      }
    }
  }
}
</style>
