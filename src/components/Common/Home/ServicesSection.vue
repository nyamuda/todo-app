<template>
  <!-- Services Start -->
  <div v-if="services.length > 0" class="mt-5">
    <div class="text-center">
      <TitleSection
        subtitle="Car wash services"
        title="Our Expertise"
        align-items="center"
      />
      <div class="row mb-4">
        <p class="col-md-8 m-auto">
          We offer professional car wash and detailing services to restore your
          car’s shine and freshness. From hand washes to deep interior cleaning,
          we do it all.
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
      <div class="row" v-else-if="services.length > 0 && !isGettingServices">
        <!--Service items-->
        <div
          v-for="service in getTwoServices"
          :key="service.id"
          class="col-md-6"
        >
          <ServiceItem :service="service" />
        </div>
        <div class="m-auto mt-4">
          <router-link to="/services"
            ><Button label="View all services" severity="contrast"
          /></router-link>
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
import Button from "primevue/button";
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
