export {
  handleFileChange,
  beforeUploadVideo,
  clearFileHandler,
  handler,
  uploadFileList,
  getStatusClass,
  percent,
  transformByte,
};
import { watch, defineProps } from "vue";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
import { ref, watchEffect } from "vue";
import axios from "axios";
import SparkMD5 from "spark-md5";
// 假设以下是你的 API 请求函数
import {
  initUpload,
  checkUpload,
  mergeUpload,
  uploadFileInfo,
} from "@/api/file";
// 假设这是你的文件后缀类型工具函数
import { fileSuffixTypeUtil } from "@/utils/fileUtils";
import type {
  checkResult,
  chunkList,
  file,
  mergeResponseData,
} from "@/types/file";
const FILE_UPLOAD_ID_KEY = "file_upload_id";
const chunkSize = 5 * 1024 * 1024; // 100kb
const percent = ref<number[]>([]);
const FileStatus = {
  wait: "等待上传",
  getMd5: "校验MD5",
  chip: "正在创建序列",
  uploading: "正在上传",
  success: "上传成功",
  error: "上传错误",
};

// 响应式数据
const simultaneousUploads = ref(3);
const uploadIdInfo = ref(null);
const uploadFileList = ref<file[]>([]);
const currentFileIndex = ref(0);
watch(
  () => uploadFileList.value,
  () => {
    console.log(uploadFileList.value);
  },
  { deep: true },
);
watch(
  () => percent.value,
  (newVal) => {},
  { deep: true },
);
// 初始化文件属性
const initFileProperties = (file: file) => {
  file.chunkList = [];
  file.status = FileStatus.wait;
  file.progressStatus = "warning";
  file.uploadProgress = 0;
};

// 处理文件列表变化
function handleFileChange(event: any) {
  if (event.target) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      initFileProperties(file);
      uploadFileList.value.push(file);
      percent.value.push(0);
    }
    console.log("uploadFileList中添加文件", uploadFileList.value);
  }
}

// 移除文件列表
// const handleRemove = (file: any, fileList:file) => {
//   uploadFileList.value = fileList;
// };

// 检查上传文件格式
const beforeUploadVideo = (file: any) => {
  let type = file.name.substring(file.name.lastIndexOf(".") + 1);
  if (["mp4", "ogg", "flv", "avi", "wmv", "rmvb"].indexOf(type) === -1) {
    showAlert("请上传正确的视频格式", "error");
    return false;
  }
  return true;
};

// 获取新文件名
const getNewFileName = (file: any, md5: string) => {
  return new Date().getTime() + file.name;
  // return md5 + "-" + file.name;
};

// 分片读取文件获取文件的 MD5
const getFileMd5 = (file: File) => {
  return new Promise((resolve) => {
    const blobSlice =
      file.slice || (file as any).mozSlice || (file as any).webkitSlice;
    const fileReader = new FileReader();
    console.log(file);

    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    console.log("总分片数：" + totalChunks);
    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    fileReader.onload = (e) => {
      if (e.target?.result) {
        try {
          // 检查 e.target.result 是否为 ArrayBuffer 类型
          if (e.target.result instanceof ArrayBuffer) {
            spark.append(e.target.result);
          } else {
            console.error("读取结果不是 ArrayBuffer 类型");
          }
        } catch (error) {
          console.log("获取Md5错误：" + currentChunk);
        }
      }
      if (currentChunk < totalChunks) {
        currentChunk++;
        loadNext();
      } else {
        resolve({ md5: spark.end(), totalChunks });
      }
    };

    fileReader.onerror = () => {
      console.warn("读取Md5失败，文件读取错误");
    };

    loadNext();
  });
};

// 文件分片
const createFileChunk = (file: File, size = chunkSize) => {
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
};

// 处理即将上传的分片列表，判断是否有已上传的分片，有则从列表中删除
const processUploadChunkList = (chunkList: any) => {
  const currentFile = uploadFileList.value[currentFileIndex.value];
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
};

