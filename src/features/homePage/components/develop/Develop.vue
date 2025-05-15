<template>
  <div class="main">
    <div class="title">历史回顾</div>
    <Icon
      v-show="canScrollUp"
      id="up-btn"
      icon="meteor-icons:angles-up"
      class="icon-arrow up-animation"
      @click="slideToPrev"
    />
    <Icon
      v-show="canScrollDown"
      id="down-btn"
      icon="meteor-icons:angles-down"
      class="icon-arrow down-animation"
      @click="slideToNext"
    />

    <div id="content">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card"
        :style="{ transform: `translateY(${offset * 100}%)` }"
      >
        <div class="card-title">{{ card.title }}</div>
        <div class="card-passage">
          <br />
          {{ card.contentChinese }}
          <br /><br />
          {{ card.contentEnglish }}
        </div>
      </div>
    </div>

    <div id="clock">
      <div
        id="clock-table"
        :style="{ transform: `rotate(${currentClockRotation}deg)` }"
      >
        <div
          v-for="(scale, index) in clockScales"
          :key="index"
          class="invisible-table"
          :style="{ transform: `rotate(${scale.degree}deg)` }"
        >
          <div :class="scale.isThick ? 'clock-thick' : 'clock-scale'">
            <span v-if="scale.isThick">{{ scale.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";

type Card = {
  year: string;
  title: string;
  contentChinese: string;
  contentEnglish: string;
};

type ClockScale = {
  degree: number;
  isThick: boolean;
  year?: number;
};

const cardsData: Card[] = [
  {
    year: "2011",
    title: "2011.06",
    contentChinese: "2011年6月成立嵌入式小组",
    contentEnglish: "2011 content description...",
  },
  {
    year: "2012",
    title: "2012年",
    contentChinese: "2012年成立未来软件工作室",
    contentEnglish: "2012 content description...",
  },
  {
    year: "2015",
    title: "2015年",
    contentChinese: "2015年成立河南艾维特网络科技有限公司",
    contentEnglish: "2015 content description...",
  },
  {
    year: "2017",
    title: "2017年",
    contentChinese: "2017年成立新乡市惠农软件技术有限公司",
    contentEnglish: "2017 content description...",
  },
  {
    year: "2023.06",
    title: "2023年",
    contentChinese:
      "截至2023年共50多名毕业生，大多在今日头条，京东、腾讯等知名企业工作，就业率达100%，集中在北京上海等一线城市。",
    contentEnglish: "2023 content description...",
  },
  {
    year: "2024",
    title: "2024年",
    contentChinese: "2024年的内容描述...",
    contentEnglish: "2024 content description...",
  },
  {
    year: "2025",
    title: "2025年",
    contentChinese: "2025年的内容描述...",
    contentEnglish: "2025 content description...",
  },
];

export default {
  name: "HistoryTimeline",
  components: { Icon },
  setup() {
    const offset = ref(0);
    const clockScales = ref<ClockScale[]>([]);
    const maxOffset = 0;
    const minOffset = -6;

    // 年份数组
    const years = [2011, 2012, 2015, 2017, 2023, 2024, 2025];

    // 定义每个年份相对于2011年的小格数（每小格6度）
    const yearStepsFrom2011: Record<number, number> = {
      2011: 0,
      2012: 3,
      2015: 12,
      2017: 18,
      2023: 36,
      2024: 39,
      2025: 42,
    };

    // 计算每个年份在时钟上的角度位置（正西方为0度，顺时针增加）
    const yearAngles = computed(() => {
      const angles: Record<number, number> = {};

      Object.entries(yearStepsFrom2011).forEach(([year, steps]) => {
        angles[parseInt(year)] = steps * 6; // 每小格6度
      });

      return angles;
    });

    // 当前时钟旋转角度（使当前年份指向左侧正中间）
    const currentClockRotation = computed(() => {
      const currentIndex = Math.abs(offset.value);
      const currentYear = years[currentIndex];
      // 左侧正中间是180度，当前年份的角度是顺时针从正西方计算
      // 所以旋转角度 = 180 - 当前年份角度
      return 180 - yearAngles.value[currentYear];
    });

    // 控制箭头显示的计算属性
    const canScrollUp = computed(() => offset.value < maxOffset);
    const canScrollDown = computed(() => offset.value > minOffset);

    // 生成时钟刻度
    const generateClockScales = () => {
      const scales: ClockScale[] = [];

      // 生成所有刻度线（0到360度范围）
      for (let i = 0; i < 360; i += 6) {
        // 检查是否是年份刻度
        const year = years.find((y) => Math.abs(i - yearAngles.value[y]) < 3);

        scales.push({
          degree: i,
          isThick: !!year,
          year: year,
        });
      }

      clockScales.value = scales;
    };

    const slideToPrev = () => {
      if (offset.value < maxOffset) {
        offset.value = offset.value + 1;
      }
    };

    const slideToNext = () => {
      if (offset.value > minOffset) {
        offset.value = offset.value - 1;
      }
    };

    onMounted(() => {
      generateClockScales();
    });

    return {
      cards: cardsData,
      clockScales,
      offset,
      currentClockRotation,
      slideToPrev,
      slideToNext,
      canScrollUp,
      canScrollDown,
    };
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.main {
  width: 100vw;
  height: 750px;
  display: flex;
  position: relative;
  background-color: #66b9bf;
  overflow: hidden;
  .title {
    width: 100%;
    text-align: center;
    font-size: 1.8em;
    font-weight: bold;
    padding-top: 50px;
    color: white;
  }
}

.icon-arrow {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 27%;
  z-index: 9;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

/* 上箭头动画 */
.up-animation {
  animation: floatUp 2s infinite ease-in-out;
  &:hover {
    transform: translateY(-5px) scale(1.1);
  }
  &:active {
    transform: translateY(0) scale(0.95);
  }
}

/* 下箭头动画 */
.down-animation {
  animation: floatDown 2s infinite ease-in-out;
  &:hover {
    transform: translateY(5px) scale(1.1);
  }
  &:active {
    transform: translateY(0) scale(0.95);
  }
}

/* 上浮动动画 */
@keyframes floatUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 下浮动动画 */
@keyframes floatDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

#up-btn {
  top: 13%;
}

#down-btn {
  bottom: 13%;
}

#content {
  width: 30%;
  height: 100%;
  position: absolute;
  left: 15%;
  overflow: hidden;
}

.card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  transition: transform 0.8s ease-in-out;

  .card-time {
    font-size: 40px;
    font-weight: 700;
  }

  .card-title {
    font-size: 50px;
    font-weight: 500;
    border-bottom: 1px solid white;
  }

  .card-passage {
    font-size: 24px;
    font-weight: 300;
  }
}

#clock {
  height: 130%;
  aspect-ratio: 1 / 1;
  position: absolute;
  right: -28%;
  top: -14%;
  border-radius: 50%;
  background-color: white;
  border: #9267a9 30px solid;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 调整表盘内容位置 */
#clock-table {
  width: 96%;
  height: 96%;
  position: relative;
  transform-origin: center center;
  transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.invisible-table {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform-origin: 50% 50%;
  position: absolute;
}

.clock-thick {
  width: 6%;
  height: 6px;
  background-color: #5b5da9;
  position: absolute;
  top: calc(50% - 3px);
  left: 0px;

  span {
    font-size: 50px;
    position: absolute;
    left: 140%;
    top: calc(50% - 30px);
    color: #5b5da9;
  }
}

.clock-scale {
  width: 4%;
  height: 2px;
  background-color: #5b5da9;
  position: absolute;
  top: calc(50% - 0.5px);
  left: 0px;
}

@media (max-width: 1000px) {
  #clock {
    right: -90%;
  }
}

