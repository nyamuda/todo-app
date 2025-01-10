<template>
  <div class="d-flex flex-column justify-content-between">
    <NavBarItem />
    <router-view />
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
