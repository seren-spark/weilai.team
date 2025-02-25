<script lang="ts" setup>
import { Progress } from '@/components/ui/progress'
import { ref, watchEffect } from 'vue'

const progress = ref({
    frontEnd: 10,
    backEnd: 10
})
watchEffect((cleanupFn) => {
    const timer = setTimeout(() => (
        progress.value.frontEnd = 50,
        progress.value.backEnd = 70
    ), 500)
    cleanupFn(() => clearTimeout(timer))
})
</script>
<template>
    <div class="horizontal">
        <div class="horizontal-bar-item">
            <div class="horizontal-bar-title">前端programmer</div>
            <Progress v-model="progress.frontEnd"
                class="horizontal-bar-content front-end color-[red]"></Progress>
        </div>
        <div class="horizontal-bar-item">
            <div class="horizontal-bar-title">后端programmer</div>
            <Progress v-model="progress.backEnd" class="horizontal-bar-content back-end"></Progress>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.horizontal {

    .horizontal-bar-item {
        width: 100%;
        margin-bottom: 10px;

        .horizontal-bar-title {
            margin-bottom: 3px;
            font-size: 18px;
            letter-spacing: 0.1em;
        }



        .horizontal-bar-content {
            width: 100%;
            height: 10px;
            background-color: #e7ebed;
        }

        // .front-end {
        //     background-color: #59b3ae;
        // }
    }
}
</style>