@media (max-width: 360px) {
  .main {
    #clock {
      display: none;
    }
    #content {
      width: 90%;
      left: 5%;
    }
    .card-title {
      font-size: 40px;
      text-align: center;
    }
    .card-passage {
      font-size: 20px;
      text-align: center;
    }
    .icon-arrow {
      left: 45%;
    }

    #up-btn {
      top: 20%;
    }

    #down-btn {
      bottom: 20%;
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .main {
    #clock {
      display: none;
    }
    #content {
      width: 90%;
      left: 5%;
    }
    .card-title {
      font-size: 40px;
      text-align: center;
    }
    .card-passage {
      font-size: 20px;
      text-align: center;
    }
    .icon-arrow {
      left: 45%;
    }

    #up-btn {
      top: 20%;
    }

    #down-btn {
      bottom: 20%;
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .main {
    #clock {
      display: none;
    }
    #content {
      width: 90%;
      left: 5%;
    }
    .card-title {
      font-size: 40px;
      padding-bottom: 10px;
      text-align: center;
    }
    .card-passage {
      font-size: 20px;
      text-align: center;
    }
    .icon-arrow {
      left: 45%;
    }

    #up-btn {
      top: 20%;
    }

    #down-btn {
      bottom: 20%;
    }
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .main {
    #clock {
      display: none;
    }
    #content {
      width: 90%;
      left: 5%;
    }
    .card-title {
      font-size: 42px;
      padding-bottom: 10px;
      text-align: center;
    }
    .card-passage {
      font-size: 21px;
      text-align: center;
    }
    .icon-arrow {
      left: 45%;
    }

    #up-btn {
      top: 20%;
    }

    #down-btn {
      bottom: 20%;
    }
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .main {
    .title {
      font-size: 28px;
    }
    .card-title {
      font-size: 40px;
      padding-bottom: 10px;
    }
    .card-passage {
      font-size: 20px;
    }
  }
}

@media (min-width: 961px) and (max-width: 1024px) {
  .main {
    #clock {
      right: -62%;
    }
    .title {
      font-size: 27px;
    }
    .card-title {
      font-size: 45px;
      padding-bottom: 10px;
    }
    .card-passage {
      font-size: 21px;
    }
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .main {
    #clock {
      right: -47%;
    }
    .title {
      font-size: 27px;
    }
    .card-title {
      font-size: 45px;
      padding-bottom: 10px;
    }
    .card-passage {
      font-size: 21px;
    }
  }
}
@media (min-width: 1281px) and (max-width: 1440px) {
  .main {
    #clock {
      right: -37%;
    }
    .title {
      font-size: 27px;
    }
    .card-title {
      font-size: 45px;
      padding-bottom: 10px;
    }
    .card-passage {
      font-size: 21px;
    }
  }
}

@media (min-width: 1441px) {
}
</style>
