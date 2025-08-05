// composables/useApplicationForm.ts
import { reactive, ref } from 'vue'
import * as z from 'zod'
import { applicationStore } from '@/store/applicationStore'
import useApplication from '@/composables/useSendApplication'

// 定义表单数据类型
interface StuInformData {
    clazz: string
    code: string | number | undefined
    email: string | number | undefined
    name: string | number | undefined
    qqNumber: string | number | undefined
    sex: string
    studentId: string | number | undefined
    file: File | null
}

// 定义错误类型
interface StuErrors {
    code: string
    email: string
    name: string
    qqNumber: string
    studentId: string
    file: string
}

export function useApplicationForm() {
    const useApplicationStore = applicationStore()
    useApplicationStore.isGetCode()

    const loading = ref(false)
    const stuInformData = reactive<StuInformData>({
        clazz: '计科241',
        code: undefined,
        email: undefined,
        name: undefined,
        qqNumber: undefined,
        sex: '男',
        studentId: undefined,
        file: null
    })

    const appStore = applicationStore()
    const filedErrors = ref<z.ZodFormattedError<StuErrors> | undefined>()

    // 表单验证 schema
    const stuSchema = z.object({
        code: z.string().min(1, '验证码不能为空'),
        email: z.string().min(1, '邮箱不能为空').email('请输入正确的邮箱'),
        name: z.string().min(1, '姓名不能为空'),
        qqNumber: z.string().min(1, 'QQ号不能为空'),
        studentId: z.string().min(11, '学号应为11位').max(11, '学号应为11位'),
        file: z
            .literal(null)
            .refine(() => false, {
                message: '请选择文件'
            })
            .or(
                z.instanceof(File).refine(
                    (file) => {
                        const mimeType = file.type
                        return (
                            mimeType === 'application/msword' ||
                            mimeType ===
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        )
                    },
                    {
                        message: '请选择一个有效的 Word 文件'
                    }
                )
            )
    })

    const emailOnlySchema = stuSchema.pick({
        email: true
    })

    // 表单验证函数
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
            filedErrors.value = stuResult.error.format()
        }
        return stuResult.success
    }

    const validateCode = () => {
        const result = emailOnlySchema.safeParse({
            email: stuInformData.email
        })

        if (!result.success) {
            filedErrors.value = result.error.format()
        }
        return result.success
    }

    const valiFirstDate = () => {
        const stuResult = stuSchema.safeParse({
            code: stuInformData.code,
            email: stuInformData.email,
            name: stuInformData.name,
            qqNumber: stuInformData.qqNumber,
            studentId: stuInformData.studentId,
        })

        if (!stuResult.success) {
            filedErrors.value = stuResult.error.format()
        }
        return stuResult.success
    }

    // 文件处理函数
    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
            convertToBinary(file)
        }
    }

    function convertToBinary(file: File) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const binaryData = e.target?.result
            if (binaryData) {
                const newFile = new File([binaryData], file.name, { type: file.type })
                stuInformData.file = newFile
                emitUpdataFile(newFile)
            } else {
                console.error('Failed to read file as binary data')
            }
        }
        reader.readAsArrayBuffer(file)
    }

    // 更新表单数据的函数
    const emitUpdataCode = (val: string | number | undefined) => {
        stuInformData.code = val
        const result = stuSchema.pick({ code: true }).safeParse({ code: val })
        if (filedErrors.value) {
            filedErrors.value.code = result.error?.format().code
        }
    }

    const emitUpdataFile = (val: File) => {
        stuInformData.file = val
        const result = stuSchema.pick({ file: true }).safeParse({ file: val })
        if (filedErrors.value) {
            filedErrors.value.file = result.error?.format().file
        }
    }

    const emitUpdataEmail = (val: string | number | undefined) => {
        stuInformData.email = val
        const result = stuSchema.pick({ email: true }).safeParse({ email: val })
        if (filedErrors.value) {
            filedErrors.value.email = result.error?.format().email
        }
    }

    const emitUpdataName = (val: string | number | undefined) => {
        stuInformData.name = val
        const result = stuSchema.pick({ name: true }).safeParse({ name: val })
        if (filedErrors.value) {
            filedErrors.value.name = result.error?.format().name
        }
    }

    const emitUpdataQqNumber = (val: string | number | undefined) => {
        stuInformData.qqNumber = val
        const result = stuSchema.pick({ qqNumber: true }).safeParse({ qqNumber: val })
        if (filedErrors.value) {
            filedErrors.value.qqNumber = result.error?.format().qqNumber
        }
    }

    const emitUpdataStudentId = (val: string | number | undefined) => {
        stuInformData.studentId = val
        const result = stuSchema.pick({ studentId: true }).safeParse({ studentId: val })
        if (filedErrors.value) {
            filedErrors.value.studentId = result.error?.format().studentId
        }
    }

    const emitUpdataSex = (val: string) => {
        stuInformData.sex = val
    }

    const emitUpdataClazz = (val: string) => {
        stuInformData.clazz = val
    }

    // 使用外部的 application hook
    const { runGetClass, classListData, getCode, sentStuInfo } = useApplication()
    runGetClass()

    // 表单提交处理
    const handleSend = async () => {
        if (!validateStu()) {
            return
        }

        const formData = new FormData()
        formData.append('clazz', stuInformData.clazz)
        formData.append('code', String(stuInformData.code) || '')
        formData.append('email', String(stuInformData.email) || '')
        formData.append('name', String(stuInformData.name) || '')
        formData.append('qqNumber', String(stuInformData.qqNumber) || '')
        formData.append('sex', stuInformData.sex)
        formData.append('studentId', String(stuInformData.studentId) || '')
        formData.append('file', stuInformData.file as File)

        return sentStuInfo(formData)
    }

    const handleCode = async () => {
        if (!validateCode()) {
            return
        }
        return getCode(stuInformData.email)
    }

    return {
        // 数据
        stuInformData,
        filedErrors,
        loading,
        appStore,
        useApplicationStore,
        classListData,

        // 方法
        handleFileChange,
        handleSend,
        handleCode,
        emitUpdataCode,
        emitUpdataFile,
        emitUpdataEmail,
        emitUpdataName,
        emitUpdataQqNumber,
        emitUpdataStudentId,
        emitUpdataSex,
        emitUpdataClazz,
        validateStu,
        validateCode,
        valiFirstDate

    }
}