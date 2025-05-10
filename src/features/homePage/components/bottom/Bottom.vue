<template>
  <div class="app-footer">
    <div class="container">
      <div class="containerleft">
        <div class="containertop">
          <ul>
            <h6>小组荣誉</h6>
            <li>蓝桥杯获奖</li>
            <li>ACM算法竞赛</li>
            <li>国家级大学生创新创业项目</li>
          </ul>
          <ul>
            <h6>小组网盘</h6>
            <li>上传文件</li>

            <li>文件社区</li>

            <li>我的收藏</li>

            <li>我的文件</li>
          </ul>
          <ul>
            <h6>文档服务</h6>
            <li>小组文档</li>
            <li>学习资料</li>
            <li>软件资源</li>
          </ul>
          <ul>
            <h6>公告</h6>
            <li>讲课公告</li>
          </ul>
        </div>
        <div class="containerbottom">
          <span>2025 @ weilai.com 版权所有 | </span>
          <span> 增值电信业务经营许可证：豫B2-20160169 | </span>
          <span>豫ICP备14002653号 | </span>
          <span>
            <!-- <img src="/images/beian.0c57706.png" height="80%" alt="" /> -->
            豫公网安备 35020302033941号
          </span>
        </div>
      </div>
      <div class="containerright">
        <div class="img">
          <img
            src="../../../../../src/assets/img/homePage/logoFooter.png"
            height="100%"
            alt=""
          />
        </div>
        <div class="telinfo">
          <p class="telmy">联系我们:</p>
          <p class="tel">1090649095@qq.com</p>
          <p class="telmy">联系我们:</p>
          <p class="tel">1090649095@qq.com</p>
        </div>
        <div class="wetchat">
          <img src="../../../../../src/assets/img/homePage/weChat.png" alt="" />
          <div class="popbox">
            <!-- <img src="/images/123213213.jpg" alt="" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="scss" scoped>
@media screen and (max-width: 998px) {
  .app-footer {
    .container {
      height: 100%;
      margin: auto;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      .containerleft {
        display: none !important;
      }
      .containerright {
        width: 100% !important;
        text-align: center;
      }
    }
  }
}
.app-footer {
  height: 40vh;
  overflow: hidden;
  width: 100%;
  padding: 20px 10px;
  background-color: #292929;
  .container {
    height: 90%;
    margin: auto;
    display: flex;

    .containerleft {
      width: 80%;
      display: flex;
      flex-direction: column;
      .containertop {
        padding: 10px;
        margin-bottom: 80px;
        height: 80%;
        display: flex;
        flex-direction: row;
        width: 100%;

        ul {
          color: hsla(0, 0%, 100%, 0.66);
          font-size: 14px;
          line-height: 1.5;
          list-style: none;
          padding: 20px;
          flex: 1;
          height: 100%;
          padding-inline: 10px;
          li {
            color: hsla(0, 0%, 100%, 0.66);
            flex: 1;
            font-size: 14px;
            line-height: 1.8;
            list-style: none;

            cursor: pointer;
            &:hover {
              color: white;
            }
          }
          h6 {
            color: #fff;

            font-size: 15px;
            font-weight: 700;
            line-height: 0.24rem;
            margin-bottom: 20px;
            white-space: nowrap;
          }
        }
      }
      .containerbottom {
        color: white;
        width: 90%;
        display: flex;
        height: 20%;
        font-size: 16px;
        padding-top: 0.13rem;
        span {
          position: relative;
          align-items: center;
          display: flex;
          height: 0.24rem;
          padding-right: 0.3rem;
          position: relative;
          flex-direction: row;
        }
        // span:before {
        //   content: "";
        //   height: 0.12rem;
        //   position: absolute;
        //   background-color: rgb(204, 204, 204);
        //   right: 0.15rem;
        //   top: 7px;
        //   width: 1px;
        // }
      }
    }
    .containerright {
      display: flex;
      padding-inline: 0.3rem;
      width: 20%;
      flex-direction: column;
      .img {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 40%;
        transform: translateX(24px);
      }
      .telinfo {
        width: 100%;
        color: white;
        .telmy {
          font-size: 15px;
          margin-bottom: 0.1rem;
          cursor: pointer;
        }
        .tel {
          color: rgb(8, 85, 249);
          margin-bottom: 0.1rem;
          cursor: pointer;
        }
      }
      .wetchat {
        width: 30px;
        height: 30px;
        margin-top: 5px;
        img {
          width: 100%;
          height: 100%;
        }
        .popbox {
          height: 2rem;
          width: 2rem;
          position: absolute;
          top: -2.2rem;
          opacity: 0;
          visibility: hidden;
          transition-duration: 0.3s;
        }
        &:hover {
          .popbox {
            opacity: 1;
            visibility: visible;
            transition-duration: 0.3s;
          }
        }
      }
    }
  }
}
</style>
