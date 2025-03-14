<template>
  <div class="text-center mt-4">
    <i class="fas fa-box-open fa-4x text-primary"></i>
    <h5 class="mt-3">{{ title }}</h5>
    <p class="mt-3 text-muted">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Nothing here yet" },
  message: { type: String, default: "No items found." },
});
</script>
