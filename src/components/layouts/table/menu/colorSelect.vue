<!-- 颜色选择器 -->
<template>
  <div class="colorSelect">
    <div></div>
    <div class="perview">
      <div
        class="bg-[#f87171] text-[#f87171]"
        @click="changeColorIt('#f87171')"
      ></div>
      <div
        class="bg-[#facc15] text-[#facc15]"
        @click="changeColorIt('#facc15')"
      ></div>
      <div
        class="bg-[#0284c7] text-[#0284c7]"
        @click="changeColorIt('#0284c7')"
      ></div>
      <div
        class="bg-[#4ade80] text-[#4ade80]"
        @click="changeColorIt('#4ade80')"
      ></div>
      <div
        class="bg-[#f0f9ff] text-[#f0f9ff]"
        @click="changeColorIt('#f0f9ff')"
      ></div>
      <div
        class="bg-[#000000] text-[#000000]"
        @click="changeColorIt('#f87171')"
      ></div>
      <div
        class="bg-[#facc15] text-[#facc15]"
        @click="changeColorIt('#facc15')"
      ></div>
      <div
        class="bg-[#0284c7] text-[#0284c7]"
        @click="changeColorIt('#0284c7')"
      ></div>
      <div
        class="bg-[#4ade80] text-[#4ade80]"
        @click="changeColorIt('#4ade80')"
      ></div>
      <div
        class="bg-[#f0f9ff] text-[#f0f9ff]"
        @click="changeColorIt('#f0f9ff')"
      ></div>
      <div
        class="bg-[#f87171] text-[#f87171]"
        @click="changeColorIt('#f87171')"
      ></div>
      <div
        class="bg-[#facc15] text-[#facc15]"
        @click="changeColorIt('#facc15')"
      ></div>
      <div
        class="bg-[#0284c7] text-[#0284c7]"
        @click="changeColorIt('#0284c7')"
      ></div>
      <div
        class="bg-[#4ade80] text-[#4ade80]"
        @click="changeColorIt('#4ade80')"
      ></div>
      <div
        class="bg-[#f0f9ff] text-[#f0f9ff]"
        @click="changeColorIt('#f0f9ff')"
      ></div>
      <div
        class="bg-[#f87171] text-[#f87171]"
        @click="changeColorIt('#f87171')"
      ></div>
      <div
        class="bg-[#facc15] text-[#facc15]"
        @click="changeColorIt('#facc15')"
      ></div>
      <div
        class="bg-[#0284c7] text-[#0284c7]"
        @click="changeColorIt('#0284c7')"
      ></div>
      <div
        class="bg-[#4ade80] text-[#4ade80]"
        @click="changeColorIt('#4ade80')"
      ></div>
      <div
        class="bg-[#f0f9ff] text-[#f0f9ff]"
        @click="changeColorIt('#f0f9ff')"
      ></div>
      <div
        class="bg-[#f87171] text-[#f87171]"
        @click="changeColorIt('#f87171')"
      ></div>
      <div
        class="bg-[#facc15] text-[#facc15]"
        @click="changeColorIt('#facc15')"
      ></div>
      <div
        class="bg-[#0284c7] text-[#0284c7]"
        @click="changeColorIt('#0284c7')"
      ></div>
      <div
        class="bg-[#4ade80] text-[#4ade80]"
        @click="changeColorIt('#4ade80')"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  handler: {
    type: Function,
    required: true,
  },
});
const changeColorIt = (color: any) => {
  props.handler(color);
};
</script>
<style lang="scss">
.colorSelect {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  padding: 5px;
  gap: 10px;
  border-radius: 2px;
  background-color: var(--tw-ring-offset-color);
  border-width: 1px;
  box-shadow: var(--jjext-color-shadow);
  .perview {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    div {
      width: 20px;
      height: 20px;
      border-radius: 2px;
    }
  }
}
</style>
