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
          <p class="h3 fw-bold mb-1">
            {{ averageRating }}
          </p>
          <!--Stars-->
          <div class="d-flex flex-column">
            <span>
              <Rating
                severity="contrast"
                :model-value="averageRating"
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
        <div
          v-if="feedback.length > 0"
          class="col-md-8 d-flex flex-column gap-2"
        >
          <div v-for="item in feedback" :key="item.id">
            <FeedbackItem :feedback="item" />
          </div>
          <!--Load more reviews start-->
          <div class="d-grid gap-2 col-md-3 mx-auto mt-3">
            <LoadMoreButton
              :onClick="loadMoreFeedback"
              :has-more="hasMoreFeedback"
              :is-loading="isLoadingMoreFeedback"
              label="Load more reviews"
              end-label="No more reviews to show"
              variant="outlined"
              end-variant="text"
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
import LoadMoreButton from "../Common/Elements/LoadMoreButton.vue";
import { useStore } from "vuex";
import { useToast } from "primevue";
import Divider from "primevue/divider";
import Rating from "primevue/rating";

let store = useStore();
let toast = useToast();
let feedback = ref([]);
//average rating for all the feedback
let averageRating = ref(0);
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
  () => store.state.feedback.feedbackPageInfo?.hasMore
);

//get all feedback for a particular service
let getFeedback = () => {
  isGettingFeedback.value = true;
  store
    .dispatch("feedback/getFeedback", props.serviceId)
    .then((data) => {
      feedback.value = data.feedback;
      averageRating.value = data.averageRating;
    })
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
