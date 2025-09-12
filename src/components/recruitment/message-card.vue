<script setup lang="ts">
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ref } from "vue";
import {
  getResumeById,
  getCommentByInterviewRecordId,
} from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import { watch, computed } from "vue";
import { InterviewEvaluationShow, WriteInterviewEvaluation } from "./dialog";

interface IProp {
  ApplyUserId: string;
  startTime: string;
  endTime: string;
  InterviewAddress: string;
  InterviewRound: string;
  InterviewName: string;
  InterviewStatus: string;
  InterviewId: string;
  InterviewOfficerFirst: {
    name: string;
    id: string;
  };
  InterviewOfficerSecond: {
    name: string;
    id: string;
  };
  InterviewOfficerThird: {
    name: string;
    id: string;
  };
}
const props = defineProps<{
  cardMessage: IProp;
}>();

const emit = defineEmits(["refreshPage"]);

const dateTime = ref({
  time1: props.cardMessage.startTime,
  time2: props.cardMessage.endTime,
});

const InterviewRecordId = ref(props.cardMessage.InterviewId);
const isShowButton = computed(() => {
  if (["待面试", "待反馈"].includes(props.cardMessage.InterviewStatus)) {
    return 2;
  } else if (["已淘汰", "已录取"].includes(props.cardMessage.InterviewStatus)) {
    return 3;
  }
  return 1;
});
// 查看简历 \/
const viewResume = (id: string) => {
  const { data, error } = useRequest(() => getResumeById({ id }));
  watch([data, error], ([newData, newError]) => {
    if (newError) {
      console.log("请求失败:", newError);
      return;
    }
    if (newData) {
      window.open(newData.data.data, "_blank");
    }
  });
};
// 查看面评 \/
const commentIsOpen = ref(false);
const interviewEvaluationmessage = ref<string>("");
const viewComment = (id: string) => {
  commentIsOpen.value = true;
  const { data, error } = useRequest(() =>
    getCommentByInterviewRecordId({ id }),
  );
  watch([data, error], ([newData, newError]) => {
    if (newError) {
      console.log("请求失败:", newError);
      return;
    }
    if (newData) {
      interviewEvaluationmessage.value = newData.data.data;
    }
  });
};
//写面评 \/
const writeInterviewEvaluationIsOpen = ref<boolean>(false);
const writeInterviewEvaluation = () => {
  writeInterviewEvaluationIsOpen.value = true;
};
</script>
<template>
  <WriteInterviewEvaluation
    :id="InterviewRecordId"
    :user-id="props.cardMessage.ApplyUserId"
    :is-open="writeInterviewEvaluationIsOpen"
    @refresh-page="emit('refreshPage')"
    @close="writeInterviewEvaluationIsOpen = false"
  />
  <InterviewEvaluationShow
    :is-open="commentIsOpen"
    :message="interviewEvaluationmessage"
    @close="commentIsOpen = false"
  />
  <Card class="message-show">
    <CardContent>
      <div class="message-show-top">
        <div class="message-show-time">
          <span class="min-width inline-block">
            {{ dateTime.time1 }}
          </span>
          &nbsp;
          <span class="min-width inline-block">
            {{ dateTime.time2 }}
          </span>
        </div>
        <div class="message-show-address">
          <span class="min-width"> 面试地点： </span>
          <span class="min-width inline-block">
            {{ cardMessage.InterviewAddress }}
          </span>
        </div>
        <div class="message-show-interviewInturn">
          <span class="min-width"> 面试轮次： </span>
          <span class="min-width inline-block">
            {{ cardMessage.InterviewRound }}
          </span>
        </div>
        <div class="message-show-name">
          <span class="min-width">
            {{ cardMessage.InterviewName }}
          </span>
        </div>
      </div>
      <div class="message-show-bottom">
        <div class="message-show-interviewOfficer">
          <span class="min-width"> 面试官： </span>
          <span class="min-width">
            {{ cardMessage.InterviewOfficerFirst.name }}
            {{ cardMessage.InterviewOfficerSecond.name }}
            {{ cardMessage.InterviewOfficerThird.name }}
          </span>
        </div>
        <div
          :class="{
            'message-show-staus': true,
            'status-pending': cardMessage.InterviewStatus === '待面试',
            'status-feedback': cardMessage.InterviewStatus === '待反馈',
            'status-rejected': cardMessage.InterviewStatus === '已淘汰',
            'status-accepted': cardMessage.InterviewStatus === '已录取',
          }"
        >
          <span class="min-width">
            {{ cardMessage.InterviewStatus }}
          </span>
        </div>
      </div>
    </CardContent>
    <CardFooter class="message-show-button">
      <Button
        v-show="isShowButton === 2"
        class="btn-style"
        @click="writeInterviewEvaluation"
        >面试评价</Button
      >
      <Button
        v-show="isShowButton === 3"
        class="btn-style"
        @click="viewComment(InterviewRecordId)"
        >查看面评</Button
      >
      <Button class="btn-style" @click="viewResume(cardMessage.ApplyUserId)"
        >查看简历</Button
      >
    </CardFooter>
  </Card>
</template>
<style lang="scss" scoped>
@use "@/assets/styles/recruitment";

.min-width {
  min-width: 60px;
}

.message-show {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  cursor: pointer;
  border-radius: var(--radius);
  &:hover {
    background-color: var(--accent);
  }
}
.message-show-top {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-width: 22.5rem;
  height: 80px;
  margin-bottom: 0.6rem;
  gap: 20px;
  font-size: 0.9rem;
  .message-show-name {
    text-align: center;
    min-width: 70px;
    border: 0.06rem solid var(--primary-foreground);
    padding: 5px 10px;
    border-radius: 15px;
    margin-right: 10px;
    // background-color: #f2f2f2;
    // color: #929292;
  }
  .message-show-interviewInturn {
    min-width: 70px;
  }
}
.message-show-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 40px;
  gap: 20px;
  font-size: 0.9rem;
}
.message-show-button {
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%;
  margin-top: 1rem;
  position: absolute;
  right: 16px;
  gap: 10px;
  @media screen and (max-width: 1300px) {
    position: relative;
    margin-left: 1rem;
  }
}
.message-show-staus {
  text-align: center;
  width: 5;
  // border: 1px solid #ffcdd2;
  padding: 5px 10px;
  border-radius: 15px;
}
.status-pending {
  // background-color: #fff1f0;
  // color: #cf1322;
  border: 0.05rem solid #a6d4ff;
  background-color: #f0f5ff;
  // background-color: var(--primary);
  // color: #266cde;
  color: var(--primary-foreground);
}
.status-feedback {
  border: 0.05rem solid #ffd593;
  background-color: #fff7e6;
  color: #d77519;
}
.status-rejected {
  // background-color: #e1bee7;
  // color: #4a148c;
  // background-color: #f2f2f2;
  // color: #929292;
  border: 0.05rem solid #ffc9c7;
  background-color: #fff1f0;
  color: #cf1322;
}
.status-accepted {
  // background-color: #c8e6c9;
  border: 0.05rem solid #bfed9b;
  background-color: #f6ffed;
  color: #58ae39;
}
</style>
