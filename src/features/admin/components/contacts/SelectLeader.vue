<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/vue";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAlert } from "@/composables/useAlert";
import { useRequest } from "@/composables/useRequest";
import { cn } from "@/lib/utils";
import type { TeamUserList } from "@/types/contacts";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { ref, watch } from "vue";
import { getMembersByGrade, setLeader } from "../../composables/useContacts";
const leader = ref<TeamUserList>();
const { executeRequest, error, loading, data } = useRequest();
const frameworks = ref<TeamUserList[]>([]);
const open = ref(false);
const value = ref("");
const props = defineProps(["group", "grade", "updateData"]);
const grade = ref(props.grade);
const group = ref(props.group);
const updateData = props.updateData;
const { showAlert } = useAlert();
// 控制弹窗显示
const isVisible = ref<boolean>(false);
const dialogRef = ref<InstanceType<typeof Dialog> | null>(null);
watch(
  () => props,
  (newVal) => {
    grade.value = newVal.grade;
    group.value = newVal.group;
    let leaderGrade = parseInt(grade.value) - 1;
    getMembersByGrade(leaderGrade + "").then((res) => {
      console.log(res);

      frameworks.value = res.data;
    });
    value.value = "";
  },
  {
    immediate: true,
    deep: true,
  },
);

function setGroupLeader() {
  let info = {
    group: `${grade.value}` + "$" + `${group.value}`,
    userId: parseInt(value.value),
  };

  if (Number.isNaN(info.userId)) {
    return showAlert("请选择组长", "waring");
  }
  setLeader(info).then((res) => {
    console.log(res);
    if (res.code == 6020) {
      return showAlert(res.message, "error");
    } else {
      showAlert("设置成功", "pass");
      updateData(grade.value, group.value);
    }

    // 关闭对话框
    isVisible.value = false;
    if (dialogRef.value) {
      dialogRef.value.$emit("update:open", false); // 触发 'update:open' 事件通知 Dialog 组件更新状态
    }
  });
}
const handleDialogOpen = (newValue: boolean) => {
  isVisible.value = newValue;
};
</script>

<template>
  <Dialog :open="isVisible" @update:open="handleDialogOpen">
    <DialogTrigger as-child>
      <Button variant="outline" size="sm" class="h-7 gap-1 header-btn">
        <Icon icon="proicons:person-2" />
        <span
          class="sr-only sm:not-sr-only sm:whitespace-nowrap"
          style="font-size: 0.875rem"
        >
          设置组长
        </span>
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>设置组长</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-6 items-center">
          <Label for="name" class="text-right w-[50px]"> 姓名 :</Label>
          <Popover v-model:open="open">
            <PopoverTrigger as-child class="bg-white">
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                class="w-[260px] justify-between"
              >
                {{
                  value
                    ? frameworks.find(
                        (framework) => framework.id.toString() === value,
                      )?.name
                    : "请选择组长"
                }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[260px] p-0 bg-white">
              <Command>
                <CommandInput class="h-9" placeholder="请选择..." />
                <CommandEmpty>未找到结果</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="framework in frameworks"
                      :key="framework.id"
                      :value="framework.id.toString()"
                      @select="
                        (ev) => {
                          if (typeof ev.detail.value === 'string') {
                            value = ev.detail.value;
                          }
                          open = false;
                        }
                      "
                    >
                      {{ framework.name }}
                      <Check
                        :class="
                          cn(
                            'ml-auto h-4 w-4',
                            value === framework.id.toString()
                              ? 'opacity-100'
                              : 'opacity-0',
                          )
                        "
                      />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="setGroupLeader()"> 确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>
.header-btn {
  color: var(--primary-foreground);
  border: none;
  box-shadow: none;
}
</style>
