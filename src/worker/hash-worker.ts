import SparkMD5 from "spark-md5";
// // 计算md5
// function createFileMd5(file: File): Promise<any> {
//   const fileReader = new FileReader();
//   const spark = new SparkMD5.ArrayBuffer();

//   return new Promise((resolve, reject) => {
//     const now = new Date();
//     fileReader.onload = (e: ProgressEvent<FileReader>) => {
//       const buffer = e.target?.result as ArrayBuffer;
//       spark.append(buffer);
//       const hash: string = spark.end();
//       if (!buffer) reject();
//       // 获取文件后缀
//       const ext: string = file.name.split(".").pop() as string;
//       resolve({
//         hash,
//         ext,
//       });
//     };
//   });
// }

// onmessage = async function (e) {
//   const data = e.data;
//   const result = await createFileMd5(data.file);
//   postMessage(result); // 返回结果
// };

// 计算文件 MD5 的函数
function createFileMd5(file: File) {
  return new Promise((resolve, reject) => {
    const blobSlice =
      file.slice || (file as any).mozSlice || (file as any).webkitSlice;
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    const chunkSize = 2097152; // 2MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    fileReader.onload = (e) => {
      if (e.target?.result) {
        try {
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
        //后端只接受了hash
        const md5 = spark.end();
        const ext = file.name.split(".").pop();
        resolve({ md5, totalChunks });
      }
    };

    fileReader.onerror = () => {
      console.warn("读取Md5失败，文件读取错误");
      reject(new Error("文件读取错误"));
    };

    loadNext();
  });
}

// 监听来自主线程的消息
self.onmessage = async function (e) {
  const file = e.data;
  try {
    const result = await createFileMd5(file);
    postMessage(result); // 将计算结果返回给主线程
  } catch (error: any) {
    postMessage({ error: error.message });
  }
};
