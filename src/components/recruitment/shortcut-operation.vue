<script lang="ts" setup>
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/vue";
</script>

<template>
  <Card class="shortcut-operation">
    <div class="shortcut-operation-icon-front">
      <Icon icon="mdi-light:vector-arrange-below" style="font-size: 18px" />
    </div>

    <div class="shortcut-operation-text">
      <div class="shortcut-operation-text-title">
        <span>安排面试</span>
      </div>
      <div class="shortcut-operation-text-content">
        <span>刘志文</span>
      </div>
    </div>

    <div class="shortcut-operation-text-behind">
      <Icon class="svg" icon="solar:alt-arrow-right-line-duotone" />
    </div>
  </Card>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/recruitment.scss";
.shortcut-operation {
  border: none;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 60px 1fr 30px;
  grid-template-rows: 1fr;
  gap: 10px;
  cursor: pointer;
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
  min-width: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
}
.shortcut-operation-text-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}
.shortcut-operation-text-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 0.8em;
  font-weight: 400;
  color: #666666;
}
.shortcut-operation-text-behind {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  .svg {
    width: 30px;
    height: 30px;
    padding: 5px;
    background-color: #e6e6e6;
    border-radius: 5px;
  }
  @media screen and (max-width: 1300px) {
    display: none;
  }
}
</style>
