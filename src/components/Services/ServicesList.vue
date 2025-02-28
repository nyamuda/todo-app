<template>
  <div>
    <div class="text-center pb-2">
      <h6 class="text-primary text-uppercase font-weight-bold">Services</h6>
      <h1 class="mb-4">What We Offer</h1>
    </div>
    <div class="d-flex justify-content-end mb-4">
      <router-link to="/services/add">
        <Button
          icon="fas fa-plus"
          label="Add new service"
          aria-label="update"
          size="small"
        />
      </router-link>
    </div>

    <!--Service item skeletons-->
    <div class="row" v-if="isGettingServices">
      <div v-for="val in serviceItemSkeletons" :key="val" class="col-md-6 mb-4">
        <ServiceItemSkeleton />
      </div>
    </div>
    <!--Car wash services-->
    <div class="row" v-else-if="services.length > 0 && !isGettingServices">
      <!--Service items-->
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
import ServiceItemSkeleton from "./ServiceItemSkeleton.vue";
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
let serviceItemSkeletons = new Array(6);
let isGettingServices = computed(() => store.state.services.isGettingServices);
</script>
