<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBarSection />
    <CarouselSection />
    <div class="flex-grow-1">
      <router-view />
    </div>
    <FooterSection />
  </div>
  <!--For all toast notifications within the application-->
  <Toast />
</template>

<script setup>
import NavBarSection from "./components/Layout/NavBarSection.vue";
import FooterSection from "./components/Layout/FooterSection.vue";
import CarouselSection from "./components/Common/Home/CarouselSection.vue";
import { onMounted } from "vue";
import Toast from "primevue/toast";

import { useStore } from "vuex";
const store = useStore();

onMounted(() => {
  //Check if user is authenticated or not
  store.dispatch("account/authenticateUser");
});
</script>

<style>
#app {
}
</style>
