import router from "@/router";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useLocalStorageWithExpire } from "@/composables/useLocalStorage";
const { setLocalStorageWithExpire, getLocalStorageWithExpire } =
  useLocalStorageWithExpire();
const pinia = createPinia();
setActivePinia(pinia);
//@ts-ignore
import nprogress from "nprogress";
import "nprogress/nprogress.css";

nprogress.configure({
  showSpinner: false,
});

router.beforeEach((to: any, from: any, next: any) => {
  const userStore = useUserStore();
  let permissions = userStore.permissions;
  nprogress.start();

  const token = getLocalStorageWithExpire("token");

  // 白名单：登录页,首页和报名页不需要 token
  if (to.path === "/login" || to.path === "/" || to.path === "/application") {
    if (token && to.path === "/login") {
      // 已登录访问登录页，跳转到首页
      return next("/");
    } else {
      // 如果有token且不在登录页
      return next(); // 放行
    }
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
router.afterEach((to: any, from: any) => {
  nprogress.done();
});
