<script setup lang="ts">
import { defineProps } from "vue";
import svgGlobal from "./svgGlobal.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  researchDirection: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imgSrc: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="content">
    <div class="person">
      <div class="headImg">
        <img :src="props.imgSrc" />
      </div>
      <div class="position">
        <div class="name">{{ props.name }}</div>
        <div class="position-title">
          <span>职位：</span>
          {{ props.position }}
        </div>
      </div>
    </div>
    <div class="teacher-intro">
      <div class="sides">
        <span>主要研究方向：</span>
        {{ props.researchDirection }}
      </div>
      <div class="sendWord">
        <span>导师寄语：</span>
        {{ props.message }}
      </div>
    </div>
    <svgGlobal class="iconGlobal"></svgGlobal>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 26em;
  min-height: 30em;
  border-radius: 10px;
  padding: 2rem;
  background-color: aliceblue;
  background-color: rgba(240, 248, 255, 0.7);
  box-shadow: 0.3rem 0.3rem 0.6rem rgba(40, 77, 213, 0.1);
  transition: transform 0.3s ease;
  .iconGlobal {
    margin: 13px 0 0 auto;
  }
  .person {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    .position {
      width: 13rem;
      .name {
        font-size: 1.2rem;
        font-weight: 600;
        margin-top: 1.6rem;
        margin-bottom: 0.2rem;
      }
      .position-title {
        span {
          font-weight: bold;
        }
        font-size: 0.95rem;
      }
    }
  }
  .headImg {
    width: 6.8rem;
    height: 6.8rem;
    border-radius: 50%;
    margin-right: 2rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .teacher-intro {
    width: 100%;
    height: 150px;
    margin-top: 2rem;
    .sides {
      font-size: 17px;
      line-height: 1.7;
      span {
        font-weight: bold;
        font-size: 18px;
      }
    }
    .sendWord {
      margin-top: 10px;
      font-size: 17px;
      line-height: 1.7;
      span {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
.content:hover {
  transform: scale(1.05);
}

@media (max-width: 360px) {
  .content {
    width: 19em;
    .iconGlobal {
      margin: 20px 0 0 auto;
    }
    .person {
      .position {
        width: 9rem;
        .name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.3rem;
        }
        .position-title {
          span {
            font-size: 0.9rem;
            font-weight: bold;
          }
          font-size: 0.85rem;
        }
      }
    }
    .headImg {
      width: 5.5rem;
      height: 5.5rem;
      object-fit: cover;
      margin-right: 1.3rem;
      border-radius: 50%;
    }
    .teacher-intro {
      width: 100%;
      height: 150px;
      margin-top: 2rem;
      .sides {
        font-size: 15px;
        span {
          font-weight: bold;
          font-size: 17px;
        }
      }
      .sendWord {
        margin-top: 13px;
        font-size: 15px;
        line-height: 1.7;
        span {
          font-size: 17px;
          font-weight: bold;
        }
      }
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .content {
    width: 20em;
    .iconGlobal {
      margin: 20px 0 0 auto;
    }
    .person {
      .position {
        width: 9rem;
        .name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.3rem;
        }
        .position-title {
          span {
            font-size: 0.9rem;
            font-weight: bold;
          }
          font-size: 0.85rem;
        }
      }
    }
    .headImg {
      width: 5.5rem;
      height: 5.5rem;
      object-fit: cover;
      margin-right: 1.3rem;
      border-radius: 50%;
    }
    .teacher-intro {
      width: 100%;
      height: 150px;
      margin-top: 2rem;
      .sides {
        font-size: 15px;
        span {
          font-weight: bold;
          font-size: 17px;
        }
      }
      .sendWord {
        margin-top: 13px;
        font-size: 15px;
        line-height: 1.7;
        span {
          font-size: 17px;
          font-weight: bold;
        }
      }
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
}

@media (min-width: 641px) and (max-width: 768px) {
  .content {
    width: 34em;
    padding: 30px;
    .iconGlobal {
      margin: 30px 0 0 auto;
    }
    .person {
      min-height: 80px;
      .position {
        width: 19rem;
        .name {
          font-size: 1.8rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.3rem;
        }
        .position-title {
          span {
            font-size: 1.5rem;
            font-weight: bold;
          }
          font-size: 1.4rem;
        }
      }
    }
    .headImg {
      width: 7rem;
      height: 7rem;
      object-fit: cover;
      margin-right: 1.3rem;
      border-radius: 50%;
    }
    .teacher-intro {
      width: 100%;
      height: 150px;
      margin-top: 2rem;
      .sides {
        font-size: 15px;
        span {
          font-weight: bold;
          font-size: 17px;
        }
      }
      .sendWord {
        margin-top: 13px;
        font-size: 15px;
        line-height: 1.7;
        span {
          font-size: 17px;
          font-weight: bold;
        }
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .content {
    width: 34em;
    padding: 30px;
    .iconGlobal {
      margin: 30px 0 0 auto;
    }
    .person {
      min-height: 80px;
      .position {
        width: 19rem;
        .name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.3rem;
        }
        .position-title {
          span {
            font-size: 1.2rem;
            font-weight: bold;
          }
          font-size: 1rem;
        }
      }
    }
    .headImg {
      width: 7rem;
      height: 7rem;
      object-fit: cover;
      margin-right: 1.3rem;
      border-radius: 50%;
    }
    .teacher-intro {
      width: 100%;
      height: 150px;
      margin-top: 2rem;
      .sides {
        font-size: 16px;
        span {
          font-weight: bold;
          font-size: 18px;
        }
      }
      .sendWord {
        margin-top: 13px;
        font-size: 16px;
        line-height: 1.7;
        span {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .content {
    width: 36em;
    padding: 30px;
    .iconGlobal {
      margin: 30px 0 0 auto;
    }
    .person {
      min-height: 85px;
      .position {
        width: 19rem;
        .name {
          font-size: 1.9rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.3rem;
        }
        .position-title {
          span {
            font-size: 1.5rem;
            font-weight: bold;
          }
          font-size: 1.4rem;
        }
      }
    }
    .headImg {
      width: 7.8rem;
      height: 7.8rem;
      object-fit: cover;
      margin-right: 2.3rem;
      border-radius: 50%;
    }
    .teacher-intro {
      width: 100%;
      height: 150px;
      margin-top: 2rem;
      .sides {
        font-size: 16px;
        span {
          font-weight: bold;
          font-size: 17px;
        }
      }
      .sendWord {
        margin-top: 13px;
        font-size: 16px;
        line-height: 1.7;
        span {
          font-size: 17px;
          font-weight: bold;
        }
      }
    }
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
}

@media (min-width: 1441px) {
}
</style>
