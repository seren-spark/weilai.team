<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue/dist/iconify.js";

const isScrolled = ref(false);
const activeLink = ref<string | null>(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const handleLinkClick = (linkName: string) => {
  activeLink.value = linkName;
  setTimeout(() => {
    activeLink.value = null;
  }, 2000);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="navCon" :class="{ scrolled: isScrolled }">
    <div class="logo">
      <img src="/src/assets/img/homePage/logo.png" alt="" />
    </div>
    <div class="navLink">
      <nav>
        <div
          class="homePage link type--C"
          :class="{ active: activeLink === 'homePage' }"
          @click="handleLinkClick('homePage')"
        >
          <span class="button__text">首页</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </div>
        <div
          class="blog link type--C"
          :class="{ active: activeLink === 'blog' }"
          @click="handleLinkClick('blog')"
        >
          <span class="button__text">博客</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </div>
        <div
          class="source link type--C"
          :class="{ active: activeLink === 'source' }"
          @click="handleLinkClick('source')"
        >
          <span class="button__text">小组资源</span>
          <Icon
            icon="meteor-icons:chevron-down"
            width="16"
            height="18"
            :style="{
              color: isScrolled ? 'black' : 'white',
              marginLeft: '4px',
              marginTop: '0px',
            }"
          />
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </div>
        <div
          class="notice link type--C"
          :class="{ active: activeLink === 'notice' }"
          @click="handleLinkClick('notice')"
        >
          <span class="button__text">公告</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </div>
        <div
          class="forum link type--C"
          :class="{ active: activeLink === 'forum' }"
          @click="handleLinkClick('forum')"
        >
          <span class="button__text">论坛</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </div>
        <div
          class="about link type--C"
          :class="{ active: activeLink === 'about' }"
          @click="handleLinkClick('about')"
        >
          <span class="button__text">关于我们</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </div>
      </nav>
    </div>
    <div class="login">
      <Button class="loginBtn" :class="{ 'scrolled-btn': isScrolled }"
        >登录</Button
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.type--A {
  --line_color: #555555;
  --back_color: #ffecf6;
}
.type--B {
  --line_color: #1b1919;
  --back_color: #e9ecff;
}
.type--C {
  --line_color: #00135c;
  --back_color: #9acfd4;
}

.link.active .button__drow1 {
  animation: drow1 ease-in 0.06s;
  animation-fill-mode: forwards;
}

.link.active .button__drow1::before {
  animation: drow2 linear 0.08s 0.06s;
  animation-fill-mode: forwards;
}

.link.active .button__drow1::after {
  animation: drow3 linear 0.03s 0.14s;
  animation-fill-mode: forwards;
}

.link.active .button__drow2 {
  animation: drow4 linear 0.06s 0.2s;
  animation-fill-mode: forwards;
}

.navCon {
  width: 100%;
  height: 10rem;
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  transition: all 0.3s ease;

  &.scrolled {
    height: 5rem;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .link {
      color: black !important;
    }
  }

  .logo {
    width: 5.4rem;
    height: 4.5rem;
    margin-right: 3rem;
    transition: all 0.3s ease;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .navLink {
    width: 55rem;
    height: 5rem;
    margin-right: 5rem;

    nav {
      width: 45rem;
      height: 5rem;
      display: flex;
      margin-left: 1rem;
      align-items: center;

      .link {
        font-size: 1rem;
        margin-right: 2rem;
        cursor: pointer;
        color: white;
        transition: all 0.3s ease;
        position: relative;
        z-index: 0;
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        .button__text {
          position: relative;
          z-index: 100;
        }
      }

      .source {
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }
}

.button__drow1,
.button__drow2 {
  position: absolute;
  z-index: -1;
  border-radius: 6.4px;
  transform-origin: 6.4px 6.4px;
}

.button__drow1 {
  top: -6.4px;
  width: 12.8px;
  height: 0;
}

.button__drow2 {
  top: 17.6px;
  width: 12.8px;
  height: 0;
}

.button__drow1 {
  left: 8px;
  transform: rotate(30deg);
}

.button__drow2 {
  left: 23.6px;
  transform: rotate(-127deg);
}

.button__drow1::before,
.button__drow1::after,
.button__drow2::before,
.button__drow2::after {
  content: "";
  position: absolute;
}

.button__drow1::before {
  bottom: 0;
  left: 0;
  width: 0;
  height: 12.8px;
  border-radius: 6.4px;
  transform-origin: 6.4px 6.4px;
  transform: rotate(-60deg);
}

.button__drow1::after {
  top: -4px;
  left: 17.6px;
  width: 0;
  height: 12.8px;
  border-radius: 6.4px;
  transform-origin: 6.4px 6.4px;
  transform: rotate(69deg);
}

.button__drow2::before {
  bottom: 0;
  left: 0;
  width: 0;
  height: 12.8px;
  border-radius: 6.4px;
  transform-origin: 6.4px 6.4px;
  transform: rotate(-146deg);
}

.button__drow2::after {
  bottom: 10.4px;
  left: -16px;
  width: 0;
  height: 12.8px;
  border-radius: 6.4px;
  transform-origin: 6.4px 6.4px;
  transform: rotate(-262deg);
}

.button__drow1,
.button__drow1::before,
.button__drow1::after,
.button__drow2,
.button__drow2::before,
.button__drow2::after {
  background: var(--back_color);
}

.link:hover .button__drow1 {
  animation: drow1 ease-in 0.06s;
  animation-fill-mode: forwards;
}

.link:hover .button__drow1::before {
  animation: drow2 linear 0.08s 0.06s;
  animation-fill-mode: forwards;
}

.link:hover .button__drow1::after {
  animation: drow3 linear 0.03s 0.14s;
  animation-fill-mode: forwards;
}

.link:hover .button__drow2 {
  animation: drow4 linear 0.06s 0.2s;
  animation-fill-mode: forwards;
}

@keyframes drow1 {
  0% {
    height: 0;
  }
  100% {
    height: 40px;
  }
}

@keyframes drow2 {
  0% {
    width: 0;
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  11% {
    opacity: 1;
  }
  100% {
    width: 48px;
  }
}

@keyframes drow3 {
  0% {
    width: 0;
  }
  100% {
    width: 32px;
  }
}

@keyframes drow4 {
  0% {
    height: 0;
  }
  100% {
    height: 48px;
  }
}

/* 调整"小组资源"和"关于我们"的动画位置 */
.source .button__drow1,
.about .button__drow1 {
  left: 27px;
}

.source .button__drow2,
.about .button__drow2 {
  left: 43px;
}
.loginBtn {
  position: relative;
  z-index: 1;
  width: 5rem;
  height: 2.2rem;
  font-weight: bold;
  border-radius: 2rem;
  color: #284dd5;
  border: 0.16rem solid #284dd5;
  transition: all 0.3s ease;
  overflow: hidden;
  background-color: transparent;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -1rem;
    z-index: -1;
    width: 170%;
    aspect-ratio: 1;
    border: none;
    border-radius: 40%;
    background-color: rgba(0, 0, 255, 0.25);
    transition: 2.5s;
  }

  &::before {
    left: -60%;
    transform: translate3d(0, 6em, 0) rotate(-340deg);
  }

  &::after {
    right: -60%;
    transform: translate3d(0, 6em, 0) rotate(390deg);
  }

  &:hover,
  &:focus {
    color: white;

    &::before,
    &::after {
      transform: none;
      background-color: rgba(0, 0, 255, 0.75);
    }
  }
}
@media screen and (max-width: 768px) {
  .navCon {
    display: none;
  }
}
@media screen and (max-width: 960px) {
  .navCon {
    display: none;
  }
}
@media screen and (max-width: 1280px) {
  .navCon {
    &.scrolled {
      height: 9em;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .link {
        font-size: 20px;
        color: black !important;
      }
    }

    .logo {
      width: 8rem;
      height: 7rem;
      margin-right: 3rem;
      transition: all 0.3s ease;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .navLink {
      margin-right: 4.3rem;
      nav {
        width: 100%;
        .link {
          font-size: 1.3rem;
        }
      }
    }
  }
  .loginBtn {
    width: 7.2rem;
    height: 3rem;
    font-size: 17px;
  }
}
</style>
