import "@/assets/styles/index.scss";
import Alert from "@/pages/Alert.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import router from "./router";
// 引入路由鉴权
import "./permission";
const pinia = createPinia();
export default pinia;
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);
app.directive("highlight", function (el) {
  let blocks = el.querySelectorAll("pre code");
  blocks.forEach((block: any) => {
    hljs.highlightBlock(block);
  });
});
app.use(pinia);
app.use(router);
app.component("Alert", Alert);
app.mount("#app");
// createApp(App).use(router).mount("#app");
