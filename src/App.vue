<template>
  <NavBarItem />
  <router-view />
  <FooterItem />
</template>

<script setup>
import NavBarItem from "./components/Layout/NavBarItem.vue";
import FooterItem from "./components/Layout/FooterItem.vue";
</script>

<style>
#app {
}
</style>
