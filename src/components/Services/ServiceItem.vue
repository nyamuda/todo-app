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
          <div
            class="d-md-none bg-light p-3 rounded mb-3"
            style="font-size: 0.9rem"
          >
            <FeedbackItem :feedback="service.feedback[0]" />
          </div>
          <!-- <p class="text-muted small d-md-none">
            <i class="fas fa-quote-left"></i>
            {{ service.feedback[0]?.content }}
          </p> -->

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
            <Button severity="contrast" size="small" label="Book Now" fluid />
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

onMounted(async () => {
  await store
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
let popularService = ref({ id: 0 });

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
