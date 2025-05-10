<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const showElements = ref([false, false, false, false, false, false]);
const container = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const startAnimation = () => {
  // 依次显示每个元素，每个延迟300ms
  const elementCount = showElements.value.length;
  for (let i = 0; i < elementCount; i++) {
    setTimeout(() => {
      showElements.value[i] = true;
    }, 300 * i);
  }
};

onMounted(() => {
  if (!container.value) return;

  // 创建IntersectionObserver实例
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 当元素进入视口时开始动画
          startAnimation();
          // 动画开始后停止观察
          observer?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // 当10%的元素可见时触发
      rootMargin: "0px 0px -100px 0px", // 底部提前100px触发
    },
  );

  // 开始观察容器元素
  observer.observe(container.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div ref="container" class="mid_intro">
    <div class="mid_conent">
      <div class="target" :class="{ 'fade-in': showElements[0] }">
        我们的目标
      </div>
      <div class="target_content" :class="{ 'fade-in': showElements[1] }">
        <div class="target_star">
          <Icon
            icon="meteor-icons:sparkles"
            width="30"
            height="30"
            style="color: #17949e"
            class="twinkle-icon delay-0"
          />
        </div>
        <span class="target_text" :class="{ 'fade-in': showElements[2] }">
          <Icon
            icon="meteor-icons:sparkles"
            width="32"
            height="32"
            style="color: #17949e"
            class="twinkle-icon delay-1"
          />做一个有影响力的团队
        </span>
        <span class="target_text" :class="{ 'fade-in': showElements[3] }"
          >做一个有影响力的人</span
        >
        <div class="target_stars">
          <Icon
            icon="meteor-icons:sparkles"
            width="32"
            height="32"
            style="color: #17949e"
            class="twinkle-icon delay-2"
          />
        </div>
      </div>
      <div class="about" :class="{ 'fade-in': showElements[4] }">
        关于未来软件工作室
      </div>
      <div class="aboutContent" :class="{ 'fade-in': showElements[5] }">
        <p>
          未来软件工作室由<span> 高国红 </span>，<span> 李士勇 </span
          >两位老师于<span> 2011年6月 </span
          >创办，以提高学生软件开发技术为核心培养目标,秉承追求卓越，采取理论基础、实践能力与综合素质并重的人才培养理念，旨在全方位提高学生的就业质量和创新创业能力。
        </p>
        <p>
          工作室成立以来，逐步形成了<span> Web设计开发 </span
          >、大前端设计开发两大学 习方向以及<span> JavaWeb </span
          >、数据处理、移动开发、UI设计等若干细方向，凝练了成熟的学习路线和培养方案。
        </p>
        <p>
          一路走来我们成绩斐然，先后获得国家级创新创业项目5项，河南省创业扶持资金项目2项，
          校级创新创业项目8项，在各类学科竞赛中获国家级奖项12项，省级奖项91项，设计开发各类软件产品40余个，
          培养毕业生40余人，均就职于京东、联想、新浪等知名企业，平均就业年薪达<span>
            20万元 </span
          >以上。
          未来，做一个有影响力的团队，未来人，做一个有影响力的人，未来有你，未来可期。
          <Icon
            icon="meteor-icons:sparkles"
            width="30"
            height="30"
            style="color: #17949e; margin-left: 100px"
            class="twinkle-icon delay-0 delay"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mid_intro {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  background: linear-gradient(-32.2deg, #f7edfa, #e2ebfa);
}
.mid_conent {
  width: 900px;
}
.delay {
  margin-top: 20px;
}
.target {
  color: #333;
  font-size: 1em;
  font-weight: bold;
  margin: 0px 20px 20px 20px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}
.target_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}
.target_star {
  margin-right: 550px;
}

.target_stars {
  margin-left: 550px;
}
.target_text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #3498db, #e5a6d5, #3498db);
  background-size: 200% 100%;
  animation: gradientAnimation 8s linear infinite;
  font-size: 3em;
  font-family: serif;
  text-align: center;
  padding: 0 10px 10px 10px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientAnimation {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.about {
  color: #333;
  font-size: 1em;
  font-weight: bold;
  padding: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}
.aboutContent {
  color: rgb(94, 94, 94);
  font-size: 0.96em;
  line-height: 2.2;
  padding: 20px;
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

  p {
    text-indent: 2em;
    opacity: 1;
  }

  span {
    font-weight: bold;
    color: #52a2d9;
  }
}

.twinkle-icon {
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.delay-0 {
  animation-delay: 0s;
}

.delay-1 {
  animation-delay: 0.5s;
  margin-right: 650px;
}

.delay-2 {
  animation-delay: 1s;
}

@media (max-width: 360px) {
  .mid_conent {
    width: 100%;
    padding: 0 5px;
    height: 100%;
    .target {
      margin: 30px 20px 15px 20px;
    }
    .target_text {
      width: 100%;
      font-size: 30px;
    }
    .twinkle-icon {
      width: 22px;
      height: 22px;
    }
    .target_star {
      margin-right: auto;
      margin-left: 40px;
      margin-bottom: 5px;
    }
    .target_stars {
      margin-left: auto;
      margin-right: 20px;
    }
    .about {
      padding: 10px 20px 0px 20px;
    }
    .delay {
      margin-top: 20px;
    }
    .delay-1 {
      margin-bottom: 10px;
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .mid_conent {
    width: 100%;
    padding: 0 5px;
    height: 100%;
    .target {
      margin: 30px 20px 15px 20px;
    }
    .target_text {
      width: 100%;
      font-size: 30px;
    }
    .twinkle-icon {
      width: 22px;
      height: 22px;
    }
    .target_star {
      margin-right: auto;
      margin-left: 40px;
      margin-bottom: 5px;
    }
    .target_stars {
      margin-left: auto;
      margin-right: 20px;
    }
    .about {
      padding: 10px 20px 0px 20px;
    }
    .delay {
      margin-top: 20px;
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .mid_conent {
    width: 100%;
    padding: 0 10px;
    height: 100%;
    .target {
      margin: 30px 20px 35px 20px;
    }
    .target_text {
      width: 100%;
      font-size: 40px;
    }
    .twinkle-icon {
      width: 27px;
      height: 27px;
    }
    .target_star {
      margin-right: auto;
      margin-left: 70px;
      margin-bottom: 5px;
    }
    .target_stars {
      margin-left: auto;
      margin-right: 60px;
    }
    .about {
      padding: 10px 20px 20px 20px;
    }
    .delay {
      margin-top: 20px;
    }
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .mid_conent {
    width: 100%;
    padding: 0 10px;
    height: 100%;
    .target {
      margin: 30px 20px 35px 20px;
    }
    .target_text {
      width: 100%;
      font-size: 40px;
    }
    .twinkle-icon {
      width: 27px;
      height: 27px;
    }
    .target_star {
      margin-right: auto;
      margin-left: 70px;
      margin-bottom: 5px;
    }
    .target_stars {
      margin-left: auto;
      margin-right: 60px;
    }
    .about {
      padding: 10px 20px 20px 20px;
    }
    .delay {
      margin-top: 20px;
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .mid_conent {
    width: 100%;
    padding: 0 100px;
    height: 100%;
    .target {
      font-size: 17px;
      margin: 30px 20px 35px 20px;
    }
    .target_text {
      width: 100%;
      font-size: 43px;
    }
    .twinkle-icon {
      width: 30px;
      height: 30px;
    }
    .target_star {
      margin-right: auto;
      margin-left: 100px;
      margin-bottom: 5px;
    }
    .target_stars {
      margin-left: auto;
      margin-right: 90px;
    }
    .about {
      font-size: 17px;
      padding: 10px 20px 20px 20px;
    }
    .delay {
      margin-top: 20px;
    }
  }
  .aboutContent {
    font-size: 16px;
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .mid_conent {
    width: 100%;
    padding: 0 125px;
    height: 100%;
    .target {
      font-size: 17px;
      margin: 30px 20px 35px 20px;
    }
    .target_text {
      width: 100%;
      font-size: 43px;
    }
    .twinkle-icon {
      width: 30px;
      height: 30px;
    }
    .target_star {
      margin-right: auto;
      margin-left: 100px;
      margin-bottom: 5px;
    }
    .target_stars {
      margin-left: auto;
      margin-right: 90px;
    }
    .about {
      font-size: 17px;
      padding: 10px 20px 20px 20px;
    }
    .delay {
      margin-top: 20px;
    }
  }
  .aboutContent {
    font-size: 16px;
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
}

@media (min-width: 1441px) {
}
</style>
