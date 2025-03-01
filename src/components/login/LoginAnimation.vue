<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
// 控制动画显示的状态
const isVisible = ref(false);
// 监听点击事件，触发动画
const handleClick = () => {
  if (!isVisible.value) {
    isVisible.value = true;
  }
};
onMounted(() => {
  document.addEventListener("click", handleClick);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClick);
});
</script>

<template>
  <div>
    <div class="box" :class="{ clickLoginTitle: isVisible }">
      <div class="chars">未</div>
      <div class="chars">来</div>
      <div class="chars">软</div>
      <div class="chars">件</div>
      <div class="chars">工</div>
      <div class="chars">作</div>
      <div class="chars">室</div>
      <div class="ll a"></div>
      <div class="ll n"></div>
      <div class="ll i"></div>
      <div class="ll p"></div>
      <div class="ll l"></div>
      <div class="ll e"></div>
      <div class="ll x"></div>
      <div class="pcov"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  position: absolute;
  left: 0;
  top: 0;
  // background-color: #fff;
  /* 100%窗口宽度和高度 */
  width: 100vw;
  height: calc(100vh - 110px);
  /* 弹性布局 水平、垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 横向排列 */
  flex-direction: row;
  /* 将平面图形转换为具有透视的3D图形 */
  perspective: 300;
  -webkit-perspective: 300;
  overflow: hidden;
  animation: show4 1.4s linear forwards;
  animation-delay: 1s;

  /* 动画字符所在的块 */
  .chars {
    color: #000;
    /* 相对定位 */
    position: relative;
    width: 3.75rem;
    height: 3.75rem;
    text-align: center;
    line-height: 3.75rem;
    font-size: 3.375rem;
    font-weight: 900;
    /* 斜体 */
    font-style: italic;
    margin: 0 0.6rem;
    opacity: 0;
  }

  /* 为每个字符添加动画 */
  div:nth-child(1) {
    animation: show12 1.2s linear forwards;
    animation-iteration-count: 2;
    animation-delay: 0.2s;
  }

  div:nth-child(2) {
    animation: show12 1.2s linear forwards;
    animation-iteration-count: 2;
    animation-delay: 0.4s;
  }

  div:nth-child(3) {
    animation: show3 1s linear 1 forwards;
    animation-delay: 0.7s;
  }

  div:nth-child(4) {
    animation: show3 1s linear 1 forwards;
    animation-delay: 0.9s;
  }

  div:nth-child(5) {
    animation: show3 1s linear 1 forwards;
    animation-delay: 1.1s;
  }

  div:nth-child(6) {
    animation: show3 1.2s linear 1 forwards;
    animation-delay: 1.3s;
  }

  div:nth-child(7) {
    animation: show3 1.2s linear 1 forwards;
    animation-delay: 1.6s;
  }

  /* 字符外的方框 */
  .ll {
    /* 绝对定位 */
    position: absolute;
    margin-left: -30rem;
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 0.18rem;
    opacity: 0;
  }

  .x {
    border: 0.25rem solid #f5b5fc;
    /* 执行动画：动画名称 时长 线性的 停留在最后一帧 */
    animation: xmove 2s linear forwards;
  }

  .e {
    border: 0.25rem solid #96f7d2;
    animation: emove 2s linear forwards;
    /* 设置动画延迟 */
    animation-delay: 0.1s;
  }

  .l {
    border: 0.25rem solid #f0f696;
    animation: lmove 2s linear forwards;
    animation-delay: 0.2s;
  }

  .p {
    border: 0.25rem solid #fcb1b1;
    animation: pmove 2s linear forwards;
    animation-delay: 0.3s;
  }

  .i {
    border: 0.25rem solid #f0f696;
    animation: imove 2s linear forwards;
    animation-delay: 0.4s;
  }

  .n {
    border: 0.25rem solid #96f7d2;
    animation: nmove 2s linear forwards;
    animation-delay: 0.5s;
  }

  .a {
    border: 0.25rem solid #f5b5fc;
    animation: amove 2s linear forwards;
    animation-delay: 0.6s;
  }

  /* 正中间的一条线 */
  .pcov {
    position: absolute;
    width: 0.25rem;
    height: 3.75rem;
    background-color: #fcb1b1;
    opacity: 0;
    animation: showp forwards;
    animation-delay: 2.3s;
  }
}

.clickLoginTitle {
  animation: none;
  animation-play-state: paused;
  opacity: 1;
  height: 9.375rem;

  .x {
    animation: none;
    opacity: 1;
    transform: translate(30.25rem) rotateY(0deg) scale(1, 1);
  }

  .e {
    animation: none;
    opacity: 1;
    transform: translate(25.125rem) rotateY(103deg) scale(1.2, 1.2);
  }

  .l {
    animation: none;
    opacity: 1;
    transform: translate(20rem) rotateY(103deg) scale(1.3, 1.3);
  }

  .p {
    animation: none;
    opacity: 1;
    transform: translate(15rem) rotateY(90deg) scale(1.6, 1.6);
  }

  .i {
    animation: none;
    opacity: 1;
    transform: translate(10.25rem) rotateY(77deg) scale(1.3, 1.3);
  }

  .n {
    animation: none;
    opacity: 1;
    z-index: -99;
    transform: translate(5rem) rotateY(77deg) scale(1.2, 1.2);
  }

  .a {
    animation: none;
    opacity: 1;
    transform: rotateY(360deg);
  }

  /* 正中间的一条线 */
  .pcov {
    animation: none;
    transform: scale(1, 2);
    opacity: 1;
  }

  /* 为每个字符添加动画 */
  div:nth-child(1),
  div:nth-child(2) {
    animation: none;
    opacity: 1;
    // transform: rotateY(360deg);
  }

  div:nth-child(3),
  div:nth-child(4),
  div:nth-child(5),
  div:nth-child(6),
  div:nth-child(7) {
    animation: none;
    opacity: 1;
    // transform: rotateY(360deg);
  }
}

