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
          <img src="../../../../assets/img/homePage/items/prj01.jpg" alt="" />
          <span>项目1</span>
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
          <img src="../../../../assets/img/homePage/items/prj06.png" alt="" />
          <span>项目6</span>
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

    .shell > img {
      width: 200%;
      height: 85%;
      object-fit: cover;
      transition: 0.5s;
      position: relative;
      z-index: 1;
    }

    .shell > span {
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
</style>
