<template>
  <AlertDialog :open="isOpen" @update:open="handleOpenChange">
    <AlertDialogContent class="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2 text-[#918e8e]">
          <!-- <Download class="h-5 w-5 text-blue-600" /> -->
          <Icon
            icon="material-symbols:brightness-alert-outline"
            class="text-[#918e8e]"
          ></Icon>
          温馨提示
        </AlertDialogTitle>
        <AlertDialogDescription class="text-left space-y-3">
          <div class="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            <ol class="list-decimal list-inside space-y-1 text-sm">
              <li>
                填写报名表需要拍照上传填写好的简历模版，且一位同学只能进行一次报名；
              </li>
              <li>
                如果未打印并填写简历，请先打印
                <span class="text-blue-400">未来软件工作室招新群</span>
                中的简历模版填写后再来提交哦~
              </li>
            </ol>
          </div>
          <!-- <div class="flex items-center justify-center">
            <button
              @click="handleDownload"
              class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Download class="h-4 w-4" />
              下载模板文件
            </button>
          </div> -->
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          class="w-full bg-blue-400 hover:bg-blue-500 text-white"
          @click="handleConfirm"
        >
          好的
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icon } from "@iconify/vue";

interface Emits {
  (e: "confirm"): void;
  (e: "download"): void;
}

const emit = defineEmits<Emits>();

const isOpen = ref(false);

const handleOpenChange = (open: boolean) => {
  isOpen.value = open;
};

const handleConfirm = () => {
  isOpen.value = false;
  emit("confirm");
};

const handleDownload = () => {
  // 创建下载链接
  const link = document.createElement("a");
  link.href = props.fileUrl;
  link.download = props.fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  emit("download");
};

// 页面进入时自动显示弹窗
onMounted(() => {
  isOpen.value = true;
});

// 暴露方法供父组件调用
// defineExpose({
//   show: () => {
//     isOpen.value = true
//   },
//   hide: () => {
//     isOpen.value = false
//   }
// })
</script>
