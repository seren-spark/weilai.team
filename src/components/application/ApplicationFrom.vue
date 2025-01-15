<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useApplication from '@/composables/useSendApplication'
import { applicationStore } from '@/store/applicationStore'
import { reactive, ref, watch } from 'vue'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import * as z from "zod";
// import useLogin from '../../composables/useLoginAll'
import { Icon } from "@iconify/vue";

const useApplicationStore = applicationStore()
useApplicationStore.isGetCode()
// const { loading } = useLogin()
const loading = ref(false)
const stuInformData = reactive({
    clazz: '计科241' as string,
    code: '' as string | number | undefined,
    email: '' as string | number | undefined,
    name: '' as string | number | undefined,
    qqNumber: '' as string | number | undefined,
    sex: '男' as string,
    studentId: '' as string | number | undefined,
    file: null as unknown as File
})

interface stuErrors {
    code: string;
    email: string;
    name: string;
    qqNumber: string;
    studentId: string;
    file: string
}


function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        convertToBinary(file)
    }
}

function convertToBinary(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
        const binaryData = e.target?.result
        if (binaryData) {
            // stuInform.value.file = e.target.result;
            const newFile = new File([binaryData], file.name, { type: file.type });
            stuInformData.file = newFile;
            emitUpdataFile(stuInformData.file)
        } else {
            console.error('Failed to read file as binary data')
        }
    }
    reader.readAsArrayBuffer(file)
}

const appStore = applicationStore()

const filedErrors = ref<z.ZodFormattedError<stuErrors> | undefined>();
const stuSchema = z.object({
    code: z.string().min(1, '验证码不能为空'),
    email: z.string().min(1, '邮箱不能为空').email('请输入正确的邮箱'),
    name: z.string().min(1, '姓名不能为空'),
    qqNumber: z.string().min(1, 'QQ号不能为空'),
    studentId: z.string().min(11, '学号应为11位').max(11, '学号应为11位'),
    file: z
        .literal(null).refine(() => false, {
            message: "请选择文件", // 如果没有选择文件，返回这个提示
        })
        .or(z.instanceof(File).refine((file) => {
            // 获取文件的 MIME 类型
            const mimeType = file.type;
            // Word 文件的 MIME 类型一般是 application/msword (doc) 或 application/vnd.openxmlformats-officedocument.wordprocessingml.document (docx)
            return mimeType === "application/msword" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }, {
            message: "请选择一个有效的 Word 文件",
        }))
})

const emailOnlySchema = stuSchema.pick({
    email: true,
});

const validateStu = () => {
    const stuResult = stuSchema.safeParse({
        code: stuInformData.code,
        email: stuInformData.email,
        name: stuInformData.name,
        qqNumber: stuInformData.qqNumber,
        studentId: stuInformData.studentId,
        file: stuInformData.file
    })
    if (!stuResult.success) {
        filedErrors.value = stuResult.error.format();
    }
    return stuResult.success
}

const validateCode = () => {
    const result = emailOnlySchema.safeParse({
        email: stuInformData.email
    });
    if (!result.success) {
        filedErrors.value = result.error.format();
    }
    return result.success;
}

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
    formData.append('clazz', stuInformData.clazz);
    formData.append('code', String(stuInformData.code) || '');
    formData.append('email', String(stuInformData.email) || '');
    formData.append('name', String(stuInformData.name) || '');
    formData.append('qqNumber', String(stuInformData.qqNumber) || '');
    formData.append('sex', stuInformData.sex);
    formData.append('studentId', String(stuInformData.studentId) || '');
    formData.append('file', stuInformData.file);
    sentStuInfo(formData)
}

// Emit更新事件
const emitUpdataCode = (val: string | number | undefined) => {
    stuInformData.code = val;
    const result = stuSchema
        .pick({ code: true })
        .safeParse({
            code: val,
        });
    if (filedErrors.value) {
        filedErrors.value.code = result.error?.format().code;
    }
}
const emitUpdataFile = (val: File) => {
    stuInformData.file = val;
    const result = stuSchema
        .pick({ file: true })
        .safeParse({
            file: val,
        });
    if (filedErrors.value) {
        filedErrors.value.file = result.error?.format().file;
    }
}
const emitUpdataEmail = (val: string | number | undefined) => {
    stuInformData.email = val;
    const result = stuSchema
        .pick({ email: true })
        .safeParse({
            email: val,
        });
    if (filedErrors.value) {
        filedErrors.value.email = result.error?.format().email;
    }
}
const emitUpdataName = (val: string | number | undefined) => {
    stuInformData.name = val;
    const result = stuSchema
        .pick({ name: true })
        .safeParse({
            name: val,
        });
    if (filedErrors.value) {
        filedErrors.value.name = result.error?.format().name;
    }
}
const emitUpdataQqNumber = (val: string | number | undefined) => {
    stuInformData.qqNumber = val;
    const result = stuSchema
        .pick({ qqNumber: true })
        .safeParse({
            qqNumber: val,
        });
    if (filedErrors.value) {
        filedErrors.value.qqNumber = result.error?.format().qqNumber;
    }
}
const emitUpdataStudentId = (val: string | number | undefined) => {
    stuInformData.studentId = val;
    const result = stuSchema
        .pick({ studentId: true })
        .safeParse({
            studentId: val,
        });
    if (filedErrors.value) {
        filedErrors.value.studentId = result.error?.format().studentId;
    }
}
const emitUpdataSex = (val: string) => {
    stuInformData.sex = val;
}
const emitUpdataClazz = (val: string) => {
    stuInformData.clazz = val;
}

