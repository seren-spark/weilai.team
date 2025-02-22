<script lang="ts" setup>
</script>
<template>
    <div class="horizontal">
        <div class="horizontal-bar-item">
            <div class="horizontal-bar-title">前端</div>
            <div class="horizontal-bar-content"></div>
        </div>
        <div class="horizontal-bar-item">
            <div class="horizontal-bar-title">后端</div>
            <div class="horizontal-bar-content"></div>
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
        }


        .horizontal-bar-content {
            width: 100%;
            height: 10px;
            background-color: aquamarine;
        }
    }
}
</style>