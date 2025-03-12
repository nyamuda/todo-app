<template>
  <div>
    <div class="text-center">
      <TitleSection subtitle="Services" title="What We Offer" />
    </div>
    <!-- Add new service button (for only admins) -->
    <div v-if="isAdmin" class="d-flex justify-content-end mb-4">
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
    <EmptyList
      v-else-if="isAdmin"
      title="No Services Available"
      message="Add a service so clients can start booking."
    />
    <EmptyList
      v-else
      title="No Services Available"
      message="We're setting up our services. Check back soon."
    />
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
import EmptyList from "../Common/Elements/EmptyList.vue";
import TitleSection from "../Common/Elements/TitleSection.vue";

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
let isAdmin = computed(() => store.state.account.loggedInUser.isAdmin);
</script>
