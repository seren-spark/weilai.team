<template>
  <div class="insert">
    <p>向{{ props.type }}插入</p>
    <Input
      class="inputInsert"
      @keydown.enter="handlerInsert"
      v-model="insertValue"
    />
    <p>{{ props.type === "左" || props.type === "右" ? "列" : "行" }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
const props = defineProps<{ type: string; handler: (value: any) => void }>();
const insertValue = ref(1);
console.log(props);

const handlerInsert = () => {
  console.log(insertValue.value);

  props.handler(insertValue.value);
};
</script>
<style lang="scss" scoped>
.insert {
  display: flex;
  align-items: center;
  gap: 5px;
  p {
    font-size: 14px;
    color: var(--jjext-color-layout-title);
  }
}
.inputInsert {
  width: 40px;
  height: 20px;
  padding: 0;
  text-align: center;
  outline: none;
}
</style>
