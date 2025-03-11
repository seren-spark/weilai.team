<template>
  <div class="container">
    <div style="display: none">
      <video width="500" height="240" controls id="upvideo"></video>
    </div>
    <h2>上传示例</h2>
    <!-- <h2 v-for="item in arr">{{ item }}</h2> -->
    <input type="file" id="file" @change="handleFileChange" multiple />
    <button style="margin-left: 5px" @click="handler">上传</button>
    <table style="margin-top: 20px">
      <tr>
        <th style="font-size: 10px; color: #909399; width: 250px">文件名</th>
        <th style="font-size: 12px; color: #909399; width: 100px">文件大小</th>
        <th style="font-size: 12px; color: #909399; width: 150px">上传进度</th>
        <!-- <th style="font-size: 12px; color: #909399; width: 100px">状态</th> -->
      </tr>
    </table>
    <div
      v-for="item in percent"
      :key="item"
      style="width: 0px; height: 0px; opacity: 0"
    >
      {{ item }}
    </div>
    <div class="file-list-wrapper">
      <div v-for="(item, index) in uploadFileList" :key="index">
        <div class="upload-file-item">
          <div
            class="file-info-item file-name"
            style="font-size: 14px; color: #909399; width: 250px"
            :title="item.name"
          >
            {{ item.name }}
          </div>

          <div
            class="file-info-item file-size"
            style="font-size: 14px; color: #909399; width: 250px"
          >
            {{ transformByte(item.size) }}
            <!-- {{ item.size }} -->
          </div>
          <div class="file-info-item file-progress">
            <span style="font-size: 14px; color: #909399; width: 250px"
              >{{ item.uploadProgress }}%</span
            >
          </div>
          <div class="file-info-item file-size">
            <div type="warning">
              {{ item.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  handleFileChange,
  beforeUploadVideo,
  clearFileHandler,
  handler,
  uploadFileList,
  getStatusClass,
  transformByte,
  percent,
} from "@/composables/useUploadFile";

import { watch, reactive } from "vue";
watch(
  uploadFileList,
  (newValue) => {
    console.log(newValue);

    console.log(555555555555);
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.container {
  width: 750px;
  margin: 0 auto;
}

.file-list-wrapper {
  margin-top: 20px;
}

h2 {
  text-align: center;
}

.file-info-item {
  margin: 0 10px;
}

.upload-file-item {
  display: flex;
}

.file-progress {
  display: flex;
  align-items: center;
}

.file-progress-value {
  width: 150px;
}

.file-name {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  width: 100px;
  margin-left: 60px;
}

.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
