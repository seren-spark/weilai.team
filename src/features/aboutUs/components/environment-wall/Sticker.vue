<template>
  <div class="sticker-wall">
    <!-- 贴纸容器包装器 - 提供滚动区域 -->
    <div class="sticker-container-wrapper">
      <!-- 贴纸容器 -->
      <div ref="stickerContainer" class="sticker-container">
        <!-- 循环渲染贴纸 -->
        <div
          v-for="(sticker, index) in stickers"
          :key="sticker.id"
          class="sticker"
          :class="`shape-${sticker.shape}`"
          :style="{
            width: `${sticker.size.width}px`,
            height: `${sticker.size.height}px`,
            left: `${sticker.position.x}px`,
            top: `${sticker.position.y}px`,
            transform: `rotate(${sticker.rotation}deg)`,
            borderRadius:
              sticker.shape === 'rounded'
                ? '8px'
                : sticker.shape === 'circle'
                  ? '50%'
                  : '2px',
            zIndex: sticker.zIndex,
            boxShadow: `0 ${sticker.shadow.size}px ${sticker.shadow.blur}px rgba(0,0,0,${sticker.shadow.opacity})`,
            '--rotation': `${sticker.rotation}deg`,
          }"
          @mouseenter="bringToFront(index)"
          @mouseleave="restoreZIndex(index)"
          @click="openPreview(sticker.imageUrl)"
        >
          <img
            :src="sticker.imageUrl"
            :alt="`Sticker ${sticker.id}`"
            class="sticker-image"
          />
        </div>
      </div>
    </div>

    <!-- 下一组按钮 - 仅在非移动端显示 -->
    <button
      class="next-btn"
      aria-label="查看下一组贴纸"
      @click="showNextGroup"
      v-if="!isMobile"
    >
      <Icon
        icon="mingcute:refresh-2-fill"
        width="24"
        height="24"
        style="color: white"
      />
    </button>

    <!-- 图片预览模态框 -->
    <div v-if="previewImageUrl" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <button class="close-btn" aria-label="关闭预览" @click="closePreview">
          <Icon icon="mingcute:close-fill" width="24" height="24" />
        </button>
        <img
          :src="previewImageUrl"
          alt="图片预览"
          class="preview-image"
          @load="imageLoaded"
          @error="imageLoadError"
        />
        <div v-if="isLoading" class="loading-spinner">
          <Icon icon="svg-spinners:three-dots" width="48" height="48" />
        </div>
        <div v-if="loadError" class="error-message">
          <p>图片加载失败</p>
          <button @click="retryLoad">重试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, onUnmounted } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

// 贴纸形状类型
interface Sticker {
  id: number;
  size: { width: number; height: number };
  position: { x: number; y: number };
  rotation: number;
  shape:
    | "square"
    | "rounded"
    | "circle"
    | "rectangle"
    | "triangle"
    | "pentagon"
    | "hexagon"
    | "diamond"
    | "star";
  imageUrl: string;
  zIndex: number;
  originalZIndex: number;
  shadow: { size: number; blur: number; opacity: number };
}

const props = defineProps({
  baseCount: {
    type: Number,
    default: 17,
  },
  minSize: { type: Number, default: 140 },
  maxSize: { type: Number, default: 200 },
  maxRotation: { type: Number, default: 15 },
  minSpacing: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 150 },
  // 长方形宽高比范围配置
  minRectRatio: { type: Number, default: 1.2 },
  maxRectRatio: { type: Number, default: 2.0 },
  // 容器高度 - 可通过外部设置
  containerHeight: { type: Number, default: 900 },
  // 容器缩放倍数（相对于视口）
  containerScale: { type: Number, default: 2.5 },
});

import image1 from "@/assets/img/prize/image1.jpg";
import image2 from "@/assets/img/prize/image2.jpg";
import image3 from "@/assets/img/prize/image3.jpg";
import image4 from "@/assets/img/prize/image4.jpg";
import image5 from "@/assets/img/prize/image5.jpg";
import image6 from "@/assets/img/prize/image6.jpg";
import image7 from "@/assets/img/prize/image7.jpg";
import image8 from "@/assets/img/prize/image8.png";
import image9 from "@/assets/img/prize/image9.png";
import image10 from "@/assets/img/prize/image10.png";
import image11 from "@/assets/img/prize/image11.jpg";
import image12 from "@/assets/img/prize/image12.jpg";
import image13 from "@/assets/img/prize/image13.jpg";
import image14 from "@/assets/img/prize/image14.jpg";
import image15 from "@/assets/img/prize/image15.png";
import image16 from "@/assets/img/prize/image16.jpg";
import image17 from "@/assets/img/prize/image17.jpg";
import image18 from "@/assets/img/prize/image18.jpg";
import image19 from "@/assets/img/prize/image19.png";
import image20 from "@/assets/img/prize/image20.jpg";
import image21 from "@/assets/img/prize/image21.jpg";
import image22 from "@/assets/img/prize/image22.jpg";
import image23 from "@/assets/img/prize/image23.jpg";
import image24 from "@/assets/img/prize/image24.jpg";
import image25 from "@/assets/img/prize/image25.jpg";
import image26 from "@/assets/img/prize/image26.jpg";
import image27 from "@/assets/img/prize/image27.jpg";
import image28 from "@/assets/img/prize/image28.jpg";
import image29 from "@/assets/img/prize/image29.jpg";
import image30 from "@/assets/img/prize/image30.jpg";
import image31 from "@/assets/img/prize/image31.jpg";
import image32 from "@/assets/img/prize/image32.jpg";

