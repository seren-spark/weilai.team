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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TeamUserList } from "@/types/contacts";
import { ref, watch } from "vue";
import * as z from "zod";
import { Icon } from "@iconify/vue";
import { getMemberInfo, updateInfo } from "../../composables/useContacts";

const groupNums = {
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
};

const userInfo = ref<TeamUserList>({
  clazz: "",
  grade: "",
  group: "",
  id: 0,
  name: "",
  studyId: "",
  allGroup: [],
  ladleUserId: 0,
  ladleName: "",
  ladleGrade: "",
});
let name = "";

const props = defineProps<{
  userId?: number;
  sendUpdateInfo?: (info: TeamUserList) => void;
}>();

interface userInfoErrors {
  name: string;
  studyId: string;
}

const filedErrors = ref<z.ZodFormattedError<userInfoErrors> | undefined>();

const userInfoSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  studyId: z.string().min(11, "请输入正确的学号").max(11, "请输入正确的学号"),
});

const validateInfo = () => {
  const result = userInfoSchema.safeParse({
    name: userInfo.value.name,
    studyId: userInfo.value.studyId,
  });
  if (result.success) {
    return true;
  } else {
    filedErrors.value = result.error.format();
    return false;
  }
};

const emitUpdataName = (val: string | number) => {
  userInfo.value.name = String(val);
  const result = userInfoSchema.pick({ name: true }).safeParse({
    name: val,
  });
  if (filedErrors.value) {
    filedErrors.value.name = result.error?.format().name;
  }
};

const emitUpdataStudyId = (val: string | number) => {
  userInfo.value.studyId = String(val);
  const result = userInfoSchema.pick({ studyId: true }).safeParse({
    studyId: val,
  });
  if (filedErrors.value) {
    filedErrors.value.studyId = result.error?.format().studyId;
  }
};

watch(
  () => props.userId,
  (newVal) => {
    if (newVal) {
      getMemberInfo(newVal).then((res) => {
        userInfo.value = (res as TeamUserList) || "";

        name = userInfo.value.name;
      });
    }
  },
  { deep: true, immediate: true },
);

// 定义 EmitType 为 DialogRootEmits 类型，方便后续使用

const dialogVisible = ref(false); // 创建响应式变量控制 Dialog 组件的显示，初始化为打开状态，可按需调整

const dialogRef = ref<InstanceType<typeof Dialog> | null>(null); // 创建组件引用，初始化为 null

const handleDialogOpen = (newValue: boolean) => {
  dialogVisible.value = newValue;
};

const handleConfirm = () => {
  if (!validateInfo()) return;
  // 这里可以添加其他逻辑，比如保存输入框中的数据等操作
  let updateInfoObj = {
    name: userInfo.value.name,
    group: userInfo.value.group,
    grade: userInfo.value.grade,
    clazz: userInfo.value.clazz,
    studyId: userInfo.value.studyId,
    id: userInfo.value.id,
  };
  updateInfo(updateInfoObj).then((res) => {
    console.log(res);
    if (res.code == 200 && props.sendUpdateInfo) {
      props.sendUpdateInfo(updateInfoObj);
    }
  });
  // 关闭对话框
  dialogVisible.value = false;
  if (dialogRef.value) {
    dialogRef.value.$emit("update:open", false); // 触发 'update:open' 事件通知 Dialog 组件更新状态
  }
};
</script>

<template>
  <Dialog :open="dialogVisible" @update:open="handleDialogOpen">
    <slot></slot>

    <DialogContent class="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <span class="memberInfo-header"
          >{{ name }}
          <span class="info-id"
            >( 组长:{{
              userInfo.ladleName == null ? "暂无组长" : userInfo.ladleName
            }})</span
          >
        </span>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div v-if="filedErrors?.name?._errors" class="errorHead">
          <Icon
            class="errorIcon"
            icon="material-symbols:account-circle-outline"
          ></Icon>
          <span>{{ filedErrors?.name?._errors[0] }}</span>
        </div>
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="name" class="text-right"> 姓名 :</Label>
          <Input
            id="name"
            class="col-span-4"
            :class="{
              noWrite: filedErrors?.name?._errors,
              'focus-visible:ring-red-300 error-border':
                filedErrors?.name?._errors,
            }"
            :model-value="userInfo.name"
            @update:model-value="(val) => emitUpdataName(val)"
          />
        </div>
        <div v-if="filedErrors?.studyId?._errors" class="errorHead">
          <Icon
            class="errorIcon"
            icon="material-symbols:account-circle-outline"
          ></Icon>
          <span>{{ filedErrors?.studyId?._errors[0] }}</span>
        </div>
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="username" class="text-right"> 学号 : </Label>
          <Input
            id="username"
            default-value="@peduarte"
            class="col-span-4"
            :class="{
              noWrite: filedErrors?.studyId?._errors,
              'focus-visible:ring-red-300 error-border':
                filedErrors?.studyId?._errors,
            }"
            :model-value="userInfo.studyId"
            @update:model-value="(val) => emitUpdataStudyId(val)"
          />
        </div>
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="username" class="text-right"> 组织 : </Label>
          <Select v-model="userInfo.group">
            <SelectTrigger class="w-[250px]">
              <SelectValue placeholder="选择组织" class="select-text" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="(item, index) in userInfo.allGroup"
                  :value="item + ''"
                  :key="index"
                >
                  {{
                    groupNums[(item + "") as keyof typeof groupNums] ||
                    "选择组织"
                  }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <!-- <div class="grid grid-cols-6 items-center gap-5">
          <Label for="username" class="text-right"> 组长 : </Label>
          <Input
            id="username"
            class="col-span-4"
            v-model="userInfo.ladleName"
          />
        </div> -->
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

.errorHead {
  position: relative;
  left: 65px;
  display: flex;
  align-items: center;
  color: var(--destructive-foreground);
  font-size: 14px;
  height: 0;

  .errorIcon {
    margin-right: 4px;
    font-size: 16px;
  }
}

.noWrite {
  border: 1px solid var(--destructive-foreground);
  animation: slideIn 0.4s ease-in-out 1;
}

@keyframes slideIn {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  50% {
    transform: translateX(10px);
  }

  75% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
