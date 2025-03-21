import "@/assets/styles/index.scss";
import Alert from "@/pages/Alert.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// 引入路由鉴权
import "./permission";
const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.component("Alert", Alert);
app.mount("#app");
// createApp(App).use(router).mount("#app");
