<script setup lang="ts">
import { Icon } from "@iconify/vue";

// const centerObj = {
//     number: 1005,
//     title: '总人数',
//     icon: 'ic:outline-person'
// }

const centerObj = defineProps({
    number: {
        type: String,
        default: '1005'
    },
    title: {
        type: String,
        default: '汇总'
    },
    icon: {
        type: String,
        default: 'ic:outline-person'
    }
})
</script>
<template>
    <div class="summaryIndex">
        <Icon class="sumIcon" :icon=centerObj.icon />
        <div class="sumIndex_center">
            <div class="sumIndex_center_Number">{{ centerObj.number }}</div>
            <div class="sumIndex_center_title">{{ centerObj.title }}</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.summaryIndex {
    // width: 90%;
    // height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    position: relative;

    &:nth-child(2) {
        // margin: 0 0 10% 0;
    }

    &:first-child {
        background-color: #59b3ae;
        color: #fff;
        // margin: 0 0 10% 0;
    }

    &:last-child {
        background-color: #3d79b1;
        color: #fff;
    }

    .sumIcon {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 30px;
    }


    .sumIndex_center {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;

        .sumIndex_center_Number {
            font-size: 24px;
        }
    }
}

@media screen and (max-width: 768px) {
}
</style>