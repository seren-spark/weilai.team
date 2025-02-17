import { useRequest } from "vue-request";
import apiClient from "@/api/axios";

//获取二级评论
function getSecondComment(
  commentId: number,
  pageNumber: number,
  pageSize: number,
) {
  return apiClient.get(
    `/comment/getCommentTwo?commentId=${commentId}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
  );
}
const { data: secondData, run } = useRequest(getSecondComment);
export { run, secondData };