// 图片链接列表
const CUSTOM_IMAGE_LIST = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
  image16,
  image17,
  image18,
  image19,
  image20,
  image21,
  image22,
  image23,
  image24,
  image25,
  image26,
  image27,
  image28,
  image29,
  image30,
  image31,
  image32,
];

// 状态管理
const stickers = ref<Sticker[]>([]);
const stickerContainer = ref<HTMLDivElement | null>(null);
const currentStartIndex = ref(0);
const isMobile = ref(false);
let nextId = 1;
let containerRect: DOMRect;
let currentTargetCount = props.baseCount;

// 图片预览相关状态
const previewImageUrl = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const loadError = ref<boolean>(false);

// 判断是否为移动设备
const checkIsMobile = () => {
  return window.innerWidth < 768;
};

// 生成整数随机数
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成浮点数随机数
const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// 根据设备类型调整展示数量
const adjustCountByDevice = () => {
  if (!window) return props.baseCount;

  // 移动端展示所有图片
  if (isMobile.value) {
    return CUSTOM_IMAGE_LIST.length;
  }

  // 桌面端根据视口大小调整
  const width = window.innerWidth;
  if (width < 1024) {
    return Math.max(6, Math.floor(props.baseCount * 0.8));
  } else {
    return props.baseCount;
  }
};

// 获取当前组图片
const getCurrentGroupImages = (): string[] => {
  // 移动端返回所有图片
  if (isMobile.value) {
    return [...CUSTOM_IMAGE_LIST];
  }

  // 桌面端按组返回
  const count = currentTargetCount;
  const result: string[] = [];
  let remaining = count;
  let currentIndex = currentStartIndex.value;

  while (remaining > 0) {
    if (currentIndex >= CUSTOM_IMAGE_LIST.length) {
      currentIndex = 0;
    }

    result.push(CUSTOM_IMAGE_LIST[currentIndex]);
    currentIndex++;
    remaining--;
  }

  currentStartIndex.value = currentIndex % CUSTOM_IMAGE_LIST.length;
  return result;
};

// 检查贴纸是否重叠或距离过近
const isTooClose = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number },
  minDistance: number,
): boolean => {
  const expandedRect1 = {
    x: rect1.x - minDistance,
    y: rect1.y - minDistance,
    width: rect1.width + minDistance * 2,
    height: rect1.height + minDistance * 2,
  };
  const expandedRect2 = {
    x: rect2.x - minDistance,
    y: rect2.y - minDistance,
    width: rect2.width + minDistance * 2,
    height: rect2.height + minDistance * 2,
  };
  return (
    expandedRect1.x < expandedRect2.x + expandedRect2.width &&
    expandedRect1.x + expandedRect1.width > expandedRect2.x &&
    expandedRect1.y < expandedRect2.y + expandedRect2.height &&
    expandedRect1.y + expandedRect1.height > expandedRect2.y
  );
};

// 生成贴纸尺寸 - 为不同形状调整尺寸比例
const generateStickerSize = (
  shape: Sticker["shape"],
): { width: number; height: number } => {
  // 基础尺寸 - 移动端使用较小尺寸
  const baseSize = isMobile.value
    ? getRandomNumber(80, 140)
    : getRandomNumber(props.minSize, props.maxSize);

  // 不同形状有不同的宽高比例
  switch (shape) {
    case "square":
    case "circle":
    case "rounded":
      return { width: baseSize, height: baseSize };

    case "rectangle":
      const rectRatio = getRandomFloat(props.minRectRatio, props.maxRectRatio);
      const isWidthLonger = Math.random() > 0.5;
      if (isWidthLonger) {
        const width = getRandomNumber(
          Math.max(props.minSize, Math.ceil(props.minSize * rectRatio)),
          props.maxSize,
        );
        const height = Math.max(props.minSize, Math.floor(width / rectRatio));
        return { width, height };
      } else {
        const height = getRandomNumber(
          Math.max(props.minSize, Math.ceil(props.minSize * rectRatio)),
          props.maxSize,
        );
        const width = Math.max(props.minSize, Math.floor(height / rectRatio));
        return { width, height };
      }

    case "triangle":
      // 三角形高度约为宽度的0.866（等边三角形）
      return { width: baseSize, height: Math.floor(baseSize * 0.866) };

    case "pentagon":
    case "hexagon":
      // 多边形高度略小于宽度
      return { width: baseSize, height: Math.floor(baseSize * 0.9) };

    case "diamond":
      // 菱形高度略大于宽度
      return { width: baseSize, height: Math.floor(baseSize * 1.1) };

    case "star":
      // 星形高度与宽度大致相同
      return { width: baseSize, height: baseSize };

    default:
      return { width: baseSize, height: baseSize };
  }
};