/* 定义动画 */
/* 显示正中间的那条线 */
@keyframes showp {
  from {
    opacity: 0;
  }

  to {
    transform: scale(1, 2);
    opacity: 1;
  }
}

/* A字符外方框的动画 */
@keyframes amove {
  0% {
    opacity: 1;
    transform: rotateY(0deg);
  }

  50% {
    transform: rotateY(180deg);
  }

  100% {
    opacity: 1;
    transform: rotateY(360deg);
  }
}

/* N字符外方框的动画 */
@keyframes nmove {
  30% {
    opacity: 1;
    transform: translate(1.875rem) rotateY(135deg) scale(1.1, 1.1);
  }

  60% {
    transform: translate(3.125rem) rotateY(45deg) scale(1.1, 1.1);
  }

  85% {
    transform: translate(5rem) rotateY(103deg) scale(1.2, 1.2);
  }

  100% {
    opacity: 1;
    z-index: -99;
    transform: translate(5rem) rotateY(77deg) scale(1.2, 1.2);
  }
}

/* I字符外方框的动画 */
@keyframes imove {
  30% {
    opacity: 1;
    transform: translate(3.75rem) rotateY(135deg) scale(1.2, 1.2);
  }

  60% {
    transform: translate(7.5rem) rotateY(45deg) scale(1.3, 1.3);
  }

  85% {
    transform: translate(10rem) rotateY(103deg) scale(1.3, 1.3);
  }

  100% {
    opacity: 1;
    transform: translate(10.25rem) rotateY(77deg) scale(1.3, 1.3);
  }
}

/* P字符外方框的动画 */
@keyframes pmove {
  30% {
    opacity: 1;
    transform: translate(3.75rem) rotateY(135deg) scale(1.2, 1.2);
  }

  60% {
    transform: translate(7.5rem) rotateY(45deg) scale(1.4, 1.4);
  }

  85% {
    transform: translate(15rem) rotateY(135deg) scale(1.6, 1.6);
  }

  100% {
    opacity: 1;
    transform: translate(15rem) rotateY(90deg) scale(1.6, 1.6);
  }
}

/* L字符外方框的动画 */
@keyframes lmove {
  33% {
    opacity: 1;
    transform: translate(5rem) rotateY(135deg) scale(1.2, 1.2);
  }

  66% {
    transform: translate(15rem) rotateY(45deg) scale(1.6, 1.6);
  }

  95% {
    transform: translate(20rem) rotateY(100deg) scale(1.4, 1.4);
  }

  100% {
    opacity: 1;
    transform: translate(20rem) rotateY(103deg) scale(1.3, 1.3);
  }
}

/* E字符外方框的动画 */
@keyframes emove {
  33% {
    opacity: 1;
    transform: translate(5rem) rotateY(135deg) scale(1.2, 1.2);
  }

  66% {
    transform: translate(15rem) rotateY(45deg) scale(1.6, 1.6);
  }

  95% {
    transform: translate(24.375rem) rotateY(135deg) scale(1.2, 1.2);
  }

  100% {
    opacity: 1;
    transform: translate(25.125rem) rotateY(103deg) scale(1.2, 1.2);
  }
}

/* X字符外方框的动画 */
@keyframes xmove {
  25% {
    opacity: 1;
    transform: translate(6.25rem) rotateY(135deg) scale(1.2, 1.2);
  }

  50% {
    transform: translate(16.25rem) rotateY(45deg) scale(1.6, 1.6);
  }

  85% {
    transform: translate(25rem) rotateY(135deg) scale(1.2, 1.2);
  }

  100% {
    opacity: 1;
    transform: translate(30.25rem) rotateY(0deg) scale(1, 1);
  }
}

/* 前两个字符的动画 */
@keyframes show12 {
  0% {
    opacity: 1;
    transform: rotateY(0deg);
  }

  100% {
    opacity: 1;
    transform: rotateY(360deg);
  }
}

/* 第3个及之后的字符的动画 */
@keyframes show3 {
  0% {
    opacity: 1;
    transform: rotateY(90deg);
  }

  100% {
    opacity: 1;
    transform: rotateY(360deg);
  }
}

@keyframes show4 {
  0% {
    opacity: 1;
    height: calc(100vh - 6.875rem);
  }

  100% {
    opacity: 1;
    height: 9.375rem;
  }
}

// @media screen and (max-width: 1400px) {
//   .box {
//     transform: scale(0.91);
//     top: -7px;
//   }
// }

// @media screen and (max-width: 1200px) {
//   .box {
//     transform: scale(0.8);
//     top: -15px;
//   }
// }

// @media screen and (max-width: 900px) {
//   .box {
//     transform: scale(0.75);
//     top: 0px;
//     overflow: visible;
//   }
// }

// @media screen and (max-width: 400px) {
//   .box {
//     transform: scale(0.65);
//     top: 0px;
//     overflow: visible;
//   }
// }
</style>
