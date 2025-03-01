import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();

import router from "@/router";
export function skipPersonCenter(id: number) {
  console.log((userStore.getMyId() as number) == id);
  if (!((userStore.getMyId() as number) == id)) {
    userStore.userId = id;
    userStore.isSelf = false;
  } else {
    userStore.isSelf = true;
  }

  router.push({
    path: `/personalCenter/userInfo`,
  });
}
