<template>
  <div class="rating-statistics">
    <!-- 5-Star Review -->
    <div class="rating-statistic">
      <span class="rating-label">5 Stars ({{ starRatings[5] }})</span>
      <ProgressBar :value="getStarPercentage(5)" showValue="{false}" />
    </div>

    <!-- 4-Star Review -->
    <div class="rating-statistic">
      <span class="rating-label">4 Stars ({{ starRatings[4] }})</span>
      <ProgressBar :value="getStarPercentage(4)" showValue="{false}" />
    </div>
  </div>
</template>

<script setup>
import ProgressBar from "primevue/progressbar";

const props = defineProps({
  feedback: {
    type: Array,
    default: () => [],
  },
});

//get the total number of reviews with given stars
//e.g how many reviews have 5 stars
let getTotalReviewsWithStars = (stars) => {
  return props.feedback.reduce((totalReviews, review) => {
    //if the rating of the review/feedback is equal to provided 'stars' argument
    //add 1 to the total number of reviews with that number of stars
    if (review.rating == stars) {
      return totalReviews + 1;
    } else {
      return totalReviews;
    }
  }, 0);
};
</script>
