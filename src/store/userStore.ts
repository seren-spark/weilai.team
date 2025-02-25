import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  // 定义初始状态
  state: () => ({
    userId: localStorage.getItem("userId")
      ? Number(JSON.parse(localStorage.getItem("userId") as string).value)
      : 0,
    isSelf: true,
  }),

  actions: {
    // 存储id
    setUserId(id: number) {
      this.userId = id;
    },
    getMyId() {
      return Number(JSON.parse(localStorage.getItem("userId") as string).value);
    },
    reset() {
      this.userId = 0;
      this.isSelf = true;
    },
  },
  getters: {
    getUserId: (state) => state.userId,
    getIsSelf: (state) => state.isSelf,
  },
  persist: {
    key: "userStore",
    storage: localStorage,
  },
});
