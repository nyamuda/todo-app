<template>
  <NavBarItem></NavBarItem>
  <router-view />
</template>

<script>
import NavBarItem from "./components/NavBarItem.vue";

export default {
  name: "App",
  components: {
    NavBarItem,
  },
};
</script>

<style>
#app {
}
</style>
