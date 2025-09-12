<template>
  <div class="method">
    <div class="content">
      <div class="title">
        学习模式<span class="titles">开启高效学习之旅</span>
      </div>
      <div class="content-main" @click="handleContentMainClick">
        <!-- 模式切换控制器 -->
        <div class="mode-tabs">
          <button
            v-for="(mode, idx) in modes"
            :key="idx"
            :class="['mode-tab', { active: currentMode === idx }]"
            @click="switchMode(idx)"
          >
            {{ mode.name }}
          </button>
        </div>

        <!-- 老带新模式 -->
        <div v-if="currentMode === 0" ref="oldNewRef" class="mode-card old-new">
          <div class="mode-title">
            <span class="main-title">老带新</span>
            <span class="sub-title">知识传承 · 协作成长</span>
          </div>
          <div class="mode-desc">
            采用 “以老带新”
            的学习模式，经验丰富的成员指导新成员，加速知识传承与技能提升，促进团队协作与成长，提高整体效能。
          </div>
          <!-- 3D人物交互元素 -->
          <div class="character-group">
            <div
              class="character old"
              @mouseenter="hoverOld"
              @mouseleave="leaveOld"
            >
              <div class="avatar memuber1"></div>
              <div class="label">资深成员</div>
              <div class="connection-line"></div>
            </div>
            <div
              class="character new"
              @mouseenter="hoverNew"
              @mouseleave="leaveNew"
            >
              <div class="avatar memuber2"></div>
              <div class="label">新成员</div>
            </div>
          </div>
          <!-- 粒子特效背景 -->
          <div ref="oldNewParticles" class="particle-bg"></div>
        </div>

        <!-- 写博客模式 -->
        <div v-if="currentMode === 1" ref="blogRef" class="mode-card blog">
          <div class="mode-title">
            <span class="main-title">写博客</span>
            <span class="sub-title">知识共享 · 品牌塑造</span>
          </div>
          <div class="mode-desc">
            博客有助于共享知识，增强团队协作与沟通。它提高成员写作与思考能力，同时建立团队网络品牌，吸引关注，增加影响力。
          </div>
          <!-- 动态博客卡片流 -->
          <div class="blog-cards">
            <div
              v-for="(card, cIdx) in blogCards"
              :key="cIdx"
              class="blog-card"
              :style="getBlogCardStyle(card)"
              @click.stop="handleBlogCardClick(cIdx)"
            >
              <div
                class="card-header"
                :style="{
                  backgroundImage: `url('${blogImages[cIdx]}')`,
                }"
              ></div>
              <div class="card-content">
                <h3>技术分享{{ cIdx + 1 }}</h3>
                <p>
                  关于{{
                    [
                      "Service Worker的介绍和简单应用",
                      "Minio实现简单的分片上传",
                      "RabbitMQ保证消息的可靠性",
                    ][cIdx]
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 讲课模式 -->
        <div
          v-if="currentMode === 2"
          ref="lectureRef"
          class="mode-card lecture"
        >
          <div class="mode-title">
            <span class="main-title">讲课</span>
            <span class="sub-title">系统成长 · 凝聚力量</span>
          </div>
          <div class="mode-desc">
            制定学习计划，定期培训与分享，提升知识技能，增强团队凝聚力。
          </div>

          <!-- 3D堆叠卡片展示 -->
          <div
            class="lecture-3d-container"
            @mousemove="handleMouseMove"
            @touchmove="handleTouchMove"
            @mouseleave="resetRotation"
          >
            <!-- 3D舞台 -->
            <div
              class="lecture-stage"
              :style="{
                transform: `perspective(1200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                transition: isTransitioning
                  ? 'none'
                  : 'transform 0.1s ease-out',
              }"
            >
              <!-- 卡片堆叠 -->
              <div class="card-stack">
                <div
                  v-for="(slide, index) in lectureSlides"
                  :key="index"
                  class="lecture-card"
                  :style="getCardStyle(index)"
                  @click="handleCardClick(index)"
                >
                  <div class="card-inner">
                    <img :src="slide.url" :alt="slide.alt" class="card-image" />
                    <div class="card-overlay"></div>
                    <div class="card-caption">{{ slide.caption }}</div>

                    <!-- 卡片悬停效果元素 -->
                    <div class="card-hover-effect"></div>
                  </div>
                </div>
              </div>

              <!-- 装饰性光效 -->
              <div class="stage-light top-left"></div>
              <div class="stage-light top-right"></div>
              <div class="stage-light bottom-center"></div>
            </div>
            <div class="card-navigation">
              <div
                v-for="(slide, index) in lectureSlides"
                :key="index"
                class="nav-dot"
                :class="{ active: activeCardIndex === index }"
                :title="slide.caption"
                @click="handleNavClick(index)"
              ></div>
            </div>

            <!-- 控制按钮 -->
            <div class="lecture-controls">
              <button class="control-btn prev" @click="prevCard">
                <i class="fas fa-chevron-left"></i> 上一张
              </button>
              <button class="control-btn auto" @click="toggleAutoRotate">
                {{ autoRotate ? "暂停自动播放" : "开启自动播放" }}
              </button>
              <button class="control-btn next" @click="nextCard">
                下一张 <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 头脑风暴模式 -->
        <div
          v-if="currentMode === 3"
          ref="brainstormRef"
          class="mode-card brainstorm"
        >
          <div class="mode-title">
            <span class="main-title">头脑风暴</span>
            <span class="sub-title">灵感迸发 · 创意无限</span>
          </div>
          <div class="mode-desc">
            通过组织会议，成员们自由提出想法，不论其可行性，以促进灵感迸发。过程中避免批评，以达到最大化的创意产出。
          </div>
          <!-- 动态想法气泡 -->
          <div class="idea-bubbles">
            <div
              v-for="(bubble, bIdx) in ideaBubbles"
              :key="bIdx"
              class="idea-bubble"
              :style="getBubbleStyle(bubble)"
              @mouseover="() => updateBubbleScale(bIdx, 1.3)"
              @mouseout="() => updateBubbleScale(bIdx, 1)"
            >
              {{ bubble.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import * as THREE from "three";
import blog1Img from "../../../../assets/img/methods/blog1.png";
import blog2Img from "../../../../assets/img/methods/blog2.png";
import blog3Img from "../../../../assets/img/methods/blog3.png";
import course1 from "../../../../assets/img/methods/course1.png";
import course2 from "../../../../assets/img/methods/course2.png";
import course3 from "../../../../assets/img/methods/course3.jpg";

// 引入博客图片列表
const blogImages = [blog1Img, blog2Img, blog3Img];

// 模式数据
const modes = [
  { name: "老带新" },
  { name: "写博客" },
  { name: "讲课" },
  { name: "头脑风暴" },
];
const currentMode = ref(0);

// 老带新相关 refs 和方法
const oldNewRef = ref<HTMLDivElement | null>(null);
const oldNewParticles = ref<HTMLDivElement | null>(null);
let particleAnimation: number | null = null;
let particleCleanup: (() => void) | null = null;

const hoverOld = () => {
  const line = oldNewRef.value?.querySelector(
    ".connection-line",
  ) as HTMLDivElement;
  line.style.animation = "pulse 0.5s infinite alternate";
};

const leaveOld = () => {
  const line = oldNewRef.value?.querySelector(
    ".connection-line",
  ) as HTMLDivElement;
  line.style.animation = "none";
};

const hoverNew = () => {
  const newChar = oldNewRef.value?.querySelector(".new") as HTMLDivElement;
  newChar.style.animation = "bounce 0.3s";
};

const leaveNew = () => {
  const newChar = oldNewRef.value?.querySelector(".new") as HTMLDivElement;
  newChar.style.animation = "none";
};

// 写博客卡片数据
const blogCards = ref([
  {
    x: -200,
    y: 0,
    z: 0,
    rotateY: 0,
    opacity: 1,
    active: false,
    targetX: -200,
    targetY: 0,
    targetZ: 0,
    targetRotateY: 0,
    originalX: -200,
    originalY: 0,
    originalZ: 0,
    originalRotateY: 0,
  },
  {
    x: 0,
    y: 0,
    z: -50,
    rotateY: 15,
    opacity: 0.8,
    active: false,
    targetX: 0,
    targetY: 0,
    targetZ: -50,
    targetRotateY: 15,
    originalX: 0,
    originalY: 0,
    originalZ: -50,
    originalRotateY: 15,
  },
  {
    x: 200,
    y: 0,
    z: 0,
    rotateY: -15,
    opacity: 0.8,
    active: false,
    targetX: 200,
    targetY: 0,
    targetZ: 0,
    targetRotateY: -15,
    originalX: 200,
    originalY: 0,
    originalZ: 0,
    originalRotateY: -15,
  },
]);

// 博客卡片点击处理
const handleBlogCardClick = (index: number) => {
  // 如果点击的是已激活的卡片，则取消激活
  if (blogCards.value[index].active) {
    resetBlogCards();
    return;
  }
  // 先重置所有卡片状态
  resetBlogCards();
  blogCards.value[index].active = true;
};

// 重置所有博客卡片状态
const resetBlogCards = () => {
  blogCards.value.forEach((card) => {
    card.active = false;
  });
};

// 点击内容区域其他地方时重置博客卡片
const handleContentMainClick = () => {
  if (currentMode.value === 1) {
    resetBlogCards();
  }
};

const getBlogCardStyle = (card: any) => {
  if (card.active) {
    return {
      transform: `translate3d(0, -15px, 150px) rotateY(0deg)`,
      opacity: 1,
      zIndex: 10,
      transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    };
  }
  return {
    transform: `translate3d(${card.x}px, ${card.y}px, ${card.z}px) rotateY(${card.rotateY}deg)`,
    opacity: card.opacity,
    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };
};

let blogAnimationFrame: number | null = null;

// 博客卡片动画
const startBlogAnimation = () => {
  // 为每个卡片设置新的目标位置
  const setNewTargets = () => {
    blogCards.value.forEach((card) => {
      if (!card.active) {
        // 只有非激活状态的卡片才会有浮动动画
        card.targetX = card.originalX + (Math.random() - 0.5) * 20;
        card.targetY = card.originalY + (Math.random() - 0.5) * 10;
        card.targetZ = card.originalZ + (Math.random() - 0.5) * 15;
        card.targetRotateY = card.originalRotateY + (Math.random() - 0.5) * 5;
      }
    });
  };

  // 初始设置目标
  setNewTargets();

  // 动画循环
  const animate = () => {
    blogCards.value.forEach((card) => {
      if (!card.active) {
        // 缓慢接近目标位置
        const factor = 0.05;
        card.x += (card.targetX - card.x) * factor;
        card.y += (card.targetY - card.y) * factor;
        card.z += (card.targetZ - card.z) * factor;
        card.rotateY += (card.targetRotateY - card.rotateY) * factor;
      }
    });

    blogAnimationFrame = requestAnimationFrame(animate);
  };

  animate();

  // 定期更新目标位置
  setInterval(setNewTargets, 5000);
};

// 讲课相关 refs 和方法
const lectureRef = ref<HTMLDivElement | null>(null);
const activeCardIndex = ref(0);
const rotationX = ref(0);
const rotationY = ref(0);
const isTransitioning = ref(false);
let autoRotateInterval: number | null = null;
let autoRotate = ref(true);

// 讲课图片列表
const lectureSlides = ref([
  {
    url: course1,
    alt: "在会议室进行项目会议",
    caption: "团队项目会议",
  },
  {
    url: course2,
    alt: "在白板上讲解概念",
    caption: "白板概念讲解",
  },
  {
    url: course3,
    alt: "小组讨论式教学",
    caption: "互动讨论教学",
  },
]);

// 获取卡片样式
const getCardStyle = (index: number) => {
  const activeIndex = activeCardIndex.value;
  const diff = index - activeIndex;

  // 计算卡片的Z轴位置
  const zPosition = diff === 0 ? 0 : diff > 0 ? -diff * 150 : diff * 150;

  // 计算卡片的X轴偏移
  const xOffset = diff * 80;

  // 计算卡片的旋转角度
  const rotation = diff * 15;

  // 计算卡片的透明度和缩放
  let opacity = 1;
  let scale = 1;

  if (diff !== 0) {
    opacity = Math.max(0.1, 1 - Math.abs(diff) * 0.3);
    scale = Math.max(0.7, 1 - Math.abs(diff) * 0.15);
  }

  // 活跃卡片的样式
  const zIndex = diff === 0 ? 10 : 10 - Math.abs(diff);

  return {
    transform: `translate3d(${xOffset}px, 0, ${zPosition}px) rotateY(${rotation}deg) scale(${scale})`,
    opacity,
    zIndex,
    transition: isTransitioning.value
      ? "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : "all 0.3s ease",
  };
};

const handleCardClick = (index: number) => {
  if (index !== activeCardIndex.value) {
    isTransitioning.value = true;
    activeCardIndex.value = index;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 600);
  }
};

const handleNavClick = (index: number) => {
  handleCardClick(index);
};

// 上一张/下一张控制
const prevCard = () => {
  isTransitioning.value = true;
  activeCardIndex.value =
    (activeCardIndex.value - 1 + lectureSlides.value.length) %
    lectureSlides.value.length;

  setTimeout(() => {
    isTransitioning.value = false;
  }, 600);
};

const nextCard = () => {
  isTransitioning.value = true;
  activeCardIndex.value =
    (activeCardIndex.value + 1) % lectureSlides.value.length;

  setTimeout(() => {
    isTransitioning.value = false;
  }, 600);
};

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  if (!lectureRef.value) return;

  const rect = lectureRef.value.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // 计算鼠标相对中心的位置比例
  const mouseX = e.clientX - rect.left - centerX;
  const mouseY = e.clientY - rect.top - centerY;

  // 计算旋转角度（限制最大角度）
  rotationX.value = Math.max(-5, Math.min(5, (-mouseY / centerY) * 5));
  rotationY.value = Math.max(-5, Math.min(5, (mouseX / centerX) * 5));
};

const handleTouchMove = (e: TouchEvent) => {
  if (!lectureRef.value) return;

  const rect = lectureRef.value.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const touchX = e.touches[0].clientX - rect.left - centerX;
  const touchY = e.touches[0].clientY - rect.top - centerY;

  rotationX.value = Math.max(-5, Math.min(5, (-touchY / centerY) * 5));
  rotationY.value = Math.max(-5, Math.min(5, (touchX / centerX) * 5));
};

// 重置旋转
const resetRotation = () => {
  rotationX.value = 0;
  rotationY.value = 0;
};

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value;

  if (autoRotate.value) {
    startAutoRotate();
  } else if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
  }
};

const startAutoRotate = () => {
  if (autoRotateInterval) clearInterval(autoRotateInterval);

  autoRotateInterval = window.setInterval(() => {
    nextCard();
  }, 6000);
};

// 头脑风暴气泡数据
const ideaBubbles = ref([
  {
    x: 20,
    y: 20,
    text: "创新方案",
    color: "#ff6b6b",
    delay: 0,
    scale: 1,
    targetX: 20,
    targetY: 20,
  },
  {
    x: 70,
    y: 10,
    text: "突破思维",
    color: "#4ecdc4",
    delay: 0.5,
    scale: 1,
    targetX: 70,
    targetY: 10,
  },
  {
    x: 30,
    y: 50,
    text: "跨界融合",
    color: "#ffe66d",
    delay: 1,
    scale: 1,
    targetX: 30,
    targetY: 50,
  },
  {
    x: 60,
    y: 60,
    text: "颠覆传统",
    color: "#a77dc2",
    delay: 1.5,
    scale: 1,
    targetX: 60,
    targetY: 60,
  },
  {
    x: 45,
    y: 35,
    text: "迭代优化",
    color: "#ff8c42",
    delay: 2,
    scale: 1,
    targetX: 45,
    targetY: 35,
  },
  {
    x: 80,
    y: 40,
    text: "用户中心",
    color: "#45b7d1",
    delay: 0.3,
    scale: 1,
    targetX: 80,
    targetY: 40,
  },
  {
    x: 25,
    y: 70,
    text: "数据驱动",
    color: "#96ceb4",
    delay: 1.2,
    scale: 1,
    targetX: 25,
    targetY: 70,
  },
  {
    x: 75,
    y: 70,
    text: "敏捷开发",
    color: "#ffaaa5",
    delay: 1.8,
    scale: 1,
    targetX: 75,
    targetY: 70,
  },
  {
    x: 15,
    y: 40,
    text: "持续集成",
    color: "#ffd3b6",
    delay: 0.8,
    scale: 1,
    targetX: 15,
    targetY: 40,
  },
]);

const getBubbleStyle = (bubble: any) => {
  return {
    left: `${bubble.x}%`,
    top: `${bubble.y}%`,
    animationDelay: `${bubble.delay}s`,
    background: bubble.color,
    transform: `scale(${bubble.scale})`,
    transition: "transform 0.3s ease, left 1s ease, top 1s ease",
  };
};

const updateBubbleScale = (index: number, scale: number) => {
  ideaBubbles.value[index].scale = scale;
};

let brainstormAnimationFrame: number | null = null;

// 头脑风暴气泡动画
const startBrainstormAnimation = () => {
  // 为每个气泡设置新的目标位置
  const setNewBubbleTargets = () => {
    ideaBubbles.value.forEach((bubble) => {
      bubble.targetX = Math.max(
        10,
        Math.min(90, bubble.x + (Math.random() - 0.5) * 20),
      );
      bubble.targetY = Math.max(
        5, // 限制最低位置
        Math.min(80, bubble.y + (Math.random() - 0.5) * 20),
      );
    });
  };

  // 初始设置目标
  setNewBubbleTargets();

  // 动画循环
  const animate = () => {
    ideaBubbles.value.forEach((bubble) => {
      // 缓慢接近目标位置
      const factor = 0.01;
      bubble.x += (bubble.targetX - bubble.x) * factor;
      bubble.y += (bubble.targetY - bubble.y) * factor;
    });

    brainstormAnimationFrame = requestAnimationFrame(animate);
  };

  animate();

  // 定期更新目标位置
  setInterval(setNewBubbleTargets, 6000);
};

const switchMode = (idx: number) => {
  resetBlogCards();
  currentMode.value = idx;

  if (idx === 2) {
    nextTick(() => {
      if (autoRotate.value) {
        startAutoRotate();
      }
    });
  } else if (autoRotateInterval) {
    // 离开讲课模式时清除自动播放
    clearInterval(autoRotateInterval);
  }

  // 触发模式切换动画
  nextTick(() => {
    const card = document.querySelector(".mode-card") as HTMLDivElement;
    if (card) {
      card.style.animation = "fadeIn 0.8s ease-out";
      setTimeout(() => {
        if (card) card.style.animation = "none";
      }, 800);
    }
  });
};

// 初始化粒子背景（老带新）
const initParticles = () => {
  if (oldNewParticles.value) {
    const container = oldNewParticles.value;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 创建粒子
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      vertices.push(x, y, z);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    const material = new THREE.PointsMaterial({ color: 0x4ecdc4, size: 0.05 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;

    // 动画循环
    const animate = () => {
      particleAnimation = requestAnimationFrame(animate);
      points.rotation.x += 0.001;
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // 清理函数
    return () => {
      if (particleAnimation) cancelAnimationFrame(particleAnimation);
      container.removeChild(renderer.domElement);
    };
  }
  return () => {};
};

// 监听模式切换，清理粒子动画
watch(currentMode, (newVal) => {
  if (newVal !== 0 && particleCleanup) {
    particleCleanup();
    particleCleanup = null;
  }
  if (newVal === 0) {
    nextTick(() => {
      if (!particleCleanup) {
        particleCleanup = initParticles();
      }
    });
  }
});

// 页面加载完成后初始化
onMounted(() => {
  // 初始化粒子效果
  if (currentMode.value === 0) {
    particleCleanup = initParticles();
  }

  // 启动博客卡片动画
  startBlogAnimation();

  // 启动头脑风暴动画
  startBrainstormAnimation();

  // 如果初始模式是讲课模式，启动自动播放
  if (currentMode.value === 2 && autoRotate.value) {
    startAutoRotate();
  }
});

// 组件卸载时清理
onUnmounted(() => {
  if (particleCleanup) {
    particleCleanup();
  }
  if (blogAnimationFrame) {
    cancelAnimationFrame(blogAnimationFrame);
  }
  if (brainstormAnimationFrame) {
    cancelAnimationFrame(brainstormAnimationFrame);
  }
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
  }
});
</script>

<style scoped lang="scss">
.memuber1 {
  background-image: url(../../../../assets/img/methods/memuber1.png);
}
.memuber2 {
  background-image: url(../../../../assets/img/methods/memuber2.png);
}
.method {
  width: 100%;
  height: 680px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .content {
    width: 1100px;
    height: 600px;
    margin-top: 50px;
    .title {
      width: 100%;
      height: 60px;
      font-size: 22px;
      font-family: "Times New Roman", Times, serif;
      font-weight: bold;
      background-image: url(../../../../assets/img/bgColor.png);
      background-repeat: no-repeat;
      background-size: contain;

      .titles {
        font-weight: 300;
        font-size: 14px;
        margin-left: 30px;
      }
    }

    .content-main {
      width: 100%;
      height: calc(100% - 60px);
      overflow: hidden;
      position: relative;
    }
  }
}

.mode-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
  z-index: 10;
  position: relative;

  .mode-tab {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.active {
      background: #4ecdc4;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
    }
  }
}

.mode-card {
  width: 100%;
  height: calc(100% - 50px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.5s ease;
  position: relative;

  &.old-new {
    background: radial-gradient(
        circle at 80% 70%,
        rgba(78, 205, 196, 0.1),
        transparent 40%
      ),
      rgba(255, 255, 255, 0.95);
  }

  &.blog {
    background: radial-gradient(
        circle at 20% 70%,
        rgba(167, 125, 194, 0.1),
        transparent 40%
      ),
      rgba(255, 255, 255, 0.95);
  }

  &.lecture {
    background: radial-gradient(
        circle at 50% 80%,
        rgba(255, 107, 107, 0.1),
        transparent 40%
      ),
      rgba(255, 255, 255, 0.95);
  }

  &.brainstorm {
    background: radial-gradient(
        circle at 50% 30%,
        rgba(255, 230, 109, 0.1),
        transparent 40%
      ),
      rgba(255, 255, 255, 0.95);
  }
}

.mode-title {
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.8rem;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 4px;
    border-radius: 2px;
  }

  .main-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-right: 1.5rem;
    position: relative;
    display: inline-block;

    &::first-letter {
      font-size: 2.2rem;
    }
  }

  .sub-title {
    font-size: 1rem;
    color: #666;
    opacity: 0.8;
    position: relative;
    top: -3px;
  }
}

.old-new {
  .mode-title::after {
    background: #4ecdc4;
  }
  .main-title {
    color: #2d9c94;
  }
}

.blog {
  .mode-title::after {
    background: #a77dc2;
  }
  .main-title {
    color: #8d5dae;
  }
}

.lecture {
  .mode-title::after {
    background: #ff6b6b;
  }
  .main-title {
    color: #e04e4e;
  }
}

.brainstorm {
  .mode-title::after {
    background: #ffe66d;
  }
  .main-title {
    color: #d4bc36;
  }
}

.mode-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.5rem;
  max-width: 800px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 老带新模式样式 */
.old-new {
  .character-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
    position: relative;
    height: 220px;

    .character {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;
      position: relative;

      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
        position: relative;
        z-index: 2;

        &::after {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          z-index: -1;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        &:hover {
          transform: scale(1.1) translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
        }
      }

      .label {
        margin-top: 0.8rem;
        font-weight: 600;
        color: #555;
        opacity: 0.8;
        transition: all 0.3s ease;
      }
    }

    .old {
      .avatar::after {
        background: #ff6b6b;
      }

      &:hover .label {
        color: #ff6b6b;
        transform: scale(1.1);
      }
    }

    .new {
      .avatar::after {
        background: #4ecdc4;
      }

      &:hover .label {
        color: #4ecdc4;
        transform: scale(1.1);
      }
    }

    .connection-line {
      width: 2px;
      height: 150px;
      background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
      margin: 0 auto;
      transition: all 0.3s ease;
      box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
    }
  }

  .particle-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.7;
  }
}

/* 写博客模式样式 */
.blog {
  .blog-cards {
    perspective: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 280px;
    position: relative;

    .blog-card {
      width: 250px;
      height: 200px;
      background: white;
      border-radius: 0.8rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: absolute;
      overflow: hidden;
      cursor: pointer;

      .card-header {
        width: 100%;
        height: 100px;
        border-top-left-radius: 0.8rem;
        border-top-right-radius: 0.8rem;
        background-size: cover;
        background-position: center;
        transition: transform 0.5s ease;
      }

      .card-content {
        padding: 1rem;
        h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        p {
          font-size: 0.8rem;
          color: #666;
          line-height: 1.4;
        }
      }

      &:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);

        .card-header {
          transform: scale(1.05);
        }
      }
    }
  }
}

/* 讲课模式 */
.lecture {
  .lecture-3d-container {
    width: 100%;
    height: 320px;
    position: relative;
    perspective: 1500px;
    margin-top: 1rem;
    overflow: hidden;
  }

  .lecture-stage {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
  }

  .card-stack {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 80%;
    transform-style: preserve-3d;
  }

  .lecture-card {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    transform-origin: center;
    backface-visibility: hidden;

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .card-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    }

    .card-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      color: white;
      font-size: 1.2rem;
      font-weight: 500;
      z-index: 2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .card-hover-effect {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      .card-image {
        transform: scale(1.05);
      }

      .card-hover-effect {
        opacity: 1;
      }
    }
  }

  /* 装饰性光效 */
  .stage-light {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
    z-index: 0;
  }

  .top-left {
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: #ff6b6b;
  }

  .top-right {
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: #4ecdc4;
  }

  .bottom-center {
    bottom: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background: #a77dc2;
  }

  /* 导航指示器 */
  .card-navigation {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.8rem;
    z-index: 10;
  }

  .nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 107, 107, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: #ff6b6b;
      transform: scale(1.3);
      box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
    }

    &:hover {
      background: rgba(255, 107, 107, 0.6);
    }
  }

  /* 控制按钮 */
  .lecture-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;

    .control-btn {
      padding: 0.5rem 1.2rem;
      border: none;
      border-radius: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;

      &.prev,
      &.next {
        background: rgba(255, 107, 107, 0.1);
        color: #e04e4e;

        &:hover {
          background: rgba(255, 107, 107, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
        }
      }

      &.auto {
        background: #ff6b6b;
        color: white;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);

        &:hover {
          background: #e04e4e;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        }
      }
    }
  }
}

/* 头脑风暴模式样式 */
.brainstorm {
  .idea-bubbles {
    position: relative;
    height: 280px;
    width: 100%;
    overflow: hidden;
    margin-top: 1rem;

    .idea-bubble {
      position: absolute;
      padding: 0.8rem 1.2rem;
      border-radius: 2rem;
      color: white;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      animation: float 6s ease-in-out infinite;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2;

      &:hover {
        z-index: 3;
      }
    }
  }

  .meeting-table {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 80px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 40px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
}

/* 动画效果 */
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes pulse {
  from {
    opacity: 0.6;
    transform: scaleX(1);
  }
  to {
    opacity: 1;
    transform: scaleX(1.1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 331px) and (max-width: 768px) {
  .method {
    height: 620px;
    .content {
      width: 100%;
      .content-main {
        padding: 0 8px 20px 8px;
        height: auto;
      }
      margin-top: 30px;
      .title {
        padding: 0 10px;
      }
    }
    .old-new {
      .character-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 2.2rem;
        position: relative;
        height: 220px;

        .character {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;

          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
            position: relative;
            z-index: 2;

            &::after {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
              border-radius: 50%;
              z-index: -1;
              opacity: 0.3;
              transition: opacity 0.3s ease;
            }

            &:hover {
              transform: scale(1.1) translateY(-10px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
            }
          }

          .label {
            margin-top: 0.8rem;
            font-weight: 600;
            color: #555;
            opacity: 0.8;
            transition: all 0.3s ease;
          }
        }

        .old {
          .avatar::after {
            background: #ff6b6b;
          }

          &:hover .label {
            color: #ff6b6b;
            transform: scale(1.1);
          }
        }

        .new {
          .avatar::after {
            background: #4ecdc4;
          }

          &:hover .label {
            color: #4ecdc4;
            transform: scale(1.1);
          }
        }

        .connection-line {
          width: 2px;
          height: 150px;
          background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
          margin: 0 auto;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
        }
      }

      .particle-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.7;
      }
    }
    .blog {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .blog-cards {
        height: 249px;
      }
    }
    .lecture {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .lecture-3d-container {
        height: 270px;
      }
    }
    .brainstorm {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .idea-bubbles {
        height: 250px;
      }
    }
  }
}
@media (min-width: 769px) and (max-width: 960px) {
  .method {
    height: 620px;
    .mode-tabs {
      .mode-tab {
        font-size: 1.7rem;
      }
    }
    .label {
      font-size: 1.7rem;
    }
    .mode-desc {
      font-size: 1.7rem;
    }
    .sub-title {
      font-size: 1.6rem;
    }
    .main-title {
      font-size: 2.2rem;
      font-weight: bold;
      margin-right: 1.5rem;
      position: relative;
      display: inline-block;

      &::first-letter {
        font-size: 2.9rem;
      }
    }
    .content {
      width: 100%;
      .content-main {
        padding: 0 8px 20px 8px;
        height: auto;
      }
      margin-top: 30px;
      .title {
        padding: 0 10px;
      }
    }
    .old-new {
      .character-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 2.2rem;
        position: relative;
        height: 220px;

        .character {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;

          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
            position: relative;
            z-index: 2;

            &::after {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
              border-radius: 50%;
              z-index: -1;
              opacity: 0.3;
              transition: opacity 0.3s ease;
            }

            &:hover {
              transform: scale(1.1) translateY(-10px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
            }
          }

          .label {
            margin-top: 0.8rem;
            font-weight: 600;
            color: #555;
            opacity: 0.8;
            transition: all 0.3s ease;
          }
        }

        .old {
          .avatar::after {
            background: #ff6b6b;
          }

          &:hover .label {
            color: #ff6b6b;
            transform: scale(1.1);
          }
        }

        .new {
          .avatar::after {
            background: #4ecdc4;
          }

          &:hover .label {
            color: #4ecdc4;
            transform: scale(1.1);
          }
        }

        .connection-line {
          width: 2px;
          height: 150px;
          background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
          margin: 0 auto;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
        }
      }

      .particle-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.7;
      }
    }
    .blog {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .blog-cards {
        height: 249px;
        .blog-card {
          .card-content {
            h3 {
              font-size: 1.7rem;
            }
            p {
              font-size: 1.6rem;
            }
          }
        }
      }
    }
    .lecture {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .lecture-3d-container {
        height: 270px;
      }
      .card-caption {
        font-size: 1.7rem;
      }
    }
    .brainstorm {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .idea-bubbles {
        height: 250px;
        .idea-bubble {
          font-size: 1.7rem;
        }
      }
    }
  }
}
@media (min-width: 960px) and (max-width: 1199px) {
  .method {
    .content {
      padding: 0 3rem;
      .title {
        padding: 0 20px;
      }
    }

    .mode-tabs {
      .mode-tab {
        font-size: 1.7rem;
      }
    }
    .label {
      font-size: 1.7rem;
    }
    .mode-desc {
      font-size: 1.7rem;
    }
    .sub-title {
      font-size: 1.6rem;
    }
    .main-title {
      font-size: 2.2rem;
      font-weight: bold;
      margin-right: 1.5rem;
      position: relative;
      display: inline-block;

      &::first-letter {
        font-size: 2.9rem;
      }
    }
    .content {
      width: 100%;
      .content-main {
        padding: 0 8px 20px 8px;
        height: auto;
      }
      margin-top: 30px;
      .title {
        padding: 0 10px;
      }
    }
    .old-new {
      .character-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 2.2rem;
        position: relative;
        height: 220px;

        .character {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;

          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
            position: relative;
            z-index: 2;

            &::after {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
              border-radius: 50%;
              z-index: -1;
              opacity: 0.3;
              transition: opacity 0.3s ease;
            }

            &:hover {
              transform: scale(1.1) translateY(-10px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
            }
          }

          .label {
            margin-top: 0.8rem;
            font-weight: 600;
            color: #555;
            opacity: 0.8;
            transition: all 0.3s ease;
          }
        }

        .old {
          .avatar::after {
            background: #ff6b6b;
          }

          &:hover .label {
            color: #ff6b6b;
            transform: scale(1.1);
          }
        }

        .new {
          .avatar::after {
            background: #4ecdc4;
          }

          &:hover .label {
            color: #4ecdc4;
            transform: scale(1.1);
          }
        }

        .connection-line {
          width: 2px;
          height: 150px;
          background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
          margin: 0 auto;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
        }
      }

      .particle-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.7;
      }
    }
    .blog {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .blog-cards {
        height: 249px;
        .blog-card {
          .card-content {
            h3 {
              font-size: 1.7rem;
            }
            p {
              font-size: 1.6rem;
            }
          }
        }
      }
    }
    .lecture {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .lecture-3d-container {
        height: 270px;
      }
      .card-caption {
        font-size: 1.7rem;
      }
    }
    .brainstorm {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .idea-bubbles {
        height: 250px;
        .idea-bubble {
          font-size: 1.7rem;
        }
      }
    }
  }
}
@media (min-width: 1200px) and (max-width: 1400px) {
  .method {
    .mode-tabs {
      .mode-tab {
        font-size: 1.3rem;
      }
    }
    .label {
      font-size: 1.4rem;
    }
    .mode-desc {
      font-size: 1.3rem;
    }
    .sub-title {
      font-size: 1.3rem;
    }
    .main-title {
      font-size: 1.8rem;
      font-weight: bold;
      margin-right: 1.5rem;
      position: relative;
      display: inline-block;

      &::first-letter {
        font-size: 2.5rem;
      }
    }

    .blog {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .blog-cards {
        height: 249px;
        .blog-card {
          .card-content {
            h3 {
              font-size: 1.2rem;
            }
            p {
              font-size: 1.1rem;
            }
          }
        }
      }
    }
    .lecture {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .lecture-3d-container {
        height: 270px;
      }
      .card-caption {
        font-size: 1.3rem;
      }
    }
    .brainstorm {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .idea-bubbles {
        height: 250px;
        .idea-bubble {
          font-size: 1.3rem;
        }
      }
    }
  }
}
@media (min-width: 1401px) and (max-width: 1440px) {
  .method {
    .mode-tabs {
      .mode-tab {
        font-size: 1rem;
      }
    }
    .label {
      font-size: 1rem;
    }
    .mode-desc {
      font-size: 1rem;
    }
    .sub-title {
      font-size: 1rem;
    }
    .main-title {
      font-size: 1.4rem;
      font-weight: bold;
      margin-right: 1.5rem;
      position: relative;
      display: inline-block;

      &::first-letter {
        font-size: 2rem;
      }
    }

    .blog {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .blog-cards {
        height: 249px;
        .blog-card {
          .card-content {
            h3 {
              font-size: 1rem;
            }
            p {
              font-size: 0.9rem;
            }
          }
        }
      }
    }
    .lecture {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .lecture-3d-container {
        height: 270px;
      }
      .card-caption {
        font-size: 1.1rem;
      }
    }
    .brainstorm {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .idea-bubbles {
        height: 250px;
        .idea-bubble {
          font-size: 0.9rem;
        }
      }
    }
  }
}
@media (max-width: 330px) {
  .method {
    height: 620px;
    .content {
      width: 100%;
      .content-main {
        padding: 0 8px 20px 8px;
        height: auto;
      }
      margin-top: 30px;
      .title {
        padding: 0 10px;
        font-size: 21px;
        .titles {
          font-size: 12px;
        }
      }
    }
    .old-new {
      .character-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 2.2rem;
        position: relative;
        height: 220px;

        .character {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;

          .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
            position: relative;
            z-index: 2;

            &::after {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
              border-radius: 50%;
              z-index: -1;
              opacity: 0.3;
              transition: opacity 0.3s ease;
            }

            &:hover {
              transform: scale(1.1) translateY(-10px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
            }
          }

          .label {
            margin-top: 0.8rem;
            font-weight: 600;
            color: #555;
            opacity: 0.8;
            transition: all 0.3s ease;
          }
        }

        .old {
          .avatar::after {
            background: #ff6b6b;
          }

          &:hover .label {
            color: #ff6b6b;
            transform: scale(1.1);
          }
        }

        .new {
          .avatar::after {
            background: #4ecdc4;
          }

          &:hover .label {
            color: #4ecdc4;
            transform: scale(1.1);
          }
        }

        .connection-line {
          width: 2px;
          height: 150px;
          background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
          margin: 0 auto;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
        }
      }

      .particle-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.7;
      }
    }
    .blog {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .blog-cards {
        height: 249px;
        .blog-card {
          width: 230px;
          height: 190px;
        }
      }
    }
    .lecture {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .lecture-3d-container {
        height: 290px;
      }
    }
    .brainstorm {
      padding: 1.5rem 1.5rem 0 1.5rem;
      .idea-bubbles {
        height: 250px;
      }
    }
  }
}
</style>
