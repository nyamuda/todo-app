<template>
  <div>
    <!--Service name and rating-->
    <div v-if="service" class="container">
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
        <div class="mt-4">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Rating from "primevue/rating";
import { useStore } from "vuex";
import { useToast } from "primevue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
//import Image from "primevue/image";

let store = useStore();
let toast = useToast();
let router = useRouter();

let service = ref(null);
let isGettingService = ref(false);
let id = ref(null);

onMounted(() => {
  //get the id of the service we want to show the details of
  //from the route parameter
  id.value = router.currentRoute.value.params.id;
  getService(id.value);
});

//get a service with a given ID
let getService = (id) => {
  isGettingService.value = true;
  store
    .dispatch("services/getService", id)
    .then((data) => {
      console.log(data);
      service.value = data;
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
      isGettingService.value = false;
    });
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
