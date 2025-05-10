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
              <div class="learnAll" @click="handleLearnAll(index)">
                {{ expandedIndex === index ? "Show back" : "See All" }}
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

const handleLearnAll = (index: number) => {
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

  #slide {
    width: max-content;
    margin-top: 50px;
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
    border-radius: 20px;
    box-shadow: 0 6px 14px #505050;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, width, height;

    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .image-normal {
      transform: scale(1);
    }

    // .image-expanded {
    //   transform: scale(1);
    // }

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
      left: 55%;
    }

    &:nth-child(4) {
      left: calc(55% + 200px);
    }

    &:nth-child(5) {
      left: calc(55% + 400px);
    }

    &:nth-child(n + 6) {
      left: calc(55% + 640px);
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

      .learnAll {
        position: relative;
        z-index: 10;
        padding: 10px 20px;
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        animation: showcontent 1s ease-in-out 0.6s 1 forwards;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
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
</style>
