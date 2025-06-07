<template>
  <Teleport to="body">
    <div v-if="isOpen" class="outer" @click="emit('close')">
      <div v-if="isOpen" class="arrange-interviewer-wrapper" @click.stop>
        <form class="w-2/3 space-y-6 form" @submit="onSubmit">
          <FormField
            v-slot="{ componentField }"
            name="applyUserName"
            :validate-on-blur="true"
          >
            <FormItem>
              <FormLabel>申请人</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入申请人姓名"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="place"
            :validate-on-blur="true"
          >
            <FormItem>
              <FormLabel>面试地点</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入面试地点"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="date"
            :validate-on-blur="true"
          >
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <DatePicker
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField.onChange"
                  @blur="componentField.onBlur"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="startTime"
            :validate-on-blur="true"
          >
            <FormItem>
              <FormLabel>开始时间</FormLabel>
              <FormControl>
                <TimePicker
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField.onChange"
                  @blur="componentField.onBlur"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="endTime"
            :validate-on-blur="true"
          >
            <FormItem>
              <FormLabel>结束时间</FormLabel>
              <FormControl>
                <TimePicker
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField.onChange"
                  @blur="componentField.onBlur"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="interviewer"
            :validate-on-blur="true"
          >
            <FormItem>
              <FormLabel>面试官</FormLabel>
              <FormControl>
                <SearchSelect
                  v-model="componentField.modelValue"
                  :selected-list="props.interviewers"
                  empty-message="没有找到面试官"
                  @update:model-value="componentField.onChange"
                  @blur="componentField.onBlur"
                />
              </FormControl>
              <FormDescription> </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="arrange-submit btn-style"> 提交 </Button>
          <Button
            class="cancel arrange-cancel btn-style"
            @click="emit('close')"
          >
            取消
          </Button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker, TimePicker} from "@/components/common/date-picker";
import {SearchSelect } from "@/components/common/search-select";
import { watch } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();

const props = defineProps<{
  isOpen: boolean;
  id: string;
  name: string;
  interviewers: Array<{ id: string; label: string }>;
}>();
const emit = defineEmits<{
  (e: "close" | "refresh"): void;
  (
    e: "submit",
    value: {
      userId: string;
      place: string;
      startTime: string;
      endTime: string;
      firstHr: string | "";
      secondHr: string | "";
      thirdHr: string | "";
    },
  ): void;
}>();
// 自定义校验函数
const validateTimeRange = (startTime: string, endTime: string) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  return diffInMinutes >= 20 && diffInMinutes <= 60;
};
const formSchema = toTypedSchema(
  z
    .object({
      applyUserName: z
        .string({
          required_error: "用户名不能为空",
          invalid_type_error: "用户名必须是字符串",
        })
        .min(2, { message: "用户名至少需要2个字符" })
        .max(50, { message: "用户名最多不能超过50个字符" }),
      place: z
        .string({
          required_error: "面试地点不能为空",
          invalid_type_error: "面试地点必须是字符串",
        })
        .min(2, { message: "面试地点至少需要2个字符" })
        .max(50, { message: "面试地点最多不能超过50个字符" }),
      date: z.object({
        year: z.number().min(2025, { message: "年份必须大于2025" }),
        month: z.number().min(1, { message: "月份必须大于0" }),
        day: z.number().min(1, { message: "日期必须大于0" }),
      }),
      startTime: z.string({
        required_error: "开始时间不能为空",
        invalid_type_error: "开始时间必须是字符串",
      }),
      endTime: z
        .string({
          required_error: "结束时间不能为空",
          invalid_type_error: "结束时间必须是字符串",
        })
        .min(2, { message: "结束时间至少需要2个字符" })
        .max(50, { message: "结束时间最多不能超过50个字符" }),
      interviewer: z
        .array(
          z.object({
            id: z.string().or(z.number().transform(String)),
            label: z.string(),
          }),
        )
        .min(2, { message: "至少选择2位面试官" })
        .max(3, { message: "最多选择3位面试官" }),
    })
    .refine((data) => validateTimeRange(data.startTime, data.endTime), {
      message: "结束时间必须在开始时间后至少20分钟,至多1小时",
      path: ["endTime"],
    }),
);

const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  emit("submit", {
    userId: props.id,
    place: values.place,
    startTime: `${values.date.year}-${String(values.date.month).padStart(2, "0")}-${String(values.date.day).padStart(2, "0")} ${values.startTime}`,
    endTime: `${values.date.year}-${String(values.date.month).padStart(2, "0")}-${String(values.date.day).padStart(2, "0")} ${values.endTime}`,
    firstHr: values.interviewer[0].id,
    secondHr: values.interviewer[1].id,
    thirdHr: values.interviewer[2]?.id || "",
  });
  showAlert("Success", "pass");
  emit("close");
  emit("refresh");
});
watch(props, () => {
  setValues({
    applyUserName: props.name,
  });
});
</script>

<style lang="scss" scoped>
.text-destructive {
  color: var(--destructive-foreground);
}

.interviewer-selected {
  background-color: var(--accent);
  border-left: 3px solid var(--accent);
  padding-left: 5px;
  margin-left: -5px;
}

.arrange-interviewer-wrapper {
  padding: 50px;
  width: 500px;
  height: 100%;
  background-color: var(--popover);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 43;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 30px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  background-color: var(--popover);
  height: 100%;
  position: relative;
  overflow-y: scroll;
}

.arrange-submit {
  position: relative;
  border: 1px solid #ccc;
  font-size: 0.8rem;
  background-color: var(--accent);
}

.arrange-cancel {
  position: relative;
  border: 1px solid #ccc;
  font-size: 0.8rem;
}
</style>
