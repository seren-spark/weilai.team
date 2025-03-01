import apiClient from "@/api/axios";

import { watch,  } from "vue";
import { useRequest } from "vue-request";
import axios from "axios";
export async function uploadFileChunk2(
  file: File,

) {
  const uploadfile = () => {
    return apiClient.post(`/upload/multipart/init`, file, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const { data } = useRequest(uploadfile);
  // let res = await executeRequest({
  //   url: `/recruit/user/upload/uploadChunk`,
  //   method: "post",
  //   requestData: { chunkIndex, file, object, uploadId },
  // });
  // console.log(res);

  return data;
}
export const uploadFileToMinio = async (url: string, chunk: any, type: any) => {
  console.log("minio函数执行了");

  await axios
    .put(url, chunk, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
    .then((res) => {
      console.log(res);
    });
};

export async function mergeFile2(data: any) {
  const mergefile = () => {
    return apiClient({
      url: `/upload/multipart/merge`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const { data: res } = useRequest(mergefile);
  watch(
    data,
    () => {
      console.log("合并分片返回的数据", res.value);
    },
    {
      deep: true,
    },
  );
  return res;
}

//上传信息
export function uploadScreenshot(data: any) {
  return apiClient({
    url: "/upload/multipart/uploadScreenshot",
    method: "post",
    data,
  });
}

//上传信息
export function uploadFileInfo(data: any) {
  return apiClient({
    url: "/upload/multipart/uploadFileInfo",
    method: "post",
    data,
  });
}

// 上传校验
export function checkUpload(MD5: any) {
  return apiClient({
    url: `/upload/multipart/check/${MD5}`,
    method: "get",
  });
}

// 初始化上传
export function initUpload(data: any) {
  return apiClient({
    url: `/upload/multipart/init`,
    method: "post",
    data,
  });
}

// 合并上传任务
export function mergeUpload(data: any) {
  return apiClient({
    url: `upload/multipart/merge`,
    method: "post",
    data,
  });
}
