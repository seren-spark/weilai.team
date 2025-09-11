import router from "@/router";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
const { setLocalStorageWithExpire, getLocalStorageWithExpire } =
  useLocalStorageWithExpire();
const pinia = createPinia();
setActivePinia(pinia);
//@ts-ignore
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// nprogress.configure({
//   showSpinner: false,
// });
nprogress.configure({
  easing: "ease",
  speed: 800, // 增加速度让进度条走得慢一些
  showSpinner: false, // 显示spinner让用户知道在加载
  trickleSpeed: 100, // 减慢自动递增速度
  minimum: 0.1, // 降低最小值
});

router.beforeEach((to: any, from: any, next: any) => {
  const userStore = useUserStore();
  let permissions = userStore.permissions;
  nprogress.start();

  const token = getLocalStorageWithExpire("token");

  // 白名单：登录页,首页和报名页不需要 token
  if (
    to.path === "/login" ||
    to.path === "/" ||
    to.path === "/application" ||
    to.path === "/aboutUs"
  ) {
    if (token) {
      // 已登录时特殊处理
      if (to.path === "/login") {
        // 已登录访问登录页，跳转到首页
        return next("/");
      } else if (to.path === "/application") {
        // 已登录访问报名页，跳转首页并提示
        showAlert("已登录用户不可访问报名页", "error");
        return next("/");
      }
    }
    // 其他白名单情况正常放行
    return next();
  }

  // 未登录且访问其他页面，跳转登录页
  if (!token) {
    return next("/login");
  }
  // 权限判断
  if (to.path.startsWith("/admin") && !permissions.includes(to.meta.roles)) {
    router.push("/404");
  }

  next();
});
//使用afterEach时,由于请求数据量大，服务器等问题，会导致进度条加载完路由还未进入的问题，影响用户体验
// router.afterEach((to: any, from: any) => {
//   nprogress.done();
// });
router.beforeResolve((to, from, next) => {
  // 此时组件已经加载完成，地址栏也会更新
  nprogress.done();
  next();
});
