// 二级路由
export const ADMIN_ROUTER_META = {
  firNav: "admin",
  subNavItems: [
    {
      name: "profile",
      title: "概况",
      icon: "material-symbols:overview-key-outline",
      path: "/admin/profile",
      redirect: "/admin/profile",
      roles: "profile_admin",
    },
    {
      name: "contacts",
      title: "通讯录",
      icon: "ph:address-book-tabs",
      path: "/admin/contacts",
      redirect: "/admin/contacts/member",
      roles: "team_admin",
    },
    {
      name: "community",
      title: "社区管理",
      icon: "material-symbols:article-outline",
      path: "/admin/community",
      roles: "community_admin",
    },
    {
      name: "recruitment",
      title: "招新管理",
      icon: "ph:student",
      path: "/admin/recruitment/recruitment",
      roles: "recruit_admin",
    },
    {
      name: "attendance",
      title: "考勤管理",
      icon: "tdesign:time",
      path: "/admin/attendance/overview",
      roles: "attendance_admin",
    },
    {
      name: "permission",
      title: "权限管理",
      icon: "material-symbols:shield-lock-outline-rounded",
      path: "/admin/limits",
      roles: "admin_plus",
    },
  ],
};
export const COMMUNITY_ROUTER_META = {
  firNav: "community",
  subNavItems: [
    {
      title: "综合",
      icon: "icon-park-outline:all-application",
      path: "/community/comprehensive",
      redirect: "/community/comprehensive/hot",
    },
    {
      title: "博客",
      icon: "uil:blogger-alt",
      path: "/community/blog",
      redirect: "/community/blog/hot",
    },
    {
      title: "公告",
      icon: "material-symbols:article-outline",
      path: "/community/notice",
      redirect: "/community/notice",
    },
    {
      title: "交流",
      icon: "lucide-lab:coins-exchange",
      path: "/community/discussion",
      redirect: "/community/discussion/hot",
    },
    {
      title: "头脑风暴",
      icon: "icon-park-outline:thinking-problem",
      path: "/community/brainstorm",
      redirect: "/community/brainstorm/hot",
    },
  ],
};
