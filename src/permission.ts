import router from "@/router";

//@ts-ignore
import nprogress from "nprogress";
import "nprogress/nprogress.css";

nprogress.configure({
  showSpinner: false,
});
router.beforeEach((to: any, from: any, next: any) => {
  nprogress.start();
  console.log(222);
  const token = localStorage.getItem("token");
  if (token && to.path === "/login") {
    router.push("/");
  }

  next();
});
router.afterEach((to: any, from: any) => {
    nprogress.done();
});
