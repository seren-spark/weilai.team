<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useRouter } from "vue-router";
import apiClient from "@/api/axios";

const router = useRouter();
const isScrolled = ref(false);
const activeLink = ref<string | null>(null);
const isNavConVisible = ref(true);
const showMobileMenu = ref(false);
const newIsScrolled = ref(false);
const hasToken = ref(false); // 用于判断是否有token
// 存储头像路径
const avatarSrc = ref("/src/assets/img/defaultAvatar.png");

// 控制body滚动
const setBodyOverflow = (hidden: boolean) => {
  document.body.style.overflow = hidden ? "hidden" : "";
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
  newIsScrolled.value = window.scrollY > 50;
  if (window.scrollY > 50) {
    isNavConVisible.value = false;
  } else {
    isNavConVisible.value = true;
  }
};

const handleLinkClick = (linkName: string) => {
  activeLink.value = linkName;
  setTimeout(() => {
    activeLink.value = null;
  }, 2000);
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  setBodyOverflow(showMobileMenu.value);
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  const token = localStorage.getItem("token");
  const userIdStr = localStorage.getItem("userId");
  let userId;
  if (userIdStr) {
    try {
      const userIdObj = JSON.parse(userIdStr);
      userId = userIdObj.value;
    } catch (error) {
      console.error("解析userId时出错", error);
    }
  }
  hasToken.value = token !== null;
  if (hasToken.value && userId) {
    try {
      const res = await apiClient.get(`user/getUserInfoByUserId/${userId}`);
      if (res.data?.headPortrait) {
        avatarSrc.value = res.data.headPortrait;
        console.log(avatarSrc.value);
      }
    } catch (error) {
      console.error("获取用户信息失败：", error);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  setBodyOverflow(false); // 组件卸载时恢复滚动
});
</script>

<template>
  <div class="navCon" :class="{ scrolled: isScrolled }">
    <div class="logo">
      <img src="/src/assets/img/homePage/logo.png" alt="" />
    </div>
    <div class="navLink">
      <nav>
        <RouterLink to="/">
          <div
            class="homePage link type--C"
            :class="{ active: activeLink === 'homePage' }"
            @click="handleLinkClick('homePage')"
          >
            <span class="button__text">首页</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
          </div>
        </RouterLink>
        <RouterLink to="/community/blog/hot">
          <div
            class="blog link type--C"
            :class="{ active: activeLink === 'blog' }"
            @click="handleLinkClick('blog')"
          >
            <span class="button__text">博客</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
          </div>
        </RouterLink>
        <RouterLink to="/community/brainstorm/hot">
          <div
            class="source link type--C"
            :class="{ active: activeLink === 'source' }"
            @click="handleLinkClick('source')"
          >
            <span class="button__text">头脑风暴</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
          </div>
        </RouterLink>

        <RouterLink to="/community/notice">
          <div
            class="notice link type--C"
            :class="{ active: activeLink === 'notice' }"
            @click="handleLinkClick('notice')"
          >
            <span class="button__text">公告</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
          </div>
        </RouterLink>
        <RouterLink to="/community/discussion/hot">
          <div
            class="forum link type--C"
            :class="{ active: activeLink === 'forum' }"
            @click="handleLinkClick('forum')"
          >
            <span class="button__text">交流</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
          </div>
        </RouterLink>
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
    <div v-if="hasToken">
      <RouterLink to="/personalCenter/userInfo">
        <div class="personCenter">
          <img :src="avatarSrc || '/public/defaultAvatar.png'" alt="" />
        </div>
      </RouterLink>
    </div>
    <div v-else>
      <div class="login">
        <RouterLink to="/login">
          <Button class="loginBtn" :class="{ 'scrolled-btn': isScrolled }"
            >登录</Button
          >
        </RouterLink>
      </div>
    </div>
  </div>
  <!-- 移动端导航 -->
  <div
    v-show="!isNavConVisible"
    class="newNavCon"
    :class="{ scrolled: newIsScrolled }"
  >
    <div class="newLogo">
      <img src="/src/assets/img/homePage/logo.png" alt="" />
    </div>
    <div class="newBtn" @click="toggleMobileMenu">
      <Icon
        icon="meteor-icons:bars-filter"
        width="35"
        height="35"
        :style="{ color: newIsScrolled ? 'black' : 'white' }"
      />
    </div>
  </div>

  <!-- 全屏菜单 -->
  <div v-if="showMobileMenu" class="mobile-menu-overlay">
    <div class="mobile-menu-header">
      <Button class="close-btn" @click="toggleMobileMenu">
        <Icon class="close" icon="meteor-icons:xmark" width="28" height="28" />
      </Button>
    </div>
    <div class="mobile-menu-content">
      <nav>
        <div
          v-for="(link, index) in [
            { name: 'homePage', to: '/' },
            { name: 'blog', to: '/community/blog/hot' },
            { name: 'source', to: '/community/brainstorm/hot' },
            { name: 'notice', to: '/community/notice' },
            { name: 'forum', to: '/community/discussion/hot' },
            { name: 'about', to: '/about' },
          ]"
          :key="index"
          class="mobile-menu-link"
          :class="{ active: activeLink === link.name }"
          @click="
            () => {
              handleLinkClick(link.name);
              router.push(link.to);
            }
          "
        >
          <span class="mobile-menu-text">
            {{
              link.name === "homePage"
                ? "首页"
                : link.name === "blog"
                  ? "博客"
                  : link.name === "source"
                    ? "头脑风暴"
                    : link.name === "notice"
                      ? "公告"
                      : link.name === "forum"
                        ? "交流"
                        : "关于我们"
            }}
          </span>
        </div>
      </nav>
      <div v-if="!hasToken">
        <RouterLink to="/login">
          <Button class="mobile-login-btn">登录</Button>
        </RouterLink>
      </div>
      <div v-else>
        <RouterLink to="/personalCenter/userInfo">
          <img :src="avatarSrc" alt="" class="mobile-avatar" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 1rem auto;
  display: block;
}
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-menu-header {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  .close {
    width: 25px;
    height: 25px;
  }
}

