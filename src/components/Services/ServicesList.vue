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
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

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
