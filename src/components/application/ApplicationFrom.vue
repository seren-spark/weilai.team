<script setup lang="ts">
import { onUnmounted, ref, reactive, watch } from "vue";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { applicationStore } from "@/store/applicationStore";
import useApplication from "@/composables/useSendApplication";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/vue";
import PlaneAnimation from "./PlaneAnimation.vue";

const useApplicationStore = applicationStore();
useApplicationStore.isGetCode();
// const { loading } = useLogin()
const loading = ref(false);
const stuInformData = reactive({
  clazz: "计科241" as string,
  code: "" as string | number | undefined,
  email: "" as string | number | undefined,
  name: "" as string | number | undefined,
  qqNumber: "" as string | number | undefined,
  sex: "男" as string,
  studentId: "" as string | number | undefined,
  file1: null as unknown as File,
  file2: null as unknown as File,
});

interface stuErrors {
  code: string;
  email: string;
  name: string;
  qqNumber: string;
  studentId: string;
  file1: string;
  file2: string;
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    convertToBinary(file);
  }
}

function convertToBinary(file: File, fileType: "file1" | "file2") {
  const reader = new FileReader();
  reader.onload = (e) => {
    const binaryData = e.target?.result;
    if (binaryData) {
      const newFile = new File([binaryData], file.name, { type: file.type });

      if (fileType === "file1") {
        stuInformData.file1 = newFile;
        emitUpdataFile1(newFile);
      } else {
        stuInformData.file2 = newFile;
        emitUpdataFile2(newFile);
      }
    } else {
      console.error("Failed to read file as binary data");
    }
  };
  reader.readAsArrayBuffer(file);
}

const appStore = applicationStore();

const filedErrors = ref<z.ZodFormattedError<stuErrors> | undefined>();
const stuSchema = z.object({
  code: z.string().min(1, "验证码不能为空"),
  email: z.string().min(1, "邮箱不能为空").email("请输入正确的邮箱"),
  name: z.string().min(1, "姓名不能为空"),
  qqNumber: z.string().min(1, "QQ号不能为空"),
  studentId: z.string().min(11, "学号应为11位").max(11, "学号应为11位"),
  file1: z
    .literal(null)
    .refine(() => false, {
      message: "请选择文件", // 如果没有选择文件，返回这个提示
    })
    .or(
      z.instanceof(File).refine(
        (file) => {
          // 获取文件的 MIME 类型
          const mimeType = file.type;
          // 允许的图片文件类型
          return (
            mimeType === "image/png" ||
            mimeType === "image/jpeg" ||
            mimeType === "image/jpg"
          );
        },
        {
          message: "请选择一个有效的图片文件(PNG, JPG, JPEG)",
        },
      ),
    ),
  file2: z
    .literal(null)
    .refine(() => false, {
      message: "请选择文件", // 如果没有选择文件，返回这个提示
    })
    .or(
      z.instanceof(File).refine(
        (file) => {
          // 获取文件的 MIME 类型
          const mimeType = file.type;
          // 允许的图片文件类型
          return (
            mimeType === "image/png" ||
            mimeType === "image/jpeg" ||
            mimeType === "image/jpg"
          );
        },
        {
          message: "请选择一个有效的图片文件(PNG, JPG, JPEG)",
        },
      ),
    ),
});

const emailOnlySchema = stuSchema.pick({
  email: true,
});

const stuBasicSchema = stuSchema.pick({
  code: true,
  email: true,
  name: true,
  qqNumber: true,
  studentId: true,
});

const validateStu = () => {
  const stuResult = stuSchema.safeParse({
    code: stuInformData.code,
    email: stuInformData.email,
    name: stuInformData.name,
    qqNumber: stuInformData.qqNumber,
    studentId: stuInformData.studentId,
    file1: stuInformData.file1,
    file2: stuInformData.file2,
  });
  if (!stuResult.success) {
    filedErrors.value = stuResult.error.format();
  }
  return stuResult.success;
};

