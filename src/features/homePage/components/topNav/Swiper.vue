<template>
  <div class="swiperbox">
    <!-- 包裹 Letter 组件，设置样式使其水平居中 -->
    <div class="letter-wrapper">
      <Letter />
    </div>
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
      <swiper-slide>
        <img
          src="../../../../assets/img/homePage/bg4.png"
          alt=""
          width="100%"
          height="100%"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          src="../../../../assets/img/homePage/bg1.png"
          alt=""
          width="100%"
          height="100%"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          src="../../../../assets/img/homePage/bg3.jpg"
          alt=""
          width="100%"
          height="100%"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination, A11y } from "swiper"; // 分页器
import "swiper/swiper-bundle.css";

import Letter from "@/features/homePage/components/topNav/Letter.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const modules = [Autoplay, Navigation, Pagination, A11y];
</script>

<style lang="scss">
@media (min-width: 361px) and (max-width: 480px) {
  .letter-wrapper {
    top: 0;
  }
}
@media (min-width: 768px) and (max-width: 960px) {
  .swiperbox {
    .swiper {
      .custom-prev,
      .custom-next {
        .blocks {
          height: 60px;
        }
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .swiperbox {
    .swiper {
      .custom-prev,
      .custom-next {
        .blocks {
          height: 85px;
        }
      }
    }
  }
}
.swiperbox {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 5;

  .letter-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 6;
    pointer-events: none; /* 让鼠标事件穿透该容器 */
  }

  .swiper {
    height: 100vh;
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* 长条分页器 */
    .swiper-pagination {
      position: absolute;
      bottom: 80px;
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .swiper-pagination-bullet {
      width: 40px; /* 长条宽度 */
      height: 2.5px; /* 长条高度 */
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 1;
      transition: all 0.3s;
    }

    .swiper-pagination-bullet-active {
      background: white;
      width: 60px; /* 激活状态更长 */
    }

    /* 导航箭头 */
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
        transition: height 0.1s ease;
        box-shadow: 0px 2px 4px 2px rgb(206, 206, 206);
        animation: glowAnimation 5s infinite;
      }
      @keyframes glowAnimation {
        0% {
          box-shadow: 0px 4px 4px 2px rgb(206, 206, 206);
        }
        50% {
          /* 中间状态加大模糊和扩散半径，增强发光效果 */
          box-shadow: 0px 3px 8px 4px rgb(206, 206, 206);
        }
        100% {
          box-shadow: 0px 4px 4px 2px rgb(206, 206, 206);
        }
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
@media (min-width: 769px) and (max-width: 960px) {
  .swiperbox {
    .swiper {
      .swiper-pagination {
        bottom: 40px;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .swiperbox {
    .swiper {
      .swiper-pagination {
        bottom: 35px;
      }
    }
  }
}
</style>
