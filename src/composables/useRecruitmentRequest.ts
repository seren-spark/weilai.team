import axios from "axios";
import router from "@/router";
import type {
  IGetAllApplyUserDTO,
  IGetAllGradeDTO,
  IExportInterviewResultDTO,
  IUpdateApplyUserDTO,
  IUpdateInterviewResultDTO,
  IGetInterviewUserDTO,
  IArrangeInterviewDTO,
} from "@/types/recruitmentType";

// 招新模块
const BASE_UEL = `http:${import.meta.env.VITE_API_BASE_URL}/`;
const getToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    throw new Error("token 不存在");
  }
  return JSON.parse(token).value;
};

//获取所有提交报名的人员
export const getAllApplyUser = ({
  pageNo,
  pageSize,
  status,
  sex,
  clazz,
  condition,
  startTime,
  endTime,
  grade,
}: IGetAllApplyUserDTO) => {
  return axios.get(`${BASE_UEL}recruit/manage/listAllRecruitUser`, {
    params: {
      ["pageDTO.pageNo"]: pageNo,
      ["pageDTO.pageSize"]: pageSize,
      status: status,
      sex: sex,
      clazz: clazz,
      condition: condition,
      startTime: startTime,
      endTime: endTime,
      grade: grade,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

// //获取所有年级
export const getAllGrade = ({ pageNo, pageSize }: IGetAllGradeDTO) => {
  return axios.get(`${BASE_UEL}recruit/manage/listAllGrade`, {
    params: {
      pageNo: pageNo,
      pageSize: pageSize,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

// //根据id获取某人的简历
export const getResumeById = ({ id }: { id: string }) => {
  return axios.get(`${BASE_UEL}recruit/manage/getResume/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

// //根据id 删除候选人
export const deleteApplyUserById = ({ id }: { id: string }) => {
  return axios.delete(`${BASE_UEL}recruit/manage/deleteRecruitUser`, {
    params: {
      id: id,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

//获取待我反馈、我录取的、我淘汰的 的面试记录
//状态参数标记 1待我反馈；2我录取；3我淘汰
export const getMyInterviewRecord = ({
  pageNo,
  pageSize,
  status,
}: {
  pageNo: number;
  pageSize: number;
  status: string;
}) => {
  return axios.get(`${BASE_UEL}recruit/manage/getAboutMe`, {
    params: {
      pageNo: pageNo,
      pageSize: pageSize,
      status: status,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

// 获取 待安排/已录取 的人数
// 状态参数标记 0待安排；2已录取
export const getInterviewCount = ({ status }: { status: number }) => {
  return axios.get(`${BASE_UEL}recruit/manage/getCount/${status}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

// 导出录取结果excel表
// 状态参数标记 0代表待安排；1代表待面试；2代表已录取；3代表已淘汰
export const exportResultExcel = ({
  startTime,
  endTime,
  grade,
  sex,
  status,
}: IExportInterviewResultDTO) => {
  console.log(startTime, endTime, grade, sex, status);
  return axios.post(
    `${BASE_UEL}recruit/manage/resultExport`,
    {
      startTime,
      endTime,
      grade,
      sex,
      status,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    },
  );
};

//修改招新报名的人员的信息
export const updateApplyUserInfo = ({
  clazz,
  email,
  grade,
  id,
  name,
  qq,
  sex,
  studentId,
}: IUpdateApplyUserDTO) => {
  return axios.put(
    `${BASE_UEL}recruit/manage/updateInfo`,
    { clazz, email, grade, id, name, qq, sex, studentId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    },
  );
};

//修改报名人员的状态
export const updateApplyUserStatus = ({
  ids,
  interviewStatus,
}: {
  ids: string[];
  interviewStatus: string;
}) => {
  const id = ids.map((id) => `ids=${id}`).join("&");
  return axios.put(
    `${BASE_UEL}recruit/manage/updateRecruitUserStatus?${id}`,
    {},
    {
      params: { interviewStatus },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    },
  );
};

//写面评
export const evaluateInterview = ({
  comment,
  id,
  isSecond,
  status,
  userId,
}: IUpdateInterviewResultDTO) => {
  return axios.post(
    `${BASE_UEL}recruit/interview/comment`,
    { comment, id, isSecond, status, userId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    },
  );
};

//根据面试记录id获取面评
export const getCommentByInterviewRecordId = ({ id }: { id: string }) => {
  return axios.get(`${BASE_UEL}recruit/interview/getComment/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

//获取所有面试官
export const getAllInterviewer = ({
  pageNo,
  pageSize,
  name,
}: {
  pageNo: number;
  pageSize: number;
  name?: string;
}) => {
  return axios.get(`${BASE_UEL}recruit/interview/listAllHr`, {
    params: {
      pageNo,
      pageSize,
      name,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

//获取所有面试人员
//状态参数标记 -1查询全部，0查询待我面试，1待反馈；2已录取；3未录取
export const getAllInterviewUser = ({
  name,
  grade,
  round,
  status,
  clazz,
  startTime,
  endTime,
  ids,
}: IGetInterviewUserDTO) => {
  let params = "";
  if (ids?.length === 0) {
    params = `${BASE_UEL}recruit/interview/listAllInterview`;
  } else {
    params = `${BASE_UEL}recruit/interview/listAllInterview?${ids?.map((id) => `ids=${id}`).join("&")}`;
  }

  return axios.get(params, {
    params: {
      name,
      grade,
      round,
      status,
      clazz,
      startTime,
      endTime,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
};

//安排面试
//状态参数标记
export const arrangeInterviewer = ({
  userId,
  startTime,
  endTime,
  place,
  firstHr,
  secondHr,
  thirdHr,
}: IArrangeInterviewDTO) => {
  console.log(userId, place,startTime,endTime, firstHr, secondHr, thirdHr);
  return axios.post(
    `${BASE_UEL}recruit/interview/scheduleInterviewer`,
    { userId,startTime,endTime,  place, firstHr, secondHr, thirdHr },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    },
  );
};
