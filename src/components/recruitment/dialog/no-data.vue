<script setup lang="ts"></script>
<template>
  <div class="noData">
    <div class="noDataImg">
      <img src="@/assets/img/noData.png" alt="暂无数据" />
    </div>
    <div class="no-data-text">
      <p>No data</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.noData {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  .noDataImg {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100px;
      max-height: 100px;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

  }
}
.no-data-text {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

    font-size: 0.8rem;

    font-style: italic;
  p {
    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
    background-clip: text;
    color: transparent;
    border-radius: 5px;
    padding: 0  1rem 0 0;
  }
}
</style>
