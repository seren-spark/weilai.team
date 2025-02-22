import { ref, toRefs, watch } from "vue";
import {
  checkUpload,
  initUpload,
  mergeUpload,
  uploadFileInfo,
} from "@/api/file";
import { fileSuffixTypeUtil } from "@/utils/fileUtils";
import axios from "axios";
import SparkMD5 from "spark-md5";
import { useAlert } from "@/composables/useAlert";
import apiClient from "@/api/axios";
import type {
  checkResult,
  chunkList,
  file,
  mergeResponseData,
  responseData,
} from "@/types/file";
const { showAlert } = useAlert();
const FILE_UPLOAD_ID_KEY = "file_upload_id";
const chunkSize = 5 * 1024 * 1024; // 10mb
let currentFileIndex = 0;
// const arr = ref([
//         { id: 'ahsgdyfa01', name: '英雄联盟' },
//         { id: 'ahsgdyfa02', name: '王者荣耀' },
//         { id: 'ahsgdyfa03', name: '原神' }
//     ])

const FileStatus = {
  wait: "等待上传",
  getMd5: "校验MD5",
  chip: "正在创建序列",
  uploading: "正在上传",
  success: "上传成功",
  error: "上传错误",
};
// setTimeout(() => {
//   uploadFileList.value[0].uploadProgress = 20;
// }, 1000);
const uploadFileList = ref<file[]>([]);
const simultaneousUploads = ref(3);
const uploadIdInfo = ref(null);

// // 转换文件大小的函数，替代原 filters
// const transformByte = (size) => {
//   if (!size) {
//     return "0B";
//   }
//   const unitSize = 1024;
//   if (size < unitSize) {
//     return size + " B";
//   }
//   // KB
//   if (size < Math.pow(unitSize, 2)) {
//     return (size / unitSize).toFixed(2) + " K";
//   }
//   // MB
//   if (size < Math.pow(unitSize, 3)) {
//     return (size / Math.pow(unitSize, 2)).toFixed(2) + " MB";
//   }
//   // GB
//   if (size < Math.pow(unitSize, 4)) {
//     return (size / Math.pow(unitSize, 3)).toFixed(2) + " GB";
//   }
//   // TB
//   return (size / Math.pow(unitSize, 4)).toFixed(2) + " TB";
// };

// setTimeout(() => {
//   uploadFileList.value = ["1111"];
// }, 1000);
watch(
  () => uploadFileList,

  (newValue) => {
    console.log("监听uploadList变化");
    console.log("newValue", newValue.value);

    uploadFileList.value = newValue.value;
    console.log(uploadFileList.value);
  },
  { deep: true },
);
// watch(
//   arr,
//   (newValue, old) => {
//     console.log("监听arr变化");
//     console.log("newValue", newValue);
//     console.log("old", old);
//   },
//   { deep: true },
// );
function getStatusClass(status: string) {
  switch (status) {
    case FileStatus.wait:
      return "status-info";
    case FileStatus.getMd5:
      return "status-warning";
    case FileStatus.uploading:
      return "status-normal";
    case FileStatus.success:
      return "status-success";
    case FileStatus.error:
      return "status-danger";
    default:
      return "status-normal";
  }
}

