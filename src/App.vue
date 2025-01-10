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
</script>

<style>
#app {
}
</style>
