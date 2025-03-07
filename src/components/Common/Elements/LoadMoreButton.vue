<template>
  <Button
    @click="onClick"
    type="button"
    :label="isLoading ? loadingLabel : !hasMore ? endLabel : label"
    :icon="!hasMore ? '' : icon"
    :loading="isLoading"
    :disabled="isLoading || !hasMore || isDisabled"
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
  icon: {
    type: String,
    default: "fas fa-chevron-down",
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
  isDisabled: {
    type: Boolean,
    default: false,
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
  onClick: {
    type: Function,
    required: true,
  },
});
</script>
