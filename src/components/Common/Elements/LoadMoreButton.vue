<template>
  <Button
    @click="onClick"
    type="button"
    :label="isLoading ? loadingLabel : !hasMore ? endLabel : label"
    :icon="!hasMore ? '' : 'fas fa-chevron-down'"
    :loading="isLoading"
    :disabled="isLoading || !hasMore"
    :severity="severity"
    :size="size"
    :variant="!hasMore ? endVariant : variant"
  />
</template>

<script setup>
import Button from "primevue/button";
defineProps({
  label: {
    type: String,
    default: "Load more",
  },
  loadingLabel: {
    type: String,
    default: "Loading...",
  },
  endLabel: {
    type: String,
    default: "You’ve reached the end of the list",
  },
  isLoading: {
    type: Boolean,
    default: false,
    required: true,
  },
  hasMore: {
    type: Boolean,
    default: true,
    required: true,
  },

  onClick: {
    type: Function,
    required: true,
  },
  severity: {
    type: String,
    default: "contrast",
  },
  size: {
    type: String,
    default: "small",
  },
  variant: {
    type: String,
    default: "filled",
  },
  endVariant: {
    type: String,
    default: "outlined",
  },
});
</script>
