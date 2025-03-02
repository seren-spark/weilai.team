<script setup lang="ts"></script>

<template>
  <div class="contentBody">
    <div class="content_img">
      <img src="@/assets/img/nothing.png" />
    </div>
    <p class="showTitle">当前文章并不存在</p>
  </div>
</template>

<style scoped lang="scss">
.contentBody {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .content_img {
    width: 550px;
    height: 400px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .showTitle {
    font-size: 19px;
    color: #616162;
    height: 20%;
  }
}
</style>
