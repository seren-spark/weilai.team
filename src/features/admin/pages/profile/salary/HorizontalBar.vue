<script lang="ts" setup>
import { Progress } from "./Progress";
import { ref, watchEffect } from "vue";

const props = defineProps({
  javaAll: {
    type: Number,
    default: 0,
  },
  htmlAll: {
    type: Number,
    default: 0,
  },
});

const progress = ref({
  frontEnd: 0,
  backEnd: 0,
});
watchEffect((cleanupFn) => {
  const timer = setTimeout(
    () => (
      (progress.value.frontEnd = props.htmlAll),
      (progress.value.backEnd = props.javaAll)
    ),
    500,
  );
  cleanupFn(() => clearTimeout(timer));
});
</script>
<template>
  <div class="horizontal">
    <div class="horizontal-bar-item">
      <div class="horizontal-bar-title">前端programmer</div>
      <Progress
        v-model="progress.frontEnd"
        :max="(props.javaAll + props.htmlAll) * 3"
        class="horizontal-bar-content front-end #447db3"
        :colors="''"
      ></Progress>
    </div>
    <div class="horizontal-bar-item">
      <div class="horizontal-bar-title">后端programmer</div>
      <Progress
        v-model="progress.backEnd"
        :max="(props.javaAll + props.htmlAll) * 3"
        class="horizontal-bar-content back-end #5dba9f"
      ></Progress>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.horizontal {
  .horizontal-bar-item {
    width: 90%;
    padding-top: 10px;
    margin-bottom: 20px;

    .horizontal-bar-title {
      margin-bottom: 0.25rem;
      font-size: 1.2rem;
      letter-spacing: 0.05em;
    }

    .horizontal-bar-content {
      width: 100%;
      height: 10px;
      background-color: #e7ebed;
    }
  }
}
</style>