function startUpload() {
  if (uploadFileList.value.length === 0) {
    showAlert("请先选择文件", "waring");
    return;
  }
  if (currentFileIndex >= uploadFileList.value.length) {
    showAlert("文件上传成功", "pass");
    return;
  }
  console.log("uploadList", uploadFileList.value);

  const currentFile = uploadFileList.value[currentFileIndex];
  console.log("当前操作文件：", currentFile);
  //更新上传标签
  currentFile.status = FileStatus.getMd5;
  currentFile.chunkUploadedList = [];
  // 1. 计算文件MD5
  //currentFile.raw

  //   await new Promise((resolve) => {
  getFileMd5(currentFile, async (md5: string, totalChunks: any) => {
    console.log("md5值", md5);
    // 2. 检查是否已上传
    const checkResult = (await checkFileUploadedByMd5(md5)) as checkResult;
    console.log("checkResult", checkResult);

    if (checkResult.code == 3400) {
      return showAlert("无需上传", "waring");
    }
    console.log("检查是否已上传-->", checkResult);
    if (checkResult.code === 200) {
      console.log("上传成功文件访问地址：" + checkResult.data.url);
      currentFile.status = FileStatus.success;
      currentFile.uploadProgress = 100;
      currentFileIndex++;
      startUpload();
      //   resolve();
      return;
    } else if (checkResult.code === 3401) {
      // "上传中" 状态
      // 获取已上传分片列表
      console.log("上传中：", checkResult);
      currentFile.status = FileStatus.uploading;
      let chunkUploadedList = checkResult.data.chunkUploadedList;
      console.log("chunkUploadedList", chunkUploadedList);
      currentFile.chunkUploadedList = chunkUploadedList;
      console.log("成功上传的分片信息", chunkUploadedList);
    } else {
      console.log("未上传");
    }
    // 3. 正在创建分片
    currentFile.status = FileStatus.chip;
    //创建分片
    let fileChunks = createFileChunk(currentFile as any, chunkSize as number);
    // 获取文件类型
    let type = fileSuffixTypeUtil(currentFile.name);
    let param = {
      fileName: currentFile.name,
      fileSize: currentFile.size,
      chunkSize: chunkSize,
      chunkNum: totalChunks,
      fileMd5: md5,
      contentType: "application/octet-stream",
      fileType: type,
      chunkUploadedList: currentFile.chunkUploadedList, //已上传的分片索引+1
    };
    let uploadIdInfoResult = await getFileUploadUrls(param);
    let uploadIdInfo = uploadIdInfoResult.data;
    console.log("获取上传url-->", uploadIdInfo);
    let uploadUrls = uploadIdInfo.urlList;
    currentFile.chunkList = [];
    if (uploadUrls !== undefined) {
      if (fileChunks.length !== uploadUrls.length) {
        showAlert("文件分片上传地址获取错误", "error");
        // resolve();
        return;
      }
    }
    fileChunks.map((chunkItem, index) => {
      if (currentFile.chunkUploadedList.indexOf(index + 1) !== -1) {
        currentFile.chunkList.push({
          chunkNumber: index + 1,
          chunk: chunkItem,
          uploadUrl: uploadUrls[index],
          progress: 100,
          progressStatus: "success",
          status: "上传成功",
        });
      } else {
        currentFile.chunkList.push({
          chunkNumber: index + 1,
          chunk: chunkItem,
          uploadUrl: uploadUrls[index],
          progress: 0,
          status: "—",
        });
      }
    });
    console.log("所有分片信息：", currentFile.chunkList);
    let tempFileChunks: any = [];
    currentFile.chunkList.forEach((item) => {
      tempFileChunks.push(item);
    });
    //更新状态
    currentFile.status = FileStatus.uploading;
    // 处理分片列表，删除已上传的分片
    tempFileChunks = processUploadChunkList(tempFileChunks);
    console.log("删除已上传的分片-->", tempFileChunks);
    // 5. 上传
    await uploadChunkBase(tempFileChunks);
    console.log("---上传完成---");
    if (uploadIdInfo.uploadId === "SingleFileUpload") {
      console.log("单文件上传");
      currentFile.status = FileStatus.success;
      currentFileIndex++;
      startUpload();
      //   resolve();
      return;
    } else {
      console.log("合并文件-->", currentFile);
      const mergeResult = (await mergeFile({
        uploadId: uploadIdInfo.uploadId,
        fileName: currentFile.name,
        fileMd5: md5,
        fileType: type,
        chunkNum: uploadIdInfo.urlList.length,
        chunkSize: chunkSize,
        fileSize: currentFile.size,
      })) as mergeResponseData;

      console.log("mergeResult", mergeResult);

      if (!mergeResult.data) {
        currentFile.status = FileStatus.error;
        showAlert(mergeResult?.error, "error");
      } else {
        localStorage.removeItem(FILE_UPLOAD_ID_KEY);
        currentFile.status = FileStatus.success;
        console.log("文件访问地址：", mergeResult.data);
        //文件下标偏移
        currentFileIndex++;
        startUpload();
      }
      //   resolve();
    }
  });
  //   });
}

