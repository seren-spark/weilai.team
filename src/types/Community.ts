export interface Data {
  data: ArticleInfo;
  code: number;
}
export interface UserData {
  data: {
    searchUsers: UserInfo[];
    pageInfo: PageInfo;
  };
}
// export interface AdminData {
//   data: AdminPostInfo;
// }
export interface SearchData {
  data: ArticleList[];
}
export interface ArticleInfo {
  countId: number;
  current: number;
  maxLimit: number;
  optimizeCountSql: boolean;
  orders: [];
  pages: number;
  records: ArticleList[];
  searchCount: boolean;
  size: number;
  total: number;
  code: number;
}
// export interface AdminPostInfo {
//   countId: number;
//   current: number;
//   maxLimit: number;
//   optimizeCountSql: boolean;
//   orders: [];
//   pages: number;
//   records: AdminPost[];
//   searchCount: boolean;
//   size: number;
//   total: number;
// }

// export interface AdminPost {
//   name: string;
//   postTime: string;
//   title: string;
//   type: number;
// }
export interface UserInfo {
  headPortrait: string;
  name: string;
  postCount: number;
  userDestination: string;
  userId: number;
  viewCount: number;
}
export interface PageInfo {
  countId: null;
  current: number;
  pages: number;
  searchCount: true;
  size: number;
  total: number;
}

export interface ArticleList {
  id: number;
  name: string;
  collectCount?: number;
  commentCount?: number;
  isCollect?: false;
  type: number;
  isLike?: false;
  headPortrait: string;
  likeCount?: number;
  postAbstract: string;
  postTags: string[];
  postTxt: string;
  postTime: string;
  title: string;
  userId?: number;
  viewCount?: number;
}