// 生成单个不重叠贴纸
const generateNonOverlappingSticker = (
  existingStickers: Sticker[],
  imageUrl: string,
): Sticker | null => {
  if (!containerRect) return null;

  for (let attempt = 0; attempt < props.maxAttempts; attempt++) {
    // 先随机形状，再根据形状生成尺寸
    const shapes: Sticker["shape"][] = [
      "square",
      "rounded",
      "circle",
      "rectangle",
      "triangle",
      "pentagon",
      "hexagon",
      "diamond",
      "star",
    ];
    // 稍微增加一些常见形状的概率
    const shapeProbabilities = [
      0.15,
      0.15,
      0.15,
      0.15, // 基本形状
      0.1,
      0.1,
      0.1,
      0.08,
      0.07, // 特殊形状
    ];

    // 根据概率选择形状
    let shapeIndex = 0;
    let random = Math.random();
    while (random > 0) {
      random -= shapeProbabilities[shapeIndex];
      if (random <= 0 || shapeIndex >= shapes.length - 1) break;
      shapeIndex++;
    }
    const shape = shapes[shapeIndex];

    // 根据形状生成对应尺寸
    const { width, height } = generateStickerSize(shape);

    // 确保贴纸完全在容器内
    const maxX = containerRect.width - width;
    const maxY = containerRect.height - height;
    if (maxX <= 0 || maxY <= 0) continue;

    // 随机位置和旋转角度
    const x = getRandomNumber(0, maxX);
    const y = getRandomNumber(0, maxY);
    const rotation = getRandomFloat(-props.maxRotation, props.maxRotation);

    // 碰撞检测
    const newStickerRect = { x, y, width, height };
    const isOverlap = existingStickers.some((sticker) =>
      isTooClose(
        newStickerRect,
        {
          x: sticker.position.x,
          y: sticker.position.y,
          width: sticker.size.width,
          height: sticker.size.height,
        },
        props.minSpacing,
      ),
    );

    if (!isOverlap) {
      // 随机阴影
      const shadow = {
        size: getRandomNumber(2, 8),
        blur: getRandomNumber(5, 20),
        opacity: Math.random() * 0.3 + 0.1,
      };

      // 随机层级
      const zIndex = getRandomNumber(1, 10);

      return {
        id: nextId++,
        size: { width, height },
        position: { x, y },
        rotation,
        shape,
        imageUrl,
        zIndex,
        originalZIndex: zIndex,
        shadow,
      };
    }
  }

  console.warn("无法找到合适位置放置贴纸，可能空间不足");
  return null;
};

// 生成当前组的贴纸
const generateCurrentGroupStickers = () => {
  if (!stickerContainer.value) return [];

  const groupImages = getCurrentGroupImages();
  const newStickers: Sticker[] = [];
  let totalAttempts = 0;
  // 移动端增加最大尝试次数，因为要展示更多图片
  const maxTotalAttempts = isMobile.value
    ? groupImages.length * 8
    : currentTargetCount * 4;

  for (const imageUrl of groupImages) {
    if (
      newStickers.length >= groupImages.length ||
      totalAttempts >= maxTotalAttempts
    ) {
      break;
    }

    const sticker = generateNonOverlappingSticker(newStickers, imageUrl);
    if (sticker) {
      newStickers.push(sticker);
    }
    totalAttempts++;
  }

  return newStickers;
};

// 展示下一组贴纸 - 仅在桌面端有效
const showNextGroup = () => {
  if (isMobile.value) return;

  stickers.value.forEach((sticker) => {
    sticker.zIndex = -1;
  });

  setTimeout(() => {
    stickers.value = generateCurrentGroupStickers();
  }, 300);
};

// 鼠标悬停置顶
const bringToFront = (index: number) => {
  const maxZIndex = Math.max(...stickers.value.map((s) => s.zIndex));
  stickers.value[index].zIndex = maxZIndex + 1;
};

// 鼠标离开恢复层级
const restoreZIndex = (index: number) => {
  stickers.value[index].zIndex = stickers.value[index].originalZIndex;
};