// const startUpload = async () => {
//   if (uploadFileList.value.length === 0) {
//     alert("请先选择文件");
//     return;
//   }
//   if (currentFileIndex >= uploadFileList.value.length) {
//     alert("文件上传成功");
//     return;
//   }
//   const currentFile = uploadFileList.value[currentFileIndex];
//   console.log("当前操作文件：", currentFile);
//   currentFile.status = FileStatus.getMd5;
//   currentFile.chunkUploadedList = [];

//   const getFileMd5 = (file, callback) => {
//     const blobSlice =
//       File.prototype.slice ||
//       File.prototype.mozSlice ||
//       File.prototype.webkitSlice;
//     const fileReader = new FileReader();
//     const totalChunks = Math.ceil(file.size / chunkSize);
//     console.log("总分片数：" + totalChunks);
//     let currentChunk = 0;
//     const spark = new SparkMD5.ArrayBuffer();

//     const loadNext = () => {
//       const start = currentChunk * chunkSize;
//       const end =
//         start + chunkSize >= file.size ? file.size : start + chunkSize;
//       fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
//     };

//     fileReader.onload = function (e) {
//       try {
//         spark.append(e.target.result);
//       } catch (error) {
//         console.log("获取Md5错误：" + currentChunk);
//       }
//       if (currentChunk < totalChunks) {
//         currentChunk++;
//         loadNext();
//       } else {
//         callback(spark.end(), totalChunks);
//       }
//     };

//     fileReader.onerror = function () {
//       console.warn("读取Md5失败，文件读取错误");
//     };

//     loadNext();
//   };

//   await new Promise((resolve) => {
//     getFileMd5(currentFile, async (md5, totalChunks) => {
//       console.log("md5值", md5);
//       const checkResult = await checkFileUploadedByMd5(md5);
//       console.log("检查是否已上传-->", checkResult);
//       if (checkResult.code === 1) {
//         console.log("上传成功文件访问地址：" + checkResult.data.url);
//         currentFile.status = FileStatus.success;
//         currentFile.uploadProgress = 100;
//         currentFileIndex++;
//         handler();
//         resolve();
//         return;
//       } else if (checkResult.code === 2) {
//         console.log("上传中：", checkResult);
//         currentFile.status = FileStatus.uploading;
//         let chunkUploadedList = checkResult.data.chunkUploadedList;
//         console.log("chunkUploadedList", chunkUploadedList);
//         currentFile.chunkUploadedList = chunkUploadedList;
//         console.log("成功上传的分片信息", chunkUploadedList);
//       } else {
//         console.log("未上传");
//       }
//       currentFile.status = FileStatus.chip;
//       let fileChunks = createFileChunk(currentFile.raw, chunkSize);
//       let type = fileSuffixTypeUtil(currentFile.name);
//       let param = {
//         fileName: currentFile.name,
//         fileSize: currentFile.size,
//         chunkSize: chunkSize,
//         chunkNum: totalChunks,
//         fileMd5: md5,
//         contentType: "application/octet-stream",
//         fileType: type,
//         chunkUploadedList: currentFile.chunkUploadedList,
//       };
//       let uploadIdInfoResult = await getFileUploadUrls(param);
//       let uploadIdInfoValue = uploadIdInfoResult.data;
//       console.log("获取上传url-->", uploadIdInfoValue);
//       let uploadUrls = uploadIdInfoValue.urlList;
//       uploadFileList.value[currentFileIndex].chunkList = [];
//       if (uploadUrls !== undefined) {
//         if (fileChunks.length !== uploadUrls.length) {
//           alert("文件分片上传地址获取错误");
//           resolve();
//           return;
//         }
//       }
//       fileChunks.map((chunkItem, index) => {
//         if (currentFile.chunkUploadedList.indexOf(index + 1) !== -1) {
//           uploadFileList.value[currentFileIndex].chunkList.push({
//             chunkNumber: index + 1,
//             chunk: chunkItem,
//             uploadUrl: uploadUrls[index],
//             progress: 100,
//             progressStatus: "success",
//             status: "上传成功",
//           });
//         } else {
//           uploadFileList.value[currentFileIndex].chunkList.push({
//             chunkNumber: index + 1,
//             chunk: chunkItem,
//             uploadUrl: uploadUrls[index],
//             progress: 0,
//             status: "—",
//           });
//         }
//       });
//       console.log(
//         "所有分片信息：",
//         uploadFileList.value[currentFileIndex].chunkList,
//       );
//       let tempFileChunks = [];
//       uploadFileList.value[currentFileIndex].chunkList.forEach((item) => {
//         tempFileChunks.push(item);
//       });
//       currentFile.status = FileStatus.uploading;
//       tempFileChunks = processUploadChunkList(tempFileChunks);
//       console.log("删除已上传的分片-->", tempFileChunks);
//       await uploadChunkBase(tempFileChunks);
//       console.log("---上传完成---");
//       if (uploadIdInfoValue.uploadId === "SingleFileUpload") {
//         console.log("单文件上传");
//         currentFile.status = FileStatus.success;
//         currentFileIndex++;
//         handler();
//         resolve();
//         return;
//       } else {
//         console.log("合并文件-->", currentFile);
//         const mergeResult = await mergeFile({
//           uploadId: uploadIdInfoValue.uploadId,
//           fileName: currentFile.name,
//           fileMd5: md5,
//           fileType: type,
//           chunkNum: uploadIdInfoValue.urlList.length,
//           chunkSize: chunkSize,
//           fileSize: currentFile.size,
//         });
//         if (!mergeResult.data) {
//           currentFile.status = FileStatus.error;
//           alert(mergeResult.error);
//         } else {
//           localStorage.removeItem(FILE_UPLOAD_ID_KEY);
//           currentFile.status = FileStatus.success;
//           console.log("文件访问地址：" + mergeResult.data);
//           currentFileIndex++;
//           handler();
//         }
//         resolve();
//       }
//     });
//   });
// };

