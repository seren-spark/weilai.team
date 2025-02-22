<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplyUserStatus } from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import { useAlert } from "@/composables/useAlert";
const { showAlert } = useAlert();

const emit = defineEmits(["close", "refreshPage"]);

const props = defineProps<{
  isOpen: boolean;
  ids: string[];
}>();

const selectStatus = ref("");

const close = (event: Event) => {
  // 点击遮罩层关闭
  if (event.target === event.currentTarget) {
    emit("close");
  }
  return;
};

const handleSubmit = () => {
  // 校验表单
  if (!selectStatus.value) {
    showAlert("请选择状态", "error");
    return;
  }
  // 提交表单
  const { run } = useRequest(updateApplyUserStatus, {
    manual: true,
    onSuccess: () => {
      emit("refreshPage");
      emit("close");
      showAlert("修改成功", "pass");
    },
    onError: () => {
      showAlert("修改失败", "error");
    },
  });
  run({ ids: props.ids, interviewStatus: selectStatus.value });

  //清除状态
  selectStatus.value = "";
};
</script>

<template>
  <Teleport to="body">
    <div v-if="props.isOpen" class="outer" @click="close($event)">
      <Form class="form-container">
        <FormField name="status" control="selectStatus" class="bg-white">
          <div class="form-label">修改状态框</div>
          <FormItem class="form-item">
            <Select v-model="selectStatus" placeholder="请选择状态">
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    :value="selectStatus"
                    class="outline"
                    placeholder="请选择状态"
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent class="select-content">
                <SelectItem value="0">待安排</SelectItem>
                <SelectItem value="1">待面试</SelectItem>
                <SelectItem value="2">已录取</SelectItem>
                <SelectItem value="3">已淘汰</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription class="form-description"
              >选择想要修改的状态</FormDescription
            >
            <FormMessage />
          </FormItem>
          <Button
            type="submit"
            class="button btn-style w-[80%]"
            @click.prevent="handleSubmit"
            >提交</Button
          >
        </FormField>
      </Form>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@use "@/assets/styles";
@use "@/assets/styles/recruitment.scss";

.form-container {
  position: relative;
  background-color: var(--popover);
  width: 400px;
  height: 300px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 41;
  gap: 20px;
}
.form-label {
  font-size: 16px;
  text-align: center;
  position: absolute;
  top: 20px;
}

.form-item {
  width: 80%;
  height: 40px;
  outline: none;
  position: relative;
  top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.button {
  position: absolute;
  bottom: 20px;
}
</style>
