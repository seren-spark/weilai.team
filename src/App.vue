<script setup lang="ts">
import Alert from "@/pages/Alert.vue";
import { useAlert } from "./composables/useAlert";
import { useRoute, useRouter } from "vue-router";
const { alertState } = useAlert();
const route = useRoute();
const router = useRouter();
import chat from "@/components/ai-service/index.vue";
console.log(route);
console.log(router.getRoutes());
</script>

<template>
  <Alert
    v-if="alertState"
    :alertState="alertState"
    :message="alertState.message"
    :type="alertState.type"
  />
  <RouterView></RouterView>
  <chat></chat>
</template>
