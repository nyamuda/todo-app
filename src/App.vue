<template>
  <div class="d-flex flex-column min-vh-100">
    <Menubar :model="items" />
    <div class="flex-grow-1">
      <router-view />
    </div>
    <FooterSection />
  </div>
</template>

<script setup>
import FooterSection from "./components/Layout/FooterSection.vue";
import { onMounted } from "vue";

import { useStore } from "vuex";
import Menubar from "primevue/menubar";

import { ref } from "vue";

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
  },
  {
    label: "Features",
    icon: "pi pi-star",
  },
  {
    label: "Projects",
    icon: "pi pi-search",
    items: [
      {
        label: "Components",
        icon: "pi pi-bolt",
      },
      {
        label: "Blocks",
        icon: "pi pi-server",
      },
      {
        label: "UI Kit",
        icon: "pi pi-pencil",
      },
      {
        label: "Templates",
        icon: "pi pi-palette",
        items: [
          {
            label: "Apollo",
            icon: "pi pi-palette",
          },
          {
            label: "Ultima",
            icon: "pi pi-palette",
          },
        ],
      },
    ],
  },
  {
    label: "Contact",
    icon: "pi pi-envelope",
  },
]);
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
