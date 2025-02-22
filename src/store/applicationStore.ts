import { defineStore } from "pinia";

export const applicationStore = defineStore("application", {
  state: () => ({
    countdown: 60,
    isRequesting: false,
  }),
  actions: {
    isGetCode() {
      const applicationStr = localStorage.getItem("application");
      const application = applicationStr ? JSON.parse(applicationStr) : null;
      if (!application) {
        return;
      } else if (application.isRequesting && application.countdown > 0) {
        console.log(111);
        this.countdown = application.countdown;
        const interval = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            clearInterval(interval);
            this.isRequesting = false;
          }
        }, 1000);
      }
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
    // 手动重置倒计时
    resetCountdown() {
      this.countdown = 60;
      this.isRequesting = false;
    },
  },

  persist: {
    key: "application",
    storage: localStorage,
  },
});
