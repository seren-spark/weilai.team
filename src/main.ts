import "@/assets/styles/index.scss";
import "@/assets/styles/public.scss";
import CustomAlert from "@/pages/Alert.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/atom-one-dark.css";
import router from "./router";
import dir from "./composables/useDebounce";
// 引入路由鉴权
import "./permission";
const pinia = createPinia();
export default pinia;
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);
app.directive("highlight", function (el) {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach((block: any) => {
    hljs.highlightBlock(block);
  });
});
app.directive("debounce", dir.debounce as any);
app.directive("preventReClick", dir.preventReClick);
app.use(pinia);
app.use(router);
app.component("CustomAlert", CustomAlert);
app.mount("#app");
