<template>
  <div class="swiperbox">
    <Letter />
    <swiper
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :centered-slides="true"
      :pagination="{
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class='${className}'></span>`;
        },
      }"
      :autoplay="{ delay: 7000, disableOnInteraction: false }"
      :navigation="{
        nextEl: '.custom-next',
        prevEl: '.custom-prev',
      }"
      :modules="modules"
    >
      <!-- 幻灯片内容 -->
      <div class="custom-navigation">
        <div class="custom-prev">
          <div class="blocks"></div>
          <Icon
            icon="meteor-icons:chevron-left"
            width="21"
            height="21"
            style="color: #fff"
            class="arrow"
          />
        </div>
        <div class="custom-next">
          <Icon
            icon="meteor-icons:chevron-right"
            width="21"
            height="21"
            style="color: #fff"
            class="arrow"
          />
          <div class="blocks"></div>
        </div>
      </div>
      <swiper-slide
        ><img
          src="../../../../assets/img/homePage/bg1.jpg"
          alt=""
          width="100%"
          height="100%"
      /></swiper-slide>
      <swiper-slide
        ><img
          src="../../../../assets/img/homePage/bg2.jpg"
          alt=""
          width="100%"
          height="100%"
      /></swiper-slide>
      <swiper-slide
        ><img
          src="../../../../assets/img/homePage/bg3.jpg"
          alt=""
          width="100%"
          height="100%"
      /></swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue"; // swiper 所需组件
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules"; // 分页器
// import 'swiper/swiper-bundle.css'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Letter from "@/features/homePage/components/topNav/Letter.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const modules = [Autoplay, Pagination, Navigation, A11y];
</script>

<style lang="scss">
.swiperbox {
  position: relative;
  height: 100vh;
  width: 100%;
  z-index: 5;

  .swiper {
    height: 100vh;
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* 自定义长条分页器 */
    .swiper-pagination {
      position: absolute;
      bottom: 80px;
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .swiper-pagination-bullet {
      width: 40px; // 长条宽度
      height: 2.5px; // 长条高度
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 1;
      transition: all 0.3s;
    }

    .swiper-pagination-bullet-active {
      background: white;
      width: 60px; // 激活状态更长
    }

    /* 自定义导航箭头 */
    .custom-navigation {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      z-index: 11;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      pointer-events: none;
    }
    .arrow {
      opacity: 0;
    }
    .custom-prev,
    .custom-next {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      .blocks {
        background-color: white;
        width: 2px;
        height: 40px;
        transition:
        //   width 0.1s ease,
          height 0.1s ease;
      }
    }
    .custom-prev:hover .blocks,
    .custom-next:hover .blocks {
      width: 0.5px;
      height: 100px;
    }
    .custom-next:hover .arrow {
      opacity: 1;
    }
    .custom-prev:hover .arrow {
      opacity: 1;
    }
  }
}
</style>
