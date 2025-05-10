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
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 6;
  top: 0;
  left: 0;
  margin-top: 15rem;
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
    pointer-events: auto;
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
      font-size: 35px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .enTitle {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .title_team {
      margin-bottom: 2em;
    }
    .more {
      width: 160px;
      height: 2.4rem;
      font-size: 16px;
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
      // margin-bottom: 3.1em;
    }
    .title_person {
      font-size: 23px;
    }
    .more {
      font-size: 17px;
    }
  }
}
@media (min-width: 540px) and (max-width: 767px) {
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
      // margin-bottom: 3.1em;
    }
    .title_person {
      font-size: 23px;
    }
    .more {
      font-size: 17px;
    }
  }
}
@media screen and (width: 768px) {
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
      font-size: 5rem;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .enTitle {
      font-size: 3.2em;
      margin-bottom: 20px;
    }
    .title_team {
      font-size: 2em;
      // margin-bottom: 3.1em;
    }
    .title_person {
      font-size: 2em;
    }
    .more {
      width: 15rem;
      height: 3.8rem;
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
      font-size: 80px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .enTitle {
      font-size: 50px;
      margin-bottom: 20px;
    }
    .title_team {
      font-size: 35px;
      // margin-bottom: 3.1em;
    }
    .title_person {
      font-size: 35px;
    }
    .more {
      width: 210px;
      height: 55px;
      font-size: 20px;
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
      font-size: 4em;
      margin-bottom: 10px;
    }
    .enTitle {
      font-size: 3.5em;
      margin-bottom: 15px;
    }
    .title_team {
      font-size: 2.4em;
      margin-bottom: 2.3em;
    }
    .title_person {
      margin-bottom: 15px;
      font-size: 2.4em;
    }
    .more {
      width: 15rem;
      height: 4rem;
      font-size: 14px;
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
      font-size: 3.9em;
      margin-bottom: 10px;
    }
    .enTitle {
      font-size: 3.4em;
      margin-bottom: 15px;
    }
    .title_team {
      font-size: 2.3em;
      margin-bottom: 2.3em;
    }
    .title_person {
      margin-bottom: 15px;
      font-size: 2.3em;
    }
    .more {
      width: 15rem;
      height: 4rem;
      font-size: 16px;
    }
  }
}
</style>
