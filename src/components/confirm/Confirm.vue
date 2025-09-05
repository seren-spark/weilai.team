<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const props = defineProps<{
  title?: string | undefined;
  content?: string | undefined;
  description?: string | undefined;
  confirmText?: string | undefined;
  cancelText?: string | undefined;
  onConfirm: Function;
  onCancel: Function;
}>();
const dialogVisible = ref(true);
</script>

<template>
  <AlertDialog :open="dialogVisible">
    <AlertDialogTrigger as-child> </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title ? title : "提示" }}</AlertDialogTitle>
        <AlertDialogDescription class="info flex">
          <Icon icon="pajamas:status-alert" />
          <span id="content"
            >{{ content ? content : "你确定执行该操作吗？" }}
            <span id="description">
              {{ description ? `(${description})` : "" }}</span
            ></span
          >
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel()">{{
          cancelText ? cancelText : "取消"
        }}</AlertDialogCancel>
        <AlertDialogAction @click="onConfirm()">{{
          confirmText ? confirmText : "确定"
        }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
<style lang="scss" scoped>
.info {
  font-size: 16px;
  align-items: center;

  svg {
    color: #f1b357;
    font-size: 22px;
    margin-right: 10px;
  }

  #description {
    font-size: 14px;
  }
}
</style>
