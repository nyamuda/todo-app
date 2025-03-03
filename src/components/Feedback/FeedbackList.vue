<template>
  <div v-for="(feedback, index) in service.feedback" :key="index">
    <FeedbackItem :feedback="feedback" />
  </div>
</template>

<script setup>
import FeedbackItem from "./FeedbackItem.vue";

defineProps({
  feedback: {
    type: Array,
  },
});
</script>
