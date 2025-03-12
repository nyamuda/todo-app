<template>
  <!-- Services Start -->
  <div>
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
    </div>
  </div>
  <!-- Services End -->
</template>

<script setup>
import { onMounted, computed } from "vue";
import TitleSection from "../Elements/TitleSection.vue";
import { useStore } from "vuex";

let store = useStore();
let services = computed(() => store.state.services.services);
onMounted(async () => {
  try {
    //fetch all the services
    await store.dispatch("services/getServices");
  } catch (ex) {
    console.log(ex);
  }
});

//get only two services to show on the homepage
let getTwoServices = computed(() => {


});
</script>
