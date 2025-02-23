import apiClient from "@/api/axios";
import { useAlert } from "@/composables/useAlert";
import { useRequest } from "@/composables/useRequest";
import type { ArticleList, Data } from "@/types/Community";
import { ref, watch } from "vue";
import { useRequest as req } from "vue-request";

const { showAlert } = useAlert();
const { executeRequest, error, loading, data } = useRequest();
let articleList = ref<ArticleList[]>([]);
let searchResult = ref<ArticleList[]>([]);
let userInfo = ref<Data>({} as Data);
let artList = ref<ArticleList[]>([]);
export function getArticle2(
  type: number | string = 0,
  condition = "",
  page = 1,
  startTime: Date | string = "",
  sort = 0,
) {
  const getArticle = () => {
    return apiClient.get(
      `/admin_post/selectAll?condition=${condition}&page=${page}&sort=${sort}&startTime=${startTime}&type=${type}`,
    );
  };
  const { data, loading } = req(getArticle, {
    loadingKeep: 600,
  });
  let res = ref<any>();
  return { loading, data };
}
export async function getArticle(
  type: number | string = 0,
  condition = "",
  page = 1,
  startTime: Date | string = "",
  sort = 0,
) {
  setTimeout(() => {}, 1000);
  await executeRequest({
    url: `/admin_post/selectAll?condition=${condition}&page=${page}&sort=${sort}&startTime=${startTime}&type=${type}`,
    method: "get",
  });
  const res = data.value as Data;
  if (res.code === 401) {
    showAlert("登录过期，请重新登录", "waring");
  }
  articleList.value = res.data.records;

  return res.data;
}
export async function deletes(ids: string) {
  return apiClient.put(`/admin_post/deletes/${ids}`);
}

export { articleList, error, loading, searchResult };
