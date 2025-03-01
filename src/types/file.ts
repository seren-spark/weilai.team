
export interface uploadFileResponseData extends responseData {
  data: {
    code: number;
    uploadId: string;
    urlList: string[];
  };
}

export interface responseData {
  code: number;

  message: string;
}
export interface file {
  status: string;
  chunkUploadedList: number[];
  name: string;
  size: number;
  uploadProgress: number;
  chunkList: chunkList[];
  progressStatus: string;
}

export interface chunkList {
  chunkNumber: number;
  chunk: any;
  uploadUrl: string;
  progress: number;
  progressStatus?: string;
  status: string;
}

export interface checkResult extends responseData {
  data: {
    chunkNum: number;
    chunkSize: number;
    chunkUploadedList: number[];
    url: string;
    uploadProgress: number;

    fileName: string;
    fileSize: number;
    uploadId: string;
    fileType: string;
    contentType: string;
  };
}

export interface mergeResponseData extends responseData {
  data: {
    chunNum: number;
    chunkSize: number;
    fileMd5: string;
  };
  error: string;
}
