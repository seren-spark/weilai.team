<script setup lang="ts">
import HeaderNav from "@/features/homePage/components/topNav/HeaderNav.vue";
import Swiper from "@/features/homePage/components/topNav/Swiper.vue";
import MidIntro from "@/features/homePage/components/des/Mid-intro.vue";
import Teacher from "@/features/homePage/components/teacher/Teacher.vue";
import ItemShow from "@/features/homePage/components/itemShow/ItemShow.vue";
import HotNews from "@/features/homePage/components/news/HotNews.vue";
import Develop from "@/features/homePage/components/develop/Develop.vue";
import Bottom from "@/features/homePage/components/bottom/Bottom.vue";
import LazyLoad from "@/features/homePage/components/lazyLoad/LazyLoad.vue";
import { ref, onMounted } from "vue";

const showBackToTop = ref(false);

// 滚动监听
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 平滑滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="con">
    <!-- 首屏组件直接渲染 -->
    <HeaderNav />
    <Swiper />

    <!-- 懒加载组件 -->
    <LazyLoad root-margin="0px 0px 200px 0px">
      <template #default>
        <MidIntro />
      </template>
      <template #fallback>
        <div class="loading-placeholder"></div>
      </template>
    </LazyLoad>

    <LazyLoad root-margin="0px 0px 200px 0px">
      <template #default>
        <Teacher />
      </template>
      <template #fallback>
        <div class="loading-placeholder"></div>
      </template>
    </LazyLoad>

    <LazyLoad root-margin="0px 0px 200px 0px">
      <template #default>
        <ItemShow />
      </template>
      <template #fallback>
        <div class="loading-placeholder"></div>
      </template>
    </LazyLoad>

    <LazyLoad root-margin="0px 0px 200px 0px">
      <template #default>
        <HotNews />
      </template>
      <template #fallback>
        <div class="loading-placeholder"></div>
      </template>
    </LazyLoad>

    <LazyLoad root-margin="0px 0px 200px 0px">
      <template #default>
        <Develop />
      </template>
      <template #fallback>
        <div class="loading-placeholder"></div>
      </template>
    </LazyLoad>

    <Bottom />

    <!-- 回到顶部 -->
    <transition name="fade">
      <div v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
        <img
          src="@/assets/img/homePage/top.png"
          alt="回到顶部"
          class="back-to-top-img"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.con {
  overflow: hidden;
  position: relative;
}

.back-to-top {
  position: fixed;
  right: 10px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.back-to-top-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 加载占位符 */
.loading-placeholder {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  margin: 20px 0;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
