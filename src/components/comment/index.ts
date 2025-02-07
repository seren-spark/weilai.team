import { reactive } from "vue";
import { useRequest } from "@/composables/useRequest";

const { data, executeRequest } = useRequest();

export interface UserInfo {
  clazz: string;
  direction: string;
  email: string;
  grade: string;
  graduationDestination: string;
  group: string;
  headPortrait: string;
  lastLoginTime: string;
  lifePhoto: [];
  name: string;
  phone: string;
  qq: string;
  sex: string;
  studyId: string;
}

function createUserInfo() {
  return reactive<UserInfo>({
    clazz: "",
    direction: "",
    email: "",
    grade: "",
    graduationDestination: "",
    group: "",
    headPortrait: "",
    lastLoginTime: "",
    lifePhoto: [],
    name: "",
    phone: "",
    qq: "",
    sex: "",
    studyId: "",
  });
}

async function getUserInfo(userId: number, userInfo: any) {
  await executeRequest({
    url: `/user/getUserInfoByUserId/${userId}`,
    method: "get",
  });
  if (data.value && data.value.code === 200) {
    Object.assign(userInfo, data.value.data);
  }
}

export { createUserInfo, getUserInfo };
