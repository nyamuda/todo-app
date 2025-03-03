<template>
  <div>
    <!-- Feedback list skeleton start -->
    <div v-if="isGettingFeedback">
      <FeedbackListSkeleton />
    </div>
    <!-- Feedback list skeleton end -->
    <!-- Feedback and rating start -->
    <div v-else>
      <div class="row row-cols-1 row-cols-md-2 g-5">
        <!--Rating-->
        <div class="col-md-4 d-flex flex-column align-items-start">
          <!--Average rating-->
          <p class="fs-3 fw-bold mb-1">
            {{ calculateAverageRating(feedback) }}
          </p>
          <!--Stars-->
          <div class="d-flex flex-column">
            <span>
              <Rating
                severity="contrast"
                :model-value="calculateAverageRating(feedback)"
                readonly
              />
            </span>
            <span class="text-muted"
              >Based on {{ feedback.length }} ratings</span
            >
          </div>
          <Divider />
          <!--Feedback statistics-->
          <div class="w-100">
            <StarsDistribution :feedback="feedback" />
          </div>
        </div>
        <!--Reviews-->
        <div class="col-md-8 d-flex flex-column gap-2">
          <div v-for="item in feedback" :key="item.id">
            <FeedbackItem :feedback="item" />
          </div>
          <!--Load more reviews start-->
          <div class="d-grid gap-2 col-md-3 mx-auto mt-3">
            <Button
              @click="loadMoreFeedback"
              type="button"
              :label="isLoadingMoreFeedback ? 'Loading...' : 'Load more'"
              icon="fas fa-chevron-down"
              :loading="isLoadingMoreFeedback"
              :disabled="
                isLoadingMoreFeedback || !hasMoreFeedback || isGettingFeedback
              "
              severity="contrast"
              size="small"
            />
          </div>
          <!--Load more reviews end-->
        </div>
      </div>
    </div>
  </div>
  <!-- Feedback and rating end -->
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import FeedbackItem from "./FeedbackItem.vue";
import StarsDistribution from "./StarsDistribution.vue";
import FeedbackListSkeleton from "./Skeletons/FeedbackListSkeleton.vue";
import { useStore } from "vuex";
import { useToast } from "primevue";
import Button from "primevue/button";
import Divider from "primevue/divider";

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

//Calculate the average star rating
const calculateAverageRating = (feedbacks) => {
  if (feedbacks.length == 0) return 0; // Return 0 if no feedbacks are provided

  const totalRating = feedbacks.reduce(
    (sum, feedback) => sum + feedback.rating,
    0
  );
  return (totalRating / feedbacks.length).toFixed(1); // Round to 1 decimal place
};
</script>