.mobile-menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.mobile-menu-link {
  width: 100%;
  padding: 19px 0;
  text-align: center;
  font-size: 19px;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #284dd5;
  }

  &.active {
    color: #284dd5;
    font-weight: bold;
  }
}

.mobile-login-btn {
  margin-top: 2rem;
  padding: 15px 20px;
  background-color: #284dd5;
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100px;
  height: 35px;

  &:hover {
    background-color: darken(#284dd5, 10%);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.newNavCon {
  width: 100%;
  height: 70px;
  position: fixed;
  z-index: 999;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  transition: all 0.3s ease;
  &.scrolled {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .newLogo {
    width: 5.4rem;
    height: 4.5rem;
    margin-left: 1rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .newBtn {
    margin-right: 1rem;
  }
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
  .personCenter {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

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
  padding: 10px 22px;
  border-radius: 4px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: #284dd5;
  transition: all 0.2s ease;
}

.loginBtn:active {
  transform: scale(0.96);
}

.loginBtn:before,
.loginBtn:after {
  position: absolute;
  content: "";
  width: 150%;
  left: 50%;
  height: 100%;
  transform: translateX(-50%);
  z-index: -1000;
  background-repeat: no-repeat;
}

.loginBtn:hover:before {
  top: -70%;
  background-image: radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, #284dd5 20%, transparent 30%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #284dd5 15%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%);
  background-size:
    10% 10%,
    20% 20%,
    15% 15%,
    20% 20%,
    18% 18%,
    10% 10%,
    15% 15%,
    10% 10%,
    18% 18%;
  background-position: 50% 120%;
  animation: greentopBubbles 0.6s ease;
}

@keyframes greentopBubbles {
  0% {
    background-position:
      5% 90%,
      10% 90%,
      10% 90%,
      15% 90%,
      25% 90%,
      25% 90%,
      40% 90%,
      55% 90%,
      70% 90%;
  }

  50% {
    background-position:
      0% 80%,
      0% 20%,
      10% 40%,
      20% 0%,
      30% 30%,
      22% 50%,
      50% 50%,
      65% 20%,
      90% 30%;
  }

  100% {
    background-position:
      0% 70%,
      0% 10%,
      10% 30%,
      20% -10%,
      30% 20%,
      22% 40%,
      50% 40%,
      65% 10%,
      90% 20%;
    background-size:
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%;
  }
}

.loginBtn:hover::after {
  bottom: -70%;
  background-image: radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #284dd5 15%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%),
    radial-gradient(circle, #284dd5 20%, transparent 20%);
  background-size:
    15% 15%,
    20% 20%,
    18% 18%,
    20% 20%,
    15% 15%,
    20% 20%,
    18% 18%;
  background-position: 50% 0%;
  animation: greenbottomBubbles 0.6s ease;
}

@keyframes greenbottomBubbles {
  0% {
    background-position:
      10% -10%,
      30% 10%,
      55% -10%,
      70% -10%,
      85% -10%,
      70% -10%,
      70% 0%;
  }

  50% {
    background-position:
      0% 80%,
      20% 80%,
      45% 60%,
      60% 100%,
      75% 70%,
      95% 60%,
      105% 0%;
  }

  100% {
    background-position:
      0% 90%,
      20% 90%,
      45% 70%,
      60% 110%,
      75% 80%,
      95% 70%,
      110% 10%;
    background-size:
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%;
  }
}
@media screen and (max-width: 768px) {
  .navCon {
    display: none;
  }
  .newNavCon {
    opacity: 1;
  }
}
@media screen and (max-width: 960px) {
  .navCon {
    display: none;
  }
  .newNavCon {
    opacity: 1;
  }
}
@media screen and (max-width: 1280px) {
  .navCon {
    &.scrolled {
      height: 95px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .link {
        font-size: 20px;
        color: black !important;
      }
    }

    .logo {
      width: 80px;
      height: 70px;
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
          font-size: 16px;
        }
      }
    }
  }
  .loginBtn {
    width: 80px;
    height: 35px;
    font-size: 16px;
  }
}
@media (min-width: 1281px) and (max-width: 1440px) {
  .navCon {
    &.scrolled {
      height: 95px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .link {
        font-size: 20px;
        color: black !important;
      }
    }

    .logo {
      width: 80px;
      height: 70px;
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
          font-size: 16px;
        }
      }
    }
  }
  .loginBtn {
    width: 80px;
    height: 35px;
    font-size: 16px;
  }
}

@media (min-width: 1441px) {
}
</style>
