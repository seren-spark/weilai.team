<template>
    <div class="add-button" @click="uploadStart">
        <div class="add-button__icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-plus"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </div>
        <input ref="input" type="file" class="add-button__input" multiple @change="uploadEnd($event)" />
    </div>
</template>
<script setup lang="ts" name="PictureFileUpload">
import { ref } from 'vue';
const emit = defineEmits(["upload:images"]);
const input = ref<HTMLInputElement | null>(null);


const uploadStart = () => {
    if (input.value) {
        input.value.click();
        return;
    }
};

const uploadEnd = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files) return;

    emit("upload:images", files);
    target.value = "";
    input.value = null;
};

</script>
<style lang="scss" scoped>
.add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    .add-button__icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
        svg {
            width: 100%;
            height: 100%;
        }
    }
    .add-button__input {
        display: none;
    }
}

</style>