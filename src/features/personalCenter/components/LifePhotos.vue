<template>
  <div v-if="addPhotoLoading" class="outer">
    <GlobalLoading />
  </div>


  <div>
    <div class="images-container">
      <div v-if="getPhotoListLoading" class="global-loading">
        <GlobalLoading />
      </div>
      <div v-else-if="images.length === 0" class="no-data">
        <NoData />
      </div>
      <img
        v-for="image in images"
        :key="hash(image)"
        :src="image"
        alt=""
        class="image"
        :class="{
          'delete-mode': deleteMode,
          selected: selectedImage === image,
          shake: deleteMode,
        }"
        @click="deleteMode && selectImage(image)"
      />
      <div v-if="!getPhotoListLoading" class="image-action">
        <PictureFileUpload class="action-item" @upload:images="imagesHandle" />
        <div class="action-item delete" @click="toggleDeleteMode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import NoData from "@/components/loading/NoData.vue";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useUserStore } from "@/store/userStore";
import { useApiRequest, apis } from "@/utils/httpClient";
import type { ApiResponseData } from "@/types/api-response";
import { hash } from "@/utils/createHashString";
import GlobalLoading from "@/components/loading/global-loading.vue";
import PictureFileUpload from "./picture-file-upload.vue";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();
import { showConfirm } from "@/composables/useConfirm";

// 图片展示开始
const {
  data: imagesShowData,
  loading: getPhotoListLoading,
  error: getPhotoListError,
  fetchData: getPhotoList,
} = useApiRequest<ApiResponseData<string[]>>({
  url: apis.getUserLifePhotos.url.replace(
    "{userId}",
    useUserStore().$state.userId.toString(),
  ),
  method: apis.getUserLifePhotos.method,
  headers: {
    "Content-Type": "application/json",
  },
});
const images = ref<string[]>([]);

watch([imagesShowData, getPhotoListError], ([newData, newError]) => {
  if (newData) {
    images.value = newData.data || [];
  }
  if (newError) {
    showAlert(newError?.message || "获取照片失败", "error");
  }
});
// 图片展示结束

const {
  data: addPhotoData,
  error: addPhotoError,
  loading: addPhotoLoading,
  fetchData: uploadPhotos,
} = useApiRequest<ApiResponseData<string>>({
  url: apis.addUserLifePhotos.url,
  method: apis.addUserLifePhotos.method,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const imagesHandle = async (files: FileList) => {
  const batchSize = 3;
  const totalBatches = Math.ceil(files.length / batchSize);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const form = new FormData();
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, files.length);

    for (let i = start; i < end; i++) {
      form.append("lifePhoto", files[i]);
    }
    uploadPhotos({ data: form });
  }
};

watch([addPhotoData, addPhotoError], ([newData, newError]) => {
  if (newData?.code === 200) {
    getPhotoList();
    console.log(newData);
    showAlert("上传成功", "pass");
  }
  if (newError) {
    showAlert(newError?.message || "上传失败", "error");
  }
});

const deleteMode = ref(false);
const selectedImage = ref<string>("");

const toggleDeleteMode = () => {
  deleteMode.value = !deleteMode.value;
  selectedImage.value = "";
};

const {
  data: deleteData,
  error: deleteError,
  fetchData: deletePhoto,
} = useApiRequest<ApiResponseData<string>>({
  url: apis.deleteUserLifePhotos.url,
  method: apis.deleteUserLifePhotos.method,
  headers: {
    "Content-Type": "application/json",
  },
});

const selectImage = (image: string) => {
  showConfirm({
    title: "系统提示",
    content: "确定删除这张照片吗？",
  })
    .then(() => {
      selectedImage.value = image;
      deletePhoto({ params: { url: selectedImage.value } });
    })
    // 删除图片后，退出删除模式
    .finally(() => {
      deleteMode.value = false;
      selectedImage.value = "";
    });
};

watch([deleteData, deleteError], ([newData, newError]) => {
  if (newData?.code === 200) {
    getPhotoList();
    showAlert("删除成功", "pass");
  } else {
    showAlert(newData?.message ?? "删除失败", "waring");
  }
  if (newError) {
    showAlert(newError?.message || "删除失败", "error");
  }
});

onBeforeMount(() => {
  console.clear();
});
onMounted(() => {
  getPhotoList();
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/public.scss";
.images-container {
  position: relative;
  top: 0.5rem;
  display: flex;
  min-height: 200px;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 2rem 2rem 2rem;
}
.image {
  width: 5rem;
  height: 5rem;
  border-radius: 5px;
  object-fit: cover;
  position: relative;
  &.delete-mode {
    cursor: pointer;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
  &.selected {
    border: 3px solid var(--primary-foreground);
    box-shadow: 0 0 5px 2px var(--primary-foreground);
  }
  &.shake {
    animation: shake 1s infinite ease-in;
    transform-origin: center center;
  }
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(-2deg);
  }
  20% {
    transform: rotate(2deg);
  }
  30% {
    transform: rotate(-2deg);
  }
  40% {
    transform: rotate(2deg);
  }
  50% {
    transform: rotate(-2deg);
  }
  60% {
    transform: rotate(2deg);
  }
  70% {
    transform: rotate(-2deg);
  }
  80% {
    transform: rotate(2deg);
  }
  90% {
    transform: rotate(-2deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.image-action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 12rem;
  height: 5rem;
  position: relative;
  top: 0;
  left: 0;
  gap: 2rem;
  .action-item {
    width: 5rem;
    height: 5rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.global-loading{
  position: fixed;
  margin: 0 auto;
}
</style>
