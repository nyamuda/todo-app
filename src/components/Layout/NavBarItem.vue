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
  <div class="container-fluid nav-bar nav-bg shadow">
    <nav
      class="navbar navbar-expand-lg navbar-light bg-white p-3 py-lg-0 px-lg-4"
    >
      <router-link
        to="/"
        class="navbar-brand d-flex align-items-center m-0 p-0 d-lg-none"
        ><h1 class="text-primary m-0 fw-bold">Prioritia</h1></router-link
      >

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span class="fas fa-bars"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <div class="navbar-nav me-auto">
          <router-link to="/" class="nav-item nav-link">Home</router-link>
          <router-link to="/contact" class="nav-item nav-link"
            >Contact</router-link
          >
        </div>

        <!--Account section-->

        <div v-if="isAuthenticated" class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle cursor-pointer d-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <i class="fa-regular fa-user fa-2xl"></i>
            <span class="ms-1">Account</span></a
          >
          <div class="dropdown-menu fade-up m-0">
            <router-link class="dropdown-item" to="/account/user"
              >Dashboard</router-link
            >
            <router-link class="dropdown-item" to="/tasks">Tasks</router-link>
            <router-link class="dropdown-item" to="/tasks/add"
              >Add task</router-link
            >
          </div>
        </div>

        <div v-else class="d-flex flex-column flex-md-row">
          <router-link to="/account/login"
            ><button class="btn btn-outline-dark w-100 py-2 px-4">
              Log in
            </button></router-link
          >
          <router-link to="/account/register"
            ><button
              class="btn btn-primary w-100 py-2 px-4 mt-2 mt-md-0 ms-md-2"
            >
              Sign up
            </button></router-link
          >
        </div>

        <!-- <div class="call-box mt-4 mt-lg-0 py-3 px-4 d-flex align-items-center"> 
          <div
            class="d-flex flex-shrink-0 align-items-center justify-content-center bg-white"
            style="width: 2.6rem; height: 2.6rem"
          >
            <i class="fa fa-phone-alt text-primary"></i>
          </div>
          <div class="ms-3">
            <h5 class="m-0 text-light">+27 67 331 9415</h5>
          </div>
        </div> -->
      </div>
    </nav>
  </div>
  <!-- Navbar End -->
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();
import { computed } from "vue";

let isAuthenticated = computed(() => store.state.isAuthenticated);
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
  z-index: 9999;
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
