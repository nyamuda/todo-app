<template>
  <div
    @click="goToServiceDetails"
    class="card shadow-sm h-100 cursor-pointer"
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
          <h5 class="card-title fw-bold">{{ service.name }}</h5>

          <!-- Star Rating & Review Count -->
          <p class="text-muted mb-1">
            <span>
              <Rating
                severity="contrast"
                :model-value="calculateAverageRating(service.feedback)"
                readonly
              />
            </span>
            ({{ service.feedback.length }}
            {{ service.feedback.length == 1 ? " review" : "reviews" }})
          </p>

          <!-- Price & Duration -->
          <p class="card-text text-muted mb-1">
            {{ formatCurrency(service.price) }}
          </p>
          <p class="card-text text-muted mb-2">
            <i class="fas fa-clock"></i> Duration:
            {{ service.duration }} minutes
          </p>

          <!-- Features (Max 4) (Mobile Only) -->
          <ul class="list-unstyled mb-2 d-md-none">
            <li
              v-for="(feature, index) in service.features.slice(0, 4)"
              :key="index"
            >
              <i class="fas fa-check-circle text-success"></i>
              {{ feature.name }}
            </li>
          </ul>

          <!-- Recent customer feedback (Mobile Only) -->
          <p class="text-muted small d-md-none">
            <i class="fas fa-quote-left"></i>
            {{ service.feedback[0]?.content }}...
          </p>

          <!-- Buttons -->
          <div class="mt-auto d-flex gap-3">
            <Button
              size="small"
              icon="fas fa-info-circle"
              label="Details"
              severity="secondary"
              outlined
              fluid
            />
            <Button size="small" label="Book Now" fluid />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Popover for full overview & customer review -->
  <Popover ref="op" style="max-width: 25rem">
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
        <FeedbackItem :feedback="selectedService.feedback[0]" />
      </div>
    </div>
  </Popover>
</template>

<script setup>
import { ref, nextTick } from "vue";
import Popover from "primevue/popover";
import Divider from "primevue/divider";
import FeedbackItem from "../Feedback/FeedbackItem.vue";
import Rating from "primevue/rating";
import Button from "primevue/button";
import { useRouter } from "vue-router";

let router = useRouter();
//Props
defineProps({
  service: Object,
});

//Service information to show on hover with a popover
const selectedService = ref();
//The ref of the the popover
const op = ref();

const displayPopover = async (event, service) => {
  // Prevent popover on mobile devices
  if (window.innerWidth <= 768) return;

  op.value?.hide();

  if (selectedService.value?.id === service.id) {
    selectedService.value = null;
  } else {
    selectedService.value = service;

    await nextTick(); // Ensure DOM updates before showing popover
    op.value?.show(event);
  }
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
let goToServiceDetails = () => {
  router.push("/");
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
