<template>
  <div>
    文件上传
    <input type="file" @change="uploadfile($event, chunkSize)" />
  </div>
</template>
<script setup lang="ts">
import SparkMD5 from "spark-md5";
import { ref, watch } from "vue";
import {
  mergeFile,
  runCheckChunk,
  uploadFileChunk,
} from "../../composables/upload";
import {
  mergeFile2,
  uploadFileChunk2,
  uploadFileToMinio,
} from "../../composables/upload2";
import { log } from "node_modules/handsontable/helpers";
import type { uploadFileResponseData } from "@/types/file";
import apiClient from "@/api/axios";
import { MinimizeIcon } from "lucide-vue-next";
const chunkSize = 5 * 1024 * 1024; //2kB
const fileHash = ref<string>("");
const fileName = ref<string>("");
const checkResult = ref<any>({});
const uploadId = ref<string>("");
// 计算文件的md5
async function computeFileHash(file: File): Promise<any> {
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const buffer = e.target?.result;
      spark.append(buffer as ArrayBuffer);
      const hash: string = spark.end();
      if (!buffer) reject();
      // 获取文件后缀
      const ext: string = file.name.split(".").pop() as string;
      resolve({
        hash,
        ext,
      });
    };
    fileReader.readAsArrayBuffer(file);
  });
}
// 把每个分片上传到minio服务器

// const uploadfile = async (e: any, chunkSize: number) => {
//   let index;
//   let start = 0;
//   let uploadId;
//   console.log(Boolean(e.target.files[0]));
//   if (Boolean(e.target.files[0])) {
//     // if (e.target.files[0].type) {
//     //   //   判断类型
//     //   return;
//     // } else
//     // {
//     let files = e.target.files[0];
//     //计算hash
//     const { hash, ext } = await computeFileHash(files);
//     let object = `${hash}.${ext}`;
//     // 向后端发送请求检查md5

//     let res = await runCheckChunk(hash);

//     console.log(res);

//     if (res.code == 3400) {
//       return alert(res.message);
//     }

//     console.log("传md5返回的数据", res.data);
//     // 获取索引
//     // index = data.index;
//     index = 0;
//     const { name, size, type } = files;
//     console.log(files);

//     while (start < size) {
//       index++;
//       let blob = null;
//       console.log(files);

//       console.log(files.slice(start, size));

//       if (start + chunkSize > size) {
//         //如果切片长度大于文件实际长度
//         blob = files.slice(start, size); //从0开始切片段到size
//       } else {
//         //如果切片长度小于文件实际长度
//         blob = files.slice(start, start + chunkSize); //每次只切片一个切片大小的文件
//       }
//       start += chunkSize; //切片片段的偏移量
//       // 切片保存在文件中 放在一个文件中再给formdata提交
//       let blobFile = new File([blob], `${name}`);
//       let formData = new FormData(); //创建一个formData对象

//       formData.append("file", blobFile); //添加文件  blobFile
//       formData.append("chunkIndex", index + ""); //添加文件索引
//       // formData.append("uploadId", `${uploadId.value}`); //添加文件索引
//       formData.append("object", object); // 总文件的md5+文件后缀名

//       let fileUploadInfo = {
//         chunkNum: index,
//         chunkSize,
//         contentType: "application/octet-stream",
//         chunkUploadedList: [],
//         fileMd5: hash,
//         fileName: name,
//         fileSize: size,
//         fileType: ext, //后缀
//       };
//       //上传文件片段
//       let data = await uploadFileChunk2(
//         JSON.stringify(fileUploadInfo),
//         index,
//         object,
//       );

//       watch(
//         data,
//         () => {
//           console.log("上传分片返回的数据", data.value);
//           let resData: uploadFileResponseData = data.value as any;
//           console.log(resData, "上传文件片段");
//           uploadId = resData.data.uploadId;

//           let url = resData.data.urlList[0];

//           const formData = new FormData();
//           console.log(url);

//           formData.append("file", blobFile);

//           uploadFileToMinio(url, blob, type);
//         },
//         {
//           deep: true,
//         },
//       );

//       // let resData = uploadFileChunk(formData);
//     }
//     //    合并分片
//     console.log("uploadId",uploadId);

//     let mergeInfo = {
//       fileMd5: hash,
//       fileName: name,
//       uploadId,
//     };
//     let mergeRes = await mergeFile2({
//       fileMd5: hash,
//       fileName: name,
//       uploadId,
//     });
//     console.log(mergeRes, "合并分片");

//     // }
//   }
// };

const uploadfile = async (e: any, chunkSize: number) => {
  let index: number;
  let start = 0;
  let uploadId;
  let data: any;
  let blobFile: any;
  let Blob: any;
  console.log(Boolean(e.target.files[0]));
  if (Boolean(e.target.files[0])) {
    let files = e.target.files[0];
    // 计算 hash
    const { hash, ext } = await computeFileHash(files);
    let object = `${hash}.${ext}`;
    // 向后端发送请求检查 md5
    let res = await runCheckChunk(hash);

    console.log(res);

    if (res.code === 3400) {
      return alert(res.message);
    }

    console.log("传 md5 返回的数据", res.data);
    index = 0;
    const { name, size, type } = files;
    async function xunhuan() {
      while (start < size) {
        console.log("循环");

        index++;
        let blob = null;
        if (start + chunkSize > size) {
          // 如果切片长度大于文件实际长度
          blob = files.slice(start, size); // 从 0 开始切片段到 size
        } else {
          // 如果切片长度小于文件实际长度
          blob = files.slice(start, start + chunkSize); // 每次只切片一个切片大小的文件
        }
        start += chunkSize; // 切片片段的偏移量
        // 切片保存在文件中 放在一个文件中再给 formdata 提交
        blobFile = new File([blob], `${name}`);
        let formData = new FormData(); // 创建一个 formData 对象

        formData.append("file", blobFile); // 添加文件  blobFile
        formData.append("chunkIndex", index + ""); // 添加文件索引
        formData.append("object", object); // 总文件的 md5+文件后缀名

        let fileUploadInfo = {
          chunkNum: index,
          chunkSize,
          contentType: "application/octet-stream",
          chunkUploadedList: [],
          fileMd5: hash,
          fileName: name,
          fileSize: size,
          fileType: ext, // 后缀
        };
        // 上传文件片段
        data = await uploadFileChunk2(
          JSON.stringify(fileUploadInfo),
          index,
          object,
        );
        watch(
          data,
          async () => {
            console.log("上传分片返回的数据", data.value);
            let resData: uploadFileResponseData = data.value as any;
            console.log(resData, "上传文件片段");

            let url = resData.data.urlList[0];

            const formData = new FormData();
            console.log(url);

            formData.append("file", blobFile);

            if (data.value.code == 3403) {
              uploadFileToMinio(url, blob, type);
              uploadId = data.value.data.uploadId;
              let mergeInfo = {
                fileMd5: hash,
                fileName: name,
                uploadId,
              };
              console.log("uploadId", uploadId);
              console.log(mergeInfo);

              let mergeRes = await mergeFile2(JSON.stringify(mergeInfo));

              console.log(mergeRes, "合并分片");
            }
          },
          {
            deep: true,
          },
        );
      }
    }

    await xunhuan();

    // 合并分片
    // console.log("uploadId", uploadId);

    // let mergeRes = await mergeFile2(mergeInfo);
    // console.log(mergeRes, "合并分片");
  }
};
</script>
