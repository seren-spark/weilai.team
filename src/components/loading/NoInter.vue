<script setup>
function goBack() {
  window.history.back();
}
</script>
<template>
  <div class="NoInternet">
    <div class="noInter-center">
      <!-- <WifiOff :size="200" color="#999"/> -->
      <img src="/src/assets/img/noInter.png" alt="" />
      <div class="noInter-left">
        <h1>Sorry~</h1>
        <p class="text-center">网页走丢了，请稍后重试</p>
        <button @click="goBack">返回</button>
        <!-- <Button></Button> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.NoInternet {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #e5e5e5;

  .noInter-center {
    // width: 80%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;

    .noInter-left {
      // width: 50%;;

      h1 {
        // font-family:'STXinwei';
        font-family: "Courier New", Courier, monospace;
        font-size: 80px;
        // font-family: 'STXingkai';
        // font-family: 'Arial';
      }

      p {
        margin-top: 20px;
        font-size: 25px;
        font-family: "KaiTi", Tahoma, Geneva, Verdana, sans-serif;
      }
    }

    button {
      margin-top: 30px;
      width: 150px;
      height: 40px;
      border-radius: 20px;
      background-color: #7a97f4;
      color: white;
      font-size: 18px;
      // border: 1.5px solid #f6f6f6;
      border: none;

      &:hover {
        background-color: #8ba3f4;
        // color: #fff;
      }

      &:active {
        background-color: #6b8df4;
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .NoInternet {
    min-height: 100vh;
    height: 100%;
    padding-bottom: 100px;

    .noInter-center {
      flex-direction: column;

      .noInter-left {
        display: flex;
        flex-direction: column;
        align-items: center;

        h1 {
          font-size: 50px;
        }

        p {
          font-size: 20px;
        }
      }

      img {
        width: 90%;
      }
    }
  }
}
</style>
