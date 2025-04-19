import { reactive, watch } from "vue";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
import { ref } from "vue";
import axios from "axios";

// 假设以下是你的 API 请求函数
import {
  initUpload,
  checkUpload,
  mergeUpload,
} from "@/api/file";
// 假设这是你的文件后缀类型工具函数
import { fileSuffixTypeUtil } from "@/utils/fileUtils";
import type {
  chunkList,
  file,
  mergeResponseData,
  responseData,
} from "@/types/file";

//创建worker
const worker = new Worker(new URL("@/worker/hash-worker.ts", import.meta.url), {
  type: "module",
});

const FILE_UPLOAD_ID_KEY = "file_upload_id";
const chunkSize = 5 * 1024 * 1024; // 5MB
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
const uploadFileList = reactive<file[]>([]);

let currentFileIndex = 0;
watch(
  () => uploadFileList,
  () => {
    console.log(uploadFileList);
  },
  { deep: true },
);
watch(
  () => percent.value,
  () => {},
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
// 修改 handleFileChange 函数，添加 event 参数的类型声明
function handleFileChange(event: InputEvent) {
  const files = (event.target as HTMLInputElement)?.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as file;
      initFileProperties(file);
      uploadFileList.push(file);
      percent.value.push(0);
    }
  }
  console.log("文件列表变化", uploadFileList);
}

// 文件分片
const createFileChunk = (file: File, size = chunkSize) => {
  const fileChunkList = [];
  let count = 0;
  while (count < file.size) {
    fileChunkList.push({
      file: file.slice(count, count + size),
    });
    count += size;
  }
  return fileChunkList;
};

