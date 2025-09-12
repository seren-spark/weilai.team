<script setup lang="ts">
import Avatar from "@/components/avatar/UserAvatar.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/ui/sidebar/Sidebar.vue";
import SidebarContent from "@/components/ui/sidebar/SidebarContent.vue";
import SidebarGroup from "@/components/ui/sidebar/SidebarGroup.vue";
import SidebarGroupContent from "@/components/ui/sidebar/SidebarGroupContent.vue";
import SidebarMenu from "@/components/ui/sidebar/SidebarMenu.vue";
import SidebarMenuButton from "@/components/ui/sidebar/SidebarMenuButton.vue";
import SidebarMenuItem from "@/components/ui/sidebar/SidebarMenuItem.vue";
import SidebarProvider from "@/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "@/components/ui/sidebar/SidebarTrigger.vue";
import type { UserInfo } from "@/components/comment/index.ts";
import UserLogin from "@/composables/useLoginAll";
import { useRequest } from "@/composables/useRequest";
import { useMessageStore } from "@/store/messageStore";
import { useNoticeStore } from "@/store/UseNoticeStore";
import { useUserStore } from "@/store/userStore";
import { Icon } from "@iconify/vue";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-vue-next";
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";
import SidebarFooter from "../ui/sidebar/SidebarFooter.vue";
import SidebarHeader from "../ui/sidebar/SidebarHeader.vue";
import { COMMUNITY_ROUTER_META } from "@/constants/router";
defineProps<{
  open?: boolean;
}>();
const { data, executeRequest } = useRequest();
// 获取个人id用于渲染
const messageStore = useMessageStore();
const noticeStore = useNoticeStore();
const userInfo = ref<UserInfo>();

const userStore = useUserStore();
async function getUserInfo() {
  await executeRequest({
    url: `/user/getUserInfoByUserId/${userStore.getMyId()}`,
    method: "get",
  });
  userInfo.value = data.value.data as UserInfo;
  return userInfo.value;
}
getUserInfo();

const { logout } = UserLogin();
const route = useRoute();
const router = useRouter();

let subNavItems = route.meta.subNavItems as SubItemInterface[] | undefined;
let currentUrl = ref("");

const items = [
  {
    title: "首页",
    url: "",
    icon: "material-symbols:home-outline",
    redirect: "",
  },
  {
    title: "社区",
    url: "community/",
    icon: "fluent:people-community-32-regular",
    redirect: "community/comprehensive/hot",
  },
  {
    title: "控制台",
    url: "admin/",
    icon: "lsicon:control-outline",
    redirect: "admin/profile",
    hidden: true,
  },
];

export interface SubItemInterface {
  title: string;
  icon: string;
  path: string;
  redirect?: string;
  name?: string;
  roles?: string;
}

function skipToPersonalCenter() {
  userStore.reset();
  router.push("/personalCenter/userInfo");
}
//获取未读公告数量
const getNotReadCount = async () => {
  await executeRequest({
    url: `/notice/getNotReadCount`,
    method: "get",
  });
  if (data.value?.code == 200) {
    if (data.value.data > 0) {
      noticeStore.setHasUnreadNotice(true);
    } else {
      noticeStore.setHasUnreadNotice(false);
    }
  }
};
getNotReadCount();

// 获取当前用户的权限
let userPermissons = userStore.permissions;
// 权限管理
function permisson(subItem: SubItemInterface) {
  return route.matched[0].path.includes("/admin") && subItem.roles
    ? userPermissons.includes(subItem.roles)
    : true;
}

function skipRedirect(item: any) {
  currentUrl.value = item.url;
  router.push(`/${item.redirect}`);
}
</script>

