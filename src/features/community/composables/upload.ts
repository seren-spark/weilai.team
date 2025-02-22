import { useAlert } from "@/composables/useAlert";
import { useRequest } from "@/composables/useRequest";
import type { ArticleList, Data } from "@/types/Community";
import { ref } from "vue";
const { showAlert } = useAlert();
const { executeRequest, error, loading, data } = useRequest();
let articleList = ref<ArticleList[]>([]);
let searchResult = ref<ArticleList[]>([]);
let userInfo = ref<Data>({} as Data);

export async function runCheckChunk(object: string) {
  await executeRequest({
    url: `/upload/multipart/check/${object}`,
    method: "get",
  });
  return data.value;
}

export async function uploadFileChunk(
  file: FormData,
  chunkIndex: number,
  object: string,
  uploadId: string,
) {
  let fileUploadInfo={
    file,
    chunkIndex,
    object,
    uploadId
  }
  await executeRequest({
    url: `/upload/multipart/init`,
    method: "post",
    requestData: { chunkIndex, file, object, uploadId },
  });

  console.log(data.value);

  return data.value;
}
export async function mergeFile(
  object: string,
  uploadId: string,
  chunkCount: number,
) {
  await executeRequest({
    url: `/recruit/user/upload/mergeChunk/${object}/${uploadId}/${chunkCount}`,
    method: "post",
  });
  return data.value;
}