const validateCode = () => {
  const result = emailOnlySchema.safeParse({
    email: stuInformData.email,
  });
  if (!result.success) {
    filedErrors.value = result.error.format();
  }
  return result.success;
};

const valiFirstDate = () => {
  const stuBasic = stuBasicSchema.safeParse({
    code: stuInformData.code,
    email: stuInformData.email,
    name: stuInformData.name,
    qqNumber: stuInformData.qqNumber,
    studentId: stuInformData.studentId,
  });

  if (!stuBasic.success) {
    filedErrors.value = stuBasic.error.format();
  }
  return stuBasic.success;
};

// 判空处理提交表单数据函数
const handleSend = async () => {
  if (!validateStu()) {
    return;
  }
  watch(
    () => loading,
    () => {
      console.log(loading);
    },
  );
  const formData = new FormData();
  formData.append("clazz", stuInformData.clazz);
  formData.append("code", String(stuInformData.code) || "");
  formData.append("email", String(stuInformData.email) || "");
  formData.append("name", String(stuInformData.name) || "");
  formData.append("qqNumber", String(stuInformData.qqNumber) || "");
  formData.append("sex", stuInformData.sex);
  formData.append("studentId", String(stuInformData.studentId) || "");
  formData.append("file1", stuInformData.file1);
  formData.append("file2", stuInformData.file2);
  sentStuInfo(formData);
};

// Emit更新事件
const emitUpdataCode = (val: string | number | undefined) => {
  stuInformData.code = val;
  const result = stuSchema.pick({ code: true }).safeParse({
    code: val,
  });
  if (filedErrors.value) {
    filedErrors.value.code = result.error?.format().code;
  }
};

const emitUpdataFile1 = (val: File) => {
  stuInformData.file1 = val;
  const result = stuSchema.pick({ file1: true }).safeParse({
    file1: val,
  });
  if (filedErrors.value) {
    filedErrors.value.file1 = result.error?.format().file1;
  }
};

const emitUpdataFile2 = (val: File) => {
  stuInformData.file2 = val;
  const result = stuSchema.pick({ file2: true }).safeParse({
    file2: val,
  });
  if (filedErrors.value) {
    filedErrors.value.file2 = result.error?.format().file2;
  }
};

const emitUpdataEmail = (val: string | number | undefined) => {
  stuInformData.email = val;
  const result = stuSchema.pick({ email: true }).safeParse({
    email: val,
  });
  if (filedErrors.value) {
    filedErrors.value.email = result.error?.format().email;
  }
};
const emitUpdataName = (val: string | number | undefined) => {
  stuInformData.name = val;
  const result = stuSchema.pick({ name: true }).safeParse({
    name: val,
  });
  if (filedErrors.value) {
    filedErrors.value.name = result.error?.format().name;
  }
};
const emitUpdataQqNumber = (val: string | number | undefined) => {
  stuInformData.qqNumber = val;
  const result = stuSchema.pick({ qqNumber: true }).safeParse({
    qqNumber: val,
  });
  if (filedErrors.value) {
    filedErrors.value.qqNumber = result.error?.format().qqNumber;
  }
};
const emitUpdataStudentId = (val: string | number | undefined) => {
  stuInformData.studentId = val;
  const result = stuSchema.pick({ studentId: true }).safeParse({
    studentId: val,
  });
  if (filedErrors.value) {
    filedErrors.value.studentId = result.error?.format().studentId;
  }
};
const emitUpdataSex = (val: string) => {
  stuInformData.sex = val;
};
const emitUpdataClazz = (val: string) => {
  stuInformData.clazz = val;
};

const { runGetClass, classListData, getCode, sentStuInfo } = useApplication();
runGetClass();

const handleCode = async () => {
  if (!validateCode()) {
    return;
  }

  watch(
    () => loading,
    () => {
      console.log(loading);
    },
  );
  getCode(stuInformData.email);
};

