<template>
  <div>
    <!-- Show service details skeleton when the service is being fetched -->
    <ServiceDetailsSkeleton v-if="isGettingService" />

    <!--Show the service with a given ID-->
    <div v-else-if="service && !isGettingService">
      <!--Service name -->
      <p class="h1">{{ service.name }}</p>

      <!-- Star Rating & Review Count -->
      <div class="text-muted mb-1 d-flex align-items-center">
        <span class="me-2">
          <Rating
            severity="contrast"
            :model-value="calculateAverageRating(service.feedback)"
            readonly
          />
        </span>
        <span>({{ service.feedback.length }})</span>
      </div>
      <!--Service overview-->
      <p>{{ service.overview }}</p>
      <!--Image-->
      <img
        :src="
          service.image?.url ||
          'https://primefaces.org/cdn/primevue/images/usercard.png'
        "
        alt="Car wash service"
        class="img-fluid rounded service-image"
      />
      <!--Description, Price & Duration  -->
      <div class="text-start mt-4 row">
        <!--Description-->
        <div class="col-md-8">
          <p class="h3">Description</p>
          <p>{{ service.description }}</p>
        </div>
        <!--Price & Duration-->
        <div class="bg-light p-3 col-md-4" style="height: fit-content">
          <p class="fs-5 fw-bold">{{ formatCurrency(service.price) }}</p>
          <div class="bg-white mb-3 d-flex justify-content-start gap-2 p-3">
            <div>
              <i class="fas fa-clock"></i>
            </div>
            <div class="d-flex flex-column align-items-start">
              <span>Estimated time</span>
              <span class="fw-bold"> {{ service.duration }} minutes</span>
            </div>
          </div>
          <Button
            rounded
            severity="contrast"
            size="small"
            label="Book Now"
            fluid
          />
        </div>
        <!--Features-->
        <div class="col-12 mt-5">
          <p class="h3">Features</p>
          <ul class="list-unstyled mb-2 row col-md-6">
            <li
              class="col-md-6"
              v-for="(feature, index) in service.features"
              :key="index"
            >
              <i class="fas fa-square-check"></i>
              {{ feature.name }}
            </li>
          </ul>
        </div>

        <!--Ratings and Reviews-->
        <div class="col-12 mt-5">
          <p class="h3">Ratings and Reviews</p>
      <p>Take a quick look at what our clients think about our service</p>
<FeedbackList :service-id="service.id"/>
      </div>
    </div>
    <!-- If the service does not exist -->
    <!-- No Service Details-->
    <ItemNotFound
      v-else
      :title="itemNotFound.title"
      :message="itemNotFound.message"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Rating from "primevue/rating";
import { useStore } from "vuex";
import { useToast } from "primevue";
import { useRouter } from "vue-router";
import Button from "primevue/button";


import ServiceDetailsSkeleton from "./Skeletons/ServiceDetailsSkeleton.vue";
import ItemNotFound from "../Common/NotFound/ItemNotFound.vue";
import FeedbackList from "../Feedback/FeedbackList.vue";

let store = useStore();
let toast = useToast();
let router = useRouter();

let service = ref(null);
let isGettingService = ref(false);
let id = ref(null);
//message to show if the item is not found
const itemNotFound = ref({
  title: "No Service Details Available",
  message:
    " The service information could not be found. It may have been removed or does not exist.",
});

onMounted(() => {
  //get the id of the service we want to show the details of
  //from the route parameter
  id.value = router.currentRoute.value.params.id;
  getService(id.value);
});

//get a service with a given ID
let getService = async (id) => {
  try {
    isGettingService.value = true;
    // get the service information
    let data = await store.dispatch("services/getService", id);
    service.value = data;
  } catch (message) {
    toast.add({
      severity: "error",
      summary: "Fetch Failed",
      detail: message,
      life: 10000,
    });
  } finally {
    isGettingService.value = false;
  }
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
</script>

<style scoped>
.service-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}
</style>