// async function startUpload() {
//   if (uploadFileList.value.length === 0) {
//     showAlert("请先选择文件", "waring");
//     return;
//   }
//   if (currentFileIndex >= uploadFileList.value.length) {
//     showAlert("文件上传成功", "pass");
//     return;
//   }
//   const currentFile = uploadFileList.value[currentFileIndex];
//   console.log("当前操作文件：", currentFile);
//   //更新上传标签
//   currentFile.status = FileStatus.getMd5;
//   currentFile.chunkUploadedList = [];
//   // 1. 计算文件MD5
//   //currentFile.raw

//   await new Promise((resolve) => {
//     getFileMd5(currentFile, async (md5, totalChunks) => {
//       console.log("md5值", md5);
//       // 2. 检查是否已上传
//       console.log(md5);

//       const checkResult = await checkFileUploadedByMd5(md5);
//       if (checkResult.code === 3400) {
//         return showAlert("无需上传");
//       }
//       console.log("检查是否已上传-->", checkResult);
//       if (checkResult.code === 1) {
//         console.log("上传成功文件访问地址：" + checkResult.data.url);
//         currentFile.status = FileStatus.success;
//         currentFile.uploadProgress = 100;
//         currentFileIndex++;
//         startUpload();
//         resolve();
//         return;
//       } else if (checkResult.code === 2) {
//         // "上传中" 状态
//         // 获取已上传分片列表
//         console.log("上传中：", checkResult);
//         currentFile.status = FileStatus.uploading;
//         let chunkUploadedList = checkResult.data.chunkUploadedList;
//         console.log("chunkUploadedList", chunkUploadedList);
//         currentFile.chunkUploadedList = chunkUploadedList;
//         console.log("成功上传的分片信息", chunkUploadedList);
//       } else {
//         console.log("未上传");
//       }
//       // 3. 正在创建分片
//       currentFile.status = FileStatus.chip;
//       //创建分片
//       let fileChunks = createFileChunk(currentFile, chunkSize);
//       // 获取文件类型
//       let type = fileSuffixTypeUtil(currentFile.name);
//       let param = {
//         fileName: currentFile.name,
//         fileSize: currentFile.size,
//         chunkSize: chunkSize,
//         chunkNum: totalChunks,
//         fileMd5: md5,
//         contentType: "application/octet-stream",
//         fileType: type,
//         chunkUploadedList: currentFile.chunkUploadedList, //已上传的分片索引+1
//       };
//       let uploadIdInfoResult = await getFileUploadUrls(param);
//       let uploadIdInfoValue = uploadIdInfoResult.data;
//       console.log("获取上传url-->", uploadIdInfoValue);
//       let uploadUrls = uploadIdInfoValue.urlList;
//       currentFile.chunkList = [];
//       if (uploadUrls !== undefined) {
//         if (fileChunks.length !== uploadUrls.length) {
//           showAlert("文件分片上传地址获取错误", "error");
//           resolve();
//           return;
//         }
//       }
//       fileChunks.map((chunkItem, index) => {
//         if (currentFile.chunkUploadedList.indexOf(index + 1) !== -1) {
//           currentFile.chunkList.push({
//             chunkNumber: index + 1,
//             chunk: chunkItem,
//             uploadUrl: uploadUrls[index],
//             progress: 100,
//             progressStatus: "success",
//             status: "上传成功",
//           });
//         } else {
//           currentFile.chunkList.push({
//             chunkNumber: index + 1,
//             chunk: chunkItem,
//             uploadUrl: uploadUrls[index],
//             progress: 0,
//             status: "—",
//           });
//         }
//       });
//       console.log("所有分片信息：", currentFile.chunkList);
//       let tempFileChunks = [];
//       currentFile.chunkList.forEach((item) => {
//         tempFileChunks.push(item);
//       });
//       //更新状态
//       currentFile.status = FileStatus.uploading;
//       // 处理分片列表，删除已上传的分片
//       tempFileChunks = processUploadChunkList(tempFileChunks);
//       console.log("删除已上传的分片-->", tempFileChunks);
//       // 5. 上传
//       await uploadChunkBase(tempFileChunks);
//       console.log("---上传完成---");
//       if (uploadIdInfoValue.uploadId === "SingleFileUpload") {
//         console.log("单文件上传");
//         currentFile.status = FileStatus.success;
//         currentFileIndex++;
//         startUpload();
//         resolve();
//         return;
//       } else {
//         console.log("合并文件-->", currentFile);
//         const mergeResult = await mergeFile({
//           uploadId: uploadIdInfoValue.uploadId,
//           fileName: currentFile.name,
//           fileMd5: md5,
//           fileType: type,
//           chunkNum: uploadIdInfoValue.urlList.length,
//           chunkSize: chunkSize,
//           fileSize: currentFile.size,
//         });
//         if (!mergeResult.data) {
//           currentFile.status = FileStatus.error;
//           showAlert(mergeResult.error, "error");
//         } else {
//           localStorage.removeItem(FILE_UPLOAD_ID_KEY);
//           currentFile.status = FileStatus.success;
//           console.log("文件访问地址：", mergeResult.data);
//           currentFileIndex++;
//           startUpload();
//         }
//         resolve();
//       }
//     });
//   });
// }

