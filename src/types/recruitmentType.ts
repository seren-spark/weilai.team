type OnClickFunction = (id: string, name?: string) => void;

//面试状态
export const enum interviewStatus {
  待安排 = 0,
  待面试 = 1,
  已录取 = 2,
  已淘汰 = 3,
}
//状态映射对象
export const interviewStatusMap = {
  [interviewStatus.待安排]: "待安排",
  [interviewStatus.待面试]: "待面试",
  [interviewStatus.已录取]: "已录取",
  [interviewStatus.已淘汰]: "已淘汰",
};

//返回值类型
export interface IResponseDataApplyUser {
  code: number;
  message: string;
  data: {
    total: number;
    pageNum: number;
    pageSize: number;
    data: IAllApplyUserDTO[];
  };
}

//根据条件获取报名人员    数据传输对象
export interface IGetAllApplyUserDTO {
  clazz?: string;
  condition?: string; //姓名 qq 邮箱 学号
  dateString?: string; //筛选日期 格式为 2023-08-20 2023-08-21
  grade?: string; //年级
  sex?: string;
  status?: interviewStatus;
  pageNo?: number;
  pageSize?: number; //每页数量
}
// 报名人员信息 数据传输对象
export interface IAllApplyUserDTO {
  clazz: string;
  email: string;
  fileUrl: string;
  grade: string;
  id: number;
  status: interviewStatus;
  name: string;
  qqNumber: string;
  sex: string;
  studentId: string;
}

// 报名人员信息 视图渲染对象
export interface IAllApplyUserVO {
  id: string;
  name: string;
  session: string;
  clazz: string;
  studentId: string;
  gender: string;
  QQ: string;
  email: string;
  state: string;
}

//获取所有年级  数据传输对象 发送
export interface IGetAllGradeDTO {
  pageNo?: number | 1;
  pageSize?: number | 10;
}

export interface IGradeData {
  id: number;
  grade: string;
  createTime: string;
}
//接收所有年级  数据传输对象 接收
export interface IAllGradeDTO {
  data: IGradeData[];
}

//导出面试结果的excel表格  数据传输对象 发送
export interface IExportInterviewResultDTO {
  clazz?: string;
  dateString: string;
  grade?: string;
  sex?: string;
  status: string;
}
//修改报名人员信息  数据传输对象 发送
export interface IUpdateApplyUserDTO {
  clazz: string;
  email: string;
  grade: string;
  id: string;
  name: string;
  qq: string;
  sex: string;
  studentId: string;
}
//面试官评价  数据传输对象 发送
export interface IUpdateInterviewResultDTO {
  comment: string;
  id: string; // 面试记录id
  round: string;
  status: string;
  userId: string; // 面试人员id
}

//获取面试人员  数据传输对象 发送
export interface IGetInterviewUserDTO {
  pageNo: number;
  pageSize: number;
  grade?: string;
  status: string;
  name?: string;
  round?: string;
}

//安排面试官  数据传输对象 发送
export interface IArrangeInterviewDTO {
  id: string;
  place: string;
  interviewTime: string;
  // 面试官id
  firstHr: string;
  secondHr: string;
  thirdHr: string;
}
// 表格头部信息
export type tableHeadersVO = {
  title: string;
  key: string;
};
// 表格操作按钮
export type tableActionsVO = {
  title: string;
  icon: string;
  onclick: OnClickFunction;
};
