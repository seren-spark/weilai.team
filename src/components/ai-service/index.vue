<template>
  <chat v-if="chatOpen" @closeChat="openChild(false)" />
  <a href="javascript:void(0)" @click="openChild(true)">
    <div :class="`rocket  ${isShow ? '' : 'topactive'}`"  >
      <img src="@/assets/img/ai.png" alt="">
    </div>
  </a>
</template>

<script setup lang="ts">
import {gsap} from 'gsap'
import {Draggable} from 'gsap/Draggable'

import chat from "@/components/ai/index.vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
gsap.registerPlugin(Draggable);
const setupDraggable = () => {
  const bodyElement = document.body;
  Draggable.create(".rocket",{
    bounds: bodyElement,
    inertia: true,
    allowContextMenu:true,
    onClick: function () {
    console.log("clicked");
  },

  onDragEnd: function (self) {
    let box=self.target.parentNode
    const element=self.target
    const rect = element.getBoundingClientRect();
    console.log(rect.width);
    let x=self.x
    console.log("drag ended",self.x);
    console.log(window.innerWidth);
    if(self.x<window.innerWidth/2){
        x=-window.innerWidth+rect.width;
    }else {
        x=0;
    }
    gsap.to(box, {
        x: x,
        duration: 1 // 吸附动画的时长
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
function handlerScroll() {
  window.scrollY > 100 ? (isShow.value = true) : (isShow.value = false);
}
onMounted(() => {
  document.addEventListener("scroll", handlerScroll);
  setupDraggable();
});
onUnmounted(() => {
  document.removeEventListener("scroll", handlerScroll);
});
</script>

<style scoped lang="scss">
.chatOpen {
  height: calc(100% - 2rem);
  width: 350px;
  position: fixed;
  right: 0.1rem;
  z-index: 10000000;
  bottom: 1rem;
}

.rocket {
  cursor: pointer;
  position: fixed;
  z-index: 9999999;
//   background-color: white;
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
//   box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.15);
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
.move-left{
    transform: translate3d(0px, -221.681px, 0px) !important;
}
</style>
