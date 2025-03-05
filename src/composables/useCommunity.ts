import { useUserStore } from "@/store/userStore";

import router from "@/router";
export function skipPersonCenter(id: number) {
  const userStore = useUserStore();
  //   const router = useRouter();
  if (!((userStore.getMyId() as number) == id)) {
    userStore.userId = id;
    userStore.isSelf = false;
  } else {
    userStore.isSelf = true;
  }

  router.push(`/personalCenter/userInfo`);
}