// 处理即将上传的分片列表，判断是否有已上传的分片，有则从列表中删除
// chunkList是即将上传的分片列表
const processUploadChunkList = (chunkList: any) => {
  const currentFile = uploadFileList[currentFileIndex];
  const chunkUploadedList = currentFile.chunkUploadedList;
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

// 上传分片使用minio库
const uploadChunkBase = (chunkList: chunkList[]) => {
  let successCount = 0;
  //chunkList是在进行删除过上传后的文件的剩余未上传的列表
  const totalChunks = chunkList.length;
  return new Promise((resolve) => {
    const handler = () => {
      if (chunkList.length) {
        const chunkItem = chunkList.shift() as chunkList; //拿出开头的分片
        //向minio请求库发请求直接上传文件
        axios
          .put(chunkItem.uploadUrl, chunkItem.chunk.file, {
            onUploadProgress: checkChunkUploadProgress(chunkItem),
            headers: {
              "Content-Type": "application/octet-stream",
            },
          })
          .then((response) => {
            if (response.status === 200) {
              percent.value[currentFileIndex + 1] = 100;
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

    // 并发
    for (let i = 0; i < simultaneousUploads.value; i++) {
      handler();
    }
  });
};

// 获取直接上传的 url 链接
const getFileUploadUrls = (fileParam: any) => {
  return initUpload(fileParam);
};

// 根据 MD5 查看文件是否上传过
const checkFileUploadedByMd5 = (md5: string) => {
  return checkUpload(md5);
};

const mergeFile = (fileParam: any) => {
  return new Promise((resolve, reject) => {
    mergeUpload(fileParam)
      .then((response) => {
        const data: responseData | null = response as mergeResponseData;
        console.log("@@@", data);
        if (!data || !data.data) {
          resolve({ message: FileStatus.error } as responseData);
        } else {
          data.message = FileStatus.success;
          resolve(data);
        }
      })
      .catch((error) => {
        resolve({ message: FileStatus.error } as responseData);
      });
  });
};
// 检查分片上传进度
const checkChunkUploadProgress = (item: chunkList) => {
  return (p: any) => {
    item.progress = parseInt(String((p.loaded / p.total) * 100));
    console.log(item.progress);
    console.log(item);

    console.log(
      "检查分片上传进度：",
      uploadFileList[currentFileIndex].uploadProgress,
    );
    console.log(uploadFileList[currentFileIndex].uploadProgress);
    console.log(uploadFileList);

    (percent.value[currentFileIndex + 1] =
      uploadFileList[currentFileIndex].uploadProgress),
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
  const currentFile = uploadFileList[currentFileIndex];
  let currentChunk = currentFile.chunkList[chunkIndex];
  currentChunk.status = status;
  console.log(
    "更新分片状态，正在上传",
    uploadFileList[currentFileIndex].status,
  );

  currentChunk.progressStatus = progressStatus;
  currentFile.chunkList.splice(chunkIndex, 1, currentChunk);
  getCurrentFileProgress();
  console.log(uploadFileList[currentFileIndex]);
};

// 获取当前文件上传进度
const getCurrentFileProgress = () => {
  const currentFile = uploadFileList[currentFileIndex];
  if (!currentFile || !currentFile.chunkList) {
    return;
  }
  const chunkList = currentFile.chunkList;
  const uploadedSize = chunkList
    .map((item) => item.chunk.file.size * item.progress)
    .reduce((acc, cur) => acc + cur);
  let progress = parseInt((uploadedSize / currentFile.size).toFixed(2));

  currentFile.uploadProgress = progress;
  console.log("progress", progress);
  uploadFileList[currentFileIndex] = currentFile;
  console.log(uploadFileList[currentFileIndex].uploadProgress);
};

// 清空列表
const clearFileHandler = () => {
  uploadFileList.splice(0, uploadFileList.length);
  uploadIdInfo.value = null;
  currentFileIndex = 0;
};

// 开始上传文件
const handler = async () => {
  if (uploadFileList.length === 0) {
    showAlert("请先选择文件", "waring");
    return;
  }
  if (currentFileIndex >= uploadFileList.length) {
    uploadFileList[currentFileIndex - 1].status = FileStatus.success;
    showAlert("文件上传成功", "pass");
    return;
  }
  const currentFile = uploadFileList[currentFileIndex] as any;
  console.log("当前操作文件：", currentFile);
  debugger;
  currentFile.status = FileStatus.getMd5;
  currentFile.chunkUploadedList = []; //先将上传过的列表初始化为空

  try {
    let checkResult: any;
    worker.postMessage(currentFile); //向子线程发送文件信息
    worker.onmessage = async (e) => {
      //当主线程接收到消息后
      const { md5, totalChunks } = e.data;
      checkResult = await checkFileUploadedByMd5(md5);
      console.log("检查是否已上传-->", checkResult);
      if (checkResult.code == 3400) {
        return showAlert("该文件已存在", "waring");
      }
      if (checkResult.code == 200) {
        debugger;
        //文件已经存在的情况
        console.log("上传成功文件访问地址：" + checkResult.data.url);
        currentFile.status = FileStatus.success;
        currentFile.uploadProgress = 100;
        currentFileIndex++;
        handler();
        return;
      } else if (checkResult.code === 3401) {
        console.log("上传中：", checkResult);
        currentFile.status = FileStatus.uploading;
        let chunkUploadedList = checkResult.data.chunkUploadedList;

        currentFile.chunkUploadedList = chunkUploadedList;
        console.log("已经上传过的上传的分片信息", chunkUploadedList);
        debugger;
      } else {
        console.log("未上传");
      }

      currentFile.status = FileStatus.chip;
      let fileChunks = createFileChunk(currentFile, chunkSize);
      let type = fileSuffixTypeUtil(currentFile.name);
      console.log(chunkSize);
      console.log(totalChunks, "totalChunks");
      debugger;

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

      console.log("传过去的数据", param);

      let uploadIdInfoResult = await getFileUploadUrls(param);
      let uploadIdInfoData = uploadIdInfoResult.data;
      console.log("获取上传url-->", uploadIdInfoData);

      let uploadUrls = uploadIdInfoData.urlList;
      currentFile.chunkList = [];

      if (uploadUrls !== undefined) {
        if (fileChunks.length !== uploadUrls.length) {
          console.log(fileChunks.length, uploadUrls.length);

          console.error("文件分片上传地址获取错误");
          return;
        }
      }

      fileChunks.map((chunkItem, index) => {
        console.log("分片信息：", chunkItem);

        if (currentFile.chunkUploadedList.indexOf(index + 1) !== -1) {
          //如果分片已经上传 则直接跳过
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
      let tempFileChunks = [];

      currentFile.chunkList.forEach((item) => {
        tempFileChunks.push(item);
      });
      //更新状态
      currentFile.status = FileStatus.uploading;
      tempFileChunks = processUploadChunkList(tempFileChunks);
      console.log("删除已上传的分片-->", tempFileChunks);

      await uploadChunkBase(tempFileChunks);

      console.log("---上传完成---");

      if (uploadIdInfoData.uploadId === "SingleFileUpload") {
        console.log("单文件上传");
        currentFile.status = FileStatus.success;
        //文件下标偏移
        currentFileIndex++;
        //递归上传下一个文件
        handler();
      } else {
        console.log("合并文件-->", currentFile);
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
          currentFileIndex++;
          handler();
        }
      }
    };
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
export {
  handleFileChange,
  clearFileHandler,
  handler,
  uploadFileList,
  getStatusClass,
  percent,
  transformByte,
};
