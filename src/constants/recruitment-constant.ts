// 候选人页
const CandidatesConst = {
  toggleItems:[
    {
      index: 0,
      title: "待安排",
      isActive: true,
    },
    {
      index: 1,
      title: "待面试",
      isActive: false,
    },
    {
      index: 2,
      title: "已录取",
      isActive: false,
    },
    {
      index: 3,
      title: "已淘汰",
      isActive: false,
    },
  ],
  columns: [
    {
      title: "姓名",
      key: "name",
    },
    {
      title: "年级",
      key: "session",
    },
    {
      title: "性别",
      key: "gender",
    },
    {
      title: "班级",
      key: "clazz",
    },
    {
      title: "学号",
      key: "studentId",
    },
    {
      title: "QQ",
      key: "QQ",
    },
    {
      title: "邮箱",
      key: "email",
    },
    {
      title: "状态",
      key: "state",
    },
  ],
  excelHeaders: [
    {
      title: "姓名",
      key: "name",
    },
    {
      title: "年级",
      key: "session",
    },
    {
      title: "班级",
      key: "clazz",
    },
    {
      title: "性别",
      key: "gender",
    },
    {
      title: "状态",
      key: "state",
    },
  ],
};


export { CandidatesConst};