<template>
  <!-- Topbar Start -->
  <div class="container-fluid nav-bg d-none d-lg-block">
    <div class="row align-items-center top-bar">
      <div class="col-lg-3 col-md-12 text-center text-lg-start">
        <router-link to="/" class="navbar-brand m-0 p-0"
          ><h1 class="text-primary fw-bold m-0">Prioritia</h1></router-link
        >
      </div>
      <div class="col-lg-9 col-md-12 text-end">
        <div class="h-100 d-inline-flex align-items-center me-4">
          <i class="fa fa-map-marker-alt text-primary me-2"></i>
          <p class="m-0">123 Street, Cape Town, South Africa</p>
        </div>
        <div class="h-100 d-inline-flex align-items-center me-4">
          <i class="far fa-envelope-open text-primary me-2"></i>
          <p class="m-0">nya20002@byui.edu</p>
        </div>
        <div class="h-100 d-inline-flex align-items-center">
          <a
            class="btn btn-sm-square bg-white text-primary me-1"
            href="https://github.com/nyamuda"
            target="_blank"
            ><i class="fab fa-github"></i
          ></a>

          <a
            class="btn btn-sm-square bg-white text-primary me-1"
            href="https://www.linkedin.com/in/nyamuda/"
            target="_blank"
            ><i class="fab fa-linkedin-in"></i
          ></a>
          <a
            class="btn btn-sm-square bg-white text-primary me-0"
            href="https://nyamuda.netlify.app/"
            target="_blank"
            ><i class="fas fa-briefcase"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
  <!-- Topbar End -->

  <!-- Navbar Start -->
  <div class="container-fluid nav-bar nav-bg shadow-sm">
    <Menubar :model="items">
      <template #start>
        <router-link
          to="/"
          class="navbar-brand d-flex align-items-center m-0 p-0 d-lg-none"
          ><h1 class="text-primary m-0 fw-bold">Prioritia</h1></router-link
        >
      </template>
      <!--Nav Links-->
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </router-link>
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
              ><Button label="Log in" severity="secondary"
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

let isAuthenticated = computed(() => store.state.account.isAuthenticated);
let isAdmin = computed(() => store.state.account.loggedInUser.isAdmin);

let logout = () => {
  store.dispatch("account/logoutUser");
};
const items = computed(() => {
  //if admin
  if (isAuthenticated.value && isAdmin.value) {
    return [
      { label: "Home", route: "/" },
      { label: "Dashboard", route: "/admin" },
      { label: "Bookings", route: "/admin/bookings" },
      { label: "Services", route: "/services" },
      { label: "Booking Statuses", route: "/statuses" },
    ];
  }
  //if normal user
  else if (isAuthenticated.value) {
    return [
      { label: "Home", route: "/" },
      { label: "Dashboard", route: "/account/user" },
      { label: "Bookings", route: "/bookings" },
      { label: "Add Booking", route: "/bookings/add" },
      { label: "Contact", route: "/contact" },
    ];
  }
  //if not logged in
  else {
    return [
      { label: "Home", route: "/" },
      { label: "Book Session", route: "/bookings/add" },
      { label: "Contact", route: "/contact" },
    ];
  }
});
</script>

<style scoped>
/*** Navbar ***/
.nav-bg {
  background-color: rgba(255, 111, 97, 0.08); /* 50% opacity */
}
.top-bar {
  height: 75px;
  padding: 0 4rem;
}
.navbar-toggler {
  border: none;
}
.navbar-toggler:focus,
.navbar-toggler:active,
.navbar-toggler-icon:focus {
  outline: none;
  box-shadow: none;
}

.nav-bar {
  position: relative;
  padding: 0 4.75rem;
  transition: 0.5s;
  z-index: 10;
}

.nav-bar.sticky-top {
  position: sticky;
  padding: 0;
  z-index: 9999;
}

.navbar .dropdown-toggle::after {
  border: none;
  content: "\f107";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  vertical-align: middle;
  margin-left: 8px;
}

.navbar-light .navbar-nav .nav-link {
  margin-right: 30px;
  padding: 25px 0;
  color: var(--dark-color);
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  outline: none;
}
.dropdown-item,
.dropdown-toggle,
.fa-user {
  color: var(--dark-color);
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
}
.dropdown-item.active,
.dropdown-item:active {
  background-color: var(--primary-color);
}
.navbar-light .navbar-nav .nav-link:hover,
.navbar-light .navbar-nav .nav-link.active {
  color: var(--primary-color);
}
.call-box {
  /* background-color: var(--primary-color); */
}
@media (max-width: 991.98px) {
  .nav-bar {
    padding: 0;
  }

  .navbar-light .navbar-nav .nav-link {
    margin-right: 0;
    padding: 10px 0;
  }

  .navbar-light .navbar-nav {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eeeeee;
  }
}

@media (min-width: 992px) {
  .navbar .nav-item .dropdown-menu {
    display: block;
    border: none;
    margin-top: 0;
    top: 150%;
    opacity: 0;
    visibility: hidden;
    transition: 0.5s;
  }

  .navbar .nav-item:hover .dropdown-menu {
    top: 100%;
    visibility: visible;
    transition: 0.5s;
    opacity: 1;
  }
  .call-box {
    margin-right: -1.5rem;
  }
}
</style>
