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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
