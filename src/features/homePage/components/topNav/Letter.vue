<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
</script>

<template>
  <div class="titleCon">
    <div>
      <div class="title">未来软件工作室</div>
      <div class="enTitle">Future software Studio</div>
      <div class="title_person">做一个有影响力的人</div>
      <div class="title_team">做一个有影响力的团队</div>
      <Button class="more">了解更多</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.titleCon {
  width: 70%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  margin-top: 15rem;
  .title {
    color: white;
    font-size: 63px;
    font-weight: bold;
  }
  .enTitle {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #74b0ce, #60d9c9, #868dd2, #aa00ff);
    background-clip: text;
    background-size: 150%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: color-change 4s linear infinite;
  }
  @keyframes color-change {
    0% {
      background-position: 0;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
  .title_person {
    font-size: 20px;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
  }
  .title_team {
    font-size: 20px;
    font-weight: bold;
    color: white;
    margin-bottom: 5rem;
  }
  .more {
    width: 12.5rem;
    height: 3rem;
    font-size: 1.2rem;
    color: white;
    font-weight: bold;
    color: #284dd5;
    border: 0.16rem solid #284dd5;
    background-color: transparent;
    position: relative;
    z-index: 1;
    transition: 2s;
    overflow: hidden;
  }
  .more::before,
  .more::after {
    content: "";
    position: absolute;
    top: -1.2rem;
    z-index: -1;
    width: 170%;
    aspect-ratio: 1;
    border: none;
    border-radius: 40%;
    background-color: rgba(0, 0, 255, 0.25);
    transition: 2s;
  }
  .more::before {
    left: -60%;
    transform: translate3d(0, 6em, 0) rotate(-340deg);
  }
  .more::after {
    right: -60%;
    transform: translate3d(0, 6em, 0) rotate(390deg);
  }
  .more:hover,
  .more:focus {
    color: white;
  }
  .more:hover::before,
  .more:hover::after,
  .more:focus::before,
  .more:focus::after {
    transform: none;
    background-color: rgba(0, 0, 255, 0.75);
  }
}
</style>
