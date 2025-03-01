<template>
  <div class="rating-statistics">
    <!---Star Review -->
    <div
      v-for="(value, index) in starValues"
      class="rating-statistic"
      :key="index"
    >
      <!--5 ,4, 3, 2, or 1 star label-->
      <div class="rating-label">
        <span>{{ index + 1 }}</span>
        <i class="fas fa-star"></i>
      </div>
      <!--Percentage of the number of reviews with that star rating as a horizontal bar-->
      <ProgressBar :value="getStarPercentage(index + 1)" showValue="false" />
      <!--Total number reviews with that star rating-->
      <span>{{ getTotalReviewsWithStars(index + 1) }}</span>
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

let starValues = new Array(4);
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
  return (getTotalReviewsWithStars(stars) / props.feedback.length) * 100;
};
</script>
