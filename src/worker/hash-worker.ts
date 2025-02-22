import SparkMD5 from "spark-md5";
// 计算md5
function createFileMd5(file: File): Promise<any> {
  const fileReader = new FileReader();
  const spark = new SparkMD5.ArrayBuffer();

  return new Promise((resolve, reject) => {
    const now = new Date();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const buffer = e.target?.result as ArrayBuffer;
      spark.append(buffer);
      const hash: string = spark.end();
      if (!buffer) reject();
      // 获取文件后缀
      const ext: string = file.name.split(".").pop() as string;
      resolve({
        hash,
        ext,
      });
    };
  });
}

onmessage = async function (e) {
  const data = e.data;
  const result = await createFileMd5(data.file);
  postMessage(result); // 返回结果
};
