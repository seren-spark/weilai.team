<template>
  <div class="chatOpen" v-click-outside="closeComponent">
    <div class="aiChat">
      <div></div>
      <div class="chatHeader">
        <div class="chatAvatar">
          <img src="@/assets/img/小组logo.png" />
        </div>
        <div class="chatTitle">
          <div class="chatTitleCon" style="color: rgb(255, 255, 255)">
            未来软件工作室Ai客服
          </div>
          <div class="chatTitleSub" style="color: rgba(255, 255, 255, 0.8)">
            联系我们:83254065@qq.com
          </div>
        </div>
        <button @click="closeComponent" class="chatTitleClose">
          <Icon icon="proicons:cancel" />
        </button>
      </div>
      <div class="chatConversation" ref="chatContainer">
        <div style="padding-top: 0px; padding-bottom: 0px">
          <div class="topExplain">
            以下回答基于大模型知识库，具体详情可联系我们~~~
          </div>
          <div class="indexBubble">
            <div class="BubbleAvatar">
              <img src="@/assets/img/小组logo.png" />
            </div>
            <div class="BubbleConten BubbleContentLeft">
              <p>
                你好，我是未来软件工作室AI机器人小 W，请问有什么可以帮到您？
              </p>
            </div>
          </div>
          <ul class="questionList">
            <li
              class="questionListItem"
              v-for="(item, index) in requestObj.initialProblem"
              :key="index"
              :style="{ background: item.bgColor, fontSize: '0.8rem' }"
              @click="setSubmit(item.text)"
            >
              {{ item.text }}
            </li>
          </ul>
          <div
            class="indexBubble"
            v-for="(item, index) in chatList"
            :key="index"
          >
            <div v-if="item.role != 'user'">
              <div class="BubbleAvatar">
                <img src="@/assets/img/小组logo.png" />
              </div>
              <div class="BubbleConten BubbleContentLeft">
                <p v-highlight v-html="item.content"></p>
              </div>
            </div>
            <div v-else class="BubbleConten bubbleContentRight subjectColor">
              <span>{{ item.content }}</span>
            </div>
          </div>
          <div v-if="loading" class="indexBubble">
            <div class="BubbleAvatar">
              <img src="@/assets/img/小组logo.png" />
            </div>
            <div class="BubbleConten BubbleContentLeft">
              <div v-highlight v-html="answer"></div>
              <Icon icon="line-md:loading-twotone-loop" class="is-loading" />
            </div>
          </div>
          <div v-else-if="error">{{ error }}</div>
        </div>
      </div>
      <div class="chatInupt">
        <div class="chatTextarea">
          <div class="chatTextareaInput">
            <textarea
              rows="1"
              placeholder="请输入您要问的内容，如:“小组的学习模式”"
              v-model="question"
              @keydown.enter="setSubmit(question)"
              class=""
            ></textarea>
          </div>
          <div class="chatFooter">
            <div class="chatFooterWww">
              <button class="subjectColor" @click="setSubmit(question)">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Marked } from "marked";
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAiTool } from "@/components/ai-service/server/useAiTool";
import { requestObj } from "@/components/ai-service/config";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
import { Icon } from "@iconify/vue";
const marked = new Marked({ gfm: true });
gsap.registerPlugin(ScrollTrigger);
interface MessageInfo {
  role: string;
  content: string;
}
const emit = defineEmits(["closeChat"]);
const isShow = ref(false);
const question = ref<string>("");
const chatList = ref<MessageInfo[]>([]);
const { answer, loading, error, getAnswer } = useAiTool();
const closeComponent = () => {
  if (isShow.value == true) {
    outing();
    // setTimeout(() => {
    emit("closeChat", false);
    // }, 300);
  } else {
    isShow.value = true;
  }
};
const setSubmit = (questionText: string) => {
  questionText = questionText.trim();
  if (questionText) {
    if (questionText) getAnswer(questionText);
    chatList.value.push({
      role: "user",
      content: questionText,
    });
    scrollToBottom();
  } else {
    console.log("请输入您要提问内容！");
    showAlert("请输入您要提问内容！", "waring");
  }
  question.value = "";
};

onMounted(() => {
  LoadingFn();
});

function LoadingFn() {
  const line = gsap.timeline();
  ScrollTrigger.create({
    trigger: ".chatOpen",
    animation: line.fromTo(
      ".chatOpen",
      {
        translateX: 80,
        opacity: 0,
        duration: 0.2,
      },
      {
        translateX: 0,
        opacity: 1,
        duration: 0.2,
      },
    ),
  });
}
function outing() {
  const line = gsap.timeline();
  ScrollTrigger.create({
    trigger: ".chatOpen",
    animation: line.fromTo(
      ".chatOpen",
      {
        translateX: 0,
        opacity: 1,
        duration: 0.2,
      },
      {
        translateX: 80,
        opacity: 0,
        duration: 0.2,
      },
    ),
  });
}
watch(loading, (newValue) => {
  if (newValue == false) {
    chatList.value.push({
      role: "assistant",
      content: marked.parse(answer.value) as string,
    });
  }
  scrollToBottom();
});
watch(answer, (newValue) => {
  scrollToBottom();
  nextTick(() => {
    answer.value = marked.parse(newValue) as string;
  });
});
const chatContainer = ref<HTMLElement | null>(null);
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight + 80;
  }
}
</script>

