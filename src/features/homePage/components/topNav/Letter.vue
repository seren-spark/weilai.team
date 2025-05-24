<template>
  <div class="titleCon">
    <div id="titles">
      <div class="title" :class="{ 'fade-in': showElements[0] }">
        未来软件工作室
      </div>
      <div class="enTitle" :class="{ 'fade-in': showElements[1] }">
        Future software Studio
      </div>
      <div class="title_person" :class="{ 'fade-in': showElements[2] }">
        做一个有影响力的人
      </div>
      <div class="title_team" :class="{ 'fade-in': showElements[3] }">
        做一个有影响力的团队
      </div>
      <Button class="more" :class="{ 'fade-in': showElements[4] }"
        >了解更多</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { ref, onMounted } from "vue";

// 定义元素数量
const elementCount = 5;
const showElements = ref<boolean[]>(new Array(elementCount).fill(false));
const fadeInDelay = 300;

onMounted(() => {
  for (let i = 0; i < elementCount; i++) {
    setTimeout(
      () => {
        showElements.value[i] = true;
      },
      fadeInDelay * (i + 1),
    );
  }
});
</script>

<style scoped lang="scss">
.titleCon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 6;
  top: 0;
  left: 0;
  pointer-events: none;

  [class^="title"],
  .enTitle,
  .more {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.6s ease-out,
      transform 0.6s ease-out;
  }

  .title {
    color: white;
    font-size: 63px;
    font-weight: bold;
  }

  .enTitle {
    font-size: 34px;
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
    font-size: 22px;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
  }

  .title_team {
    font-size: 22px;
    font-weight: bold;
    color: white;
    margin-bottom: 5rem;
  }

  .more {
    position: relative;
    z-index: 0;
    pointer-events: auto;
    text-transform: uppercase;
    height: 40px;
    width: 180px;
    background-color: #284dd5;
    border: 1px solid rgba(22, 76, 167, 0.6);
    border-radius: 4px;
    padding: 18px 20px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.2px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.02, 0.01, 0.47, 1);
  }

  .more:hover {
    animation: rotate624 0.7s ease-in-out both;
  }

  @keyframes rotate624 {
    0% {
      transform: rotate(0deg) translate3d(0, 0, 0);
    }

    25% {
      transform: rotate(3deg) translate3d(0, 0, 0);
    }

    50% {
      transform: rotate(-3deg) translate3d(0, 0, 0);
    }

    75% {
      transform: rotate(1deg) translate3d(0, 0, 0);
    }

    100% {
      transform: rotate(0deg) translate3d(0, 0, 0);
    }
  }

  @keyframes storm1261 {
    0% {
      transform: translate3d(0, 0, 0) translateZ(0);
    }

    25% {
      transform: translate3d(4px, 0, 0) translateZ(0);
    }

    50% {
      transform: translate3d(-3px, 0, 0) translateZ(0);
    }

    75% {
      transform: translate3d(2px, 0, 0) translateZ(0);
    }

    100% {
      transform: translate3d(0, 0, 0) translateZ(0);
    }
  }
  .more:after {
    background: #fff;
    content: "";
    height: 155px;
    left: -75px;
    opacity: 0.4;
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 50px;
    z-index: -10;
  }

  .more:hover:after {
    left: 120%;
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
  }

  .fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 268px) and (max-width: 360px) {
  #titles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      color: white;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .enTitle {
      font-size: 23px;
      margin-bottom: 20px;
    }
    .title_team {
      font-size: 20px;
      margin-bottom: 35px;
    }
    .title_person {
      font-size: 20px;
    }
    .more {
      width: 160px;
      height: 2.4rem;
      font-size: 14px;
    }
  }
}
@media (min-width: 361px) and (max-width: 480px) {
  #titles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      color: white;
      font-size: 38px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .enTitle {
      font-size: 25px;
      margin-bottom: 20px;
    }
    .title_team {
      margin-bottom: 2em;
    }
    .more {
      width: 160px;
      height: 2.3rem;
      font-size: 15px;
    }
  }
}

@media (min-width: 481px) and (max-width: 539.5px) {
  #titles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      color: white;
      font-size: 44px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .enTitle {
      font-size: 27px;
      margin-bottom: 20px;
    }
    .title_team {
      font-size: 23px;
      margin-bottom: 2.1em;
    }
    .title_person {
      font-size: 23px;
    }
    .more {
      font-size: 17px;
    }
  }
}
@media (min-width: 540px) and (max-width: 768px) {
  #titles {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      color: white;
      font-size: 44px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .enTitle {
      font-size: 27px;
      margin-bottom: 10px;
    }
    .title_team {
      font-size: 23px;
      margin-bottom: 2.1em;
    }
    .title_person {
      font-size: 23px;
    }
    .more {
      font-size: 17px;
    }
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  #titles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      color: white;
      font-size: 47px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .enTitle {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .title_team {
      font-size: 23px;
      margin-bottom: 1.4em;
    }
    .title_person {
      font-size: 23px;
    }
    .more {
      width: 210px;
      height: 35px;
      font-size: 14px;
    }
  }
}
@media (min-width: 961px) and (max-width: 1024px) {
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      font-size: 3.2em;
      margin-bottom: 10px;
    }
    .enTitle {
      font-size: 2.7em;
      margin-bottom: 10px;
    }
    .title_team {
      font-size: 1.8em;
      margin-bottom: 2em;
    }
    .title_person {
      margin-bottom: 8px;
      font-size: 1.8em;
    }
    .more {
      width: 15rem !important;
      height: 3rem;
      font-size: 13px;
    }
  }
}
@media (min-width: 1025px) and (max-width: 1280px) {
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      font-size: 2.7em;
      margin-bottom: 8px;
    }
    .enTitle {
      font-size: 2.7em;
      margin-bottom: 10px;
    }
    .title_team {
      font-size: 1.8em;
      margin-bottom: 1.5em;
    }
    .title_person {
      margin-bottom: 10px;
      font-size: 1.8em;
    }
    .more {
      width: 12rem;
      height: 3rem;
      font-size: 14px;
    }
  }
}
@media (min-width: 1286px) and (max-width: 1440px) {
  .titleCon {
    margin-top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .title {
      font-size: 2.7em;
      margin-bottom: 8px;
    }
    .enTitle {
      font-size: 2.7em;
      margin-bottom: 10px;
    }
    .title_team {
      font-size: 1.8em;
      margin-bottom: 1.5em;
    }
    .title_person {
      margin-bottom: 10px;
      font-size: 1.8em;
    }
    .more {
      width: 12rem;
      height: 3rem;
      font-size: 14px;
    }
  }
}
</style>