const { runGetClass, classListData, getCode, sentStuInfo } = useApplication()
runGetClass()

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
</script>

<template>
    <div class="recruitment-form">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-xl">
                    立即报名
                </CardTitle>
                <CardDescription>
                    请输入您的信息填写报名表
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <!-- <div class="grid grid-cols-2 gap-4"> -->
                    <div class="grid gap-2">
                        <Label for="first-name">姓名</Label>
                        <div v-if="filedErrors?.name?._errors" class="errorHead">
                            <Icon class="errorIcon" icon="material-symbols:account-circle-outline"></Icon>
                            <span>{{ filedErrors?.name?._errors[0] }}</span>
                        </div>
                        <Input id="first-name" placeholder="姓名" required
                            :class="{ 'noWrite': filedErrors?.name?._errors, 'focus-visible:ring-red-300 error-border': filedErrors?.name?._errors }"
                            :model-value="stuInformData.name" @update:model-value="(val) => emitUpdataName(val)" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="last-name">班级</Label>
                        <Select :model-value="stuInformData.clazz" @update:model-value="(val) => emitUpdataClazz(val)">
                            <SelectTrigger id=" category" aria-label="Select category">
                                <SelectValue placeholder="请选择班级" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="item, index in classListData" :key="index" :value="item">{{ item
                                    }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <!-- </div> -->
                    <div class="grid grid-cols-2 gap-4">
                        <Label for="sex">性别</Label>
                        <RadioGroup :model-value="stuInformData.sex" default-value="option-one" style="display: flex;"
                            @update:model-value="(val) => emitUpdataSex(val)">
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="option-one" value="男" />
                                <Label for="男">男</Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem id="option-two" value="女" />
                                <Label for="女">女</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div class="grid gap-2">
                        <Label for="student-id">学号</Label>
                        <div v-if="filedErrors?.studentId?._errors" class="errorHead">
                            <Icon class="errorIcon" icon="la:id-card"></Icon>
                            <span>{{ filedErrors?.studentId?._errors[0] }}</span>
                        </div>
                        <Input id="student-id"
                            :class="{ 'noWrite': filedErrors?.studentId?._errors, 'focus-visible:ring-red-300 error-border': filedErrors?.studentId?._errors }"
                            :model-value="stuInformData.studentId"
                            @update:model-value="(val) => emitUpdataStudentId(val)" placeholder="学号" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="qq-num">QQ</Label>
                        <div v-if="filedErrors?.qqNumber?._errors" class="errorHead">
                            <Icon class="errorIcon" icon="mingcute:qq-line"></Icon>
                            <span>{{ filedErrors?.qqNumber?._errors[0] }}</span>
                        </div>
                        <Input id="qq-num"
                            :class="{ 'noWrite': filedErrors?.qqNumber?._errors, 'focus-visible:ring-red-300 error-border': filedErrors?.qqNumber?._errors }"
                            :model-value="stuInformData.qqNumber" @update:model-value="(val) => emitUpdataQqNumber(val)"
                            placeholder="QQ" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">邮箱</Label>
                        <div v-if="filedErrors?.email?._errors" class="errorHead">
                            <Icon class="errorIcon" icon="ic:outline-email"></Icon>
                            <span>{{ filedErrors?.email?._errors[0] }}</span>
                        </div>
                        <Input id="email"
                            :class="{ 'noWrite': filedErrors?.email?._errors, 'focus-visible:ring-red-300 error-border': filedErrors?.email?._errors }"
                            :model-value="stuInformData.email" type="email"
                            @update:model-value="(val) => emitUpdataEmail(val)" placeholder="邮箱" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">验证码</Label>
                        <div v-if="filedErrors?.code?._errors" class="errorHead">
                            <Icon class="errorIcon" icon="material-symbols:ads-click"></Icon>
                            <span>{{ filedErrors?.code?._errors[0] }}</span>
                        </div>
                        <div class="flex w-full max-w-sm items-center gap-1.5">
                            <Input id="code"
                                :class="{ 'noWrite': filedErrors?.code?._errors, 'focus-visible:ring-red-300 error-border': filedErrors?.code?._errors }"
                                :model-value="stuInformData.code" @update:model-value="(val) => emitUpdataCode(val)"
                                placeholder="请输入验证码" />
                            <Button v-if="!appStore.isRequesting" type="submit" @click="handleCode()">
                                获取验证码
                            </Button>
                            <Button v-if="appStore.isRequesting" disabled>
                                {{ useApplicationStore.countdown }}s后重新发送
                            </Button>
                        </div>
                    </div>
                    <div class="grid gap-2">
                        <div class="grid w-full max-w-sm items-center gap-1.5">
                            <Label for="tabular">报名表</Label>
                            <div v-if="filedErrors?.file?._errors" class="errorHead">
                                <Icon class="errorIcon" icon="solar:file-broken"></Icon>
                                <span>{{ filedErrors?.file?._errors[0] }}</span>
                            </div>
                            <Input id="picture" type="file" :class="{ 'noWrite': filedErrors?.file?._errors }"
                                accept=".docx" multiple @change="handleFileChange" />
                        </div>
                        <!-- <input type="file" accept=".doc,.docx" multiple></input> -->
                    </div>
                    <!-- <Button type="submit" class="w-full" @click="sentStuInfo(Object.assign({}, stuInform))"> -->
                    <Button type="submit" class="w-full" @click="handleSend">
                        提交
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
<style scoped lang="scss">
.recruitment-form {
    margin-top: 50px;

    .noWrite {
        border: 1px solid var(--destructive-foreground);
        animation: slideIn 0.4s ease-in-out 1;
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