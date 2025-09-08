<script setup lang="ts">
import Alert from "@/pages/Alert.vue";
import { useAlert } from "./composables/useAlert";
const { alertState } = useAlert();
import chat from "@/components/ai-service/index.vue";

const myLog = console;

let logText = [
  `欢迎来到`,
  `未来软件工作室!`,
  `行而不弃，未来可期✨`,
  "©2025 By 未来",
  [`
     ______               __
    /      \\             /  |,
   /$$$$$$  | __    __  _$$ |_    __    __   ______    ______,
   $$ |_ $$/ /  |  /  |/ $$   |  /  |  /  | /      \\  /      \\,
   $$   |    $$ |  $$ |$$$$$$/   $$ |  $$ |/$$$$$$  |/$$$$$$  |,
   $$$$/     $$ |  $$ |  $$ | __ $$ |  $$ |$$ |  $$/ $$    $$ |,
   $$ |      $$ \\__$$ |  $$ |/  |$$ \\__$$ |$$ |      $$$$$$$$/,
   $$ |      $$    $$/   $$  $$/ $$    $$/ $$ |      $$       |,
   $$/        $$$$$$/     $$$$/   $$$$$$/  $$/        $$$$$$$/`
  ],
];

const colors = [
  "color:#39c5bb;font-weight:bold;", // 欢迎来到
  "color:#ff9800;font-weight:bold;", // 未来软件工作室!
  "color:#4caf50;", // 行而不弃，未来可期✨
  "color:#bdbdbd;font-style:italic;", // 版权
  "color:#00bcd4;font-weight:bold;", // 字符画
];

// 动态输出
function printLog() {
  myLog.log(
    `\n%c${logText[0]}  %c${logText[1]}\n\n    %c${logText[2]}\n\n          %c${logText[3]}`,
    colors[0],
    colors[1],
    colors[2],
    colors[3],
  );
  // 直接输出
  myLog.log(`%c${logText[4]}`, colors[4]);
}

printLog();
</script>

<template>
  <Alert
    v-if="alertState"
    :alert-state="alertState"
    :message="alertState.message"
    :type="alertState.type"
  />
  <RouterView></RouterView>
  <chat></chat>
</template>
<style  scoped>
*{
  user-select: none;
}
</style>
