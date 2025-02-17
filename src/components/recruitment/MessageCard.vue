<script setup lang="ts">
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ref } from "vue";
// import { useAlert } from "@/composables/useAlert";
import { interviewStatus } from "@/types/recruitmentType";
import {
  getResumeById,
  getCommentByInterviewRecordId,
} from "@/composables/useRecruitmentRequest";
import { useRequest } from "vue-request";
import { watch } from "vue";
import { InterviewEvaluationShow,WriteInterviewEvaluation } from "./dialog";

// const { showAlert } = useAlert();
// showAlert("您已通过面试，请等待HR联系", "pass");

interface IProp {
  ApplyUserId: string;
  InterviewTime: string;
  InterviewAddress: string;
  InterviewRound: string;
  InterviewName: string;
  InterviewStatus: interviewStatus;
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

const dateTime = ref({
  date: props.cardMessage.InterviewTime.split(" ")[0],
  time: props.cardMessage.InterviewTime.split(" ")[1],
});
// const InterviewOfficerIdArr = ref([
//   props.cardMessage.InterviewOfficerFirst.id,
//   props.cardMessage.InterviewOfficerSecond.id,
//   props.cardMessage.InterviewOfficerThird.id,
// ]);
const InterviewRecordId = ref(props.cardMessage.InterviewId);

const isShowButton = ref(1);
const theInterviewStatus = props.cardMessage.InterviewStatus.toString();

if (["待面试", "待反馈"].includes(theInterviewStatus)) {
  isShowButton.value = 2;
} else if (["已淘汰", "已录取"].includes(theInterviewStatus)) {
  isShowButton.value = 3;
}

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
const writeInterviewEvaluationIsOpen = ref(false);
const writeInterviewEvaluation = (id: string) => {
  console.log(id);
  writeInterviewEvaluationIsOpen.value = true;
};

</script>
<template>
  <WriteInterviewEvaluation
    :id="InterviewRecordId"
    :is-open="writeInterviewEvaluationIsOpen"
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
            {{ dateTime.date }}
          </span>
          &nbsp;
          <span class="min-width inline-block">
            {{ dateTime.time }}
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
        <div class="message-show-staus">
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
       @click="writeInterviewEvaluation(InterviewRecordId)"
       >面试评价</Button>
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
@use "@/assets/styles";
@use "@/assets/styles/recruitment";

.min-width {
  min-width: 60px;
}

.message-show {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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
  min-width: 360px;
  height: 80px;
  margin-bottom: 10px;
  gap: 20px;
  font-size: 0.8rem;
  .message-show-name {
    text-align: center;
    min-width: 70px;
    border: 1px solid skyblue;
    padding: 5px 10px;
    border-radius: 15px;
    margin-right: 10px;
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
  font-size: 0.8rem;
}
.message-show-button {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100px;
  height: 100%;
  margin-top: 2em;
  position: absolute;
  right: 16px;
  // margin-left: 4em;
  //
  gap: 10px;
  @media screen and (max-width: 1300px) {
    position: relative;
    margin-left: 1em;
  }
}
.message-show-staus {
  text-align: center;
  width: 80px;
  border: 1px solid #ffcdd2;
  padding: 5px 10px;
  border-radius: 15px;
}
</style>
