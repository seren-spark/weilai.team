<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BadgeCheck, BadgeAlert, BadgeX } from "lucide-vue-next";
import { defineProps, computed, ref, watch } from "vue";

// message:提示框内的内容
// type:提示框类型  { error:错误提示框, waring:警告提示框, pass:成功提示框  }
const propsData = defineProps({
  message: { type: String, required: true },
  type: {
    type: String,
    required: true,
    validator: (val: string) => ["error", "waring", "pass"].includes(val),
  },
});

// 根据 type 计算图标和样式
const icon = computed(() => {
  switch (propsData.type) {
    case "pass":
      return BadgeCheck;
    case "waring":
      return BadgeAlert;
    case "error":
      return BadgeX;
  }
});

const variantClass = computed(() => {
  switch (propsData.type) {
    case "pass":
      return "pass";
    case "waring":
      return "waring";
    case "error":
      return "error";
  }
});
</script>

<template>
  <Alert variant="destructive" class="allAlert" :class="propsData.type">
    <template v-if="icon">
      <component :is="icon" class="alertIcon w-4 h-4" />
    </template>
    <AlertDescription>
      {{ message }}
    </AlertDescription>
  </Alert>
</template>

<style scoped lang="scss">
.allAlert {
  /* background-color: white; */
  position: fixed;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 500px;
  font-size: 16px;
  z-index: 9999;
  height: 50px;
}

.error {
  /* transition: transform 0.5s ease-in-out, opacity 0.5s ease; */
  border: 0.5px #f87979 solid;
  color: rgb(249, 78, 78);
  background-color: #ffeeee;
  .alertIcon {
    color: #f87979;
  }
}

.waring {
  border: 0.5px #ffa341 solid;
  color: #ffa004;
  background-color: #fcf8eb;
  .alertIcon {
    color: #ffa004;
  }
}

.pass {
  border: 0.5px #68c331 solid;
  color: #49b407;
  background-color: #f2fceb;
  .alertIcon {
    color: #49b407;
  }
}

/* 定义下滑和上滑动画 */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease;
}

.alert-fade-enter,
.alert-fade-leave-to

/* .alert-fade-leave-active in <2.1.8 */ {
  transform: translateY(-100%);
  opacity: 0;
}

.alert-fade-enter-to,
.alert-fade-leave {
  transform: translateY(0);
  opacity: 1;
}
</style>
