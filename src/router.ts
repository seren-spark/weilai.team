import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { ADMIN_ROUTER_META, COMMUNITY_ROUTER_META } from "./constants/router";

for (const route of routes) {
  if (route.name === "/admin") {
    route.meta = ADMIN_ROUTER_META;
    console.log(route);
  } else if (route.name === "/community") {
    route.meta = COMMUNITY_ROUTER_META;
  }
}
const router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
});

export default router;
