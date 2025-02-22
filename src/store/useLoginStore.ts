import { defineStore } from "pinia";
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";

export const useLoginStore = defineStore("login", {
  state: () => ({
    countdown: 60,
    isRequesting: false,
  }),
  actions: {
    isGetCode() {
      const loginStr = localStorage.getItem("login");
      const login = loginStr ? JSON.parse(loginStr) : null;
      // this.countdown = login ? JSON.parse(login) : {} || 60
      // console.log(login.countdown, login.isRequesting);
      if (!login) {
        return;
      } else if (login.isRequesting && login.countdown > 0) {
        this.countdown = login.countdown;
        const interval = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            clearInterval(interval);
            this.isRequesting = false;
          }
        }, 1000);
      }
      // this.isRequesting = login ? true : false
      // console.log(isRequesting, this.countdown);
    },
    startCountdown() {
      if (this.isRequesting) return; // 防止重复请求
      this.countdown = 60;
      this.isRequesting = true;
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.isRequesting = false;
        }
      }, 1000);
    },
    resetCountdown() {
      this.countdown = 60;
      this.isRequesting = false;
    },
  },
  persist: {
    key: "login",
    storage: localStorage,
  },
});
