import { defineStore } from "pinia";

interface TagData {
  type: number; // type = 1: blog,2:notice, 3: discussion, 4: brainstorm  不传参数是综合
  tagType: string;
}

export const useTagStore = defineStore("tag", {
  state: () => {
    return {
      tagType: { type: 0, tagType: "" } as TagData,
    };
  },
  actions: {
    addTag(data: TagData) {
      this.tagType = data;
    },
    clearTag() {
      this.tagType = { type: 0, tagType: "" };
    },
  },
});
