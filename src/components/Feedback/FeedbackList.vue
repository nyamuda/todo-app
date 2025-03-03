<template>
  <div v-for="item in feedback" :key="item.id">
    <FeedbackItem :feedback="item" />
  </div>
  <!--Load more Feedback start-->
  <div class="d-grid gap-2 col-md-3 mx-auto mt-3">
    <Button
      @click="loadMoreFeedback"
      type="button"
      :label="isLoadingMoreFeedback ? 'Loading...' : 'Load more'"
      icon="fas fa-chevron-down"
      :loading="isLoadingMoreFeedback"
      :disabled="isLoadingMoreFeedback || !hasMoreFeedback || isGettingFeedback"
      severity="contrast"
      size="small"
    />
  </div>
  <!--Load more Feedback end-->
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import FeedbackItem from "./FeedbackItem.vue";
import { useStore } from "vuex";
import { useToast } from "primevue";
import Button from "primevue/button";

let store = useStore();
let toast = useToast();
let feedback = ref([]);
let isGettingFeedback = ref(false);
let props = defineProps({
  // The ID of the entity(service) the feedback is associated with
  serviceId: {
    type: Number,
  },
});
onMounted(() => {
  getFeedback();
});
//is there more currently being loaded
let isLoadingMoreFeedback = computed(
  () => store.state.feedback.isLoadingMoreFeedback
);

//is there still more feedback that can be loaded
let hasMoreFeedback = computed(
  () => store.state.feedback.feedbackPageInfo.hasMore
);

//get all feedback for a particular service
let getFeedback = () => {
  isGettingFeedback.value = true;
  store
    .dispatch("feedback/getFeedback", props.serviceId)
    .then((data) => (feedback.value = data))
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Fetch Failed",
        detail: message,
        life: 10000,
      });
    })
    .finally(() => {
      isGettingFeedback.value = false;
    });
};

//load more feedback
let loadMoreFeedback = () => {
  store
    .dispatch("feedback/loadMoreFeedback", props.serviceId)
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Load Failed",
        detail: message,
        life: 5000,
      });
    });
};
</script>
