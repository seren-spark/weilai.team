export const columns=[
  {
    title: "用户姓名",
    key: "name",
  },
  {
    title: "用户组别",
    key: "group",
  },
  {
    title: "应打卡时间",
    key: "baseCheckTime",
  },
  {
    title: "打卡时间",
    key: "userCheckTime",
  },
  {
    title: "打卡类型",
    key: "checkType",
  },
  {
    title: "打卡结果",
    key: "timeResult",
  },
  {
    title: "工作日期",
    key: "workDate",
  },
]

export const enum TimeResultStatus {
   "正常"='Normal',
    "迟到"='Late',
    "早退"='Early',
    "旷工"='Absenteeism',
    "未打卡"='NotSigned',
    "严重迟到"='SeriousLate',
}
export const TimeResultStatusMap = {
    [TimeResultStatus.正常]: "正常",
    [TimeResultStatus.迟到]: "迟到",
    [TimeResultStatus.早退]: "早退",
    [TimeResultStatus.旷工]: "旷工",
    [TimeResultStatus.未打卡]: "未打卡",
    [TimeResultStatus.严重迟到]: "严重迟到",
}
export const enum CheckType  {
    "上班"='OnDuty',
    "下班"='OffDuty',
}
export const CheckTypeMap = {
    [CheckType.上班]: "上班",
    [CheckType.下班]: "下班",
}