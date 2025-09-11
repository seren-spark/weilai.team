<template>
  <div class="environment-wall">
    <div class="environmentCon">
      <Sticker
        :sticker-count="25"
        :min-size="170"
        :max-size="300"
        :max-rotation="12"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sticker from "./Sticker.vue";
</script>

<style scoped lang="scss">
.environment-wall {
  width: 100%;
  height: 820px;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .environmentCon {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-bottom: 50px;
  }
}
</style>