<style scoped lang="scss">
.chatOpen {
  height: calc(100% - 2rem);
  width: 350px;
  position: fixed;
  right: 0.1rem;
  z-index: 10000000;
  bottom: 1rem;
}
.aiChat {
  position: absolute;
  bottom: 0;
  background-color: white;
  border-radius: 12px;
  width: 350px;
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.15);
  height: 100%;
  min-height: 250px;
  max-height: 500px;
  .subjectColor {
    background: linear-gradient(45deg, rgb(90, 136, 253), rgb(0, 206, 188));
    color: rgb(255, 255, 255);
    font-size: 0.825rem;
  }
  .chatHeader {
    height: 80px;
    background: linear-gradient(45deg, rgb(90, 136, 253), rgb(0, 206, 188));
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 18px 20px;
    position: relative;
    flex: 0 0 auto;
    z-index: 3;
    box-shadow: 0 4px 10px rgba(85, 106, 160, 0.2);
    .chatAvatar {
      background-color: inherit;
      height: 46px;
      width: 46px;
      line-height: 46px;
      text-align: center;
      padding: 7px;
      display: inline-block;
      border-radius: 5px;
      background: #fff;
      position: relative;
      vertical-align: middle;
      img {
        position: absolute;
        width: 80%;
        height: 80%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        object-fit: cover;
      }
    }
    .chatTitle {
      vertical-align: middle;
      display: inline-block;
      width: calc(100% - 90px);
      text-overflow: ellipsis;
      overflow: hidden;
      height: 44px;
      margin-left: 12px;
      font-size: 12px;
      position: relative;
      .chatTitleCon,
      .chatTitleSub {
        word-break: break-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 22px;
        position: absolute;
        left: 0;
        max-width: 100%;
        font-weight: 300;
        line-height: 18px;
        bottom: -5px;
      }
      .chatTitleCon {
        top: 0px;
        font-size: 18px;
        line-height: 22px;
        font-weight: 700;
        top: 0;
      }
    }
    .chatTitleClose {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 22px;
      height: 22px;
      border-radius: 2px;
      background-color: none;
      font-weight: 800;
      border: none;
      color: rgb(255, 255, 255);
      cursor: pointer;
      padding-top: 2px;
      background-color: rgba(238, 238, 238, 0);
      // &:hover {
      //   background-color: rgba(238, 238, 238, 0.4);
      // }
    }
  }
  .chatConversation {
    padding: 0 15px;
    overflow: hidden auto;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 175px);
    margin-bottom: 90px;
    flex: 0 1 auto;
    background: #fff;
    z-index: 2;
    position: relative;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    .topExplain {
      margin-top: 10px;
      text-align: center;
      font-size: 12px;
    }
    .indexBubble {
      position: relative;
      margin: 16px 0;
      overflow: hidden;
      width: 100%;
      .BubbleAvatar {
        width: 40px;
        box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.1);
        height: 40px;
        line-height: 40px;
        text-align: center;
        clear: left;
        position: relative;
        background: #fff;
        color: #0d1626;
        border-radius: 50%;
        position: absolute;
        left: 2px;
        top: 3px;
        img {
          max-height: 100%;
          width: 100%;
          height: auto;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          border-radius: 50%;
        }
      }
      .BubbleContentLeft {
        float: left;
        border-radius: 12px 12px 12px 3px;
        margin-left: 50px;
        background: rgba(84, 152, 243, 0.08);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
        color: #252525;
        min-width: 16px;
      }
      .BubbleConten {
        position: relative;
        line-height: 1.4;
        word-break: break-word;
        max-width: 85%;
        font-size: 14px;
        letter-spacing: 0;
      }

      .bubbleContentRight {
        float: right;
        clear: right;
        border-radius: 12px 12px 3px 12px;
        min-width: 16px;
      }
      .BubbleConten {
        position: relative;
        line-height: 1.4;
        padding: 12px 20px;
        word-break: break-word;
        max-width: 85%;
        font-size: 14px;
        letter-spacing: 0;
      }
    }
    .questionList {
      float: right;
      display: block;
      width: 100%;
      list-style: none;
      text-align: right;
      margin: 6px 0;
      .questionListItem {
        cursor: pointer;
        padding: 8px 10px;
        display: inline-block;
        margin: 5px 0 5px 5px;
        color: #252525;
        border-radius: 20px;
        border: 1px solid transparent;
        transition: all 0.15s;
        &:hover {
          border: 1px solid#bababa;
          box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
  .chatInupt {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 3;
    border-radius: 0 0 12px 12px;
    flex: 0 0 auto;
    border-top: 1px solid #d3e2ff;
    .chatTextarea {
      position: relative;
      z-index: 5;
      .chatTextareaInput {
        padding: 0 20px;
        border-top: 1px solid #f3f7ff;
        position: relative;
        min-height: 30px;
        height: 30px;
        padding-top: 8px;
        margin: 0px;
        textarea {
          overflow: auto;
          width: 100%;
          border: none;
          outline: none;
          height: 100%;
          padding: 10px 0;
          border-radius: 0;
          resize: none;
          margin: 0;
          padding: 0;
          line-height: 20px;
          overflow-x: hidden;
          font-size: 14px;
        }
      }
    }
  }
  .chatFooter {
    display: flex;
    margin-top: 17px;
    padding: 0 20px 10px 20px;
    border-radius: 12px;
    .chatFooterWww {
      text-align: right;
      line-height: 30px;
      button {
        cursor: pointer;
        width: 60px;
        line-height: 32px;
        border: none;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border-radius: 40px;
        margin-left: 5px;
        transition: all 0.2s;
        &:hover {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}
.rocket {
  cursor: pointer;
  position: fixed;
  z-index: 9999999;
  background-color: white;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0.2rem;
  bottom: 0.9rem;
  .back-to-top-icon {
    overflow: hidden;
    width: 80%;
    height: 95%;
    border-radius: 50%;
    fill: currentcolor;
    color: rgb(40, 77, 213);
  }
}
.topactive {
  display: none;
}
</style>
