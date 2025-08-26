<!-- PlaneAnimation.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

// 飞机状态
const plane = ref<HTMLDivElement | null>(null);
const deg = ref(0);
const ex = ref(0);
const ey = ref(0);
const vx = ref(0);
const vy = ref(0);
const count = ref(0);
let animationFrameId: number | null = null;

// 计算飞机样式
const planeStyle = computed(() => ({
  transform: `rotate(${deg.value}deg)`,
  left: `${vx.value}px`,
  top: `${vy.value}px`,
}));

// 鼠标移动事件处理
const handleMouseMove = (e: MouseEvent) => {
  if (!plane.value) return;

  const rect = plane.value.getBoundingClientRect();
  ex.value = e.clientX - rect.left - rect.width / 2;
  ey.value = e.clientY - rect.top - rect.height / 2;

  // 计算飞机旋转角度
  deg.value = (360 * Math.atan(ey.value / ex.value)) / (2 * Math.PI) + 45;
  if (ex.value < 0) {
    deg.value += 180;
  }

  count.value = 0;
};

// 动画循环
const animate = () => {
  if (!plane.value) return;

  if (count.value < 100) {
    vx.value += ex.value / 100;
    vy.value += ey.value / 100;
  }

  count.value++;
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  plane.value = document.getElementById("plane") as HTMLDivElement;

  // 绑定鼠标移动事件
  window.addEventListener("mousemove", handleMouseMove);

  // 启动动画循环
  animate();
});

onUnmounted(() => {
  // 移除事件监听器和取消动画帧
  window.removeEventListener("mousemove", handleMouseMove);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <div id="plane" :style="planeStyle">
    <Icon icon="fa-solid:paper-plane" aria-hidden="true"></Icon>
  </div>
</template>

<style scoped>
#plane {
  color: #79abfe;
  font-size: 2.5rem;
  /* 绝对定位 */
  position: absolute;
  /* 弹性布局 水平+垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