const currentStep = ref(2);
const showAreaPicker = ref(false);
const showUploadOptions = ref(false);
const showCamera = ref(false);
const photo = ref(1);

const resumeFile1 = ref<File>();
const resumeFile2 = ref<File>();
const resumePreview1 = ref<string>();
const resumePreview2 = ref<string>();

const fileInput1 = ref<HTMLInputElement>();
const fileInput2 = ref<HTMLInputElement>();
const videoElement = ref<HTMLVideoElement>();
const canvasElement = ref<HTMLCanvasElement>();

const nextStep = () => {
  if (valiFirstDate()) {
    currentStep.value = 2;
  }
};

const prevStep = () => {
  currentStep.value = 1;
};

const selectArea = (area: string) => {
  //   formData.value.area = area;
  showAreaPicker.value = false;
};

const selectFile = () => {
  showUploadOptions.value = false;
  if (photo.value == 1) {
    fileInput1.value?.click();
  } else if (photo.value == 2) {
    fileInput2.value?.click();
  }
};

// 预览
const handleFile1Select = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    resumeFile1.value = file;
    // 如果是图片文件，生成预览
    if (file.type.startsWith("image/")) {
      stuInformData.file1 = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        resumePreview1.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
};

const handleFile2Select = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    resumeFile2.value = file;

    // 如果是图片文件，生成预览
    if (file.type.startsWith("image/")) {
      stuInformData.file2 = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        resumePreview2.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
};

// 打开相机
const openCamera = async () => {
  showUploadOptions.value = false;
  showCamera.value = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
    }
  } catch (error) {
    console.error("无法访问相机:", error);
    alert("无法访问相机，请检查权限设置");
    showCamera.value = false;
  }
};