// 上传分片
const uploadChunkBase = (chunkList: chunkList[]) => {
  return new Promise((resolve) => {
    let successCount = 0;
    let totalChunks = chunkList.length;

    const handler = () => {
      if (chunkList.length) {
        const chunkItem = chunkList.shift() as chunkList;
        axios
          .put(chunkItem.uploadUrl, chunkItem.chunk.file, {
            onUploadProgress: checkChunkUploadProgress(chunkItem),
            headers: {
              "Content-Type": "application/octet-stream",
            },
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("分片：" + chunkItem.chunkNumber + " 上传成功");
              successCount++;
              if (successCount >= totalChunks) {
                resolve(true);
              } else {
                handler();
              }
            } else {
              console.log(
                "上传失败：" + response.status + "，" + response.statusText,
              );
              chunkList.push(chunkItem);
              handler();
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
    };

    // 并发
    for (let i = 0; i < simultaneousUploads.value; i++) {
      handler();
    }
  });
};

// 获取直接上传的 uri 链接
const getFileUploadUrls = (fileParam: any) => {
  return initUpload(fileParam);
};

// 根据 MD5 查看文件是否上传过
const checkFileUploadedByMd5 = (md5: string) => {
  return checkUpload(md5);
};

// 合并文件
const mergeFile = (fileParam: any) => {
  return mergeUpload(fileParam);
};

// 检查分片上传进度
const checkChunkUploadProgress = (item: chunkList) => {
  return (p: any) => {
    item.progress = parseInt(String((p.loaded / p.total) * 100));
    console.log(
      "检查分片上传进度：",
      uploadFileList.value[currentFileIndex.value].uploadProgress,
    );
    (percent.value[currentFileIndex.value + 1] =
      uploadFileList.value[currentFileIndex.value].uploadProgress),
      updateChunkUploadStatus(item);
  };
};

// 更新分片上传状态
const updateChunkUploadStatus = (item: chunkList) => {
  let status = FileStatus.uploading;
  let progressStatus = "normal";
  if (item.progress >= 100) {
    status = FileStatus.success;
    progressStatus = "success";
  }
  let chunkIndex = item.chunkNumber - 1;
  const currentFile = uploadFileList.value[currentFileIndex.value];
  let currentChunk = currentFile.chunkList[chunkIndex];
  currentChunk.status = status;
  currentChunk.progressStatus = progressStatus;
  currentFile.chunkList.splice(chunkIndex, 1, currentChunk);
  getCurrentFileProgress();
};

// 获取当前文件上传进度
const getCurrentFileProgress = () => {
  const currentFile = uploadFileList.value[currentFileIndex.value];
  if (!currentFile || !currentFile.chunkList) {
    return;
  }
  const chunkList = currentFile.chunkList;
  const uploadedSize = chunkList
    .map((item) => item.chunk.file.size * item.progress)
    .reduce((acc, cur) => acc + cur);
  let progress = parseInt((uploadedSize / currentFile.size).toFixed(2));
  currentFile.uploadProgress = progress;
  uploadFileList.value.splice(currentFileIndex.value, 1, currentFile);
};

// 保存文件信息到数据库
const saveFileInfoToDB = (
  currentFile: File,
  fileName: string,
  url: string,
  md5: string,
) => {
  let userInfoCache = JSON.parse(localStorage.getItem("userInfo") as any);
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
    if (res.status === 200) {
      console.log("文件信息存储成功");
      if (uploadFileList.value.length > currentFileIndex.value) {
        handler();
      }
    } else {
      console.error("文件信息存储失败");
    }
  });
};

// 清空列表
const clearFileHandler = () => {
  uploadFileList.value = [];
  uploadIdInfo.value = null;
  currentFileIndex.value = 0;
};

// 开始上传文件
const handler = async () => {
  console.log(uploadFileList.value, "上传文件列表");

  if (uploadFileList.value.length === 0) {
    showAlert("请先选择文件", "waring");
    return;
  }
  if (currentFileIndex.value >= uploadFileList.value.length) {
    showAlert("文件上传成功", "pass");

    return;
  }
  const currentFile = uploadFileList.value[currentFileIndex.value] as any;
  // console.log("当前操作文件：", currentFile);
  currentFile.status = FileStatus.getMd5;
  currentFile.chunkUploadedList = [];

  try {
    const { md5, totalChunks } = (await getFileMd5(currentFile)) as any;
    // console.log("md5值", md5);
    const checkResult = await checkFileUploadedByMd5(md5);
    console.log("检查是否已上传-->", checkResult);
    if (checkResult.code == 3400) {
      return showAlert("该文件已存在", "waring");
    }
    if (checkResult.code === 200) {
      console.log("上传成功文件访问地址：" + checkResult.data.url);
      currentFile.status = FileStatus.success;
      currentFile.uploadProgress = 100;
      currentFileIndex.value++;
      handler();
      return;
    } else if (checkResult.code === 3401) {
      console.log("上传中：", checkResult);
      currentFile.status = FileStatus.uploading;
      let chunkUploadedList = checkResult.data.chunkUploadedList;
      console.log("chunkUploadedList", chunkUploadedList);
      currentFile.chunkUploadedList = chunkUploadedList;
      console.log("成功上传的分片信息", chunkUploadedList);
    } else {
      console.log("未上传");
    }

    currentFile.status = FileStatus.chip;
    let fileChunks = createFileChunk(currentFile, chunkSize);
    let type = fileSuffixTypeUtil(currentFile.name);

    let param = {
      fileName: currentFile.name,
      fileSize: currentFile.size,
      chunkSize: chunkSize,
      chunkNum: totalChunks,
      fileMd5: md5,
      contentType: "application/octet-stream",
      fileType: type,
      chunkUploadedList: currentFile.chunkUploadedList,
    };

    let uploadIdInfoResult = await getFileUploadUrls(param);
    let uploadIdInfoData = uploadIdInfoResult.data;
    console.log("获取上传url-->", uploadIdInfoData);

    let uploadUrls = uploadIdInfoData.urlList;
    currentFile.chunkList = [];

    if (uploadUrls !== undefined) {
      if (fileChunks.length !== uploadUrls.length) {
        console.error("文件分片上传地址获取错误");
        return;
      }
    }

    fileChunks.forEach((chunkItem, index) => {
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
    let tempFileChunks = [...currentFile.chunkList];
    currentFile.status = FileStatus.uploading;

    tempFileChunks = processUploadChunkList(tempFileChunks);
    console.log("删除已上传的分片-->", tempFileChunks);

    await uploadChunkBase(tempFileChunks);
    console.log("---上传完成---");

    if (uploadIdInfoData.uploadId === "SingleFileUpload") {
      console.log("单文件上传");
      currentFile.status = FileStatus.success;
      currentFileIndex.value++;
      handler();
    } else {
      console.log("合并文件-->", currentFile);
      console.log({
        uploadId: uploadIdInfoData.uploadId,
        fileName: currentFile.name,
        fileMd5: md5,
        fileType: type,
        chunkNum: uploadIdInfoData.urlList.length,
        chunkSize: chunkSize,
        fileSize: currentFile.size,
      });

      const mergeResult = (await mergeFile({
        uploadId: uploadIdInfoData.uploadId,
        fileName: currentFile.name,
        fileMd5: md5,
        fileType: type,
        chunkNum: uploadIdInfoData.urlList.length,
        chunkSize: chunkSize,
        fileSize: currentFile.size,
      })) as mergeResponseData;
      console.log(mergeResult, "mergeResult");

      if (!mergeResult.data) {
        currentFile.status = FileStatus.error;
        console.error(mergeResult.message);
      } else {
        localStorage.removeItem(FILE_UPLOAD_ID_KEY);
        currentFile.status = FileStatus.success;
        console.log("文件访问地址：", mergeResult.data);
        currentFileIndex.value++;
        handler();
      }
    }
  } catch (error) {
    console.error("上传过程中出现错误：", error);
  }
};

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
// 导出方法供模板使用
// export {
//   handleFileChange,
//   beforeUploadVideo,
//   clearFileHandler,
//   handler,
//   uploadFileList,
//   getStatusClass,
// };

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
