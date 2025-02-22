<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
const loginStore = useLoginStore();
import { useLoginStore } from "@/store/useLoginStore";
import type { Editor } from "@tiptap/vue-3";

loginStore.isGetCode();

interface FontErrors {
  email: string;
  code: string;
  password: string;
  passwordAgin: string;
}

defineProps<{
  editor: Editor | undefined;
  email: string | number | undefined;
  code: string | number | undefined;
  password: string | number | undefined;
  passwordAgin: string | number | undefined;
  errors: Zod.ZodFormattedError<FontErrors> | undefined;
  handleCode: () => void;
}>();

defineEmits<{
  (e: "update:fontEmail", value: string | number | undefined): void;
  (e: "update:fontCode", value: string | number | undefined): void;
  (e: "update:fontPassword", value: string | number | undefined): void;
  (e: "update:fontPasswordAgin", value: string | number | undefined): void;
}>();
</script>
<template>
  <div class="fontPassConcent grid gap-4 py-4">
    <div v-if="errors?.email?._errors" class="errorHead">
      <Icon class="errorIcon" icon="ic:baseline-alternate-email"></Icon>
      <span>{{ errors?.email?._errors[0] }}</span>
    </div>
    <div class="fontPassFormInp grid grid-cols-4 items-center gap-4">
      <Label for="name" class="inpTit text-right"> 邮箱 </Label>
      <Input
        id="name"
        type="email"
        :class="{
          noWrite: errors?.email?._errors,
          'focus-visible:ring-red-300 error-border': errors?.email?._errors,
        }"
        class="col-span-3"
        placeholder="请输入邮箱"
        :model-value="email"
        @update:model-value="(val) => $emit('update:fontEmail', val)"
      />
    </div>
    <div v-if="errors?.code?._errors" class="errorHead">
      <Icon class="errorIcon" icon="material-symbols:ads-click"></Icon>
      <span>{{ errors?.code?._errors[0] }}</span>
    </div>
    <div class="fontPassFormInp grid grid-cols-4 items-center gap-4">
      <Label for="username" class="inpTit text-right"> 验证码 </Label>
      <div class="flex w-full max-w-sm items-center gap-1.5">
        <Input
          id="code"
          placeholder="请输入验证码"
          :class="{
            noWrite: errors?.code?._errors,
            'focus-visible:ring-red-300 error-border': errors?.code?._errors,
          }"
          style="width: 170px"
          :model-value="code"
          @update:model-value="(val) => $emit('update:fontCode', val)"
        />
        <Button
          class="fontBtn"
          @click="handleCode"
          v-if="!loginStore.isRequesting"
        >
          获取验证码
        </Button>
        <Button v-if="loginStore.isRequesting" disabled
          >已发送({{ loginStore.countdown }}s)</Button
        >
      </div>
    </div>
    <div v-if="errors?.password?._errors" class="errorHead">
      <Icon class="errorIcon" icon="mdi:1password"></Icon>
      <span>{{ errors?.password?._errors[0] }}</span>
    </div>
    <div class="fontPassFormInp grid grid-cols-4 items-center gap-4">
      <Label for="username" class="inpTit text-right"> 密码 </Label>
      <Input
        id="password"
        type="password"
        class="col-span-3"
        :class="{
          noWrite: errors?.password?._errors,
          'focus-visible:ring-red-300 error-border': errors?.password?._errors,
        }"
        placeholder="请输入密码"
        :model-value="password"
        @update:model-value="(val) => $emit('update:fontPassword', val)"
      />
    </div>
    <div v-if="errors?.passwordAgin?._errors" class="errorHead">
      <Icon class="errorIcon" icon="mdi:1password"></Icon>
      <span>{{ errors?.passwordAgin?._errors[0] }}</span>
    </div>
    <div class="fontPassFormInp grid grid-cols-4 items-center gap-4">
      <Label for="username" class="inpTit text-right"> 确认密码 </Label>
      <Input
        id="passwordAgin"
        type="password"
        :class="{
          noWrite: errors?.passwordAgin?._errors,
          'focus-visible:ring-red-300 error-border':
            errors?.passwordAgin?._errors,
        }"
        placeholder="请再次输入密码"
        class="col-span-3"
        :model-value="passwordAgin"
        @update:model-value="(val) => $emit('update:fontPasswordAgin', val)"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.fontPassFormInp {
  position: relative;
  left: -20px;
  margin: 7px 0;
}

.errorHead {
  display: flex;
  align-items: center;
  color: var(--destructive-foreground);
  font-size: 14px;
  position: relative;
  left: 80px;
  top: 7px;
  height: 0;

  .errorIcon {
    margin-right: 4px;
    font-size: 16px;
  }
}

.noWrite {
  border: 1px solid var(--destructive-foreground);
  animation: slideIn 0.4s ease-in-out 1;
  // color: var(--destructive-foreground);
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
