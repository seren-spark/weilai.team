<script setup lang="ts">
defineProps<{
    title?: string
    data: {
        name: string
        color: string
        value: any
    }[]
}>()
</script>

<template>
    <div v-for="(item, key) in data" :key="key" class="flex justify-between tooltip-item">
        <div class="flex items-center">
            <span class="w-2.5 h-2.5 mr-2">
                <svg width="100%" height="100%" viewBox="0 0 30 30">
                    <path d=" M 15 15 m -14, 0 a 14,14 0 1,1 28,0 a 14,14 0 1,1 -28,0" :stroke="item.color"
                        :fill="item.color" stroke-width="1" />
                </svg>
            </span>
            <span>{{ item.name }}</span>
        </div>
        <span class="font-semibold ml-4 tooltip-item-value">{{ item.value }}</span>
    </div>

</template>
<style lang="scss" scoped>
.tooltip-item {
    font-size: 14px;

    .tooltip-item-value {
        font-size: 14px;
    }
}

@media screen and (min-width: 1600px) {
    .tooltip-item {
        font-size: 16px;

        .tooltip-item-value {
            font-size: 16px;
        }
    }
}

@media screen and (max-width: 1200px) {
    .tooltip-item {
        font-size: 12px;

        .tooltip-item-value {
            font-size: 12px;
        }
    }
}

@media screen and (max-width: 1040px) {
    .tooltip-item {
        font-size: 10px;

        .tooltip-item-value {
            font-size: 10px;
        }
    }
}
</style>