import apiClient from "@/api/axios";
import * as XLSX from "xlsx";

interface UserData {
  姓名: string;
  学号: string;
  邮箱: string;
  班级: string;
  年级: string;
  组别: string;
  电话: string;
  QQ: string;
}

// 验证文件后缀
function validateFileExtension(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".xlsx");
}

// 验证Excel字段
async function validateExcelFields(file: File): Promise<string | boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<UserData>(firstSheet);

        if (jsonData.length === 0) {
          reject("Excel文件内容为空");
          return;
        }

        const requiredFields = [
          "姓名",
          "学号",
          "班级",
          "年级",
          "组别",
          "电话",
          "QQ",
        ];

        const missingFields = requiredFields.filter(
          (field) => !(field in jsonData[0]),
        );

        if (missingFields.length > 0) {
          reject(`文件缺少必要字段`);
          return;
        }

        resolve(true);
      } catch (error) {
        reject("文件解析失败");
      }
    };
    reader.onerror = () => reject("文件读取失败");
    reader.readAsArrayBuffer(file);
  });
}

//批量导入
export async function processFiles(file: File) {
  if (!validateFileExtension(file.name)) {
    throw "请上传.xlsx格式的文件";
  }
  try {
    const validationResult = await validateExcelFields(file);
    if (validationResult !== true) {
      throw validationResult as string;
    }
    const formData = new FormData();
    formData.append("file", file);

    return await apiClient.post("/userManager/teamInfo/addUsers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    // 修改此处：将返回改为抛出
    if (error instanceof Error) {
      throw error.message;
    }
    throw typeof error === "string" ? error : "未知错误";
  }
}

// 模拟非.xlsx 文件
const nonXlsxFile = new File([], "example.txt", { type: "text/plain" });
processFiles(nonXlsxFile).then((result) => {
  console.log(result);
});