// 图片预览相关方法
const openPreview = (imageUrl: string) => {
  previewImageUrl.value = imageUrl;
  isLoading.value = true;
  loadError.value = false;
  // 阻止页面滚动
  document.body.style.overflow = "hidden";
};

const closePreview = () => {
  previewImageUrl.value = null;
  // 恢复页面滚动
  document.body.style.overflow = "";
};

const imageLoaded = () => {
  isLoading.value = false;
  loadError.value = false;
};

const imageLoadError = () => {
  isLoading.value = false;
  loadError.value = true;
};

const retryLoad = () => {
  if (previewImageUrl.value) {
    const urlWithCacheBust = new URL(previewImageUrl.value);
    urlWithCacheBust.searchParams.set("cacheBust", Date.now().toString());
    previewImageUrl.value = urlWithCacheBust.toString();
    isLoading.value = true;
    loadError.value = false;
  }
};

// 调整容器大小以适应设备类型
const adjustContainerSize = () => {
  if (stickerContainer.value) {
    // 容器高度固定为props传入的值
    const containerHeight = props.containerHeight;

    if (isMobile.value) {
      // 移动端：宽度为视口的N倍，高度固定，允许全方向滚动
      const containerWidth = window.innerWidth * props.containerScale;
      stickerContainer.value.style.width = `${containerWidth}px`;
      stickerContainer.value.style.height = `${containerHeight}px`;
      stickerContainer.value.style.overflow = "visible";
    } else {
      // 桌面端：宽度100%，高度固定
      stickerContainer.value.style.width = "100%";
      stickerContainer.value.style.height = `${containerHeight}px`;
      stickerContainer.value.style.overflow = "hidden";
    }

    containerRect = stickerContainer.value.getBoundingClientRect();
  }
};

// 窗口 resize 时重新调整
const handleResize = () => {
  const wasMobile = isMobile.value;
  isMobile.value = checkIsMobile();

  // 如果设备类型发生变化
  if (stickerContainer.value && wasMobile !== isMobile.value) {
    adjustContainerSize();
    currentTargetCount = adjustCountByDevice();
    // 重置起始索引，确保移动端显示所有图片
    if (isMobile.value) {
      currentStartIndex.value = 0;
    } else {
      currentStartIndex.value = 0;
    }
    stickers.value = generateCurrentGroupStickers();
  }
};

// 初始化
onMounted(() => {
  isMobile.value = checkIsMobile();
  if (stickerContainer.value) {
    adjustContainerSize();
    currentTargetCount = adjustCountByDevice();
    stickers.value = generateCurrentGroupStickers();
  }
  window.addEventListener("resize", handleResize);
});

onUpdated(() => {
  if (stickerContainer.value) {
    containerRect = stickerContainer.value.getBoundingClientRect();
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
.sticker-wall {
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
}

// 容器包装器
.sticker-container-wrapper {
  width: 100%;
  overflow: hidden;
  height: v-bind('props.containerHeight + "px"');
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sticker-container {
  position: relative;
  background-image: url(../../../../assets/img/bgStudy.png);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.sticker {
  position: absolute;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  background-color: #fff;
  opacity: 1;

  // 淡出动画
  &[style*="z-index: -1"] {
    opacity: 0;
    transform: rotate(var(--rotation)) scale(0.8);
  }

  &:hover {
    transform: rotate(var(--rotation)) scale(1.03);
    z-index: 100 !important;
  }

  // 裁剪不同形状
  &.shape-triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  &.shape-pentagon {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }

  &.shape-hexagon {
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }

  &.shape-diamond {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &.shape-star {
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
  }
}

.sticker-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: all 0.3s ease;
  .shape-triangle &,
  .shape-pentagon &,
  .shape-hexagon &,
  .shape-diamond &,
  .shape-star & {
    transform: scale(1.2);
  }
}

.next-btn {
  position: absolute;
  bottom: 150px;
  right: 25px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    background-color: #359e75;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1);
  }

  i {
    font-size: 20px;
  }
}

// 图片预览样式
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  padding: 20px;
  box-sizing: border-box;
}

.preview-content {
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

.preview-image {
  width: 400px;
  height: auto;
  display: block;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: scale(0.95);
  animation: imageIn 0.3s ease 0.1s forwards;
  object-fit: cover;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(80, 79, 79, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;

  p {
    margin-bottom: 15px;
    font-size: 18px;
  }

  button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #359e75;
    }
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes imageIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .next-btn {
    width: 44px;
    height: 44px;

    i {
      font-size: 18px;
    }
  }

  .close-btn {
    top: -30px;
    right: 0;
    width: 30px;
    height: 30px;
  }

  .preview-image {
    max-width: 95%;
    width: auto;
    max-height: 70vh;
  }
}
</style>
