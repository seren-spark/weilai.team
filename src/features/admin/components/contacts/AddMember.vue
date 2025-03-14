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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useRequest } from "@/composables/useRequest";
import { useAlert } from "@/composables/useAlert";
import { Icon } from "@iconify/vue";
import { ref, watch } from "vue";
import { useRequest } from "vue-request";
import { z } from "zod";
import { addMember } from "../../composables/useContacts";
import type { ApiResponseData } from "@/types/api-response";
import type { TeamUserList } from "@/types/contacts";
// 定义input样式

const { showAlert } = useAlert();
const props = defineProps<{
  group: string;
  grade: string;
  updateData: (grade: string, group: string) => void;
}>();
const group = ref(props.group);
const grade = ref(props.grade);
const userInfo = ref<addUser>({
  clazz: "",
  grade: grade.value,
  group: group.value,
  name: "",
  studyId: "",
  qq: "",
  phone: "",
  sex: "男",
  email: "",
});
interface addUser {
  clazz: string;
  grade: string;
  group: string;
  name: "";
  studyId: "";
  qq: "";
  phone: "";
  sex: string;
  email: "";
}
const dialogVisible = ref(false); // 创建响应式变量控制 Dialog 组件的显示，初始化为打开状态，可按需调整
const dialogRef = ref<InstanceType<typeof Dialog> | null>(null); // 创建组件引用，初始化为 null

const errors = ref<z.ZodFormattedError<addUser> | undefined>(); //存储错误信息
const handleDialogOpen = (newValue: boolean) => {
  dialogVisible.value = newValue;
  if (newValue == false) {
    // errors.value = {};
  }
};
const { data, run } = useRequest(addMember, { manual: true });
// 定义表单验证格式
const formSchema = z.object({
  name: z.string().min(2, { message: "名字至少需要2个字符" }),
  studyId: z
    .string()
    .min(11, { message: "学号格式错误" })
    .max(11, { message: "学号格式错误" }),
  email: z.string().email({ message: "邮箱格式错误" }),

  clazz: z.string().regex(/^[\u4e00-\u9fa5]{2}\d{3}$/, {
    message: "格式错误",
  }),
});

const handleConfirm = () => {
  // 这里可以添加其他逻辑，比如保存输入框中的数据等操作
  const parseResult = formSchema.safeParse(userInfo.value);
  console.log(parseResult.error);

  if (!parseResult.success) {
    errors.value = parseResult.error.format();

    return;
  } else {
    let addInfoObj = { ...userInfo.value };
    console.log(addInfoObj);
    run(addInfoObj);
    // 关闭对话框
    dialogVisible.value = false;
    if (dialogRef.value) {
      dialogRef.value.$emit("update:open", false); // 触发 'update:open' 事件通知 Dialog 组件更新状态
    }
  }
};
watch(
  () => data.value,
  () => {
    if (data.value) {
      const response = data.value as ApiResponseData<TeamUserList>;
      if (response.code === 200) {
        showAlert("添加成功", "pass");
        props.updateData(grade.value, group.value);
      }
    }
  },
);
watch(
  () => errors.value,
  (newVal) => {
    console.log(newVal);
  },
);
</script>

<template>
  <Dialog :open="dialogVisible" @update:open="handleDialogOpen">
    <slot></slot>

    <DialogContent class="sm:max-w-[425px] bg-white">
      <DialogHeader> 成员信息 </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="input-container">
          <Label for="name" class="text-center"> 姓名 :</Label>
          <Input
            id="name"
            v-model="userInfo.name"
            class="col-span-4 focus:outline-none"
            :error="errors?.name ? true : false"
            placeholder="请输入姓名"
            @input="
              () => {
                const parseResult = formSchema.pick({ name: true }).safeParse({
                  name: userInfo.name,
                });

                if (errors) {
                  errors.name = parseResult.error?.format().name;
                  console.log(errors.name, 22);
                }
              }
            "
          />
          <div class="grid grid-cols-subgrid gap-4 col-span-3">
            <div v-if="errors?.name" class="col-start-2 error flex">
              <Icon icon="material-symbols:error-outline" />
              {{ errors.name?._errors[0] }}
            </div>
          </div>
        </div>
        <div class="input-container">
          <Label for="username" class="text-center"> 学号 : </Label>
          <Input
            id="username"
            v-model="userInfo.studyId"
            class="col-span-4"
            placeholder="请输入学号"
            :error="errors?.studyId ? true : false"
            @input="
              () => {
                const parseResult = formSchema
                  .pick({ studyId: true })
                  .safeParse({
                    studyId: userInfo.studyId,
                  });
                if (errors) {
                  errors.studyId = parseResult.error?.format().studyId;
                }
              }
            "
          />
          <div class="grid grid-cols-subgrid gap-4 col-span-3">
            <div v-if="errors?.studyId" class="col-start-2 error flex">
              <Icon icon="material-symbols:error-outline" />
              {{ errors.studyId._errors[0] }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-6 items-center gap-5">
          <Label for="sex" class="text-right"> 性别 :</Label>
          <RadioGroup v-model="userInfo.sex" class="flex">
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="r1" value="男" />
              <Label for="r1">男</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="r2" value="女" />
              <Label for="r2">女</Label>
            </div>
          </RadioGroup>
        </div>
        <div class="input-container">
          <Label for="username" class="text-center"> 邮箱 : </Label>
          <Input
            v-model="userInfo.email"
            placeholder="请输入邮箱"
            class="col-span-4"
            :error="errors?.email ? true : false"
            @input="
              () => {
                const parseResult = formSchema.pick({ email: true }).safeParse({
                  email: userInfo.email,
                });
                if (errors) {
                  errors.email = parseResult.error?.format().email;
                }
              }
            "
          />
          <div class="grid grid-cols-subgrid gap-4 col-span-3">
            <div v-if="errors?.email" class="col-start-2 error flex">
              <Icon icon="material-symbols:error-outline" />
              {{ errors.email._errors[0] }}
            </div>
          </div>
        </div>
        <div class="input-container">
          <Label for="username" class="text-center"> QQ : </Label>
          <Input
            v-model="userInfo.qq"
            default-value="@peduarte"
            class="col-span-4"
            placeholder="请输入QQ"
          />
        </div>
        <div class="input-container">
          <Label for="username" class="text-center"> 电话 : </Label>
          <Input
            v-model="userInfo.phone"
            default-value="@peduarte"
            class="col-span-4"
            placeholder="请输入电话"
          />
        </div>
        <div class="input-container">
          <Label for="username" class="text-center"> 班级 : </Label>
          <Input
            v-model="userInfo.clazz"
            placeholder="请输入班级（格式：计科xxx）"
            class="col-span-4"
            :error="errors?.clazz ? true : false"
            @input="
              () => {
                console.log(1111);

                const parseResult = formSchema.pick({ clazz: true }).safeParse({
                  clazz: userInfo.clazz,
                });
                if (errors) {
                  errors.clazz = parseResult.error?.format().clazz;
                }
              }
            "
          />
          <div class="grid grid-cols-subgrid gap-4 col-span-3">
            <div v-if="errors?.clazz" class="col-start-2 error flex">
              <Icon icon="material-symbols:error-outline" />
              {{ errors.clazz._errors[0] }}
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button @click="handleConfirm"> 确定 </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>
@use "@admin/styles/form.scss";
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
.error {
  color: var(--destructive-foreground);
  display: flex;
  align-items: center;
  width: max-content;
  font-size: 11px;
}
.errorInput {
  &:focus {
    outline: none;
  }
}
</style>