<template>
  <div class="frame">
    <Sidebar id="sidebar" class="sidebar bg-white bg-white w-[--sidebar-width]">
      <SidebarTrigger
        :class="['sidebar-trigger']"
        :style="!open ? 'opacity:1 !important' : ''"
      ></SidebarTrigger>
      <SidebarHeader id="sidebar-header"
        ><div class="sidebar-logo">
          <img src="../../../public/logo.png" alt="" /></div
      ></SidebarHeader>
      <SidebarContent id="sidebar-content">
        <!-- 一级导航 -->
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                v-for="item in items"
                :key="item.url"
                class="sidebar__item"
              >
                <SidebarMenuButton class="sidebar__button">
                  <RouterLink
                    :to="`/${item.url}`"
                    active-class="sidebar__link--active"
                    class="sidebar__link"
                    :style="open ? '' : 'justify-content : center;'"
                    @click="skipRedirect(item)"
                  >
                    <Icon :icon="`${item.icon}`" />&nbsp;
                    <span>{{ item.title }}</span>
                    <span
                      v-if="
                        item.title === '社区' && noticeStore.hasUnreadNotice
                      "
                      class="noticeDot"
                    ></span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- 二级导航 -->
        <SidebarGroup v-show="subNavItems?.length" id="sub-nav">
          <SidebarGroupContent>
            <SidebarMenu>
              <template v-for="(item, index) in subNavItems" :key="index">
                <SidebarMenuItem class="sidebar__item" v-if="permisson(item)">
                  <SidebarMenuButton class="sidebar__button">
                    <RouterLink
                      :to="item.path"
                      active-class="sidebar__sub-link--active"
                      class="sidebar__sub-link"
                      @click="
                        router.push(item.redirect ? item.redirect : item.path)
                      "
                    >
                      <Icon :icon="`${item.icon}`" />&nbsp;
                      <span>{{ item.title }}</span>
                      <span
                        v-if="
                          item.title === '公告' && noticeStore.hasUnreadNotice
                        "
                        class="noticeDot"
                      ></span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </template>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem class="sidebar__item">
                <SidebarMenuButton class="sidebar__button">
                  <RouterLink
                    :to="`/personalCenter/userInfo`"
                    active-class="sidebar__link--active"
                    class="sidebar__link mb-1"
                    @click="skipToPersonalCenter"
                  >
                    <Icon icon="gravity-ui:person" />&nbsp;
                    <span>个人资料</span>
                  </RouterLink>
                </SidebarMenuButton>
                <SidebarMenuButton class="sidebar__button">
                  <RouterLink
                    :to="`/message/likeMes`"
                    active-class="sidebar__link--active"
                    class="sidebar__link"
                  >
                    <Icon
                      icon="mage:box-3d-notification"
                      style="stroke-width: 3"
                    />&nbsp;
                    <span>消息</span>
                    <span v-if="messageStore.hasNewMessage" class="dot"></span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter id="sidebar-footer" style="height: 7rem">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <SidebarMenuButton class="publish-btn">
                <RouterLink to="/post" class="flex items-center w-full h-full">
                  <Icon icon="prime:pencil" width="16px" />
                  <span class="ml-2">发布</span>
                </RouterLink>
              </SidebarMenuButton>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu class="footer-user">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div class="avatar">
                    <Avatar :avatar="userStore.avatar" />
                  </div>

                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate">{{ userInfo?.name }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-0"
                side="bottom"
                :side-offset="4"
                ><router-link
                  :to="`/personalCenter/userInfo`"
                  @click="skipToPersonalCenter"
                >
                  <DropdownMenuItem class="drop-menu-item">
                    <BadgeCheck />
                    个人资料
                  </DropdownMenuItem>
                </router-link>

                <DropdownMenuItem class="drop-menu-item" @click="logout()">
                  <LogOut />
                  退出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  </div>
  <div class="main-menu">
    <RouterLink to="/">
      <Button class="main-menu-button"
        ><Icon
          icon="bitcoin-icons:home-outline"
          class="main-menu-icon" /></Button
    ></RouterLink>

    <DropdownMenu>
      <DropdownMenuTrigger
        ><Button class="main-menu-button"
          ><Icon
            icon="fluent:people-community-20-regular"
            class="main-menu-icon" /></Button
      ></DropdownMenuTrigger>
      <DropdownMenuContent class="w-6 bg-white">
        <RouterLink
          v-for="(item, index) in COMMUNITY_ROUTER_META.subNavItems"
          :key="index"
          :to="item.redirect as string"
          active-class="sidebar__sub-link--active"
          class="main-menu-sub-link"
        >
          {{ item.title }}
        </RouterLink>
      </DropdownMenuContent>
    </DropdownMenu>
    <RouterLink to="/message/likeMes"
      ><Button class="main-menu-button"
        ><Icon icon="ph:bell-simple" class="main-menu-icon" />

        <span v-if="messageStore.hasNewMessage" class="dot"></span></Button
    ></RouterLink>
    <RouterLink     :to="`/personalCenter/userInfo`"
                  @click="skipToPersonalCenter"
      ><Button class="main-menu-button"
        ><Icon icon="bi:person" class="main-menu-icon" /></Button
    ></RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-trigger {
  position: absolute;
  z-index: 5;
  width: 1rem;
  height: 4rem;
  background-color: white;
  border-radius: 2rem;
  top: 40%;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transition: all 0.3s;
}
.dot {
  position: absolute;
  top: 41%;
  right: 20px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #ff0000;
}
.noticeDot {
  position: absolute;
  top: 41%;
  right: 20px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #ff0000;
}
.main-menu {
  display: none;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}
