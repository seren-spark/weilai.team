import { defineStore } from "pinia";
import apiClient from "@/api/axios";
interface UserState {
  userId: number;
  isSelf: boolean;
  avatar: string;
}
export const useUserStore = defineStore("user", {
  // 定义初始状态
  state: (): UserState => ({
    userId: 0,
    isSelf: true,
    avatar: "",
  }),

  actions: {
    // 存储id
    setUserInfo(id: number, avatar: string) {
      this.userId = id;
      this.avatar = avatar;
    },

    getMyId() {
      return Number(JSON.parse(localStorage.getItem("userId") as string).value);
    },
    reset() {
      this.userId = getMyId();
      this.isSelf = true;
    },
  },
  getters: {
    getUserId: (state) => state.userId,
    getIsSelf: (state) => state.isSelf,
    getAvatar: (state) => state.avatar,
  },
  persist: {
    key: "userStore",
    storage: localStorage,
  },
});
export const getMyId = () =>
  Number(JSON.parse(localStorage.getItem("userId") as string).value);
export async function getUserAvatarInfo() {
  const id = getMyId();
  const res = await apiClient({
    url: `/user/getUserInfoByUserId/${id}`,
    method: "get",
  });
  console.log(res);
  if (res.code == 200) {
    return res.data.headPortrait;
  }
}
