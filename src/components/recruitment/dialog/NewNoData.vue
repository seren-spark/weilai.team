<script setup lang="ts"></script>
<template>
  <div class="noData">
    <div class="noDataImg">
      <img src="@/assets/img/noData.png" alt="暂无数据" />
    </div>
    <p>No data</p>
  </div>
</template>
<style lang="scss" scoped>
.noData {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  .noDataImg {
    width: 80%;
    height: 80%;
    max-width: 100px;
    max-height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
    p {
        padding: 0 0.5rem;
        font-size: 0.8rem;
        background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
        background-clip: text;
        color: transparent;
        border-radius: 5px;
        margin-top: 20px;
        font-style: italic;
    }
}

</style>
