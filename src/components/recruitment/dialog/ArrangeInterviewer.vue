<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="arrange-interviewer-wrapper">
        <!-- 箭头图标 -->
        <div class="arrow" @click="emit('close')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="rgba(0,0,0,0.5)"
              d="m6.59 6.84l5.66 5.66l-5.66 5.66l-.7-.71l4.95-4.95l-4.95-4.95zm4 0l5.66 5.66l-5.66 5.66l-.7-.71l4.95-4.95l-4.95-4.95z"
            />
          </svg>
        </div>
        <div class="arrange-interviewer">
          <div class="title text-center">
            <p>安排面试</p>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- 申请人字段 -->
            <FormField name="ApplyUser" class="ApplyUser">
              <FormItem>
                <FormLabel class="m-3 m-b-2">申请人</FormLabel>
                <FormControl>
                  <Input
                    v-model="formData.ApplyUser"
                    placeholder="填写申请人"
                  />
                </FormControl>
                <span class="form-message">{{ errors.ApplyUser }}</span>
              </FormItem>
            </FormField>
            <!-- 面试地点字段 -->
            <FormField name="place" class="place">
              <FormItem>
                <FormLabel class="m-3">面试地点</FormLabel>
                <FormControl>
                  <Input v-model="formData.place" placeholder="安排面试地点" />
                </FormControl>
                <span class="form-message">{{ errors.place }}</span>
              </FormItem>
            </FormField>
            <!-- 面试官字段 -->
            <FormField name="interviewer" class="interviewer">
              <FormItem class="flex flex-col">
                <FormLabel class="m-3">面试官</FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        :class="[
                          'pl-3 text-left font-normal',
                          formData.interviewer.length === 0 &&
                            'text-muted-foreground',
                        ]"
                      >
                        {{
                          formData.interviewer.length > 0
                            ? formData.interviewer
                                .map(
                                  (interviewer) =>
                                    choices?.find(
                                      (choice) => choice?.value === interviewer,
                                    )?.label || "",
                                )
                                .join(", ")
                            : "选择面试官"
                        }}
                        <ChevronsUpDownIcon
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="p-0" align="start">
                    <Command>
                      <CommandInput
                        v-model="searchName"
                        placeholder="搜索面试官"
                      />
                      <CommandList>
                        <CommandEmpty>未找到该面试官</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            v-for="choice in choices"
                            :key="choice.value"
                            :value="choice.label"
                            :class="{
                              'interviewer-selected':
                                formData.interviewer.includes(choice.value),
                            }"
                            @select="
                              () =>
                                handleInterviewerChange(choice.value, choice.id)
                            "
                          >
                            <CheckIcon
                              :class="[
                                'mr-2 h-4 w-4',
                                formData.interviewer.includes(choice.value)
                                  ? 'opacity-100'
                                  : 'opacity-50',
                              ]"
                            />
                            {{ choice.label }}
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <span class="form-message">{{ errors.interviewer }}</span>
              </FormItem>
            </FormField>
            <!-- 面试日期字段 -->
            <FormField name="date" class="date">
              <FormItem class="flex flex-col">
                <FormLabel class="m-3">面试日期 </FormLabel>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button
                        variant="outline"
                        :class="[
                          'pl-3 text-left font-normal',
                          !formData.date && 'text-muted-foreground',
                        ]"
                      >
                        <CalendarIcon
                          class="mr-2 h-4 w-4 shrink-0 opacity-50"
                        />
                        {{
                          formData.date
                            ? format(
                                new Date(
                                  formData.date.year,
                                  formData.date.month - 1,
                                  formData.date.day,
                                ),
                                "yyyy-MM-dd",
                              )
                            : `选择面试日期`
                        }}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="formData.date as any"
                      :on-date-change="handleDateUpdate"
                      mode="single"
                      locale="zh-CN"
                    />
                  </PopoverContent>
                </Popover>
                <span class="form-message">{{ errors.date }}</span>
              </FormItem>
            </FormField>
            <!-- 开始时间字段 -->
            <FormField name="startTime" class="startTime">
              <FormItem>
                <FormLabel class="m-3">开始时间</FormLabel>
                <FormControl>
                  <Input
                    v-model="formData.startTime"
                    placeholder="填写开始时间"
                  />
                </FormControl>
                <span class="form-message">{{ errors.startTime }}</span>
              </FormItem>
            </FormField>
            <!-- 结束时间字段 -->
            <FormField name="endTime" class="endTime">
              <FormItem>
                <FormLabel class="m-3">结束时间</FormLabel>
                <FormControl>
                  <Input
                    v-model="formData.endTime"
                    placeholder="填写结束时间"
                  />
                </FormControl>
                <span class="form-message">{{ errors.endTime }}</span>
              </FormItem>
            </FormField>
            <Button class="btn-style" type="submit">保存</Button>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits, watchEffect, watch } from "vue";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-icons/vue";
import { z } from "zod"; // 引入 Zod
import type { DateValue } from "@internationalized/date";
import {
  getAllInterviewer,
  arrangeInterviewer,
} from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();

const props = defineProps<{
  isOpen: boolean;
  id: string;
  name: string;
}>();
const emit = defineEmits(["close"]);

// 定义表单数据结构
const formData = reactive({
  ApplyUser: "",
  place: "",
  interviewer: [] as string[],
  date: null as DateValue | null,
  startTime: "",
  endTime: "",
});

