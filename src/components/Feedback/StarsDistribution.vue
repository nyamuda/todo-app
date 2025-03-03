<template>
  <div v-if="feedback.length > 0">
    <!---Star Review -->
    <div v-for="stars in starValues" class="row" :key="stars">
      <div class="rating-bar mb-2">
        <!--5 ,4, 3, 2, or 1 star label-->
        <div class="d-flex justify-content-between align-items-center mb-1">
          <div class="d-flex">
            <span class="me-1">{{ stars }}</span>
            <Rating modelValue="1" :stars="1" readonly />
          </div>
          <small class="text-muted">
            {{ getTotalReviewsWithStars(stars) }}
          </small>
        </div>
        <!--Percentage of the number of reviews with that star rating as a horizontal bar-->
        <div class="progress" style="height: 0.5rem">
          <div
            class="progress-bar bg-success"
            role="progressbar"
            :style="{ width: getStarPercentage(stars) + '%' }"
            :aria-valuenow="getStarPercentage(stars)"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Rating from "primevue/rating";

const props = defineProps({
  feedback: {
    type: Array,
    default: () => [],
  },
});

let starValues = [5, 4, 3, 2, 1];
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
//get the percentage of a given number of stars
//e.g the number of reviews with 5 stars is 60%
let getStarPercentage = (stars) => {
  let percentage =
    (getTotalReviewsWithStars(stars) / props.feedback.length) * 100;
  return percentage;
};
</script>