function getFileMd5(file: any, callback: any) {
  const blobSlice =
    file.slice || (file as any).mozSlice || (file as any).webkitSlice;
  const fileReader = new FileReader();
  // 计算分片数
  console.log(file);

  console.log(file.size);

  const totalChunks = Math.ceil(file.size / chunkSize);
  console.log("总分片数：" + totalChunks);
  let currentChunk = 0;
  const spark = new SparkMD5.ArrayBuffer();
  loadNext();
  fileReader.onload = function (e) {
    if (e.target?.result) {
      try {
        spark.append(e.target.result as any);
      } catch (error) {
        console.log("获取Md5错误：" + currentChunk);
      }
    }

    if (currentChunk < totalChunks) {
      currentChunk++;
      loadNext();
    } else {
      callback(spark.end(), totalChunks);
    }
  };
  fileReader.onerror = function () {
    console.warn("读取Md5失败，文件读取错误");
  };

  function loadNext() {
    const start = currentChunk * chunkSize;
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    // 注意这里的 fileRaw
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
}
// function handler() {
//   //判断文件列表是否为空
//   if (uploadFileList.value.length === 0) {
//     showAlert("请先选择文件", "error");
//     return;
//   }
//   if (currentFileIndex >= uploadFileList.value.length) {
//     showAlert("上传完成", "pass");
//     return;
//   }
//   //当前操作文件
//   const currentFile = uploadFileList.value[currentFileIndex];
//   console.log("当前操作文件：", currentFile);
//   //debugger
//   //更新上传标签
//   currentFile.status = FileStatus.getMd5;
//   currentFile.chunkUploadedList = [];

//   //截取封面图片
//   //this.ScreenshotVideo(currentFile.raw);

//   // 1. 计算文件MD5
//   getFileMd5(currentFile.raw, async (md5, totalChunks) => {
//     console.log("md5值", md5);
//     // 2. 检查是否已上传
//     const checkResult = await checkFileUploadedByMd5(md5);
//     console.log("检查是否已上传-->", checkResult);
//     // debugger
//     if (checkResult.code == 200) {
//       //self.$message.success(`上传成功，文件地址：${checkResult.data.url}`)
//       console.log("上传成功文件访问地址：" + checkResult.data.url);
//       currentFile.status = FileStatus.success;
//       currentFile.uploadProgress = 100;
//       //如果此文件上传过，就跳到下一个文件
//       currentFileIndex++;
//       this.handler();
//       return;
//     } else if (checkResult.code === 3401) {
//       // "上传中" 状态
//       // 获取已上传分片列表
//       console.log("上传中：", checkResult);
//       currentFile.status = FileStatus.uploading;
//       let chunkUploadedList = checkResult.data.chunkUploadedList;
//       console.log("chunkUploadedList", chunkUploadedList);
//       currentFile.chunkUploadedList = chunkUploadedList;
//       console.log("成功上传的分片信息", chunkUploadedList);
//     } else {
//       // 未上传
//       console.log("未上传");
//     }
//     // 3. 正在创建分片
//     currentFile.status = FileStatus.chip;

//     //创建分片
//     let fileChunks = createFileChunk(currentFile.raw, chunkSize);

//     //重命名文件
//     //let fileName = this.getNewFileName(currentFile)

//     // 获取文件类型
//     //let type = currentFile.name.substring(currentFile.name.lastIndexOf(".") + 1)
//     let type = fileSuffixTypeUtil(currentFile.name);

//     let param = {
//       fileName: currentFile.name,
//       fileSize: currentFile.size,
//       chunkSize: chunkSize,
//       chunkNum: totalChunks,
//       fileMd5: md5,
//       contentType: "application/octet-stream",
//       fileType: type,
//       //uploadId:localStorage.getItem("file_upload_id"),
//       chunkUploadedList: currentFile.chunkUploadedList, //已上传的分片索引+1
//     };
//     // debugger
//     // 4. 获取上传url
//     let uploadIdInfoResult = await getFileUploadUrls(param);
//     debugger;

//     uploadIdInfo.value = uploadIdInfoResult.data;
//     console.log("获取上传url-->", uploadIdInfo.value);

//     let uploadUrls = uploadIdInfo.value.urlList;

//     currentFile.chunkList = [];

//     if (uploadUrls !== undefined) {
//       if (fileChunks.length !== uploadUrls.length) {
//         showAlert("文件分片上传地址获取错误", "error");
//         return;
//       }
//     }

//     fileChunks.map((chunkItem, index) => {
//       if (currentFile.chunkUploadedList.indexOf(index + 1) !== -1) {
//         currentFile.chunkList.push({
//           chunkNumber: index + 1,
//           chunk: chunkItem,
//           uploadUrl: uploadUrls[index],
//           progress: 100,
//           progressStatus: "success",
//           status: "上传成功",
//         });
//       } else {
//         currentFile.chunkList.push({
//           chunkNumber: index + 1,
//           chunk: chunkItem,
//           uploadUrl: uploadUrls[index],
//           progress: 0,
//           status: "—",
//         });
//       }
//     });
//     console.log("所有分片信息：", currentFile.chunkList);
//     let tempFileChunks = [];

//     currentFile.chunkList.forEach((item) => {
//       tempFileChunks.push(item);
//     });

//     //更新状态
//     currentFile.status = FileStatus.uploading;

//     // 处理分片列表，删除已上传的分片
//     tempFileChunks = processUploadChunkList(tempFileChunks);
//     console.log("删除已上传的分片-->", tempFileChunks);
//     // 5. 上传
//     await uploadChunkBase(tempFileChunks);

//     console.log("---上传完成---");

//     //判断是否单文件上传或者分片上传
//     if (uploadIdInfo.value.uploadId === "SingleFileUpload") {
//       console.log("单文件上传");
//       //更新状态
//       currentFile.status = FileStatus.success;
//       //文件下标偏移
//       currentFileIndex++;
//       //递归上传下一个文件
//       handler();
//       return;
//     } else {
//       // 6. 合并文件
//       console.log("合并文件-->", currentFile);
//       const mergeResult = await mergeFile({
//         uploadId: uploadIdInfo.value.uploadId,
//         fileName: currentFile.name,
//         fileMd5: md5,
//         fileType: type,
//         chunkNum: uploadIdInfo.value.urlList.length,
//         chunkSize: chunkSize,
//         fileSize: currentFile.size,
//       });

//       //合并文件状态
//       if (!mergeResult.data) {
//         currentFile.status = FileStatus.error;
//         showAlert(mergeResult.error, "error");
//       } else {
//         localStorage.removeItem(FILE_UPLOAD_ID_KEY);
//         currentFile.status = FileStatus.success;
//         console.log("文件访问地址：" + mergeResult.data);
//         //文件下标偏移
//         currentFileIndex++;
//         //递归上传下一个文件
//         handler();
//       }
//     }
//   });
// }

function handleFileChange(event: any) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    initFileProperties(file);
    uploadFileList.value.push(file);
    console.log("uploadFileList", uploadFileList.value);
  }
  console.log("uploadFileList", uploadFileList.value);
}

