<script setup></script>
<template>
  <div class="noDataContainer">
    <div class="noData">
      <img class="noDataImg" src="../../assets/img/noData.png" alt="" />
      <p class="noDataText">暂无数据</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.noDataContainer {
  width: 100%;
  height: 100%;

  .noData {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .noDataImg {
      width: 20%;
      height: auto;
      object-fit: cover;
    }

    .noDataText {
      color: #999;
      padding-top: 15px;
      text-align: center;
      padding-right: 2%;
    }
  }
}
</style>
