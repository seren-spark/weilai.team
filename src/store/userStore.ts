import { defineStore } from "pinia";
import apiClient from "@/api/axios";
interface UserState {
  userId: number | undefined;
  isSelf: boolean;
  avatar: string;
  permissions: string[];
}
export const useUserStore = defineStore("user", {
  // 定义初始状态
  state: (): UserState => ({
    userId: 0,
    isSelf: true,
    avatar: "",
    permissions: [],
  }),

  actions: {
    // 存储id
    setUserInfo(id: number, avatar: string) {
      this.userId = id;
      this.avatar = avatar;
    },

    getMyId() {
      return Number(JSON.parse(localStorage.getItem("userId") as string).value);
      // return JSON.parse(localStorage.getItem("userId") as string);
    },

    reset() {
      this.userId = Number(
        JSON.parse(localStorage.getItem("userId") as string).value,
      );
      this.isSelf = true;
    },
    resetStorage() {
      this.userId = undefined;
      this.isSelf = true;
      this.avatar = "";
      this.permissions = [];
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
