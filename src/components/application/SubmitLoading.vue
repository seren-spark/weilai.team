<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
      <div v-if="!showSuccess">
        <!-- 可爱的小纸飞机动画 -->
        <div class="relative h-32 mb-6 overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <!-- 云朵背景 -->
            <div class="absolute top-4 left-8 animate-float-slow">
              <div class="w-8 h-6 bg-blue-100 rounded-full relative">
                <div
                  class="absolute -left-2 top-1 w-6 h-4 bg-blue-100 rounded-full"
                ></div>
                <div
                  class="absolute -right-2 top-0.5 w-5 h-5 bg-blue-100 rounded-full"
                ></div>
              </div>
            </div>
            <div class="absolute top-8 right-6 animate-float-delayed">
              <div class="w-6 h-4 bg-blue-50 rounded-full relative">
                <div
                  class="absolute -left-1 top-0.5 w-4 h-3 bg-blue-50 rounded-full"
                ></div>
                <div
                  class="absolute -right-1 top-0 w-3 h-3 bg-blue-50 rounded-full"
                ></div>
              </div>
            </div>

            <!-- 纸飞机 -->
            <div class="animate-fly">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                class="text-blue-500 drop-shadow-lg"
              >
                <path
                  fill="currentColor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                />
              </svg>
            </div>

            <!-- 星星装饰 -->
            <div class="absolute top-2 right-12 animate-twinkle">
              <div class="w-2 h-2 bg-yellow-400 transform rotate-45"></div>
            </div>
            <div class="absolute bottom-6 left-12 animate-twinkle-delayed">
              <div class="w-1.5 h-1.5 bg-pink-400 transform rotate-45"></div>
            </div>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">提交进度</span>
            <span class="text-sm font-medium text-blue-600">
              {{ Math.round(((currentStatus + 1) / steps.length) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              class="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full transition-all duration-700 ease-out relative"
              :style="{
                width: ((currentStatus + 1) / steps.length) * 100 + '%',
              }"
            >
              <div
                class="absolute inset-0 bg-white opacity-20 animate-shimmer"
              ></div>
            </div>
          </div>
        </div>

        <!-- 状态文字 -->
        <div class="text-center">
          <p class="text-gray-800 font-medium mb-2 animate-fade-in">
            {{ steps[currentStatus] }}
          </p>

          <!-- 可爱的加载点动画 -->
          <div class="flex justify-center space-x-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- 成功状态 -->
        <div class="text-center animate-scale-in">
          <!-- 成功图标 -->
          <div class="relative mb-6">
            <div
              class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-success-pop"
            >
              <svg
                class="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <!-- 庆祝特效 -->
            <div class="absolute inset-0 pointer-events-none">
              <div class="absolute top-4 left-8 animate-confetti-1">🎉</div>
              <div class="absolute top-8 right-6 animate-confetti-2">✨</div>
              <div class="absolute bottom-8 left-6 animate-confetti-3">🎊</div>
              <div class="absolute bottom-4 right-8 animate-confetti-4">⭐</div>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">提交成功！</h3>
          <p class="text-gray-600 mb-4">您的报名表已成功提交</p>
          <p class="text-sm text-gray-500">
            我们将在
            <Popover>
              <PopoverTrigger class="text-blue-600">
                2025未来软件工作室招新群
              </PopoverTrigger>
              <PopoverContent class="w-50px h-50px">
                <img src="/public/group.png" alt="" class="w-50px h-50px" />
              </PopoverContent>
            </Popover>
            内公布面试时间，请您及时关注群内信息
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LoadingAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}
// 提交加载动画
const props = defineProps<LoadingAnimationProps>();
const emit = defineEmits<{
  (e: "complete"): void;
}>();

const currentStatus = ref(0);
const showSuccess = ref(false);
const steps = ref([
  "正在准备您的报名表...",
  "检查报名信息完整性...",
  "上传个人资料中...",
  "连接服务器中...",
  "提交报名表中...",
  "处理完成！",
]);

let timer: number | undefined;
watch(
  () => props.isVisible,
  (newVal) => {
    if (!newVal) {
      currentStatus.value = 0;
      showSuccess.value = false;
      document.body.style.overflow = "";
      if (timer) {
        clearInterval(timer);
      }
      return;
    }

    timer = setInterval(() => {
      if (currentStatus.value < steps.value.length - 1) {
        currentStatus.value++;
      } else {
        showSuccess.value = true;
        document.body.style.overflow = "hidden";
        setTimeout(() => {
          props.onComplete?.();
          emit("complete");
        }, 1500);
      }
    }, 800);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
<style lang="scss" scoped>
/* 关键帧动画定义保持不变 */
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-8px) translateX(4px);
  }
  66% {
    transform: translateY(-4px) translateX(-2px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-6px) translateX(-3px);
  }
  66% {
    transform: translateY(-2px) translateX(2px);
  }
}

@keyframes fly {
  0% {
    transform: translateX(-20px) translateY(10px) rotate(-10deg);
  }
  50% {
    transform: translateX(10px) translateY(-5px) rotate(5deg);
  }
  100% {
    transform: translateX(-20px) translateY(10px) rotate(-10deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: rotate(45deg) scale(1.2);
  }
}

@keyframes twinkle-delayed {
  0%,
  100% {
    opacity: 0.7;
    transform: rotate(45deg) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: rotate(45deg) scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes success-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes confetti-1 {
  0% {
    transform: translateY(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-30px) rotate(180deg) scale(1);
    opacity: 0;
  }
}

@keyframes confetti-2 {
  0% {
    transform: translateY(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-25px) rotate(-180deg) scale(1);
    opacity: 0;
  }
}

@keyframes confetti-3 {
  0% {
    transform: translateY(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-35px) rotate(270deg) scale(1);
    opacity: 0;
  }
}

@keyframes confetti-4 {
  0% {
    transform: translateY(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-28px) rotate(-270deg) scale(1);
    opacity: 0;
  }
}

/* 动画应用类名保持不变 */
.animate-float-slow {
  animation: float-slow 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 3s ease-in-out infinite 0.5s;
}

.animate-fly {
  animation: fly 3s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.animate-twinkle-delayed {
  animation: twinkle-delayed 2.5s ease-in-out infinite 0.3s;
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.6s ease-out;
}

.animate-success-pop {
  animation: success-pop 0.8s ease-out;
}

.animate-confetti-1 {
  animation: confetti-1 1s ease-out 0.2s;
}

.animate-confetti-2 {
  animation: confetti-2 1.2s ease-out 0.4s;
}

.animate-confetti-3 {
  animation: confetti-3 1.1s ease-out 0.1s;
}

.animate-confetti-4 {
  animation: confetti-4 1.3s ease-out 0.3s;
}
</style>
