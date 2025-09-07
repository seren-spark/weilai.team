<template>
  <AlertDialog :open="isOpen" @update:open="handleOpenChange">
    <AlertDialogContent class="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2 text-[#918e8e]">
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
                <!-- <span class="text-blue-400">未来软件工作室招新群</span> -->
                <Popover>
                  <PopoverTrigger class="text-blue-400">
                    2025未来软件工作室招新群
                  </PopoverTrigger>
                  <PopoverContent class="w-50px h-50px">
                    <img src="/public/group.png" alt="" class="w-50px h-50px" />
                  </PopoverContent>
                </Popover>
                中的简历模版填写后再来提交哦~
              </li>
            </ol>
          </div>
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// 页面进入时自动显示弹窗
onMounted(() => {
  isOpen.value = true;
});
</script>
