<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center mt-5"
  >
    <i class="fas fa-times-circle fa-5x mb-3"></i>
    <h2 class="text-dark fw-bold mb-2">404 - Page Not Found</h2>
    <p class="text-muted mb-4">We couldn't find what you were looking for.</p>
    <Button
      label="Return Home"
      icon="fas fa-home"
      severity="contrast"
      variant="outlined"
      @click="goHome"
    />
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => router.push("/");
</script>
