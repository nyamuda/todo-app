<template>
  <div
    class="card shadow-sm h-100"
    @mouseenter="displayPopover($event, service)"
    @mouseleave="hidePopover(service.id)"
  >
    <div class="row g-0">
      <!-- Image Section -->
      <div class="col-md-4">
        <img
          :src="
            service.image?.url ||
            'https://primefaces.org/cdn/primevue/images/usercard.png'
          "
          alt="Car wash service"
          class="img-fluid rounded-start"
          style="height: 100%; object-fit: cover"
        />
      </div>

      <!-- Content Section -->
      <div class="col-md-8">
        <div class="card-body d-flex flex-column">
          <div
            class="d-flex justify-content-between align-items-center flex-wrap-reverse"
          >
            <h5 class="card-title fs-5 fw-bold">{{ service.name }}</h5>

            <!--Check if the service is the most popular-->
            <Tag
              v-if="service?.id == popularService.id"
              severity="success"
              value="Most Popular"
            ></Tag>
          </div>

          <!-- Star Rating & Review Count -->
          <div class="text-muted mb-1 d-flex align-items-center">
            <span class="me-2">
              <Rating
                severity="contrast"
                :model-value="calculateAverageRating(service.feedback)"
                readonly
              />
            </span>
            <span>
              ({{ service.feedback.length }}
              {{ service.feedback.length == 1 ? " review" : "reviews" }})</span
            >
          </div>

          <!-- Price & Duration -->
          <p class="card-text text-muted mb-1">
            {{ formatCurrency(service.price) }}
          </p>
          <p class="card-text text-muted mb-2">
            <i class="fa-regular fa-clock"></i> Duration:
            {{ service.duration }} minutes
          </p>
          <!-- Overview(Mobile Only) -->
          <p class="mb-2 d-md-none">{{ service.overview }}</p>
          <!-- Features (Max 4) (Mobile Only) -->
          <ul class="list-unstyled mb-2 row d-md-none">
            <li
              class="col-6"
              v-for="(feature, index) in service.features.slice(0, 4)"
              :key="index"
            >
              <i class="fas fa-check-circle"></i>
              {{ feature.name }}
            </li>
          </ul>

          <!-- Recent customer feedback (Mobile Only) -->
          <FeedbackItem
            class="d-md-none bg-light p-3 rounded mb-3"
            style="font-size: 0.9rem"
            :feedback="getLatestBestFeedback(service.feedback)"
          />

          <!-- Buttons -->
          <div class="mt-auto d-flex gap-3">
            <Button
              size="small"
              icon="fas fa-info-circle"
              label="Details"
              severity="secondary"
              outlined
              fluid
              @click="goToServiceDetails(service?.id)"
            />

            <Button
              @click="bookService(service?.id)"
              severity="contrast"
              size="small"
              label="Book Now"
              fluid
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Popover start -->
  <!-- Popover for full overview & customer review -->
  <!-- If the Popover is glitching or shaking, try adjusting the width.
You can try increasing the column with, set a max width style  -->
  <div>
    <Popover
      ref="op"
      :pt="{
        root: { style: 'max-width: 30rem;' }, // Apply styles to the root element
      }"
    >
      <div v-if="selectedService" class="p-1">
        <p class="h4 fw-bold">{{ selectedService.name }}</p>
        <p>{{ selectedService.overview }}</p>
        <!-- Features (Max 4) -->
        <ul class="list-unstyled mb-2 row">
          <li
            class="col-6"
            v-for="(feature, index) in selectedService?.features?.slice(0, 4)"
            :key="index"
          >
            <i class="fas fa-check"></i>
            {{ feature.name }}
          </li>
        </ul>
        <Divider />
        <!--Feedback section-->
        <div
          style="font-size: 0.9rem"
          v-if="selectedService.feedback?.length > 0"
        >
          <FeedbackItem
            :feedback="getLatestBestFeedback(selectedService.feedback)"
          />
        </div>
      </div>
    </Popover>
  </div>
  <!-- Popover end -->
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import Popover from "primevue/popover";
import Divider from "primevue/divider";
import FeedbackItem from "../Feedback/FeedbackItem.vue";
import Rating from "primevue/rating";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import Tag from "primevue/tag";

let router = useRouter();
let store = useStore();

onMounted(() => {
  store
    .dispatch("services/getPopularService")
    .then((service) => (popularService.value = service))
    .catch(() => {});
});
//Props
defineProps({
  service: Object,
});

//the popular service
//this is used to show which service is the popular one
//by putting a tag on it
let popularService = ref({ id: -1 });

//Service information to show on hover with a popover
const selectedService = ref();
//The ref of the the popover
const op = ref();

const displayPopover = async (event, service) => {
  // Prevent popover on mobile devices
  if (window.innerWidth <= 768) return;

  // If the same service is already selected, do nothing
  if (selectedService.value?.id === service.id) return;

  // Update the selected service
  selectedService.value = service;

  await nextTick(); // Ensure DOM updates before showing popover
  op.value?.show(event);
};

const hidePopover = () => {
  op.value?.hide();
  selectedService.value = null; // Reset selection to allow re-triggering
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

//format number into a monetary value
let formatCurrency = (amount, currency = "ZAR", locale = "en-ZA") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};
//navigate to the service details
let goToServiceDetails = (id) => {
  router.push(`services/${id}/details`);
};

//Get the latest best feedback to show
const getLatestBestFeedback = (feedbacks) => {
  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    feedbacks
      .filter(({ rating }) => rating === 5 || rating === 4) // Keep only 5 or 4-star reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null
  ); // Sort and return latest
};

let bookService = (id) => {
  router.push(`/bookings/add?serviceTypeId=${id}`);
};
</script>

<style scoped>
/* Add this to style the Popover */
:deep(.p-popover) {
  max-width: 25rem !important; /* Adjust as needed */
}
</style>
