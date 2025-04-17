<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProvinces,
  getPrefectures,
  getCounties,
  getCodeByProvinceName,
} from "china-region";

// 1. 接收父组件的 `props`
const props = defineProps<{
  province?: string;
  city?: string;
  district?: string;
}>();

// 2. 省份数据
const provinces = ref(getProvinces());
const selectedProvince = ref(props.province || "");
const selectedCity = ref(props.city || "");
const selectedDistrict = ref(props.district || "");
const cities = ref([]);
const districts = ref([]);

// 3. 监听 `selectedProvince`，更新 `cities` 并恢复 `props.city`
watch(
  selectedProvince,
  (newProvince) => {
    selectedCity.value = "";
    selectedDistrict.value = "";
    if (newProvince) {
      const provinceCode = getCodeByProvinceName(newProvince);
      cities.value = getPrefectures(provinceCode);

      // 如果 `props.city` 存在，并且 `cities` 里有这个城市，则选中
      if (props.city) {
        const targetCity = cities.value.find(
          (city) => city.name === props.city,
        );
        if (targetCity) {
          selectedCity.value = props.city;
        }
      }
    } else {
      cities.value = [];
    }
  },
  { immediate: true },
);

// 4. 监听 `selectedCity`，更新 `districts` 并恢复 `props.district`
watch(
  selectedCity,
  (newCity) => {
    selectedDistrict.value = "";
    if (newCity) {
      const cityCode = cities.value.find((item) => item.name === newCity).code;
      districts.value = getCounties(cityCode);

      // 如果 `props.district` 存在，并且 `districts` 里有这个区县，则选中
      if (props.district) {
        const targetDistrict = districts.value.find(
          (district) => district.name === props.district,
        );
        if (targetDistrict) {
          selectedDistrict.value = props.district;
        }
      }
    } else {
      districts.value = [];
    }
  },
  { immediate: true },
);

// 5. 监听 `props` 变化，确保 `props.city` 和 `props.district` 正确赋值
watch(
  () => props.province,
  (newVal) => {
    if (newVal) {
      selectedProvince.value = newVal;
    }
  },
);
watch(
  () => props.city,
  (newVal) => {
    if (newVal && cities.value.some((city) => city.name === newVal)) {
      selectedCity.value = newVal;
    }
  },
);
watch(
  () => props.district,
  (newVal) => {
    if (
      newVal &&
      districts.value.some((district) => district.name === newVal)
    ) {
      selectedDistrict.value = newVal;
    }
  },
);

// 6. 计算选中的地区
const selectedRegion = computed(() => {
  return `中国,${selectedProvince.value},${selectedCity.value},${selectedDistrict.value}`;
});

// 7. 让父组件可以访问选中的数据
defineExpose({
  selectedRegion,
});
</script>

<template>
  <div>
    <div class="text-sm">工作地区</div>
    <!-- 省份选择 -->
    <div class="flex gap-4">
      <Select v-model="selectedProvince">
        <SelectTrigger class="w-[100px]">
          <SelectValue placeholder="请选择省份" />
        </SelectTrigger>
        <SelectContent class="h-60">
          <SelectItem
            v-for="item in provinces"
            :key="item.name"
            :value="item.name"
          >
            {{ item.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- 城市选择 -->
      <Select
        v-model="selectedCity"
        :disabled="!selectedProvince || !cities.length"
      >
        <SelectTrigger class="w-[100px]">
          <SelectValue placeholder="请选择城市" />
        </SelectTrigger>
        <SelectContent class="h-60">
          <SelectItem
            v-for="item in cities"
            :key="item.name"
            :value="item.name"
          >
            {{ item.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- 区县选择 -->
      <Select v-model="selectedDistrict" :disabled="!selectedCity">
        <SelectTrigger class="w-[100px]">
          <SelectValue placeholder="请选择区县" />
        </SelectTrigger>
        <SelectContent class="max-h-60">
          <SelectItem
            v-for="item in districts"
            :key="item.name"
            :value="item.name"
          >
            {{ item.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
