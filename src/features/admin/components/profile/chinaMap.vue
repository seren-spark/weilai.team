<script lang="ts" setup>
import MapDrilling from "./map/index.vue";
</script>
<template>
  <div class="map-wrapper">
    <MapDrilling class="mapdriliing"></MapDrilling>
  </div>
</template>
<style lang="scss" scoped>
.map-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  //   background: no-repeat 2% 5% url('../../assets/images/bg.png');
  background-color: #fff;
  margin-top: 20px;

  .fade-enter {
    opacity: 0;
    transform: translateX(10px);
  }
  .fade-enter-active {
    transition: all 0.5s;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }

  h2 {
    color: #fff;
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 28px;
  }

  .mapdriliing {
    width: 100%;
    height: 100vh;
  }
}
</style>
