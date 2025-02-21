import { ref, watch } from 'vue'
import { useRequest } from 'vue-request';
import apiClient from '@/api/axios';
import { useAlert } from './useAlert';
import { applicationStore } from '@/store/applicationStore';

const useApplicationStore = applicationStore()

interface ClassList {
    data: string[]
}

interface Data {
    code: number;
    message: string
}

interface EmailResponse {
    code: number;
    message?: string;
}
export default function () {
    const { showAlert } = useAlert()
    const classListData = ref<string[]>([])

    // 获取班级列表
    function runGetClass() {
        const getClass = () => apiClient.get('/recruit/user/listAllClass')
        const { data } = useRequest(getClass)
        watch(data, () => {
            const res = data.value as ClassList;
            classListData.value = res.data
        })
    }

    // 获取验证码
    function getCode(email: string | number | undefined) {
        const getCodeAx = () => apiClient.get(`/recruit/user/sendEmailCode/${email}`)
        const { data } = useRequest(getCodeAx)
        watch(data, () => {
            const res = data.value as EmailResponse;
            if (res.code == 1007) {
                showAlert("验证码发送成功", "pass");
                useApplicationStore.startCountdown();
            } else if (res.code == 1005) {
                showAlert("验证码未过期", "waring");
            }
        })
    }

    // 提交报名表
    function sentStuInfo(stuInform: FormData) {
        const sentStuInfoAx = () => apiClient.post('/recruit/user/register', stuInform, { headers: { 'Content-Type': 'multipart/form-data' } })
        const { data } = useRequest(sentStuInfoAx)
        watch(data, () => {
            const res = data.value as Data;
            if (res.code == 200) {
                showAlert('报名成功，请及时关注邮箱等待面试通知！', 'pass')
            } else if (res.code == 1008) {
                showAlert('验证码错误', 'error')
            } else if (res.code == 3102) {
                showAlert('该账户已报过名，请勿重复报名', 'waring')
            }
        })
    }
    return { runGetClass, classListData, getCode, sentStuInfo }
}