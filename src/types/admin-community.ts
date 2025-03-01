export interface AdminPostInfo {
  countId: number;
  current: number;
  maxLimit: number;
  optimizeCountSql: boolean;
  orders: [];
  pages: number;
  records: AdminPost[];
  searchCount: boolean;
  size: number;
  total: number;
}

export interface AdminResponseData {
  code: number;
  message: string;
  data: AdminPostInfo;
}
export interface AdminPost {
  name: string;
  postTime: string;
  title: string;
  type: number;
  id: number;
  selected?: boolean;
}
