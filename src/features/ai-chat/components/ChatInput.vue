<template>
  <div class="input-container">
    <div class="input-wrapper">
      <textarea
        v-model="inputValue"
        class="message-input"
        :placeholder="
          disabled
            ? 'AI 正在回复，请稍候…'
            : '发消息... 输入 @ 选择技能或 / 选择文件'
        "
        :disabled="disabled"
        @keydown.enter.exact="handleSend"
        @keydown.enter.shift.exact.prevent="inputValue += '\n'"
        rows="1"
      ></textarea>
      <div class="input-actions">
        <button
          class="input-btn"
          :disabled="disabled || !inputValue.trim()"
          @click="$emit('voice')"
        >
          <Icon icon="mdi:microphone" />
        </button>
        <button
          class="input-btn send-btn"
          @click="handleSend"
          :disabled="!inputValue.trim()"
        >
          <Icon icon="mdi:send" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  modelValue: string;
  disabled: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  send: [message: string];
  voice: [];
}>();

const inputValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  },
);

watch(inputValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const handleSend = (e: Event) => {
  if (props.disabled) return;
  if (e instanceof KeyboardEvent && e.shiftKey) {
    return;
  }

  e.preventDefault();

  const message = inputValue.value.trim();
  if (!message) return;

  emit("send", message);
  inputValue.value = "";
};
</script>

<style scoped lang="scss">
.input-container {
  padding: 1rem 2rem 2rem;
  background: #fff;
  border-top: 1px solid #e5e5e5;

  .input-wrapper {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;

    .message-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: 0.95rem;
      resize: none;
      max-height: 120px;
      line-height: 1.5;
      font-family: inherit;

      &::placeholder {
        color: #999;
      }
    }

    .input-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      .input-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1.2rem;
        color: #666;
        transition: all 0.2s;
        border-radius: 8px;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #1890ff;
        }

        &.send-btn {
          color: #1890ff;

          &:disabled {
            color: #ccc;
            cursor: not-allowed;

            &:hover {
              background: none;
            }
          }
        }
      }
    }
  }
}
</style>
