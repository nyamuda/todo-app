<template>
  <div class="text-center mt-5">
    <i class="fas fa-exclamation-circle fa-4x text-danger mb-3"></i>
    <h2 class="fw-bold">Page Not Found</h2>
    <p class="text-muted">The page you're looking for doesn't exist.</p>
    <Button label="Go Home" icon="pi pi-home" @click="goHome" />
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => router.push("/");
</script>
