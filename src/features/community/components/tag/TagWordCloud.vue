<script lang="ts" setup>
import { ref, watch } from "vue";
import VueWordCloud from "vuewordcloud";
// import { Icon } from "@iconify/vue";
import CommunityTag from "../../composables/CommunityTag";
import { useTagStore } from "@/store/tagTypeStore";

const tagStore = useTagStore();
const tagType = tagStore.tagType.tagType;
const { tagCloudList, getTagCloudList } = CommunityTag();
const words = ref<[string, number][]>([]);
// 随机生成一个数，范围0-99
function assignRandomNumbers(strArray: string[]): [string, number][] {
  return strArray.map((str) => [
    str,
    Math.floor(Math.random() * (30 + 1)) + 20,
  ]); // 随机数范围 0-15
}

function getColor(weight: number) {
  if (weight > 50) return "#552af4";
  if (weight > 47) return "#412045";
  if (weight > 45) return "#5bc496";
  if (weight > 42) return "#f3cf77";
  if (weight > 40) return "#416af6";
  if (weight > 38) return "#eb7eb1";
  if (weight > 35) return "#ee8231";
  if (weight > 32) return "#552af4";
  if (weight > 30) return "#ae8af0";
  if (weight > 25) return "#579ce4";
  return "#ec5c6c";
}

getTagCloudList();
watch(tagCloudList, () => {
  words.value = assignRandomNumbers(tagCloudList.value);
});
</script>

<template>
  <div class="word-cloud">
    <!-- <div class="noWord">
            <Icon icon="svg-spinners:3-dots-fade"></Icon>
        </div> -->
    <!-- <LoadingPage v-if="words.length == 0" /> -->
    <!-- <vue-word-cloud class="cloud" :words=words /> -->
    <vue-word-cloud
      :words="words"
      :color="([, weight]: [string, number]) => getColor(weight)"
      font-family="微软雅黑,Microsoft YaHei"
      spacing="0.2"
    >
      <template #default="{ text }">
        <div style="cursor: pointer">
          <router-link
            active-class="active"
            :to="`/community/${tagType}/label/${text}`"
          >
            {{ text }}</router-link
          >
        </div>
      </template>
    </vue-word-cloud>
  </div>
</template>

<style scoped lang="scss">
.word-cloud {
  margin-top: 70px;
  height: calc(100vh - 150px);
  width: 100%;
}

@media screen and (max-width: 1200px) {
  .word-cloud {
    margin-top: 50px;
    height: calc(100vh - 130px);
  }
}

@media screen and (max-width: 1024px) {
  .word-cloud {
    margin-top: 55px;
    height: calc(100vh - 135px);
  }
}

@media screen and (max-width: 768px) {
  .word-cloud {
    margin-top: 60px;
    height: calc(100vh - 70px);
  }
}
</style>
