<template>
  <!-- Topbar Start -->
  <div class="container-fluid top-bar d-none d-lg-block py-2">
    <div
      class="d-flex align-items-center justify-content-end align-items-center"
    >
      <div>
        <div class="d-inline-flex align-items-center me-4">
          <i class="fa fa-map-marker-alt text-primary me-2"></i>
          <p class="m-0">123 Street, Cape Town, South Africa</p>
        </div>
        <div class="d-inline-flex align-items-center me-4">
          <i class="far fa-envelope-open text-primary me-2"></i>
          <p class="m-0">nya20002@byui.edu</p>
        </div>
        <div class="d-inline-flex align-items-center">
          <a
            class="btn btn-primary btn-lg btn-floating text-primary me-1"
            style="background-color: #ffffff; border: none"
            role="button"
            ><i class="fab fa-instagram"></i
          ></a>
          <a
            class="btn btn-primary btn-lg btn-floating text-primary me-1"
            style="background-color: #ffffff; border: none"
            role="button"
            ><i class="fab fa-facebook"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
  <!-- Topbar End -->

  <!-- Navbar Start -->
  <div class="nav-bar nav-bg shadow-sm">
    <Menubar :model="items">
      <template #start>
        <router-link to="/" class="navbar-brand"
          ><h1 class="text-primary fw-bold">Prioritia</h1></router-link
        >
      </template>
      <!--Nav Links-->
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else
          v-ripple
          :href="item.route"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span class="fas fa-angle-down"></span>
        </a>
      </template>

      <!--Signin, signup & logout button section-->
      <template #end>
        <div class="d-flex">
          <Button
            v-if="isAuthenticated"
            @click.prevent="logout"
            label="Log out"
            icon="fas fa-arrow-right-from-bracket"
            severity="secondary"
          />

          <template v-else>
            <router-link to="/account/login"
              ><Button label="Log in" severity="contrast" variant="text"
            /></router-link>
            <router-link class="me-0 me-md-2" to="/account/register"
              ><Button label="Sign up" class="ms-2"
            /></router-link>
          </template>
        </div>
      </template>
    </Menubar>
  </div>
  <!-- Navbar End -->
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();
import { computed } from "vue";
import Button from "primevue/button";

import Menubar from "primevue/menubar";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

let isAuthenticated = computed(() => store.state.account.isAuthenticated);
let isAdmin = computed(() => store.state.account.loggedInUser.isAdmin);

const toast = useToast();
const router = useRouter();

//Log out user
let logout = () => {
  store
    .dispatch("account/logoutUser")
    .then((message) => {
      toast.add({
        severity: "success",
        summary: "Logout Success",
        detail: message,
        life: 3000,
      });
      router.push("/");
    })
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Logout Failed",
        detail: message,
        life: 10000,
      });
    });
};
const items = computed(() => {
  //if admin
  if (isAuthenticated.value && isAdmin.value) {
    return [
      { label: "Home", icon: "fas fa-house", route: "/" },
      { label: "Dashboard", icon: "fas fa-gauge", route: "/admin" },
      {
        label: "Bookings",
        icon: "fas fa-calendar-check",

        items: [
          {
            label: "Booking List",
            icon: "fas fa-list-ul",
            route: "/admin/bookings",
          },
          {
            label: "Add Booking",
            icon: "fas fa-plus-circle",
            route: "bookings/add",
          },
          {
            label: "Statuses",
            icon: "fas fa-clipboard-check",
            items: [
              {
                label: "Status List",
                icon: "fas fa-list-ul",
                route: "/statuses",
              },
              {
                label: "Add Status",
                icon: "fas fa-plus-circle",
                route: "/statuses/add",
              },
            ],
          },
        ],
      },
      {
        label: "Services",
        icon: "fa-solid fa-car",
        items: [
          {
            label: "Service List",
            icon: "fas fa-list-ul",
            route: "/services",
          },
          {
            label: "Add Service",
            icon: "fas fa-plus-circle",
            route: "/services/add",
          },
          {
            label: "Features",
            icon: "fas fa-tint",
            items: [
              {
                label: "Feature List",
                icon: "fas fa-list-ul",
                route: "/features",
              },
              {
                label: "Add Feature",
                icon: "fas fa-plus-circle",
                route: "/features/add",
              },
            ],
          },
        ],
      },
    ];
  }
  //if normal user
  else if (isAuthenticated.value) {
    return [
      { label: "Home", icon: "fas fa-house", route: "/" },
      { label: "Dashboard", icon: "fas fa-gauge", route: "/account" },
      {
        label: "Bookings",
        icon: "fas fa-calendar-check",
        items: [
          {
            label: "Booking List",
            icon: "fas fa-list-ul",
            route: "/bookings",
          },
          {
            label: "Add Booking",
            icon: "fas fa-plus-circle",
            route: "bookings/add",
          },
        ],
      },
      {
        label: "Services",
        icon: "fa-solid fa-car",
        route: "/services",
      },
      { label: "Contact", icon: "fas fa-envelope", route: "/contact" },
    ];
  }
  //if not logged in
  else {
    return [
      { label: "Home", route: "/" },
      { label: "Services", route: "/services" },
      { label: "Contact", route: "/contact" },
    ];
  }
});
</script>

<style scoped>
.top-bar {
  background-color: rgba(255, 111, 97, 0.08); /* 50% opacity */
}
</style>
