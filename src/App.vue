<template>
  <div class="d-flex flex-column min-vh-100">
    <NavBarItem />
    <div class="flex-grow-1">
      <router-view />
    </div>
    <FooterItem />
  </div>
</template>

<script setup>
import NavBarItem from "./components/Layout/NavBarItem.vue";
import FooterItem from "./components/Layout/FooterItem.vue";
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
