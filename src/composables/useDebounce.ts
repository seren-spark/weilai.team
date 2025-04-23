import type { Directive } from "vue";

export default {
  //自定义节流操作
  preventReClick: {
    mounted(
      el: {
        addEventListener: (arg0: string, arg1: () => void) => void;
        disabled: boolean;
      },
      binding: { value: any },
    ) {
      el.addEventListener("click", () => {
        if (!el.disabled) {
          el.disabled = true;
          setTimeout(() => {
            el.disabled = false;
          }, binding.value || 2000); //2000ms间隔时间
        }
      });
    },
  },
  debounce: {
    mounted(
      el: {
        addEventListener: (arg0: string, arg1: () => void) => void;
        value: any;
      },
      binding: { value: any; arg: any },
    ) {
      let timer: number | null = null;
      const { value, arg = 0 } = binding;
      console.log(value);
      console.log(el.value, "el.value");

      el.addEventListener("input", () => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          value(el.value, arg);
        }, 1000);
      });
    },
    updated(
      el: {
        addEventListener: (arg0: string, arg1: (e: any) => void) => void;
        value: any;
        removeEventListener: (arg0: string, arg1: (e: any) => void) => void;
      },
      binding: { value: any; arg: any },
    ) {
      // 若指令的值更新，重新绑定事件处理函数
      let timer: number | null = null;
      let { value, arg = 0 } = binding;
      console.log(arg);

      const existingListener = (e: any) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          value(el.value, arg);
        }, 1000);
      };
    //   el.removeEventListener("input", existingListener);
    //   el.addEventListener("input", existingListener);
    },
  },
};
