<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgotPassword from "./ForgotPassword.vue";
import { Icon } from "@iconify/vue";
// import { ref } from 'vue'

interface LoginError {
  account: string | number;
  password: string | number;
}

defineProps<{
  account: string | number | undefined;
  password: string | number | undefined;
  errors: Zod.ZodFormattedError<LoginError> | undefined;
}>();

defineEmits<{
  (e: "update:loginAccount", value: string | number | undefined): void;
  (e: "update:loginPassword", value: string | number | undefined): void;
}>();
// const isAttributeOpen = ref(true);
// const isTocOpen = ref(true);
</script>
<template>
  <div class="grid gap-2">
    <Label class="inputTitle" for="stuId">账号</Label>
    <div v-if="errors?.account?._errors" class="errorHead">
      <Icon class="errorIcon" icon="ri:account-circle-2-line"></Icon>
      <span>{{ errors?.account?._errors[0] }}</span>
    </div>
    <Input
      class="formInput"
      :class="{
        noWrite: errors?.account?._errors,
        'focus-visible:ring-red-300 error-border': errors?.account?._errors,
      }"
      id="stuId"
      placeholder="请输入学号或邮箱"
      required
      :model-value="account"
      @update:model-value="(val) => $emit('update:loginAccount', val)"
    />
  </div>
  <div class="grid gap-2">
    <div class="flex items-center justify-between">
      <Label class="inputTitle" for="password">密码</Label>
    </div>
    <div v-if="errors?.password?._errors" class="errorHead">
      <Icon class="errorIcon" icon="pepicons-pop:key-circle"></Icon>
      <span>{{ errors?.password?._errors[0] }}</span>
    </div>
    <Input
      class="formInput"
      :class="{
        noWrite: errors?.password?._errors,
        'focus-visible:ring-red-300 error-border': errors?.password?._errors,
      }"
      id="password"
      type="password"
      placeholder="请输入密码"
      required
      :model-value="password"
      @update:model-value="(val) => $emit('update:loginPassword', val)"
    />
    <div class="forgotPass flex items-center justify-end">
      <ForgotPassword></ForgotPassword>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.inputTitle {
  font-size: 16px;
  margin: 14px 0 4px 0;
}

.forgotPass {
  position: relative;
  top: -12px;
}

.errorHead {
  display: flex;
  align-items: center;
  color: var(--destructive-foreground);
  font-size: 14px;

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

@media screen and (max-width: 1400px) {
  .inputTitle {
    font-size: 14px;
    margin: 3px 0 1px 0;
  }

  .formInput {
    height: 36px;
    font-size: 12px;
  }
}

@media screen and (max-width: 1200px) {
  .inputTitle {
    font-size: 12px;
    margin: 0;
  }

  .formInput {
    height: 28px;
    font-size: 10px;
  }

  .errorHead {
    font-size: 11px;
  }
}

@media screen and (min-width: 1024px) {
}

@media screen and (max-width: 500px) {
  .inputTitle {
    display: none;
    font-size: 18px;
    margin: 2px 0 5px 0;
  }

  .formInput {
    height: 60px;
    font-size: 20px;
    border-radius: 40px;
    padding: 0 20px;
    margin: 10px 0;
  }
}
</style>
