<template>
  <div :class="alignItemsClass + ' d-flex flex-column'">
    <p class="heading-line rounded"></p>
    <p class="fs-4 text-capitalize mb-0 text-secondary">{{ subtitle }}</p>
    <h2 class="display-5 fw-bold mb-4 text-secondary">{{ title }}</h2>
  </div>
</template>

<script setup>
import { computed } from "vue";
let props = defineProps({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  alignItems: {
    type: String,
    default: "start",
  },
});

//Class to use to align the items
let alignItemsClass = computed(() => {
  if (props.alignItems == "center") {
    return "align-items-center";
  } else if (props.alignItems == "end") {
    return "align-items-end";
  } else {
    return "align-items-start";
  }
});
</script>