function saveFileInfoToDB(
  currentFile: any,
  fileName: string,
  url: string,
  md5: string,
) {
  let userInfoCache = JSON.parse(localStorage.getItem("userInfo") as string);
  let VideoFileInfo = {
    userId: userInfoCache.id,
    fileRealName: currentFile.name,
    fileName: fileName,
    fileSize: currentFile.size,
    fileMd5: md5,
    fileAddress: url,
    bucketName: "video",
    fileType: "video",
  };
  console.log(VideoFileInfo);
  uploadFileInfo(VideoFileInfo).then((res: any) => {
    console.log(res.data);
    if (res.status == 200) {
      showAlert("文件信息存储成功", "pass");
      if (uploadFileList.value.length > currentFileIndex) {
        startUpload();
      }
    } else {
      showAlert("文件信息存储失败", "error");
    }
  });
}

function clearFileHandler() {
  uploadFileList.value = [];
  uploadIdInfo.value = null;
  currentFileIndex = 0;
}

function initFileProperties(file: any) {
  file.chunkList = [];
  file.status = FileStatus.wait;
  file.progressStatus = "warning";
  file.uploadProgress = 0;
}

function beforeUploadVideo(file: any) {
  let type = file.name.substring(file.name.lastIndexOf(".") + 1);
  if (["mp4", "ogg", "flv", "avi", "wmv", "rmvb"].indexOf(type) == -1) {
    showAlert("请上传正确的视频格式", "error");
    return false;
  }
}
function getNewFileName(file: any, md5: string) {
  return new Date().getTime() + file.name;
}