//当props改变时清空所有表单项 没有变化时保留数据
watch(
  () => props.isOpen,
  () => {
    if (!props.isOpen) {
      Object.keys(formData).forEach((key) => {
        if (key === "date") {
          formData[key] = null;
        } else if (key === "interviewer") {
          formData[key] = [];
        } else {
          formData[
            key as Exclude<keyof typeof formData, "date" | "interviewer">
          ] = "";
        }
      });
      //清空错误信息
      Object.keys(errors).forEach((key) => {
        errors[key as keyof typeof errors] = "";
      });
    }
    formData.ApplyUser = props.name;
  },
);

// 定义 Zod 模式
const formSchema = z
  .object({
    ApplyUser: z.string().min(1, "申请人不能为空"),
    place: z.string().min(1, "面试地点不能为空"),
    interviewer: z
      .array(z.string())
      .min(2, "请选择至少两个面试官")
      .max(3, "最多选择三个面试官"),
    date: z
      .object({
        year: z.number(),
        month: z.number(),
        day: z.number(),
      })
      .nullable()
      .refine((date) => date !== null, "请选择面试日期"), // 修改错误消息
    startTime: z
      .string()
      .min(1, "开始时间不能为空")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "开始时间必须是有效的24小时制时间"),
    endTime: z
      .string()
      .min(1, "结束时间不能为空")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "结束时间必须是有效的24小时制时间"),
  })
  .superRefine(({ startTime, endTime }, ctx) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    const timeDifference = endDate.getTime() - startDate.getTime();

    if (timeDifference <= 20 * 60 * 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "结束时间必须在开始时间之后且间隔至少20分钟",
        path: ["endTime"],
      });
    }
  });

const choices = ref<[{ label: string; value: string; id: string }]>();
const searchName = ref("");
//从后端拿到面试官信息
import { onMounted } from "vue";

onMounted(() => {
  const { data, error } = useRequest(() =>
    getAllInterviewer({ pageNo: 1, pageSize: 100, name: searchName.value }),
  );

  watchEffect(() => {
    if (error.value) {
      console.log("error", error.value);
    }
    if (data.value?.data.code === 200) {
      choices.value = data.value?.data.data.data.map(
        (item: { id: string; name: string }) => ({
          label: item.name,
          value: item.name,
          id: item.id,
        }),
      );
    }
  });
});

const formatDate = (date: DateValue | null) => {
  return date
    ? format(new Date(date.year, date.month - 1, date.day), "yyyy-MM-dd")
    : "选择日期";
};

const selectedInterviewersIds = ref<string[]>([]);

//获取到选择的面试官的id
const handleInterviewerChange = (value: string, id: string) => {
  if (formData.interviewer.includes(value)) {
    formData.interviewer = formData.interviewer.filter(
      (interviewer) => interviewer !== value,
    );
    selectedInterviewersIds.value = selectedInterviewersIds.value.filter(
      (id) => id !== value,
    );
  } else {
    if (formData.interviewer.length < 3) {
      formData.interviewer.push(value);
      selectedInterviewersIds.value.push(id);
    } else {
      showAlert("最多选择三个面试官", "error");
    }
  }
};
// 处理日期更新
const handleDateUpdate = (value: DateValue | null) => {
  formData.date = value;
};

// 定义错误对象
const errors = reactive({
  ApplyUser: "",
  place: "",
  interviewer: "",
  date: "",
  startTime: "",
  endTime: "",
});

const handleSubmit = () => {
  //如果错误信息不为空，清空错误信息
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // 使用 Zod 进行校验
  const result = formSchema.safeParse(formData);

  if (result.success) {
    console.log("表单数据有效:", result.data);
    // 清空错误消息
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = "";
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dateString = `${formatDate(formData.date as any)}-${formData.startTime}-${formatDate(formData.date as any)}-${formData.endTime}`;
    // 提交表单数据
    const { data } = useRequest(() =>
      arrangeInterviewer({
        id: props.id,
        interviewTime: dateString,
        place: formData.place,
        firstHr: selectedInterviewersIds.value[0],
        secondHr: selectedInterviewersIds.value[1],
        thirdHr: selectedInterviewersIds.value[2],
      }),
    );
    watchEffect(() => {
      if (data.value) {
        console.log("data.value:", data.value);
        // showAlert("安排面试成功", "pass");
        // emit("close");
      }
      // if (data.value?) {
      //   showAlert("安排面试成功", "pass");
      //   emit("close");
      // }
      // if (error.value) {
      //   showAlert("安排面试失败", "error");
      // }
    });
  } else {
    console.error("表单数据无效:", result.error);
    // 处理校验错误，例如显示错误消息
    result.error.issues.forEach((issue) => {
      errors[issue.path[0] as keyof typeof errors] = issue.message;
    });
  }
};
</script>

<style lang="scss">
@use "@/assets/styles/recruitment.scss";
.interviewer-selected {
  background-color: var(--accent);
  border-left: 3px solid var(--accent);
  padding-left: 5px;
  margin-left: -5px;
}
.btn-style {
  margin: 0 auto;
  width: 80%;
  padding: 10px;
  border-radius: var(--radius);
  border: solid 1px var(--input);
  cursor: pointer;
}
.arrow {
  width: 35px;
  height: 35px;
  margin-left: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  z-index: 100;
  font-size: 30px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
}
.arrange-interviewer-wrapper {
  padding: 50px;
  width: 40%;
  height: 100%;
  background-color: var(--popover);
  position: fixed;
  top: 0;
  left: 60%;
  z-index: 43;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 30px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.arrange-interviewer {
  width: 80%;
  background-color: var(--popover);
  height: 100%;
  position: relative;
  padding: 0 40px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  width: 100%;
}
.form-message {
  color: var(--destructive-foreground);
  font-size: 12px;
}

// 时间选择器样式
.vue__time-picker {
  width: 100%;
  input {
    padding: 10px;
    border: 1px solid #ccc;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
