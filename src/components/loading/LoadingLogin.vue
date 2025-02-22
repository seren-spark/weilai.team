<template>
  <transition name="loading" tag="div">
    <div class="loading-center" v-if="isShow">
      <div class="wavy">
        <!-- --i是自定义属性，可通过var函数调用 -->
        <span style="--i: 1">l</span>
        <span style="--i: 2">o</span>
        <span style="--i: 3">a</span>
        <span style="--i: 4">d</span>
        <span style="--i: 5">i</span>
        <span style="--i: 6">n</span>
        <span style="--i: 7">g</span>
        <span style="--i: 8">.</span>
        <span style="--i: 9">.</span>
        <span style="--i: 10">.</span>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, onMounted } from "vue";

let isShow = ref(true);
onMounted(() => {
  isShow.value = false;
  console.log("挂载完成");
});
</script>

<style lang="css" scoped>
.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
}

.wavy {
  /* 相对定位 */
  position: relative;
  /* 倒影效果 */
  -webkit-box-reflect: below -12px
    linear-gradient(transparent, rgba(0, 0, 0, 0.2));
}

.wavy span {
  position: relative;
  display: inline-block;
  color: #fff;
  font-size: 70px;
  text-transform: uppercase;
  letter-spacing: 8px;
  /* 执行动画：动画名 时长 加速后减速 无限次播放 */
  animation: wavyAnimate 1s ease-in-out infinite;
  /* 通过var函数调用自定义属性--i，在计算出动画延迟时间 */
  animation-delay: calc(0.1s * var(--i));
}

/* 进入的起点 离开的终点 */
.loading-leave-to {
  transform: translateY(-100%);
}

/* 进入的终点 离开的起点*/
.loading-leave {
  transform: translateY(0);
}

.loading-leave-active {
  transition: 0.5s linear;
}

/* 定义动画 */
@keyframes wavyAnimate {
  0% {
    transform: translateY(0);
  }

  20% {
    transform: translateY(-20px);
  }

  40%,
  100% {
    transform: translateY(0);
  }
}

@media screen and (max-width: 1000px) {
  .wavy span {
    font-size: 25px;
  }
}
</style>
