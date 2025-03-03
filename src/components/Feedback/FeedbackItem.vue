<template>
  <div v-if="feedback" class="container-fluid">
    <div class="d-flex flex-column align-items-start mb-2">
      <span class="fw-bold d-flex">Tatenda Pierce</span>

      <div class="d-flex">
        <Rating class="me-2" :model-value="feedback.rating" readonly />
        <span class="text-muted">{{
          dateFormat(feedback.createdAt, "mmmm dS, yyyy")
        }}</span>
      </div>
    </div>
    <p class="">
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
