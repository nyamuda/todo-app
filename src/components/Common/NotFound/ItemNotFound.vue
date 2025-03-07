<template>
  <div class="text-center">
    <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
    <h2 class="text-muted fw-bold">{{ title }}</h2>
    <p class="text-secondary m-auto col-md-5">{{ message }}</p>
    <Button
      class="mt-3"
      label="Go Back"
      icon="fas fa-arrow-left"
      severity="contrast"
      variant="outlined"
      @click="goBack"
    />
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { defineProps } from "vue";
import { useRouter } from "vue-router";

// Define the props for title and message
defineProps({
  title: {
    type: String,
    default: "Item Not Found",
  },
  message: {
    type: String,
    default: "The requested item could not be found.",
  },
});

// Router for navigation
const router = useRouter();

// Go back backward
const goBack = () => router.go(-1);
</script>
