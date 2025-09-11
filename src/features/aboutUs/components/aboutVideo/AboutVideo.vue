<template>
  <div class="about-video">
    <div class="videoCon">
      <div class="title">
        小组风采<span class="titles">记录奋斗历程，定格成长瞬间</span>
      </div>
      <div class="VideoBox">
        <div class="video-container">
          <div class="video-decoration top-left"></div>
          <div class="video-decoration top-right"></div>
          <div class="video-decoration bottom-left"></div>
          <div class="video-decoration bottom-right"></div>
          <div class="video-wrapper">
            <video class="group-video" autoplay loop muted playsinline controls>
              <source
                src="../../../../assets/video/video.mp4"
                type="video/mp4"
              />
              您的浏览器不支持视频播放
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.about-video {
  width: 100%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  .videoCon {
    width: 1100px;
    height: 600px;
  }
  .title {
    width: 100%;
    height: 60px;
    font-size: 22px;
    font-family: "Times New Roman", Times, serif;
    font-weight: bold;
    background-image: url(../../../../assets/img/bgColor.png);
    background-repeat: no-repeat;
    background-size: contain;

    .titles {
      font-weight: 300;
      font-size: 14px;
      margin-left: 30px;
    }
  }

  .VideoBox {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .video-container {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: 100%;
    max-height: 500px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
  }

  .video-decoration {
    position: absolute;
    width: 50px;
    height: 50px;
    z-index: 1;
    pointer-events: none;
  }

  .top-left {
    top: 10px;
    left: 10px;
    border-top: 4px solid #17949e;
    border-left: 4px solid #17949e;
  }

  .top-right {
    top: 10px;
    right: 10px;
    border-top: 4px solid #17949e;
    border-right: 4px solid #17949e;
  }

  .bottom-left {
    bottom: 10px;
    left: 10px;
    border-bottom: 4px solid #17949e;
    border-left: 4px solid #17949e;
  }

  .bottom-right {
    bottom: 10px;
    right: 10px;
    border-bottom: 4px solid #17949e;
    border-right: 4px solid #17949e;
  }

  .video-wrapper {
    position: relative;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 20px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #000;
  }

  .group-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  .play-pause-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    font-size: 24px;
    opacity: 0;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  .video-wrapper:hover .play-pause-btn {
    opacity: 1;
  }

  .video-tag {
    position: absolute;
    top: 35px;
    left: 35px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 2;
    letter-spacing: 0.5px;
  }
}
@media (min-width: 331px) and (max-width: 768px) {
  .about-video {
    width: 100%;
    height: auto;
    padding: 10px 0;
    .videoCon {
      height: auto;
    }
    .VideoBox {
      padding-top: 5px;
    }
    .title {
      font-size: 21px;
      padding: 0 10px;
      .titles {
        font-size: 13px;
      }
    }
    .video-container {
      height: auto;
    }
    .video-tag {
      display: none;
    }
  }
}
@media (max-width: 330px) {
  .about-video {
    height: auto;
    padding: 10px 0;
    .videoCon {
      height: auto;
    }
    .VideoBox {
      padding-top: 5px;
    }
    .title {
      padding: 0 12px;
      font-size: 21px;
      .titles {
        font-size: 12px;
      }
    }
    .video-container {
      height: auto;
    }
    .video-tag {
      display: none;
    }
  }
}
@media (min-width: 769px) and (max-width: 960px) {
  .about-video {
    height: auto;
    padding: 10px 0;
    .videoCon {
      height: auto;
    }
    .VideoBox {
      padding-top: 5px;
    }
    .title {
      padding: 0 12px;
      font-size: 21px;
      .titles {
        font-size: 13px;
      }
    }
    .video-container {
      height: auto;
    }
    .video-tag {
      display: none;
    }
  }
}
@media (min-width: 960px) and (max-width: 1199px) {
  .about-video {
    padding: 10px 40px;
  }
}
</style>
