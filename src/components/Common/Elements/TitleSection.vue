<template>
  <div>
    <p class="heading-line rounded"></p>
    <p class="fs-4 text-capitalize mb-0">{{ subtitle }}</p>
    <h2 class="display-5 fw-bold mb-4">{{ title }}</h2>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
});
</script>
