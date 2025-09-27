<template>
  <chat v-if="chatOpen" @closeChat="openChild(false)" />
  <a href="javascript:void(0)" @click="openChild(true)">
    <div :class="`rocket  ${isShow ? '' : 'topactive'}`">
      <img src="@/assets/img/ai.webp" alt="" />
    </div>
  </a>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

import chat from "@/components/ai/index.vue";
import { onMounted, ref, watch } from "vue";
gsap.registerPlugin(Draggable);
const setupDraggable = () => {
  const bodyElement = document.body;
  Draggable.create(".rocket", {
    bounds: bodyElement,
    inertia: true,
    allowContextMenu: true,
    onClick: function () {},

    onDragEnd: function (self) {
      let box = self.target.parentNode;
      const element = self.target;
      const rect = element.getBoundingClientRect();
      let x = self.x;
      if (self.x < window.innerWidth / 2) {
        x = -window.innerWidth + rect.width + 20;
      } else {
        x = 0;
      }
      gsap.to(box, {
        x: x,
        duration: 1, // 吸附动画的时长
      });
    },
  });
};
//图标
const isShow = ref(true);

const chatOpen = ref(false);
const openChild = (open: boolean) => {
  //子组件打开 open应该为false
  chatOpen.value = open;
  isShow.value = !open;
};
watch(
  () => isShow,
  () => {
    console.log(isShow.value);
  },
);
// 监听窗口缩放
window.addEventListener("resize", () => {
  setupDraggable();
});
onMounted(() => {
  setupDraggable();
});
</script>

<style scoped lang="scss">
.rocket {
  cursor: pointer;
  position: fixed;
  z-index: 9999999;
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0.2rem;
  bottom: 0.9rem;
  .back-to-top-icon {
    overflow: hidden;
    width: 80%;
    height: 95%;
    border-radius: 50%;
    fill: currentcolor;
    color: rgb(40, 77, 213);
  }
}
.topactive {
  display: none;
}
.move-left {
  transform: translate3d(0px, -221.681px, 0px) !important;
}

@media screen and (max-width: 768px) {
  a {
    display: none;
  }
}
</style>
