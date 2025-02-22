import { ref } from "vue";

// 这个方法将控制 alert 的显示与隐藏
const alertState = ref<{ message: string; type: string } | null>(null);

export function useAlert() {
  // 显示 alert
  const showAlert = (message: string, type: "error" | "waring" | "pass") => {
    alertState.value = { message, type };

    // 设置定时器，在三秒后自动隐藏 alert
    setTimeout(() => {
      hideAlert();
    }, 3000); // 3000 毫秒 = 3 秒
  };

  // 隐藏 alert
  const hideAlert = () => {
    alertState.value = null;
  };

  return { alertState, showAlert, hideAlert };
}
