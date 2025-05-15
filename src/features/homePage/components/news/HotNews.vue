<template>
  <div class="news_con">
    <div class="title">热点新闻</div>
    <div class="carousel-container">
      <div class="container" :class="{ 'fade-in': carouselVisible }">
        <div class="buttons" :class="{ 'dark-icons': expandedIndex !== null }">
          <Icon id="prev" icon="meteor-icons:chevron-left" @click="prevSlide" />
          <Icon
            id="next"
            icon="meteor-icons:chevron-right"
            @click="nextSlide"
          />
        </div>
        <div id="slide">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="item"
            :class="{
              active: index === activeIndex,
              expanded: expandedIndex === index,
              hidden: expandedIndex !== null && expandedIndex !== index,
            }"
            @click="toggleExpand(index)"
          >
            <img
              class="item-image"
              :src="item.image"
              alt=""
              :class="{
                'image-expanded': expandedIndex === index,
                'image-normal': expandedIndex !== index,
              }"
            />
            <div
              class="content"
              :class="{
                show: index === activeIndex,
                'content-hidden':
                  expandedIndex !== null && expandedIndex !== index,
              }"
            >
              <div
                class="name"
                :class="{
                  'text-hidden': expandedIndex == index,
                }"
              >
                {{ item.name }}
              </div>
              <div
                class="des"
                :class="{
                  'text-hidden': expandedIndex == index,
                }"
              >
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";

interface CarouselItem {
  image: string;
  name: string;
  description: string;
}

const activeIndex = ref(1);
const expandedIndex = ref<number | null>(null);
const carouselVisible = ref(false);
const items = ref<CarouselItem[]>([
  {
    image: "/src/assets/img/homePage/news/baligou.jpg",
    name: "八里沟游玩",
    description:
      "为了更好凝聚团队和放松身心，未来软件工作室组织前往八里沟游玩。",
  },
  {
    image: "/src/assets/img/homePage/news/kanghong.png",
    name: "抗洪",
    description:
      "在2023年特大洪水期间，未来软件工作室团队积极帮助学校进行抗洪工作。",
  },
  {
    image: "/src/assets/img/homePage/news/nianhui.jpg",
    name: "小组年会",
    description: "2023年小组年会，历届毕业学长学姐回归交流工作经验。",
  },
  {
    image: "/src/assets/img/homePage/news/sports_meet.JPG",
    name: "小组运动会",
    description:
      "为提升小组成员身体健康素质，培养全面发展人才，未来软件工作室组织开展小组运动会。",
  },
  {
    image: "/src/assets/img/homePage/news/zuotanhui.jpeg",
    name: "座谈会",
    description:
      "2024年暑期留校期间邀请往届学长学姐，交流学习，在计科院前合影留念",
  },
]);

const nextSlide = () => {
  const firstItem = items.value.shift();
  if (firstItem) {
    items.value.push(firstItem);
  }
};

const prevSlide = () => {
  const lastItem = items.value.pop();
  if (lastItem) {
    items.value.unshift(lastItem);
  }
};

const toggleExpand = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

onMounted(() => {
  // 延迟显示轮播组件，实现淡入效果
  setTimeout(() => {
    carouselVisible.value = true;
  }, 600);
});
</script>

<style scoped lang="scss">
.news_con {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f4f8fb;
  .carousel-container {
    width: 100%;
    height: 600px;
  }

  .title {
    width: 100%;
    text-align: center;
    font-size: 1.7em;
    margin-bottom: 30px;
    font-weight: bold;
    padding-top: 50px;
  }

  .container {
    width: 900px;
    height: 600px;
    background-color: #f5f5f5;
    box-shadow: 0 30px 50px #b7b7b7;
    opacity: 0;
    transform: translateY(50px);
    transition:
      opacity 0.8s ease-out,
      transform 0.8s ease-out;
    &.fade-in {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .item {
    width: 180px;
    height: 200px;
    display: inline-block;
    position: absolute;
    z-index: 1;
    top: 50%;
    transform-origin: center center;
    transform: translate(0, -50%);
    border-radius: 10px;
    box-shadow: 0 6px 14px #505050;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, width, height;
    cursor: pointer;

    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .image-normal {
      transform: scale(1);
    }

    &:nth-child(1),
    &:nth-child(2) {
      left: 0;
      top: 0;
      transform: translate(0, 0);
      border-radius: 0;
      width: 100%;
      height: 100%;
      box-shadow: none;

      .item-image {
        width: 100%;
        height: 100%;
      }
    }

    &:nth-child(3) {
      left: 67.5%;
    }

    &:nth-child(4) {
      left: calc(67.5% + 200px);
    }

    &:nth-child(5) {
      left: calc(67.5% + 400px);
    }

    &:nth-child(n + 6) {
      left: calc(67.5% + 640px);
      opacity: 0;
    }

    &.expanded {
      width: 80%;
      height: 80%;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 100;

      .item-image {
        transform: scale(1);
      }
    }

    &.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 100px;
      width: 300px;
      text-align: left;
      padding: 0;
      color: #eee;
      transform: translate(0, -50%);
      display: none;
      font-family: system-ui;
      z-index: 10;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);

      .text-hidden {
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        transition: all 0.3s ease !important;
      }

      &.show {
        display: block;
        z-index: 11111;
      }

      .name {
        font-size: 40px;
        font-weight: bold;
        opacity: 0;
        animation: showcontent 1s ease-in-out 1 forwards;
      }

      .des {
        margin: 20px 0;
        opacity: 0;
        animation: showcontent 1s ease-in-out 0.3s 1 forwards;
      }
    }
  }

  @keyframes showcontent {
    from {
      opacity: 0;
      transform: translate(0, 100px);
      filter: blur(33px);
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
      filter: blur(0);
    }
  }

  .buttons {
    position: absolute;
    bottom: 20px;
    width: 870px;
    z-index: 222222;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;

    #prev,
    #next {
      width: 28px;
      height: 28px;
      margin-right: 30px;
      cursor: pointer;
      color: white;
      transition: color 0.3s ease;
    }
    &.dark-icons {
      #prev,
      #next {
        color: black;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
      }
    }
  }
}