function createFileChunk(file: File, size = chunkSize) {
  const fileChunkList = [];
  let count = 0;
  while (count < file.size) {
    fileChunkList.push({
      file: file.slice(count, count + size),
    });
    console.log("文件分片", file.slice(count, count + size));
    count += size;
  }
  return fileChunkList;
}

function processUploadChunkList(chunkList: chunkList[]) {
  const currentFile = uploadFileList.value[currentFileIndex];
  let chunkUploadedList = currentFile.chunkUploadedList;
  if (
    chunkUploadedList === undefined ||
    chunkUploadedList === null ||
    chunkUploadedList.length === 0
  ) {
    return chunkList;
  }
  for (let i = chunkList.length - 1; i >= 0; i--) {
    const chunkItem = chunkList[i];
    for (let j = 0; j < chunkUploadedList.length; j++) {
      if (chunkItem.chunkNumber === chunkUploadedList[j]) {
        chunkList.splice(i, 1);
        break;
      }
    }
  }
  return chunkList;
}

function uploadChunkBase(chunkList: chunkList[]) {
  debugger;
  console.log("执行uploadChunkBase");

  let successCount = 0;
  let totalChunks = chunkList.length;
  return new Promise((resolve) => {
    const handler = () => {
      if (chunkList.length) {
        const chunkItem = chunkList.shift() as chunkList;
        console.log(chunkItem.uploadUrl, chunkItem.chunk.file);

        axios
          .put(chunkItem.uploadUrl, chunkItem.chunk.file, {
            onUploadProgress: checkChunkUploadProgress(chunkItem),
            headers: {
              "Content-Type": "application/octet-stream",
            },
          })
          .then((response) => {
            console.log(response);

            if (response.status === 200) {
              console.log("分片：" + chunkItem.chunkNumber + " 上传成功");
              successCount++;
              handler();
            } else {
              console.log(
                "上传失败：" + response.status + "，" + response.statusText,
              );
            }
          })
          .catch((error) => {
            console.log(
              "分片：" + chunkItem.chunkNumber + " 上传失败，" + error,
            );
            chunkList.push(chunkItem);
            handler();
          });
      }
      if (successCount >= totalChunks) {
        resolve(true);
      }
    };
    for (let i = 0; i < simultaneousUploads.value; i++) {
      console.log("执行");

      handler();
    }
  });
}
function getFileUploadUrls(fileParam: any) {
  return initUpload(fileParam);
}

