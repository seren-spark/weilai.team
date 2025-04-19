<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { modifyManyUser, TeamUserList } from "@/types/Contacts";

import { useAlert } from "@/composables/useAlert";
import { reactive, ref, watch } from "vue";
import { useRequest } from "vue-request";
import { changeInfosForMembers } from "../../composables/useContacts";
import type { ApiResponseData } from "@/types/api-response";
const { data, run } = useRequest(changeInfosForMembers, {
  manual: true,
});
const { showAlert } = useAlert();
// 匹配数字
const matchedNumber = ref("");
const groupNums = reactive({
  "1": "一组",
  "2": "二组",
  "3": "三组",
  "4": "四组",
  "5": "五组",
  "6": "六组",
  "7": "七组",
  "8": "八组",
  "9": "九组",
  "10": "十组",
  "11": "十一组",
  "12": "十二组",
  "13": "十三组",
});
const props = defineProps<{
  userId?: number;
  sendUpdateInfo?: (grade: string, group: string) => void;
  grade: string;
  group: string;
  selectIds: Array<number>;
  updateData: (grade: string, group: string) => void;
}>();
const userInfo = ref<modifyManyUser>({
  clazz: "计科XXX",
  grade: props.grade,
  group: props.group,
  ids: props.selectIds,
});
const groupInput = ref("");
const dialogVisible = ref(false); // 创建响应式变量控制 Dialog 组件的显示，初始化为打开状态，可按需调整
const dialogRef = ref<InstanceType<typeof Dialog> | null>(null); // 创建组件引用，初始化为 null

// 监听请求返回的数据的变化
watch(
  () => data.value,
  () => {
    if (data.value) {
      const response = data.value as ApiResponseData<TeamUserList>;
      if (response.code == 200) {
        showAlert("修改成功", "pass");
        props.updateData(props.grade, props.group);
      }
    }
  },
);

const handleDialogOpen = (newValue: boolean) => {
  dialogVisible.value = newValue;
};

const handleConfirm = () => {
  // 这里可以添加其他逻辑，比如保存输入框中的数据等操作
  matchGroup();
  console.log(userInfo.value);
  run(userInfo.value);

  // 关闭对话框
  dialogVisible.value = false;
  if (dialogRef.value) {
    dialogRef.value.$emit("update:open", false); // 触发 'update:open' 事件通知 Dialog 组件更新状态
  }
};

// 匹配组织
const matchGroup = () => {
  for (const key in groupNums) {
    if (groupNums[key as keyof typeof groupNums] === groupInput.value) {
      matchedNumber.value = key;
      userInfo.value.group = key;
      return;
    }
  }
  matchedNumber.value = "";
};
</script>

<template>
  <Dialog :open="dialogVisible" @update:open="handleDialogOpen">
    <slot></slot>

    <DialogContent class="sm:max-w-[425px] bg-white">
      <DialogHeader> 批量修改 </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="username" class="text-right"> 年级 : </Label>
          <Input id="name" v-model="userInfo.grade" class="col-span-4" />
        </div>
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="username" class="text-right"> 班级 : </Label>
          <Input
            id="username"
            v-model="userInfo.clazz"
            default-value="@peduarte"
            class="col-span-4"
          />
        </div>
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="username" class="text-right"> 组织 : </Label>
          <Input
            id="username"
            v-model="groupInput"
            default-value="@peduarte"
            class="col-span-4"
            :placeholder="groupNums[userInfo.group as keyof typeof groupNums]"
          />
        </div>
      </div>
      <DialogFooter>
        <Button @click="handleConfirm"> 确定 </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>
input,
.select-text {
  color: var(--secondary-foreground);
}
.memberInfo-header {
  .info-id {
    font-size: 12px;
    color: var(--secondary-foreground);
  }
}
</style>
