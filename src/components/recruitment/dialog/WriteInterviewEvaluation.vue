<template>
  <Teleport to="body">
    <div v-if="props.isOpen" class="outer" @click="close($event)">
      <form class="space-y-6 p-4" @submit.prevent="handleSubmit">
        <!-- 写面评字段 -->
        <FormField name="interviewEvaluation">
          <FormItem class="text-center">
            <FormLabel class="dialog-title">书写面评</FormLabel>
            <FormControl>
              <Textarea
                v-model="formData.interviewEvaluation"
                placeholder="在此书写面试评价"
                class="resize-none"
              >
              </Textarea>
            </FormControl>
            <span v-if="errors.interviewEvaluation" class="error-message">{{
              errors.interviewEvaluation
            }}</span>
          </FormItem>
        </FormField>
        <!-- 面试去向字段 -->
        <FormField name="interviewResult">
          <FormItem class="text-center">
            <FormLabel class="dialog-title">面试去向</FormLabel>
            <FormControl>
              <Select v-model="formData.status">
                <SelectTrigger>
                  <SelectValue placeholder="选择面试去向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-2">待二面</SelectItem>
                  <SelectItem value="3">淘汰</SelectItem>
                  <SelectItem value="2">已录取</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <span v-if="errors.status" class="error-message">{{
              errors.status
            }}</span>
          </FormItem>
        </FormField>
        <Button type="submit" class="btn-style">保存</Button>
      </form>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { z } from "zod";
const emit = defineEmits(["close"]);
const close = (event: Event) => {
  // 点击遮罩层关闭
  if (event.target === event.currentTarget) {
    emit("close");
  }
  return;
};

const props = defineProps({
  isOpen: Boolean,
  id: {
    type: String,
    default: "",
  },
});

const formData = ref({
  interviewEvaluation: "",
  status: "",
});

// 清空formData里填写的数据
const clearFormData = () => {
  formData.value = {
    interviewEvaluation: "",
    status: "",
  };
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      clearFormData();
    }
  },
);

const errors = ref({
  interviewEvaluation: "",
  status: "",
});

const schema = z.object({
  interviewEvaluation: z.string().min(1, { message: "面试评价不能为空" }),
  status: z.string().min(1, { message: "面试去向不能为空" }),
});

const handleSubmit = () => {
  const result = schema.safeParse(formData.value);
  if (!result.success) {
    // 校验失败
    const formattedErrors = result.error.format();
    errors.value = {
      interviewEvaluation:
        formattedErrors.interviewEvaluation?._errors?.[0] || "",
      status: formattedErrors.status?._errors?.[0] || "",
    };
  } else {
    // 清空错误消息
    errors.value = {
      interviewEvaluation: "",
      status: "",
    };

    // 校验成功，执行提交逻辑
    console.log("表单数据:", formData.value);
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--popover);
  padding: 20px;
  border-radius: var(--radius);
  &.space-y-6 {
    margin-bottom: 20px;
  }
}

// 表单消息提示区域样式（比如错误提示等）
.error-message {
  color: var(--destructive-foreground);
  font-size: 14px;
  margin-top: 5px;
}

// 提交按钮样式
Button[type="submit"] {
  background-color: skyblue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

// 文本域样式调整
Textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px;
}
.dialog-title {
  display: block;
  font-size: 0.8rem;
  // font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 10px;
  word-spacing: 3px;
}
</style>
