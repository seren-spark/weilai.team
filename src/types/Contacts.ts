export interface PageInfo {
  countId: null;
  current: number;
  maxLimit: null;
  optimizeCountSql: true;
  orders: [];
  pages: number;
  records: [];
  searchCount: true;
  size: number;
  total: number;
}

export interface TeamInfo {
  grade: string;
  group: [];
  name: string;
  postCount: number;
  userDestination: string;
  userId: number;
  viewCount: number;
}
export interface TeamUser {
  clazz: string;
  grade: string;
  group: string;
  id?: number;
  name: string;
  studyId: string;
}
export interface TeamUserList {
  clazz: string;
  grade: string;
  group: string;
  id: number;
  name: string;
  studyId: string;
  ladleUserId?: number;
  ladleName?: string;
  ladleGrade?: string;
  allGroup?: Array<number>;
  isLeader?: boolean;
}
export interface modifyManyUser {
  clazz: string;
  grade: string;
  group: string;
  ids: Array<number>;
}
export interface ContactData {
  data: {
    teamUserList: TeamUserList[];
    userGroupLeader: TeamUserList;
    teamAble: TeamInfo[];
    pageInfo: PageInfo;
    userCount: number;
  };
}
export interface searchData {
  data: Array<TeamUserList>;
}
export interface MemeberData {
  data: TeamUserList;
}
