<script setup lang="ts">
import PersonCard from "./PersonCard.vue";
import teacher2Img from "../../../../assets/img/homePage/teacher2.png";
import teacher1Img from "../../../../assets/img/homePage/teacher1.png";
import { ref, onMounted } from "vue";

const teacherG = {
  name: "高国红",
  position: "副教授，在职博士，现任计算机科学与技术学院院长",
  researchDirection: "云计算与物联网技术",
  message:
    "胜利贵在坚持，要取得胜利就要坚持不懈地努力，饱尝了许多次的失败之后才能成功，即所谓的失败乃成功之母，成功也就是胜利的标志，也可以这样说，坚持就是胜利。",
  imgSrc: teacher2Img,
};

const teacherL = {
  name: "李士勇",
  position: "讲师，硕士",
  researchDirection:
    "《Java面向对象》课程研究、《JSP程序 设计》、基于.NET的智能网络教学系统开发等",
  message:
    "成功的意义不在于你取得多人的成就也不在于你有多么的伟大。因为，成功总会与努力过的人握手，只要享受了努力的过程，我们就不是失败者。",
  imgSrc: teacher1Img,
};

const showCards = ref(false);

onMounted(() => {
  setTimeout(() => {
    showCards.value = true;
  }, 1000);
});
</script>

<template>
  <div class="teacher_con">
    <div class="title">指导老师</div>
    <div class="teachers" :class="{ 'fade-in': showCards }">
      <PersonCard
        class="teacher-G"
        :name="teacherG.name"
        :position="teacherG.position"
        :research-direction="teacherG.researchDirection"
        :message="teacherG.message"
        :img-src="teacherG.imgSrc"
      ></PersonCard>
      <PersonCard
        class="teacher-L"
        :name="teacherL.name"
        :position="teacherL.position"
        :research-direction="teacherL.researchDirection"
        :message="teacherL.message"
        :img-src="teacherL.imgSrc"
      ></PersonCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.teacher_con {
  width: 100%;
  height: 100vh;
  background-image: url(../../../../assets/img/homePage/image3.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #f4f8fb;

  .title {
    width: 100%;
    text-align: center;
    font-size: 1.7em;
    font-weight: bold;
    padding-top: 50px;
    margin-bottom: 70px;
  }

  .teachers {
    width: 100%;
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: translateY(80px);
    transition:
      opacity 0.8s ease-out,
      transform 0.8s ease-out;

    .teacher-G {
      margin-right: 100px;
    }

    &.fade-in {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
@media (max-width: 360px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 50px 0;
    .title {
      margin-bottom: 50px;
    }
    .teachers {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .teacher-G {
        margin: 0 0 40px 0;
      }
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 50px 0;
    .title {
      margin-bottom: 50px;
    }
    .teachers {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .teacher-G {
        margin: 0 0 40px 0;
      }
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 50px 0;
    .title {
      margin-bottom: 50px;
    }
    .teachers {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .teacher-G {
        margin: 0 0 40px 0;
      }
    }
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 50px 0;
    .title {
      margin-bottom: 50px;
    }
    .teachers {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .teacher-G {
        margin: 0 0 40px 0;
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 50px 0;
    .title {
      margin-bottom: 50px;
      font-size: 25px;
    }
    .teachers {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .teacher-G {
        margin: 0 0 40px 0;
      }
    }
  }
}
@media (min-width: 961px) and (max-width: 1024px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 50px 0;
    .title {
      margin-bottom: 50px;
      font-size: 25px;
    }
    .teachers {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .teacher_con {
    width: 100%;
    height: 100%;
    padding: 0 0 70px 0;
    .title {
      margin-bottom: 50px;
      font-size: 30px;
    }
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
}

@media (min-width: 1441px) {
}
</style>
