<template>
  <div class="text-center mt-5">
    <i class="fas fa-search fa-4x text-muted mb-3"></i>
    <h2 class="text-muted fw-bold">{{ title }}</h2>
    <p class="text-secondary">{{ message }}</p>
    <Button label="Go Back" icon="fas fa-arrow-left" severity="secondary" @click="goBack"/>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { defineProps } from 'vue';
import { useRouter } from "vue-router";

// Define the props for title and message
defineProps({
  title: {
    type: String,
    default: 'Item Not Found'
  },
  message: {
    type: String,
    default: 'The requested item could not be found.'
  }
});

// Router for navigation
const router = useRouter();

// Go back backward
const goBack = () => router.go(-1); 

</script>