const capturePhoto = () => {
  if (videoElement.value && canvasElement.value) {
    const video = videoElement.value;
    const canvas = canvasElement.value;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `resume_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        if (photo.value === 1) {
          resumeFile1.value = file;
          resumePreview1.value = canvas.toDataURL();
        } else if (photo.value === 2) {
          resumeFile2.value = file;
          resumePreview2.value = canvas.toDataURL();
        }
        closeCamera();
      }
    });
  }
};

const closeCamera = () => {
  if (videoElement.value?.srcObject) {
    const stream = videoElement.value.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
  }
  showCamera.value = false;
};

const removeFile = (key: number) => {
  if (key == 1) {
    resumeFile1.value = undefined;
    resumePreview1.value = "";
  } else if (key == 2) {
    resumeFile2.value = undefined;
    resumePreview2.value = "";
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

onUnmounted(() => {
  // 确保在组件卸载时正确关闭相机
  if (showCamera.value) {
    closeCamera();
  }
});
</script>

<template>
  <div class="recruitment-form">
    <!-- <div id="plane" :style="planeStyle">
      <Icon icon="fa-solid:paper-plane" aria-hidden="true"></Icon>
    </div> -->
    <PlaneAnimation />
    <Card class="mx-auto border-0 bg-0 recruitment-card">
      <div class="applyTitle">
        <img src="@/assets/img/小组logo.png" alt="logo" class="applyLogo" />
        <div class="applyTitleText">投递简历</div>
        <div class="step-indicator">
          <div class="step">
            <div class="step-icon">
              <Icon
                v-if="currentStep === 1"
                icon="material-symbols:person"
              ></Icon>
              <Icon
                v-if="currentStep === 2"
                class="correctIcon"
                icon="material-symbols:check"
              ></Icon>
              <!-- <CheckIcon /> -->
            </div>
            <span class="step-label">基础信息</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-icon">
              <Icon icon="material-symbols:post-add"></Icon>
            </div>
            <span class="step-label">上传简历</span>
          </div>
        </div>
      </div>
      <CardContent class="bg-card applyContent">
        <div v-if="currentStep === 1" class="grid gap-4 applyForm">
          <div class="section-header">
            <div class="section-title">基本信息</div>
          </div>
          <div class="grid gap-2">
            <Label for="first-name" class="text-base font-bold form-label"
              >姓名
            </Label>
            <div v-if="filedErrors?.name?._errors" class="errorHead">
              <Icon
                class="errorIcon"
                icon="material-symbols:account-circle-outline"
              ></Icon>
              <span>{{ filedErrors?.name?._errors[0] }}</span>
            </div>
            <Input
              id="first-name"
              placeholder="姓名"
              required
              class="text-base py-3 h-12 form-input"
              :class="{
                noWrite: filedErrors?.name?._errors,
                'focus-visible:ring-red-300 error-border':
                  filedErrors?.name?._errors,
              }"
              :model-value="stuInformData.name"
              @update:model-value="(val) => emitUpdataName(val)"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <Label for="sex" class="text-base font-bold form-label"
              >性别
            </Label>
            <RadioGroup
              :model-value="stuInformData.sex"
              default-value="option-one"
              style="display: flex"
              @update:model-value="(val) => emitUpdataSex(val)"
            >
              <div class="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-one"
                  class="custom-radio"
                  value="男"
                />
                <Label for="男" class="form-label">男</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-two"
                  class="custom-radio"
                  value="女"
                />
                <Label for="女" class="form-label">女</Label>
              </div>
            </RadioGroup>
          </div>
          <div class="section-header">
            <div class="section-title">班级信息</div>
          </div>
          <div class="grid gap-2 class-info">
            <Label for="last-name" class="text-base font-bold form-label"
              >班级
            </Label>
            <Select
              class="text-base py-3 h-12 form-input"
              :model-value="stuInformData.clazz"
              @update:model-value="(val) => emitUpdataClazz(val)"
            >
              <SelectTrigger id=" category" aria-label="Select category">
                <SelectValue placeholder="请选择班级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="(item, index) in classListData"
                  :key="index"
                  :value="item"
                  >{{ item }}</SelectItem
                >
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="student-id" class="text-base font-bold form-label"
              >学号</Label
            >
            <div v-if="filedErrors?.studentId?._errors" class="errorHead">
              <Icon class="errorIcon" icon="la:id-card"></Icon>
              <span>{{ filedErrors?.studentId?._errors[0] }}</span>
            </div>
            <Input
              id="student-id"
              class="text-base py-3 h-12 form-input"
              :class="{
                noWrite: filedErrors?.studentId?._errors,
                'focus-visible:ring-red-300 error-border':
                  filedErrors?.studentId?._errors,
              }"
              :model-value="stuInformData.studentId"
              @update:model-value="(val) => emitUpdataStudentId(val)"
              placeholder="学号"
              required
            />
          </div>
          <div class="section-header">
            <div class="section-title">联系方式</div>
          </div>
          <div class="grid gap-2">
            <Label for="qq-num" class="text-base font-bold form-label"
              >QQ
            </Label>
            <div v-if="filedErrors?.qqNumber?._errors" class="errorHead">
              <Icon class="errorIcon" icon="mingcute:qq-line"></Icon>
              <span>{{ filedErrors?.qqNumber?._errors[0] }}</span>
            </div>
            <Input
              id="qq-num"
              class="text-base py-3 h-12 form-input"
              :class="{
                noWrite: filedErrors?.qqNumber?._errors,
                'focus-visible:ring-red-300 error-border':
                  filedErrors?.qqNumber?._errors,
              }"
              :model-value="stuInformData.qqNumber"
              @update:model-value="(val) => emitUpdataQqNumber(val)"
              placeholder="QQ"
            />
          </div>
          <div class="grid gap-2">
            <Label for="email" class="text-base font-bold form-label"
              >邮箱
            </Label>
            <div v-if="filedErrors?.email?._errors" class="errorHead">
              <Icon class="errorIcon" icon="ic:outline-email"></Icon>
              <span>{{ filedErrors?.email?._errors[0] }}</span>
            </div>
            <Input
              id="email"
              class="text-base py-3 h-12 form-input"
              :class="{
                noWrite: filedErrors?.email?._errors,
                'focus-visible:ring-red-300 error-border':
                  filedErrors?.email?._errors,
              }"
              :model-value="stuInformData.email"
              type="email"
              @update:model-value="(val) => emitUpdataEmail(val)"
              placeholder="邮箱"
            />
          </div>
          <div class="grid gap-2">
            <Label for="email" class="text-base font-bold form-label"
              >验证码
            </Label>
            <div v-if="filedErrors?.code?._errors" class="errorHead">
              <Icon class="errorIcon" icon="material-symbols:ads-click"></Icon>
              <span>{{ filedErrors?.code?._errors[0] }}</span>
            </div>
            <div class="flex w-full max-w-sm items-center gap-1.5">
              <Input
                id="code"
                class="text-base py-3 h-12 form-input"
                :class="{
                  noWrite: filedErrors?.code?._errors,
                  'focus-visible:ring-red-300 error-border':
                    filedErrors?.code?._errors,
                }"
                :model-value="stuInformData.code"
                placeholder="请输入验证码"
                @update:model-value="(val) => emitUpdataCode(val)"
              />
              <button
                v-if="!appStore.isRequesting"
                type="submit"
                class="form-btn getCode"
                @click="handleCode()"
              >
                获取验证码
              </button>
              <Button v-if="appStore.isRequesting" disabled>
                {{ useApplicationStore.countdown }}s后重新发送
              </Button>
            </div>
          </div>
          <!-- <div class="grid gap-2">
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label for="tabular" class="text-base font-bold form-label"
                >报名表
              </Label>
              <div v-if="filedErrors?.file?._errors" class="errorHead">
                <Icon class="errorIcon" icon="solar:file-broken"></Icon>
                <span>{{ filedErrors?.file?._errors[0] }}</span>
              </div>
              <Input
                id="picture"
                type="file"
                class="text-base py-3 h-12 form-input"
                :class="{ noWrite: filedErrors?.file?._errors }"
                accept=".docx"
                multiple
                @change="handleFileChange"
              />
            </div>
          </div> -->
          <button class="next-btn" @click.prevent="nextStep">下一页</button>
        </div>
        <div v-if="currentStep === 2" class="applyForm">
          <div class="section-header">
            <div class="section-title">上传简历</div>
            <div class="section-subtitle">
              请上传您的个人简历，支持拍照或选择文件
            </div>
          </div>
          <div class="upload-section">
            <div
              class="upload-area"
              @click="
                showUploadOptions = true;
                photo = 1;
              "
            >
              <div v-if="filedErrors?.file1?._errors" class="errorHead">
                <Icon class="errorIcon" icon="solar:file-broken"></Icon>
                <span>{{ filedErrors?.file1?._errors[0] }}</span>
              </div>
              <div class="upload-placeholder">
                <Icon icon="material-symbols:upload" class="upload-icon"></Icon>
                <p>点击上传简历正面</p>
                <span>支持图片格式</span>
              </div>
            </div>
            <div
              class="upload-area"
              @click="
                showUploadOptions = true;
                photo = 2;
              "
            >
              <div v-if="filedErrors?.file2?._errors" class="errorHead">
                <Icon class="errorIcon" icon="solar:file-broken"></Icon>
                <span>{{ filedErrors?.file2?._errors[0] }}</span>
              </div>
              <div class="upload-placeholder">
                <Icon icon="material-symbols:upload" class="upload-icon"></Icon>
                <p>点击上传简历反面</p>
                <span>支持图片格式</span>
              </div>
            </div>
            <!-- 已上传文件列表 -->
            <div
              v-if="resumeFile1 != undefined || resumeFile2 != undefined"
              class="uploaded-files"
            >
              <h3>已上传文件</h3>
              <div class="file-list">
                <div v-if="resumeFile1 != undefined" class="uploaded-file">
                  <Icon
                    icon="material-symbols:docs-outline"
                    class="file-icon"
                  ></Icon>
                  <div class="file-info">
                    <p class="file-name">{{ resumeFile1.name }}</p>
                    <span class="file-size">{{
                      formatFileSize(resumeFile1.size)
                    }}</span>
                  </div>
                  <button class="remove-file" @click="removeFile(1)">
                    <Icon icon="material-symbols:close-small"></Icon>
                  </button>
                </div>
                <div v-if="resumeFile2 != undefined" class="uploaded-file">
                  <Icon
                    icon="material-symbols:docs-outline"
                    class="file-icon"
                  ></Icon>
                  <div class="file-info">
                    <p class="file-name">{{ resumeFile2.name }}</p>
                    <span class="file-size">{{
                      formatFileSize(resumeFile2.size)
                    }}</span>
                  </div>
                  <button class="remove-file" @click="removeFile(2)">
                    <Icon icon="material-symbols:close-small"></Icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- 文件预览区域 -->
            <div
              v-if="resumeFile1 != undefined || resumeFile2 != undefined"
              class="preview-section"
            >
              <h3>文件预览</h3>
              <div class="preview-grid">
                <div v-if="resumeFile1 != undefined" class="preview-item">
                  <img
                    :src="resumePreview1"
                    :alt="`文件预览`"
                    class="resume-preview"
                  />
                  <p class="preview-filename">简历正面</p>
                </div>
                <div v-if="resumeFile2 != undefined" class="preview-item">
                  <img
                    :src="resumePreview2"
                    :alt="`文件预览`"
                    class="resume-preview"
                  />
                  <p class="preview-filename">简历反面</p>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="prev-btn" @click="prevStep">上一步</button>
            <button class="submit-btn" @click="handleSend">提交申请</button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 上传选项弹窗 -->
    <div
      v-if="showUploadOptions"
      class="modal-overlay"
      @click="showUploadOptions = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>选择上传方式</h3>
          <button @click="showUploadOptions = false">
            <Icon icon="material-symbols:close-small"></Icon>
          </button>
        </div>
        <div class="upload-options">
          <button class="upload-option" @click="openCamera">
            <Icon icon="material-symbols:add-a-photo-outline"></Icon>
            拍照上传
          </button>
          <button class="upload-option" @click="selectFile">
            <Icon icon="material-symbols:file-export-outline"></Icon>
            选择文件
          </button>
        </div>
      </div>
    </div>

    <!-- 上传文件隐藏 -->
    <input
      id="picture"
      ref="fileInput1"
      type="file"
      :class="{ noWrite: filedErrors?.file1?._errors }"
      accept=".jpg,.jpeg,.png"
      multiple
      style="display: none"
      @change="handleFile1Select"
    />

    <input
      id="picture"
      ref="fileInput2"
      type="file"
      :class="{ noWrite: filedErrors?.file2?._errors }"
      accept=".jpg,.jpeg,.png"
      multiple
      style="display: none"
      @change="handleFile2Select"
    />

    <!-- 相机弹窗 -->
    <div v-if="showCamera" class="modal-overlay">
      <div class="camera-modal">
        <div class="camera-header">
          <button @click="closeCamera">
            <Icon icon="material-symbols:close-small"></Icon>
          </button>
          <h3>拍照上传</h3>
        </div>
        <div class="camera-container">
          <video ref="videoElement" autoplay playsinline></video>
          <canvas ref="canvasElement" style="display: none"></canvas>
        </div>
        <div class="camera-controls">
          <button class="capture-btn" @click="capturePhoto">
            <Icon icon="material-symbols:photo-camera-outline"></Icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.recruitment-form {
  .recruitment-card {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;

    .applyTitle {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      //   padding: 20px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      //   margin-bottom: 30px;
      padding: 40px 15px;

      .applyLogo {
        width: 6.6rem;
        padding-bottom: 0.5rem;
      }
      .applyTitleText {
        line-height: 4rem;
        font-size: 1.8rem;
        font-weight: 800;
        font-family: "华文楷体";
      }

      .step-indicator {
        display: flex;
        margin-left: 40px;

        .step {
          text-align: center;
          margin-left: 30px;
          .step-icon {
            width: 50px;
            height: 50px;
            font-size: 30px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background-color: #ffffff26;
            color: #fff;

            .correctIcon {
              color: rgb(63, 208, 0);
              font-size: 40px;
            }
          }
        }
      }
    }
  }

  .applyContent {
    background: white;
    min-height: calc(100vh - 140px);
    padding: 20px;
  }

  .applyForm {
    max-width: 600px;
    margin: 0 auto;

    .section-header {
      margin: 30px 0 20px 0;
      padding-left: 12px;
      border-left: 4px solid #667eea;

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
    }

    .custom-radio {
      width: 24px;
      height: 24px;
      border-color: #ccc;
    }

    .form-label {
      display: block;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      height: 50px;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .class-info button {
      width: 100%;
      height: 50px;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-btn {
      width: 100%;
      height: 50px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .next-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 30px;
      transition: opacity 0.3s;
    }

    .getCode {
      background: linear-gradient(135deg, #667eea 0%, #5734b8 100%);
      color: #fff;
    }

    // 第二面
    .upload-section {
      margin: 20px 0;

      .upload-area {
        border: 2px dashed #ddd;
        border-radius: 12px;
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.3s;

        .upload-placeholder,
        .upload-summary {
          display: flex;
          flex-direction: column;
          align-items: center;

          .upload-icon {
            font-size: 20px;
          }
        }
      }
    }
  }

  .noWrite {
    border: 1px solid var(--destructive-foreground);
    animation: slideIn 0.4s ease-in-out 1;
  }

  .errorHead {
    display: flex;
    align-items: center;
    color: var(--destructive-foreground);
    font-size: 16px;

    .errorIcon {
      margin-right: 4px;
      font-size: 16px;
    }
  }
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 30px;

  .prev-btn {
    flex: 1;
    padding: 16px;
    background: #f5f5f5;
    color: #333;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }

  .submit-btn {
    flex: 2;
    margin: 0;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s;
  }
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.file-icon {
  font-size: 32px;
  color: #667eea;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  margin: 0 0 4px 0;
  // 添加以下样式来实现文本省略
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px; // 可根据需要调整宽度
}

.file-size {
  color: #666;
  font-size: 14px;
}

.remove-file {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-filename {
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.upload-options {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.upload-option:hover {
  background: #e9ecef;
}

.camera-modal {
  background: white;
  border-radius: 12px;
  width: 90vw;
  max-width: 500px;
  overflow: hidden;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.camera-container {
  position: relative;
  aspect-ratio: 4/3;
}

.camera-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-controls {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.capture-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .recruitment-form {
    background: #f5f5f5;
    padding: 20px;

    .recruitment-card {
      max-width: 800px;
      margin: 0 auto;
      border-radius: 12px 12px 12px 12px;

      .applyTitle {
        border-radius: 12px 12px 0 0;
      }

      .applyContent {
        max-width: 800px;
        margin: 0 auto;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// @keyframes slideIn {
//   0% {
//     transform: translateX(0);
//   }

//   25% {
//     transform: translateX(-10px);
//   }

//   50% {
//     transform: translateX(10px);
//   }

//   75% {
//     transform: translateX(-10px);
//   }

//   100% {
//     transform: translateX(0);
//   }
// }

// /* 背景动画 */
// @keyframes bgAnimation {
//   0% {
//     background-position: 0% 50%;
//   }
//   50% {
//     background-position: 100% 50%;
//   }
//   100% {
//     background-position: 0% 50%;
//   }
// }
</style>
