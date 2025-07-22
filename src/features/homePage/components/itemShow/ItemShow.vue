<script setup lang="ts">
// 在这里编写组件逻辑
</script>

<template>
  <div class="itemShow">
    <div class="background-overlay"></div>
    <div class="content-wrapper">
      <div class="titles">项目展示</div>
      <div class="items">
        <div class="shell">
          <img src="../../../../assets/img/homePage/items/prj01.png" alt="" />
          <span>温心网</span>
        </div>
        <div class="shell">
          <img src="../../../../assets/img/homePage/items/prj02.png" alt="" />
          <span>论坛</span>
        </div>
        <div class="shell">
          <img src="../../../../assets/img/homePage/items/prj03.png" alt="" />
          <span>v视界</span>
        </div>
        <div class="shell">
          <img src="../../../../assets/img/homePage/items/prj04.jpg" alt="" />
          <span>食谱网</span>
        </div>
        <div class="shell">
          <img src="../../../../assets/img/homePage/items/prj05.png" alt="" />
          <span>小说网</span>
        </div>
        <div class="shell">
          <img src="../../../../assets/img/homePage/items/prj07.png" alt="" />
          <span>双选系统</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.itemShow {
  width: 100%;
  height: 700px;
  position: relative;
  background-image: url(../../../../assets/img/homePage/heardone.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
    height: 100%;
  }

  .titles {
    width: 100%;
    text-align: center;
    font-size: 1.7em;
    font-weight: bold;
    padding-top: 50px;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .items {
    width: 100%;
    height: 450px;
    margin-top: 50px;
    display: flex;

    .shell {
      flex: 1;
      overflow: hidden;
      transition: 0.5s;
      margin: 0 20px;
      box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
      border-radius: 20px;
      border: 7px solid #f4f8fb;
      background-color: #d0e2f6;
      position: relative;
      &:hover::before {
        opacity: 1;
      }
    }

    .shell img {
      width: 200%;
      height: 85%;
      object-fit: cover;
      transition: 0.5s;
      position: relative;
      z-index: 1;
    }

    .shell span {
      text-align: center;
      height: 15%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 1.2em;
    }

    .shell:hover {
      flex-basis: 40%;
      transform: translateY(-10px);
    }

    .shell:hover img {
      width: 100%;
      height: 100%;
    }
  }
}

@media (max-width: 360px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .items {
      height: auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      .shell {
        height: 160px;
        margin: 0 0 20px 0;
        width: 94%;
        pointer-events: none;
      }
      .shell img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        position: relative;
        z-index: 1;
      }

      .shell span {
        text-align: center;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        border-top: 2px solid #2cc4d0;
        background-color: white;
      }
      .shell::before {
        content: "";
        z-index: 10;
        position: absolute;
        left: -100%;
        top: -100%;
        width: 100%;
        height: calc(100% - 50px);
        background-color: rgba(0, 0, 0, 0.4);
        transition: all 0.5s ease-in;
        border-radius: 4px;
      }
      .shell:hover ::before {
        pointer-events: auto;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .items {
      height: auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      .shell {
        margin: 0 0 20px 0;
        width: 90%;
        pointer-events: none;
      }
      .shell img {
        width: 100%;
        height: 230px;
        object-fit: cover;
        position: relative;
        z-index: 1;
      }

      .shell span {
        text-align: center;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        border-top: 2px solid #2cc4d0;
        background-color: white;
      }
      .shell::before {
        content: "";
        z-index: 10;
        position: absolute;
        left: -100%;
        top: -100%;
        width: 100%;
        height: calc(100% - 50px);
        background-color: rgba(0, 0, 0, 0.4);
        transition: all 0.5s ease-in;
        border-radius: 4px;
      }
      .shell:hover ::before {
        pointer-events: auto;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .items {
      height: auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      .shell {
        height: 280px;
        margin: 0 0 20px 0;
        width: 94%;
        pointer-events: none;
      }
      .shell img {
        width: 100%;
        height: 280px;
        object-fit: cover;
        position: relative;
        z-index: 1;
      }

      .shell span {
        text-align: center;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        border-top: 2px solid #2cc4d0;
        background-color: white;
      }
      .shell::before {
        content: "";
        z-index: 10;
        position: absolute;
        left: -100%;
        top: -100%;
        width: 100%;
        height: calc(100% - 50px);
        background-color: rgba(0, 0, 0, 0.4);
        transition: all 0.5s ease-in;
        border-radius: 4px;
      }
      .shell:hover ::before {
        pointer-events: auto;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .items {
      height: auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      .shell {
        height: 300px;
        margin: 0 0 20px 0;
        width: 94%;
        pointer-events: none;
      }
      .shell img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        position: relative;
        z-index: 1;
      }

      .shell span {
        text-align: center;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        border-top: 2px solid #2cc4d0;
        background-color: white;
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .titles {
      font-size: 25px;
    }
    .items {
      height: auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      .shell {
        height: 300px;
        margin: 0 0 20px 0;
        width: 90%;
        pointer-events: none;
      }
      .shell img {
        width: 100%;
        height: 380px;
        object-fit: cover;
        position: relative;
        z-index: 1;
      }

      .shell span {
        text-align: center;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        border-top: 2px solid #2cc4d0;
        background-color: white;
      }
    }
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .titles {
      font-size: 25px;
    }
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
  .itemShow {
    height: auto;
    padding-bottom: 50px;
    .titles {
      font-size: 25px;
    }
  }
}

@media (min-width: 1441px) {
}
</style>
