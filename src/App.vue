<script setup lang="ts">
import Alert from "@/pages/Alert.vue";
import { useAlert } from "./composables/useAlert";

const { alertState } = useAlert();
</script>

<template>
  <Alert
    v-if="alertState"
    :alertState="alertState"
    :message="alertState.message"
    :type="alertState.type"
  />
  <RouterView></RouterView>
</template>
