import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  // 定义初始状态
  state: () => ({
    userId: getMyId(),
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
      this.userId = getMyId();
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

const getMyId = () =>
  Number(JSON.parse(localStorage.getItem("userId") as string).value);
