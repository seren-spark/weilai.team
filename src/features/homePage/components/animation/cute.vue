<template>
  <div class="content" @mouseenter="stopAnimation" @mouseleave="startAnimation">
    <RouterLink to="/application">
      <img
        ref="movingImg"
        src="../../../../assets/img/homePage/Animation1.gif"
        alt="图片"
        class="moving-image"
      />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const movingImg = ref<HTMLImageElement | null>(null);
const animationFrame = ref<number | null>(null);
const direction = ref<number>(1); // 1:向右, -1:向左
const position = ref<number>(0);
const speed = 0.6; // 移动速度(像素/帧)

const animate = () => {
  if (!movingImg.value) return;

  // 更新位置
  position.value += speed * direction.value;

  // 获取窗口和图片尺寸
  const windowWidth = window.innerWidth;
  const imgWidth = movingImg.value.clientWidth;

  // 边界检测
  if (position.value <= 0) {
    position.value = 0;
    direction.value = 1; // 向右转
  } else if (position.value >= windowWidth - imgWidth) {
    position.value = windowWidth - imgWidth;
    direction.value = -1; // 向左转
  }

  // 应用新位置
  movingImg.value.style.transform = `translateX(${position.value}px)`;

  // 继续动画
  animationFrame.value = requestAnimationFrame(animate);
};

const startAnimation = () => {
  if (animationFrame.value === null) {
    animationFrame.value = requestAnimationFrame(animate);
  }
};

const stopAnimation = () => {
  if (animationFrame.value !== null) {
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = null;
  }
};

onMounted(() => {
  // 等待图片加载完成后再开始动画
  if (movingImg.value) {
    movingImg.value.onload = startAnimation;
  }
});

onUnmounted(() => {
  stopAnimation();
  window.removeEventListener("resize", startAnimation);
});
</script>

<style scoped lang="scss">
.content {
  position: fixed;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
  pointer-events: none; /* 允许鼠标穿透到下方元素 */

  .moving-image {
    position: absolute;
    bottom: 0px; /* 距离底部间距 */
    left: 0;
    height: 100px; /* 根据你的图片调整高度 */
    width: 100px;
    user-select: none; /* 防止拖动 */
    pointer-events: auto; /* 恢复图片本身的鼠标事件 */
    will-change: transform; /* 优化动画性能 */
  }
}
</style>
