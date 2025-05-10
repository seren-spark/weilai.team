import router from "@/router";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "@/store/userStore";

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

  const token = localStorage.getItem("token");
  if (token && to.path === "/login") {
    router.push("/");
  }
  // 权限判断
  console.log(to.meta, to.meta.roles, permissions.includes(to.meta.roles));

  if (to.path.startsWith("/admin") && !permissions.includes(to.meta.roles)) {
    router.push("/404");
  }

  next();
});
router.afterEach((to: any, from: any) => {
  nprogress.done();
});
