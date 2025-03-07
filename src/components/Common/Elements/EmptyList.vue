<template>
  <div class="text-center py-5">
    <i class="fas fa-box-open fa-3x text-secondary"></i>
    <p class="mt-3 text-muted">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: "No items found." },
});
</script>
