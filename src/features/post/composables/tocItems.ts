import { ref, type Ref } from "vue";
interface Item {
  id: string;
  text: string;
  level: number;
  pos: number;
}


export const items: Ref<Item[]> = ref([]);
