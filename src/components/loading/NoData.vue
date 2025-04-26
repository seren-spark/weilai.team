<script setup lang="ts"></script>
<template>
  <div class="noDataContainer">
    <div class="noData">
      <img class="noDataImg" src="../../assets/img/noData.png" alt="" />
      <p class="noDataText">No Data</p>
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
      //   color: #999;
      padding-top: 15px;
      text-align: center;
      padding-right: 2%;
      background: linear-gradient(to right, #619bbe, #c9c3e6);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
