<template>
  <div :class="textAlignClass">
    <p class="heading-line rounded"></p>
    <p class="fs-4 text-capitalize mb-0">{{ subtitle }}</p>
    <h2 class="display-5 fw-bold mb-4">{{ title }}</h2>
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
  textAlign: {
    type: String,
    default: "start",
  },
});

//Class to use to align the items
let textAlignClass = computed(() => {
  if (props.textAlign == "center") {
    return "text-center";
  } else if (props.textAlign == "end") {
    return "text-end";
  } else {
    return "text-start";
  }
});
</script>
