<template>
  <div>
    <div class="d-flex flex-column align-items-start mb-2">
      <span class="fw-bold d-flex">Tatenda Pierce</span>

      <span class="d-flex">
        <Rating class="me-2" :model-value="feedback.rating" readonly />
        {{ dateFormat(feedback.createdAt, "mmmm dS, yyyy") }}
      </span>
    </div>
    <p class="text-muted">
      <i class="fas fa-quote-left pe-1"></i>
      {{ feedback.content }}
    </p>
  </div>
</template>

<script setup>
import dateFormat from "dateformat";
import Rating from "primevue/rating";

defineProps({
  feedback: Object,
});
</script>
