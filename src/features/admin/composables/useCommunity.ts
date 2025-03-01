import apiClient from "@/api/axios";
import { useAlert } from "@/composables/useAlert";
import { useRequest } from "@/composables/useRequest";
//@ts-ignore
import type { ArticleList, Data } from "@/types/community";
import { ref, watch } from "vue";
import { useRequest as req } from "vue-request";
import type { AdminResponseData } from "../../../types/admin-community";
enum API {
  SELECTALL = "/admin_post/selectAll", //查询帖子
  DELETES = "/admin_post/deletes/", //删除帖子
}
let articleList = ref<ArticleList[]>([]);
let searchResult = ref<ArticleList[]>([]);
let adminPostData = ref<AdminResponseData>();
export function getAdminPost(
  type: number | string = 0,
  condition = "",
  startTime: Date | string = "",
  sort = 0,
) {
  const getArticle = (
    page = 1,
    condition = "",
    type: number | string = 0,
    startTime: Date | string = "",
    endTime: Date | string = "",
  ) => {
    return apiClient({
      url: API.SELECTALL,
      method: "get",
      params: {
        condition,
        page,
        sort,
        startTime,
        endTime,
        type,
      },
    });
  };
  const { data, loading, run } = req(getArticle);
  return { loading, data, run };
}

export async function deletes(ids: string) {
  return apiClient.put(API.DELETES + `${ids}`);
}

export { articleList, searchResult, adminPostData };
