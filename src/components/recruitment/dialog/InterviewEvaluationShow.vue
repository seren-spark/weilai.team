<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import {marked} from "marked";

const props = defineProps<{
  message: string;
  isOpen: boolean;
}>();


const safeHtml=computed(()=> marked(props.message));


const emit = defineEmits(["close"]);
const close = (event: Event): void => {
  // 点击遮罩层关闭
  if (event.target === event.currentTarget) {
    emit("close");
  }
  return void 0;
};
</script>
<!-- <InterviewEvaluationShow /> -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="outer" @click="close($event)">
      <div class="interview-evaluation-container">
        <div class="title">
          <h2>面试评价展示页</h2>
        </div>
        <div class="content">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="safeHtml"></p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped lang="scss">
@use "@/assets/styles/recruitment.scss";
.interview-evaluation-container {
  width: 400px;
  height: 300px;
  background-color: var(--popover);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  top: 20px;
  box-sizing: content-box;
  margin-bottom: 40px;
  border-radius: var(--radius);
  .title {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 20px;
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: left;
  }
}
</style>
