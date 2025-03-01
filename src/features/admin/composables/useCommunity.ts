import apiClient from "@/api/axios";

import type { ArticleList } from "@/types/community";
import { ref } from "vue";
import { useRequest as req } from "vue-request";
import type { AdminResponseData } from "../../../types/admin-community";
enum API {
  SELECTALL = "/admin_post/selectAll", //查询帖子
  DELETES = "/admin_post/deletes/", //删除帖子
}
const articleList = ref<ArticleList[]>([]);
const searchResult = ref<ArticleList[]>([]);
const adminPostData = ref<AdminResponseData>();
export function getAdminPost(

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
