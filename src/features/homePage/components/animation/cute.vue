<template>
  <div class="content" @mouseenter="stopAnimation" @mouseleave="startAnimation">
    <div class="moving-container">
      <RouterLink to="/application">
        <img
          ref="movingImg"
          src="../../../../assets/img/homePage/Animation1.gif"
          alt="图片"
          class="moving-image"
        />
      </RouterLink>
      <div v-show="isEnterShow" class="text">
        <img src="../../../../assets/img/homePage/enter.webp" alt="报名" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const movingImg = ref<HTMLImageElement | null>(null);
const animationFrame = ref<number | null>(null);
const direction = ref<number>(1);
const position = ref<number>(0);
const speed = 0.6;
const isEnterShow = ref<boolean>(true);
const showTimer = ref<NodeJS.Timeout | null>(null);
const showDuration = 2000;
const hideDuration = 2000;

// --------------性能优化------------
// 缓存窗口宽度和图片宽度
const windowWidth = ref(window.innerWidth);
const imgWidth = ref(0);

// 计算动画的边界值（避免每次都读取 DOM)
const maxPosition = computed(() => windowWidth.value - imgWidth.value);
const animate = () => {
  if (!movingImg.value) return;

  position.value += speed * direction.value;

  // const windowWidth = window.innerWidth;
  // const imgWidth = movingImg.value.clientWidth;

  if (position.value <= 0) {
    position.value = 0;
    direction.value = 1;
  } else if (position.value >= maxPosition.value) {
    position.value = maxPosition.value;
    direction.value = -1;
  }

  const container = movingImg.value.parentElement?.parentElement;
  if (container) {
    container.style.transform = `translateX(${position.value}px)`;
  }

  animationFrame.value = requestAnimationFrame(animate);
};
// 窗口 resize 时，更新缓存的 windowWidth
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  // 重置动画状态（可选，根据需求决定是否重新计算位置）
  stopAnimation();
  startAnimation();
};
const toggleEnterShow = () => {
  isEnterShow.value = !isEnterShow.value;
  clearTimeout(showTimer.value!);
  showTimer.value = setTimeout(
    toggleEnterShow,
    isEnterShow.value ? showDuration : hideDuration,
  );
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
  if (movingImg.value) {
    // movingImg.value.onload = startAnimation;
    // 图片加载完成后，缓存 imgWidth
    movingImg.value.onload = () => {
      imgWidth.value = movingImg.value!.clientWidth;
      startAnimation();
    };
  }
  showTimer.value = setTimeout(toggleEnterShow, showDuration);
  // window.addEventListener("resize", () => {
  //   stopAnimation();
  //   startAnimation();
  // });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // stopAnimation();
  // if (showTimer.value) clearTimeout(showTimer.value);
  // window.removeEventListener("resize", startAnimation);
  window.removeEventListener("resize", handleResize);
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
  pointer-events: none;

  .moving-container {
    position: absolute;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }

  .moving-image {
    position: relative;
    height: 100px;
    width: 100px;
    user-select: none;
    pointer-events: auto;
    will-change: transform;
  }

  .text {
    position: absolute;
    top: -30px;
    right: -30px;
    pointer-events: auto;
    z-index: 1001;
    transition: opacity 0.3s ease;

    img {
      width: 100px;
      height: 50px;
      object-fit: cover;
      user-select: none;
    }
  }
}
</style>
