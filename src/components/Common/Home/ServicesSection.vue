<template>
  <!-- Services Start -->
  <div v-if="services.length > 0" class="mt-5">
    <div>
      <!-- Title for small screens -->
      <TitleSection
        subtitle="Car wash services"
        title="Our Expertise"
        align-items="center"
      />
      <!-- Title for large screens -->
      <!-- <TitleSection
        class="d-none d-lg-flex"
        subtitle="Car wash services"
        title="Our Expertise"
        align-items="center"
      /> -->
      <div class="row mb-4">
        <p class="col-lg-8 text-center m-auto">
          Keep your car looking its best with our high-quality wash services. We
          remove dirt, dust, and grime while protecting your vehicle’s finish.
        </p>
      </div>

      <!-- Service list start -->
      <!--Service item skeletons-->
      <div class="row" v-if="isGettingServices">
        <div
          v-for="val in serviceItemSkeletons"
          :key="val"
          class="col-md-6 mb-4"
        >
          <ServiceItemSkeleton />
        </div>
      </div>
      <!--Car wash services-->
      <div
        class="row gy-4 gy-lg-2"
        v-else-if="services.length > 0 && !isGettingServices"
      >
        <!--Service items-->
        <div
          v-for="service in getTwoServices"
          :key="service.id"
          class="col-lg-6"
        >
          <ServiceItem :service="service" />
        </div>
        <div class="text-center m-auto mt-4">
          <router-link
            class="btn btn-primary text-light btn-lg m-2 px-4 py-2 px-md-5 py-md-3"
            to="/services"
            role="button"
            >View all services</router-link
          >
        </div>
      </div>
      <!-- No services -->
      <EmptyList
        v-else
        title="No Services Available"
        message="We're setting up our services. Check back soon."
      />
      <!-- Service list end -->
    </div>
  </div>
  <!-- Services End -->
</template>

<script setup>
import { onMounted, computed } from "vue";
import TitleSection from "../Elements/TitleSection.vue";
import { useStore } from "vuex";
import ServiceItemSkeleton from "@/components/Services/ServiceItemSkeleton.vue";

import EmptyList from "../Elements/EmptyList.vue";
import ServiceItem from "@/components/Services/ServiceItem.vue";

let store = useStore();
let services = computed(() => store.state.services.services);
let serviceItemSkeletons = new Array(2);
let isGettingServices = computed(() => store.state.services.isGettingServices);
onMounted(async () => {
  try {
    //fetch all the services
    await store.dispatch("services/getServices");
  } catch (ex) {
    console.log(ex);
  }
});

//get only two services to show on the homepage
let getTwoServices = computed(() => services.value.slice(0, 2));
</script>
