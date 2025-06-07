<template>
  <div ref="pickerRoot" class="time-picker">
    <input
      :value="inputValue"
      placeholder="选择时间"
      class="time-input ui-input"
      readonly
      @click="showPicker = true"
    />
    <div v-if="showPicker" class="picker-container ui-popover-content">
      <div class="picker-header">
        <div class="clear-button ui-button ui-button-ghost" @click="clearInput">清空</div>
        <button class="close-button ui-button ui-button-ghost" @click="showPicker = false">×</button>
      </div>
      <div class="picker-body">
        <div class="hour-column">
          <div
            v-for="(hour, hourIndex) in hours"
            :key="hourIndex"
            :class="['picker-cell', { selected: hour === hourSelected }]"
            @click="selectHour(hour)"
          >
            {{ hour.toString().padStart(2, '0') }}
          </div>
        </div>
        <div class="minute-column">
          <div
            v-for="(minute, minuteIndex) in minutes"
            :key="minuteIndex"
            :class="['picker-cell', { selected: minute === minuteSelected }]"
            @click="selectMinute(minute)"
          >
            {{ minute.toString().padStart(2, '0') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import dayjs from 'dayjs';

const props = defineProps<{
  modelValue?: string
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

type Hour = number;
type Minute = number;

const inputValue = ref<string>(props.modelValue ?? '');
const showPicker = ref<boolean>(false);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const hourSelected = ref<Hour | null>(null);
const minuteSelected = ref<Minute | null>(null);
const pickerRoot = ref<HTMLElement | null>(null);

const selectHour = (hour: Hour): void => {
  hourSelected.value = hour;
};

const selectMinute = (minute: Minute): void => {
  minuteSelected.value = minute;
  const selectedTime = dayjs()
    .set('hour', hourSelected.value || 0)
    .set('minute', minuteSelected.value || 0)
    .format('HH:mm');
  inputValue.value = selectedTime;
  emit('update:modelValue', selectedTime);
};

const handleClickOutside = (event: MouseEvent): void => {
  nextTick(() => {
    if (!pickerRoot.value) return;
    if (!(event.target instanceof Node)) return;
    if (!pickerRoot.value.contains(event.target)) {
      showPicker.value = false;
    }
  });
};

const clearInput = (): void => {
  inputValue.value = '';
  hourSelected.value = null;
  minuteSelected.value = null;
  emit('update:modelValue', '');
};

// 外部 modelValue 变化时同步到内部
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue ?? '';
    if (newValue) {
      const [h, m] = newValue.split(':').map(Number);
      hourSelected.value = isNaN(h) ? null : h;
      minuteSelected.value = isNaN(m) ? null : m;
    } else {
      hourSelected.value = null;
      minuteSelected.value = null;
    }
  }
);

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.time-picker {
  position: relative;
  user-select: none;
  width: 120px;
}

.time-input.ui-input {
  width: 100%;
  cursor: pointer;
  text-align: center;
  font-size: .9rem;
  padding: 8px 12px;
  border-radius: var(--radius, 6px);
  border: 1px solid var(--input-border, #d1d5db);
  background: var(--input-bg, #fff);
  transition: border-color 0.2s;
}
.time-input.ui-input:focus {
  border-color: var(--primary, #409eff);
  outline: none;
}

.picker-container.ui-popover-content {
  position: absolute;
  top: 44px;
  left: 0;
  width: 220px;
  background: var(--popover, #fff);
  border: 1px solid var(--popover-border, #e5e7eb);
  border-radius: var(--radius, 6px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  z-index: 1000;
  padding: 0;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--popover-border, #e5e7eb);
  background: var(--popover-header, #f9fafb);
}

.clear-button.ui-button,
.close-button.ui-button {
  font-size: 0.95rem;
  padding: 2px 10px;
  border-radius: var(--radius, 6px);
  border: none;
  background: transparent;
  color: black;
  cursor: pointer;
  transition: background 0.15s;
}
.clear-button.ui-button:hover,
.close-button.ui-button:hover {
  background: var(--primary-bg-hover, #f0f6ff);
}

.picker-body {
  display: flex;
  padding: 10px 12px;
  gap: 10px;
}

.hour-column,
.minute-column {
  flex: 1;
  max-height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-color, #bdbdbd) var(--scrollbar-track-color, #f1f1f1);
}

.hour-column::-webkit-scrollbar,
.minute-column::-webkit-scrollbar {
  width: 6px;
}
.hour-column::-webkit-scrollbar-thumb,
.minute-column::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb-color, #bdbdbd);
  border-radius: 4px;
}
.hour-column::-webkit-scrollbar-track,
.minute-column::-webkit-scrollbar-track {
  background: var(--scrollbar-track-color, #f1f1f1);
  border-radius: 4px;
}

.picker-cell {
  padding: 6px 0;
  margin: 2px 0;
  text-align: center;
  border-radius: var(--radius, 6px);
  cursor: pointer;
  font-size: .95rem;
  transition: background 0.15s, color 0.15s;
  color: var(--text, #333);
}
.picker-cell:hover:not(.selected) {
  background: var(--primary-bg-hover, #f0f6ff);
}
.picker-cell.selected {
  background: var(--primary, #409eff);
  font-weight: 600;
}
</style>