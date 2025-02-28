<template>
  <div>
    <h1 class="display-6 mb-4">Car wash services</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/services/add">
        <Button
          icon="fas fa-pen"
          variant="text"
          label="Add new service"
          rounded
          aria-label="update"
        />
      </router-link>
    </div>

    <!--Car wash services-->
    <div class="row" v-if="services.length > 0 || isGettingServices">
      <div v-for="service in services" :key="service.id" class="col-md-6 mb-4">
        <ServiceItem :service="service" />
      </div>
    </div>

    <!--No Services Start-->
    <div
      v-else
      class="d-flex justify-content-center align-bookings-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
    >
      <div class="mb-2">
        <!-- Font Awesome Icon for no bookings -->
        <i class="fas fa-0 fa-3x text-primary"></i>
      </div>
      <p class="fs-4 text-muted mb-2">
        There are no available car wash services at the moment.
      </p>
      <p class="text-muted">
        Add a service and let clients start booking car wash sessions.
      </p>
    </div>
    <!--No Service End-->
  </div>
  <!--Service card skeleton start-->
  <div class="card shadow-sm h-100">
    <div class="row g-0">
      <!-- Image Skeleton -->
      <div class="col-md-4">
        <Skeleton class="w-100 h-100 rounded-start" style="height: 180px" />
      </div>

      <!-- Content Section -->
      <div class="col-md-8">
        <div class="card-body d-flex flex-column">
          <!-- Title & Badge -->
          <div
            class="d-flex justify-content-between align-items-center flex-wrap-reverse"
          >
            <Skeleton width="60%" height="1.5rem" class="mb-2" />
            <Skeleton width="20%" height="1.5rem" class="mb-2" />
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end gap-2">
            <Skeleton shape="circle" size="2rem" />
            <Skeleton shape="circle" size="2rem" />
          </div>

          <!-- Star Rating & Review Count -->
          <div class="text-muted mb-1 d-flex align-items-center">
            <Skeleton width="40%" height="1rem" class="me-2" />
            <Skeleton width="10%" height="1rem" />
          </div>

          <!-- Price & Duration -->
          <Skeleton width="30%" height="1rem" class="mb-1" />
          <Skeleton width="50%" height="1rem" class="mb-2" />

          <!-- Features (Mobile Only) -->
          <ul class="list-unstyled mb-2 row d-md-none">
            <li class="col-6" v-for="index in 4" :key="index">
              <Skeleton width="80px" height="1rem" />
            </li>
          </ul>

          <!-- Recent Feedback (Mobile Only) -->
          <div class="d-md-none bg-light p-3 rounded mb-3">
            <Skeleton width="100%" height="2rem" />
          </div>

          <!-- Buttons -->
          <div class="mt-auto d-flex gap-3">
            <Skeleton height="2rem" fluid />
            <Skeleton height="2rem" fluid />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Service card skeleton end-->
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { Skeleton } from "primevue";

import Button from "primevue/button";

import ServiceItem from "./ServiceItem.vue";
import { useToast } from "primevue/usetoast";

let store = useStore();

const toast = useToast();
onMounted(() => {
  store
    .dispatch("services/getServices")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error Fetching Services",
        detail: message,
        life: 20000,
      });
    });
});

let services = computed(() => store.state.services.services);
//let rowSkeletons = new Array(4);
let isGettingServices = computed(() => store.state.services.isGettingServices);

//Get the latest 5 or 4 star review
// const latestBestReview = (feedbacks) => {
//   //if the feedback array is empty, return false
//   if (!feedbacks.length == 0) return false;

//   let bestReviews = feedbacks.filter(
//     (feedback) => feedback.rating == 5 || feedback.rating == 4
//   );

//   if (bestReviews.length > 0) return bestReviews[0];
//   //if there are not 5 or 4 star reviews, return false
//   else return false;
// };
</script>
