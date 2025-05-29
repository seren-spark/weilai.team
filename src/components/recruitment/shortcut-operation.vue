<script lang="ts" setup>
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/vue";
const emit=defineEmits(["sendIdAndName"]);

const props = defineProps<{
  name:string | "";
  id:string | "";
}>();

const emitIdAndName = () => {
  emit("sendIdAndName", props.id, props.name);
};
</script>

<template>
  <Card
    class="shortcut-operation"
    @click="emitIdAndName"
  >
    <div class="shortcut-operation-icon-front">
      <Icon icon="mdi-light:vector-arrange-below" style="font-size: 18px" />
    </div>

    <div class="shortcut-operation-text">
      <div class="shortcut-operation-text-title">
        <span>安排面试</span>
      </div>
      <div class="shortcut-operation-text-content">
        <span>{{ props.name }}</span>
      </div>
    </div>

    <div class="shortcut-operation-text-behind">
      <Icon class="svg" icon="solar:alt-arrow-right-line-duotone" />
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.shortcut-operation {
  border: none;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr;
  gap: 10px;
  cursor: pointer;
  box-sizing: border-box;
  white-space: nowrap;
}
.shortcut-operation-icon-front {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #cdd9fc;
  color: white;
  border-radius: var(--radius);
  margin-top: 10px;
}
.shortcut-operation-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.shortcut-operation-text-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .8rem;
  font-weight: 500;
  color: #333333;
}
.shortcut-operation-text-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: .8rem;
  font-weight: 400;
  color: #666666;
}
.shortcut-operation-text-behind {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .svg {
    width: 1.5rem;
    height: 1.5rem;
    padding: 5px;
    background-color: #e6e6e6;
    border-radius: 5px;
  }
  @media screen and (max-width: 1300px) {
    display: none;
  }
}
</style>
