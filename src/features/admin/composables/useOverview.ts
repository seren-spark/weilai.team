import apiClient from "@/api/axios";
import { ref, watch } from "vue";
import { useRequest } from "vue-request";

interface ProfileRes {
    data: ProfileData;
}
interface ProfileData {
    allTeamUserCount: number;
    salaryYearAll: number;
    copyrightCount: number;
    lanQiaoCount: number;
    javaCurrent: number;
    htmlCurrent: number;
    examCurrent: number;
    workCurrent: number;
    userCount: number;
    postB: number;
    postG: number;
    postJ: number;
    postT: number;
    javaAll: number;
    htmlAll: number;
    htmlPer: [];
    javaPer: [];
    areas: []
}
export default function () {
    const profile = ref<ProfileData>()
    const getOverview = () => apiClient.get('/index/getSummarize');
    const { data } = useRequest(getOverview);
    // console.log(data);
    watch(data, () => {
        const res = data.value as ProfileRes;
        profile.value = res.data
    })


    return { profile };
}