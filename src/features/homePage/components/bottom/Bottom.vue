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
          <span>豫ICP备2024075616号 | </span>
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
          <p class="tel">3416177992@qq.com</p>
          <p class="telmy">联系我们:</p>
          <p class="tel">2767073256@qq.com</p>
        </div>
        <div class="telIcon">
          <div class="wetchat">
            <img
              src="../../../../../src/assets/img/homePage/weChat.png"
              alt=""
            />
            <div class="popbox">
              <img
                src="../../../../../src/assets/img/homePage/wecode.jpg"
                alt=""
              />
            </div>
          </div>
          <div class="qq">
            <img src="../../../../../src/assets/img/homePage/QQ.png" alt="" />
            <div class="popboxs">
              <img
                src="../../../../../src/assets/img/homePage/qrcode.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="scss" scoped>
.app-footer {
  height: 350px;
  overflow: hidden;
  width: 100%;
  padding: 20px 10px;
  background-color: #292929;
  .container {
    height: 90%;
    margin: auto;
    display: flex;
    justify-content: center;

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
      // width: 20%;
      flex-direction: column;
      .img {
        display: flex;
        // justify-content: center;
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
      .telIcon {
        width: 158px;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
      }
      .wetchat {
        position: relative;
        width: 30px;
        height: 30px;
        margin-top: 5px;
        margin-right: 35px;
        img {
          width: 100%;
          height: 100%;
        }
        .popbox {
          height: 70px;
          width: 70px;
          position: absolute;
          top: 10px;
          right: 35px;
          opacity: 0;
          visibility: hidden;
          transition-duration: 0.3s;
        }
        &:hover {
          .popbox {
            opacity: 1;
            transform: translateY(10px);
            visibility: visible;
            transition-duration: 0.3s;
          }
        }
      }
      .qq {
        width: 30px;
        height: 30px;
        position: relative;
        margin-top: 5px;
        img {
          width: 100%;
          height: 100%;
        }
        .popboxs {
          height: 70px;
          width: 70px;
          position: absolute;
          top: 10px;
          left: 30px;
          opacity: 0;
          visibility: hidden;
          transition-duration: 0.3s;
        }
        &:hover {
          .popboxs {
            opacity: 1;
            visibility: visible;
            transform: translateY(10px);
            transition-duration: 0.3s;
          }
        }
      }
    }
  }
}

@media (max-width: 360px) {
  .app-footer {
    height: 310px;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 100px;
          height: 100px;
          transform: translateX(0px);
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(-10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            left: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(-10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 361px) and (max-width: 480px) {
  .app-footer {
    height: 310px;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 100px;
          height: 100px;
          transform: translateX(0px);
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(-10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            left: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(-10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .app-footer {
    height: 310px;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 100px;
          height: 100px;
          transform: translateX(0px);
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(-10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            left: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(-10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .app-footer {
    height: 310px;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 100px;
          height: 100px;
          transform: translateX(0px);
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(-10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            left: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(-10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .app-footer {
    height: 310px;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 100px;
          height: 100px;
          transform: translateX(0px);
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(-12px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 7px;
            left: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(-12px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 961px) and (max-width: 1024px) {
  .app-footer {
    .container {
      .containerleft {
        .containertop {
          height: 70%;
          ul {
            li {
              font-size: 13px;
            }
          }
        }
        .containerbottom {
          width: 110%;
          font-size: 13px;
        }
      }
      .containerright {
        .telinfo {
          .tel {
            font-size: 14px;
          }
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 0px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 0px;
            left: 35px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .app-footer {
    .container {
      .containerleft {
        .containertop {
          height: 70%;
        }
        .containerbottom {
          width: 110%;
          font-size: 14px;
        }
      }
      .containerright {
        .telinfo {
          .tel {
            font-size: 14px;
          }
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 0px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 0px;
            left: 35px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}
@media (min-width: 1281px) and (max-width: 1440px) {
  .app-footer {
    .container {
      .containerleft {
        .containertop {
          height: 60%;
          ul {
            li {
              font-size: 14px;
            }
          }
        }
        .containerbottom {
          width: 110%;
          font-size: 14px;
        }
      }
      .containerright {
        .telinfo {
          .tel {
            font-size: 14px;
          }
        }
        .wetchat {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          margin-right: 35px;
          img {
            width: 100%;
            height: 100%;
          }
          .popbox {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 0px;
            right: 40px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popbox {
              opacity: 1;
              transform: translateY(10px);
              visibility: visible;
              transition-duration: 0.3s;
            }
          }
        }
        .qq {
          width: 30px;
          height: 30px;
          position: relative;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
          }
          .popboxs {
            height: 70px;
            width: 70px;
            position: absolute;
            top: 0px;
            left: 35px;
            opacity: 0;
            visibility: hidden;
            transition-duration: 0.3s;
          }
          &:hover {
            .popboxs {
              opacity: 1;
              visibility: visible;
              transform: translateY(10px);
              transition-duration: 0.3s;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 1441px) {
}
</style>
