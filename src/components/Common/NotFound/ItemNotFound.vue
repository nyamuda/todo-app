<template>
  <div
    class="d-flex justify-content-center align-items-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
  >
    <div class="mb-2">
      <!-- Font Awesome Icon for missing booking details -->
      <i class="fas fa-info-circle fa-3x text-primary"></i>
    </div>
    <p class="fs-4 text-muted mb-2">{{ title }}</p>
    <p class="text-muted">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
  },
  message: {
    type: String,
  },
});
</script>
