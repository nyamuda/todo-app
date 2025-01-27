<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBarSection />
    <div class="flex-grow-1">
      <router-view />
    </div>
    <FooterSection />
  </div>
</template>

<script setup>
import NavBarSection from "./components/Layout/NavBarSection.vue";
import FooterSection from "./components/Layout/FooterSection.vue";
import { onMounted } from "vue";

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