@media (max-width: 360px) {
  .news_con {
    height: 500px;
    .container {
      width: 90%;
      height: 300px;
      .item {
        &:nth-child(3) {
          left: 67.5%;
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 20px;
        }
        .des {
          text-align: center;
        }
        .content {
          top: 30%;
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 14px;
          align-items: center;
          left: 0;
        }
      }
    }
    .buttons {
      width: 95%;
      bottom: 8px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .news_con {
    height: 510px;
    .container {
      width: 90%;
      height: 300px;
      .item {
        &:nth-child(3) {
          left: 67.5%;
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 20px;
        }
        .des {
          text-align: center;
          padding: 0 10px;
        }
        .content {
          top: 30%;
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 14px;
          align-items: center;
          left: 0;
        }
      }
    }
    .buttons {
      width: 95%;
      bottom: 8px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .news_con {
    height: 560px;
    .container {
      width: 90%;
      height: 350px;
      .item {
        &:nth-child(3) {
          left: 67.5%;
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 21px;
        }
        .des {
          text-align: center;
          padding: 0 10px;
        }
        .content {
          top: 30%;
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 15px;
          align-items: center;
          left: 0;
        }
      }
    }
    .buttons {
      width: 95%;
      bottom: 8px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .news_con {
    height: 580px;
    .container {
      width: 90%;
      height: 370px;
      .item {
        &:nth-child(3) {
          left: 67.5%;
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 21px;
        }
        .des {
          text-align: center;
          padding: 0 10px;
        }
        .content {
          top: 30%;
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 15px;
          align-items: center;
          left: 0;
        }
      }
    }
    .buttons {
      width: 95%;
      bottom: 8px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .news_con {
    height: 610px;
    .container {
      width: 90%;
      height: 400px;
      .item {
        &:nth-child(3) {
          left: 67.5%;
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 23px;
        }
        .des {
          text-align: center;
          padding: 0 10px;
        }
        .content {
          top: 30%;
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 17px;
          align-items: center;
          left: 0;
        }
      }
    }
    .buttons {
      width: 95%;
      bottom: 10px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 22px;
        height: 22px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 961px) and (max-width: 1024px) {
  .news_con {
    height: 700px;
    .title {
      font-size: 26px;
    }
    .container {
      width: 80%;
      height: 500px;

      .item {
        &:nth-child(3) {
          left: 87.5%;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 25px;
        }
        .des {
          font-size: 17px;
        }
      }
    }
    .buttons {
      width: 100%;
      bottom: 15px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 25px;
        height: 25px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .news_con {
    height: 700px;
    .title {
      font-size: 26px;
    }
    .container {
      width: 80%;
      height: 500px;
      .item {
        &:nth-child(3) {
          left: 87.5%;
        }

        &:nth-child(4) {
          left: calc(67.5% + 200px);
          opacity: 0;
          pointer-events: none;
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 25px;
        }
        .des {
          font-size: 17px;
        }
      }
    }
    .buttons {
      width: 100%;
      bottom: 15px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 25px;
        height: 25px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
  .news_con {
    height: 800px;
    .title {
      font-size: 26px;
    }
    .container {
      width: 80%;
      height: 600px;
      .item {
        &:nth-child(3) {
          left: 73.5%;
        }

        &:nth-child(4) {
          left: calc(73.5% + 200px);
        }

        &:nth-child(5) {
          left: calc(67.5% + 400px);
          opacity: 0;
          pointer-events: none;
        }
        .name {
          font-size: 25px;
        }
        .des {
          font-size: 17px;
        }
      }
    }
    .buttons {
      width: 100%;
      bottom: 15px;
      #prev {
        margin-right: 40px;
      }
      #prev,
      #next {
        width: 25px;
        height: 25px;
        cursor: pointer;
        color: white;
        transition: color 0.3s ease;
      }
      &.dark-icons {
        #prev,
        #next {
          color: black;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        }
      }
    }
  }
}

@media (min-width: 1441px) {
  .news_con {
    height: 800px;
    .title {
      margin-bottom: 40px;
      padding-top: 50px;
    }
    .carousel-container {
      width: 100%;
      height: 600px;
    }
  }
}
</style>
