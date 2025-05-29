const RecruitRequestApi:Record<string, string> =
  {
    // 获取快捷操作的相关内容
    getName : "recruit/manage/getName GET",
    // 获取待安排/已录取 的人数
    getCount : "recruit/manage/getCount/{status} GET",
    //获取待我反馈、我录取的、我淘汰的 的面试记录
    //状态参数标记 1待我反馈；2我录取；3我淘汰
    getMyInterviewRecord : "recruit/manage/getAboutMe GET",
    // 获取面试官
     getAllInterviewer : "recruit/interview/listAllHr GET",
    // 安排面试
    arrangeInterviewer : "recruit/interview/scheduleInterviewer POST",
  }

export default RecruitRequestApi