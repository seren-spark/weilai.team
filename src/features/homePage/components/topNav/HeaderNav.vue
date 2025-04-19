<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue/dist/iconify.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 响应式变量控制滚动状态
const isScrolled = ref(false);

// 滚动事件处理函数
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// 生命周期钩子
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
        <div class="homePage link">首页</div>
        <div class="blog link">博客展示</div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div class="source link">
              小组资源
              <Icon
                icon="meteor-icons:chevron-down"
                width="16"
                height="18"
                :style="{
                  color: isScrolled ? 'black' : 'white',
                  marginLeft: '4px',
                  marginTop: '3px',
                }"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>我的文件</DropdownMenuItem>
            <DropdownMenuItem>我的收藏</DropdownMenuItem>
            <DropdownMenuItem>上传文件</DropdownMenuItem>
            <DropdownMenuItem>文件社区</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div class="notice link">公告</div>
        <div class="forum link">论坛</div>
        <div class="about link">关于我们</div>
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
.navCon {
  width: 100%;
  height: 10rem;
  position: fixed;
  z-index: 100;
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
        transition: color 0.3s ease;
      }

      .source {
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }
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
</style>
