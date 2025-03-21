<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { group, type TeamTableItem } from "@/types/attendance-overview";
import { computed, watch } from "vue";

const props = defineProps<{
  teamInfo: TeamTableItem;
}>();
watch(
  () => props.teamInfo,
  () => {
    console.log(props.teamInfo);
    console.log(Object.keys(props.teamInfo)[0]);
  },
);
const mappedTeamInfo = computed(() => {
  return Object.entries(props.teamInfo || {}).map(([key, value]) => ({
    department: group[key as keyof typeof group],
    data: value,
  }));
});
// const tags = Array.from({ length: 10 }).map(
//   (_, i, a) => `beta.${a.length - i}`,
// );
</script>

<template>
  <div class="p-4">
    <p class="title">部门明细</p>
    <div>
      <header>
        <div>部门</div>
        <div>应到人数</div>
        <div>打卡人数</div>
      </header>
      <ScrollArea class="h-[20rem] rounded-md">
        <div>
          <div v-for="(item, index) in mappedTeamInfo" :key="index">
            <div class="text-sm group">
              <div class="group-item">
                <span>{{ item.department }}</span>
              </div>
              <div
                v-for="(info, idx) in Object.values(item.data)"
                :key="idx"
                class="group-item"
              >
                <span>{{ info }}</span>
              </div>
            </div>
            <Separator class="my-2" />
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
<style scoped lang="scss">
.group {
  display: flex;
  justify-content: space-between;
}
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  div {
    padding: 0.3rem 0.3rem;
    width: 33.3%;
    font-size: 0.9rem;
    color: var(--foreground);
  }
}
.group-item {
  width: 33.3%;
  color: var(--secondary-foreground);
  padding: 0.3rem 0.3rem;
}
.title {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
