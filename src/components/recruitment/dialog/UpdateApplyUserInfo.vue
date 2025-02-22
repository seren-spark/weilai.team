<template>
  <Teleport to="body">
    <div v-if="props.isOpen" class="outer" @click="close">
      <form @submit.prevent="handleSubmit">
        <div class="text-center title">
          <p>修改用户信息</p>
          <span class="close" @click="close">&times;</span>
        </div>
        <!-- 班级字段 -->
        <FormField name="clazz" class="clazz">
          <FormItem
            :class="{
              'has-error': formErrors.clazz && formErrors.clazz.length > 0,
            }"
          >
            <FormLabel>班级</FormLabel>
            <FormControl>
              <Input
                v-model="formData.clazz"
                class="input"
                placeholder="写入想要修改的班级"
                @focus="clearError('clazz')"
              />
            </FormControl>
            <span class="form-message">{{ formErrors.clazz?.join(", ") }}</span>
          </FormItem>
        </FormField>
        <!-- 名字字段 -->
        <FormField name="name" class="name">
          <FormItem
            :class="{
              'has-error': formErrors.name && formErrors.name.length > 0,
            }"
          >
            <FormLabel>名字</FormLabel>
            <FormControl>
              <Input
                v-model="formData.name"
                class="input"
                placeholder="输入想要修改的名字"
                @focus="clearError('name')"
              />
            </FormControl>
            <span class="form-message">{{ formErrors.name?.join(", ") }}</span>
          </FormItem>
        </FormField>
        <!-- 年级字段 -->
        <FormField name="grade" class="grade">
          <FormItem
            :class="{
              'has-error': formErrors.grade && formErrors.grade.length > 0,
            }"
          >
            <FormLabel>年级</FormLabel>
            <FormControl>
              <Input
                v-model="formData.grade"
                class="input"
                placeholder="输入想要修改的年级"
                @focus="clearError('grade')"
              />
            </FormControl>
            <span class="form-message">{{ formErrors.grade?.join(", ") }}</span>
          </FormItem>
        </FormField>
        <!-- 邮箱字段 -->
        <FormField name="email" class="email">
          <FormItem
            :class="{
              'has-error': formErrors.email && formErrors.email.length > 0,
            }"
          >
            <FormLabel>邮箱</FormLabel>
            <FormControl>
              <Input
                v-model="formData.email"
                class="input"
                placeholder="输入要修改的邮箱"
                @focus="clearError('email')"
              />
            </FormControl>
            <span class="form-message">{{ formErrors.email?.join(", ") }}</span>
          </FormItem>
        </FormField>
        <!-- QQ字段 -->
        <FormField name="qq" class="qq">
          <FormItem
            :class="{ 'has-error': formErrors.qq && formErrors.qq.length > 0 }"
          >
            <FormLabel>qq</FormLabel>
            <FormControl>
              <Input
                v-model="formData.qq"
                class="input"
                placeholder="输入想修改的qq"
                @focus="clearError('qq')"
              />
            </FormControl>
            <span class="form-message">{{ formErrors.qq?.join(", ") }}</span>
          </FormItem>
        </FormField>
        <!-- 性别字段 -->
        <FormField name="gender" class="gender">
          <FormItem
            :class="{
              'has-error': formErrors.gender && formErrors.gender.length > 0,
            }"
          >
            <FormLabel>性别</FormLabel>
            <FormControl>
              <Select v-model="formData.gender" @click="clearError('gender')">
                <SelectTrigger>
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <span class="form-message">{{
              formErrors.gender?.join(", ")
            }}</span>
          </FormItem>
        </FormField>
        <!-- 学号字段 -->
        <FormField name="studentId" class="studentId">
          <FormItem
            :class="{
              'has-error':
                formErrors.studentId && formErrors.studentId.length > 0,
            }"
          >
            <FormLabel>学号</FormLabel>
            <FormControl>
              <Input
                v-model="formData.studentId"
                class="input"
                placeholder="输入想修改的学号"
                @focus="clearError('studentId')"
              />
            </FormControl>
            <span class="form-message">{{
              formErrors.studentId?.join(", ")
            }}</span>
          </FormItem>
        </FormField>
        <Button type="submit" class="submit">提交修改</Button>
      </form>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateApplyUserInfo } from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import { watchEffect } from "vue";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();

const props = defineProps({
  isOpen: Boolean,
  id: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["close"]);
const close = (event: Event) => {
  // 点击遮罩层关闭
  if (event.target === event.currentTarget) {
    emit("close");
  }
  return;
};

// 定义 Zod 验证模式
const formSchema = z.object({
  clazz: z.string(),
  name: z.string(),
  grade: z.string(),
  email: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === "" ||
        (value &&
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)),
      { message: "请输入有效的邮箱地址" },
    ),
  qq: z.string(),
  gender: z.string(),
  studentId: z.string(),
});

const formData = reactive({
  clazz: "",
  name: "",
  grade: "",
  email: "",
  qq: "",
  gender: "",
  studentId: "",
});

// 初始化 formErrors 时包含所有可能的字段
const formErrors = ref<{
  clazz?: string[];
  name?: string[];
  grade?: string[];
  email?: string[];
  qq?: string[];
  gender?: string[];
  studentId?: string[];
}>({
  clazz: [],
  name: [],
  grade: [],
  email: [],
  qq: [],
  gender: [],
  studentId: [],
});

const clearError = (fieldName: keyof typeof formData) => {
  formErrors.value[fieldName] = [];
};

const handleSubmit = async () => {
  try {
    console.log("开始验证表单数据");
    // 验证表单数据
    await formSchema.parseAsync(formData);
    console.log("表单验证成功:", formData);
    // 在这里处理表单提交逻辑
    const { data } = useRequest(() =>
      updateApplyUserInfo({
        id: String(props.id),
        clazz: formData.clazz,
        email: formData.email,
        grade: formData.grade,
        name: formData.name,
        qq: formData.qq,
        sex: formData.gender,
        studentId: formData.studentId,
      }),
    );
    watchEffect(() => {
      // console.log("data.value:", data.value);
      // 监听 data 变化，当请求成功时，关闭对话框
      if (data.value) {
        console.log(data.value);
        emit("close");
        showAlert("修改成功", "pass");
      }
    });

    formErrors.value = {}; // 清空错误信息
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod 错误:", error.formErrors.fieldErrors);
      // 处理验证错误，例如显示错误信息
      formErrors.value = error.formErrors.fieldErrors;
    }
  }
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/recruitment.scss";
/* 确保错误信息可见 */
.form-message {
  color: var(--destructive-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: 0.5rem;
}
form {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 20px repeat(5, 1fr);
  grid-template-areas:
    "title title"
    "clazz name"
    "grade grade"
    "email qq"
    "gender studentId"
    "submit submit";
  gap: 20px;
  height: 500px;
  width: 600px;
  background-color: var(--popover);
  padding: 20px;
  border-radius: var(--radius);
}
.title {
  grid-area: title;
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    font-size: 1.5em;
  }
}

.clazz {
  grid-area: clazz;
}

.name {
  grid-area: name;
}

.grade {
  grid-area: grade;
}

.email {
  grid-area: email;
}

.qq {
  grid-area: qq;
}

.gender {
  grid-area: gender;
}

.studentId {
  grid-area: studentId;
}

.submit {
  grid-area: submit;
}
/* 标记错误的表单项 */
.has-error .input {
  border-color: var(--destructive-foreground);
}
</style>