.frame {
  &:hover {
    .sidebar-trigger {
      opacity: 1;
    }
  }
  color: var(--secondary-foreground);
  #sub-nav {
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  top: 0;
  background-color: #fafafa;
  display: flex;
  span {
    font-size: 0.9rem;
  }
  #sidebar {
    background-color: white;
  }
}

.drop-menu-item {
  background-color: white;
  width: 105%;
  &:hover {
    background-color: var(--secondary);
  }
}
.publish-btn {
  height: 2.5rem;
  padding-left: 1rem;
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
  background: linear-gradient(
    to right,
    #139bb8,
    #739fcd,
    #b2b3df,
    #e7dcf3,
    #fdfbfe00
  );
  svg {
    font-weight: bold;
    font-size: 1rem;
  }
}
.sidebar {
  &__button {
    padding: 0;
    height: 100%;
  }

  &__link,
  &__sub-link {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0.65rem 1rem;
    border-radius: 2rem;
    position: relative;
  }
  &-logo {
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 80%;
      object-fit: cover;
    }
  }

  &__link {
    &:hover {
      color: var(--primary-foreground);
      background-color: var(--primary);
    }

    &--active {
      color: var(--primary-foreground);
      background-color: var(--primary);
    }
  }

  &__sub-link {
    &:hover {
      color: var(--secondary-foreground);
      background-color: var(--secondary);
    }

    &--active {
      color: var(--secondary-foreground);
      background-color: var(--secondary);
    }
  }
  #sidebar-footer {
    .footer-user {
      height: 5.5rem;
      box-sizing: border-box;
      .truncate {
        font-size: 0.9rem;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .dot {
    position: absolute;
    top: 25%;
    right: 30%;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #ff0000;
  }
  .main-menu {
    padding: 8px 25px;
    display: flex;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 60px;
    box-sizing: border-box;
    background-color: white;
    z-index: 9999;
    &-button {
      width: 45px;
      height: 45px;
      display: flex;

      #main-menu_dropdown {
        width: max-content;
      }
      .icon-publish {
        color: white;
      }
    }
    &-button {
      width: 45px;
      height: 45px;
      display: flex;
      box-shadow: none;
      padding: 0 10px;
      position: relative;
    }
    &-icon {
      font-size: 22px;
      width: 90%;
      height: 90%;
    }
    &-sub-link {
      width: 100%;
      display: inline-block;
      padding: 5px 5px;
      box-sizing: border-box;
      color: var(--secondary-foreground);
      text-align: center;
      &:hover {
        background-color: var(--secondary);
      }
    }

    &-publish {
      position: absolute;
      top: -800%;
      border-radius: 50%;
      padding: 12px;
      background: linear-gradient(#67a5e6, #c0d2e6, #eff1f4);
    }
    .frame {
      display: none;
      position: fixed;
      bottom: 0;
      height: 100px;
      overflow: hidden;
      #sidebar {
        position: fixed;
        top: 90%;
        bottom: 0;
        max-height: 100px;
        &-header {
          display: none;
        }
        #sub-nav {
          display: none;
        }
        &-content {
          max-height: 100px;
        }
      }
    }
  }
}
@media screen and (min-width: 900px) and (max-width: 2000px) {
  .main-menu {
    display: none;
  }

  .avatar {
    width: calc(20% - 2px);
    height: calc(100% - 2px);
    border-radius: 50%;
  }
  .frame {
    color: var(--secondary-foreground);
    #sub-nav {
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }
  }

  .drop-menu-item {
    background-color: white;
    width: 105%;
    &:hover {
      background-color: var(--secondary);
    }
  }
  .publish-btn {
    height: 2.625rem;
    padding-left: 15px;
    border-radius: 20px;
    color: white;
    font-size: 0.9vw;

    svg {
      font-weight: bold;
      font-size: 16px;
    }
  }
  .sidebar {
    &__button {
      padding: 0;
      height: 100%;
    }

    &__link,
    &__sub-link {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0.65rem 1rem;
      border-radius: 2rem;
    }
    &-logo {
      height: 8vh;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 80%;
        object-fit: cover;
      }
    }

    &__link {
      &:hover {
        color: var(--primary-foreground);
        background-color: var(--primary);
      }

      &--active {
        color: var(--primary-foreground);
        background-color: var(--primary);
      }
    }

    &__sub-link {
      &:hover {
        color: var(--secondary-foreground);
        background-color: var(--secondary);
      }

      &--active {
        color: var(--secondary-foreground);
        background-color: var(--secondary);
      }
    }
  }

  #sidebar {
    width: 17vh;
    &-provider {
      height: 100vh;
    }

    &-footer {
      .footer-user {
        li {
          box-sizing: border-box;
          height: 100%;
          button {
            box-sizing: border-box;
            height: 100%;
            padding: 0 0.5vw;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1700px) {
  .avatar {
    width: calc(20% - 2px);
    height: calc(100% - 2px);
    border-radius: 50%;
  }
  .frame {
    color: var(--secondary-foreground);
    #sub-nav {
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }
  }

  .drop-menu-item {
    background-color: white;
    width: 105%;
    &:hover {
      background-color: var(--secondary);
    }
  }
  .publish-btn {
    height: 5vh;
    padding-left: 15px;
    border-radius: 20px;
    color: white;
    font-size: 0.9vw;
    background: linear-gradient(
      to right,
      #139bb8,
      #739fcd,
      #b2b3df,
      #e7dcf3,
      #fdfbfe00
    );
    svg {
      font-weight: bold;
      font-size: 60px;
    }
  }
  .sidebar {
    &__button {
      padding: 0;
      height: 100%;
    }

    &__link,
    &__sub-link {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0.65rem 1rem;
      border-radius: 2rem;
      svg {
        font-size: 1.5rem;
      }
    }
    &-logo {
      height: 8vh;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 80%;
        object-fit: cover;
      }
    }

    &__link {
      &:hover {
        color: var(--primary-foreground);
        background-color: var(--primary);
      }

      &--active {
        color: var(--primary-foreground);
        background-color: var(--primary);
      }
    }

    &__sub-link {
      &:hover {
        color: var(--secondary-foreground);
        background-color: var(--secondary);
      }

      &--active {
        color: var(--secondary-foreground);
        background-color: var(--secondary);
      }
    }
  }

  #sidebar {
    width: 17vh;
    &-provider {
      height: 100vh;
    }
    // &-content {
    //   width: 17vw;
    // }
    &-footer {
      .footer-user {
        height: 5.8rem;
        box-sizing: border-box;
        .truncate {
          font-size: 0.9vw;
        }
        li {
          box-sizing: border-box;
          height: 100%;
          button {
            box-sizing: border-box;
            height: 100%;
            padding: 0 0.5vw;
          }
        }
      }
    }
  }
}
::-webkit-scrollbar {
  width: 0.2rem;
  height: 0.2rem;
}
</style>
