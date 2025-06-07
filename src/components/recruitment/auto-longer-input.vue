<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";

const isLonger = ref(false);
const emit = defineEmits(["input_src"]);

const isComposing = ref(false);
const onCompositionStart = () => {
  isComposing.value = true;
};
const onCompositionEnd = (e: Event) => {
  isComposing.value = false;
  input_src(e);
};

const input_src = (e: Event) => {
  if (isComposing.value) {
    isLonger.value = true;
    return;
  }
  if ((e.target as HTMLInputElement).value === "") {
    isLonger.value = false;
    emit("input_src", (e.target as HTMLInputElement).value);
    return;
  }
  if (e) {
    isLonger.value = true;
    emit("input_src", (e.target as HTMLInputElement).value);
  }
  return;
};
const props = defineProps<{
  placeholderText: string;
}>();
watch(isLonger, (newValue) => {
  console.log(newValue);
});
</script>
<template>
  <div :id="isLonger ? 'longer' : ''" class="auto-longer-input">
    <div class="svg-icon">
      <svg
        id="Isolation_Mode"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Isolation Mode"
        viewBox="0 0 24 24"
        width="22"
        height="22"
      >
        <path
          d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
        ></path>
      </svg>
    </div>
    <input
      type="text"
      class="input"
      :placeholder="props.placeholderText"
      @input="input_src($event)"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
  </div>
</template>
<style scoped lang="scss">
#longer {
  width: 100%;
  background-color: var(--accent);
  border: 1px solid rgba(var(--primary-foreground), 0.5);
}
.auto-longer-input {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 45px;
  height: 100%;
  border-radius: 10px;
  padding: 0 10px;
  background-color: var(--background);
  border: 1px solid var(--border);
  transition: all 0.5s ease-in-out;
  &:hover,
  &:focus-within,
  &:valid {
    @extend #longer;
  }
}
.svg-icon {
  width: 20px;
  height: 20px;
  fill: var(--ring);
}
.input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--primary--foreground);
  &::placeholder {
    color: var(--primary--foreground);
    opacity: 0.7;
    transition: all 0.5s ease-in-out;
    font-size: 0.8em;
  }
  &:focus,
  &:valid {
    color: var(--primary--foreground);
  }
}
</style>