function checkFileUploadedByMd5(md5: string) {
  return new Promise((resolve, reject) => {
    checkUpload(md5)
      .then((response: checkResult) => {
        console.log(response);

        console.log("md5-->:", response);
        resolve(response);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

function mergeFile(fileParam: any) {
  return new Promise((resolve) => {
    mergeUpload(fileParam).then((response: any) => {
      console.log(response);
      let data = response;
      console.log("@@@", data);
      if (!data) {
        data.msg = FileStatus.error;
        resolve(data);
      } else {
        data.msg = FileStatus.success;
        resolve(data);
      }
    });
  });
}
/**
 * 检查分片上传进度
 */
function checkChunkUploadProgress(item: chunkList) {
  return (p: any) => {
    console.log("checkChunkUploadProgress事件触发", p);
    item.progress = parseInt(String((p.loaded / p.total) * 100));

    console.log(
      "检查分片上传进度：",
      uploadFileList.value[currentFileIndex].uploadProgress,
    );

    updateChunkUploadStatus(item);
  };
}
function updateChunkUploadStatus(item: chunkList) {
  let status = FileStatus.uploading;
  let progressStatus = "normal";
  if (item.progress >= 100) {
    status = FileStatus.success;
    progressStatus = "success";
  }
  let chunkIndex = item.chunkNumber - 1;
  let currentChunk =
    uploadFileList.value[currentFileIndex].chunkList[chunkIndex];
  // 修改状态
  currentChunk.status = status;
  currentChunk.progressStatus = progressStatus;
  // 更新状态

  (uploadFileList.value[currentFileIndex].chunkList[chunkIndex] = currentChunk),
    // 获取文件上传进度
    getCurrentFileProgress();
}

function getCurrentFileProgress() {
  const currentFile = uploadFileList.value[currentFileIndex];
  if (!currentFile || !currentFile.chunkList) {
    return;
  }
  const chunkList = currentFile.chunkList;
  const uploadedSize = chunkList
    .map((item) => item.chunk.file.size * item.progress)
    .reduce((acc, cur) => acc + cur);
  // 计算方式：已上传大小 / 文件总大小
  let progress = parseInt((uploadedSize / currentFile.size).toFixed(2));
  debugger;
  currentFile.uploadProgress = progress;
  console.log("1050行 获取当前文件进度", currentFile);

  uploadFileList.value[currentFileIndex] = currentFile;
  console.log(uploadFileList.value);
}

//   filters: {
function transformByte(size: number) {
  if (!size) {
    return "0B";
  }
  const unitSize = 1024;
  if (size < unitSize) {
    return size + " B";
  }
  // KB
  if (size < Math.pow(unitSize, 2)) {
    return (size / unitSize).toFixed(2) + " K";
  }
  // MB
  if (size < Math.pow(unitSize, 3)) {
    return (size / Math.pow(unitSize, 2)).toFixed(2) + " MB";
  }
  // GB
  if (size < Math.pow(unitSize, 4)) {
    return (size / Math.pow(unitSize, 3)).toFixed(2) + " GB";
  }
  // TB
  return (size / Math.pow(unitSize, 4)).toFixed(2) + " TB";
}
