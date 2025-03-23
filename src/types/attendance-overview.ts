export interface AttendanceOverview {
  leavesUserCount: number;
  lateUserCount: number;
  userCountCurrent: number;
  userCountShould: number;
  teamTable: TeamTableItem;

  lineChart: ChartData;
}
export const group = {
  "1": "一组",
  "2": "二组",
  "3": "三组",
  "4": "四组",
  "5": "五组",
  "6": "六组",
  "7": "七组",
  "8": "八组",
  "9": "九组",
  "10": "十组",
  "11": "十一组",
  "12": "十二组",
  "13": "十三组",
};

export interface TeamTableItem {
  [key: number]: number[];
}

export interface ChartData {
  [key: string]: number[];
}
