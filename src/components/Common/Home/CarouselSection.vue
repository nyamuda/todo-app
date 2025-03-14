<template>
  <Carousel v-bind="carouselConfig">
    <Slide v-for="slide in slides" :key="slide">
      <!-- Carousel Content Start -->
      <div class="slide-container position-relative w-100">
        <!-- Image Container -->
        <div class="slide-image-container overflow-hidden h-500">
          <img
            :src="slide.image"
            :alt="slide.title"
            class="slide-image w-100 h-100"
          />
        </div>

        <!-- Overlay Content -->
        <div
          class="slide-content position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
        >
          <div
            class="content-overlay position-absolute w-100 h-100"
            style="background-color: rgba(0, 0, 0, 0.6)"
          ></div>

          <div
            class="content-text position-relative text-white text-center p-4 w-100"
          >
            <div
              class="row text-light d-flex flex-column justify-content-center text-center"
            >
              <h2 class="slide-title fw-bold mb-3">
                {{ slide.title }}
              </h2>
              <p class="slide-description container">
                {{ slide.description }}
              </p>
              <div
                class="col-8 col-sm-12 m-auto d-flex flex-column flex-sm-row flex-wrap justify-content-center btn-container"
              >
                <router-link
                  class="btn btn-secondary text-white btn-lg m-2 px-3 px-sm-4 py-sm-2 px-md-5 py-md-3"
                  to="/bookings/add"
                  role="button"
                  >Book Now</router-link
                >
                <router-link
                  class="btn btn-light btn-lg m-2 px-3 px-sm-4 py-sm-2 px-md-5 py-md-3"
                  to="/services"
                  role="button"
                  >Our Services</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Carousel Content End -->
    </Slide>
    <template #addons>
      <CarouselNavigation>
        <template #prev>
          <div class="ms-5">
            <Button
              id="navigator-prev-btn"
              class="text-light"
              icon="fas fa-chevron-left"
              severity="secondary"
              variant="text"
            />
          </div>
        </template>
        <template #next>
          <div class="me-5">
            <Button
              id="navigator-next-btn"
              class="text-light"
              icon="fas fa-chevron-right"
              severity="secondary"
              variant="text"
            />
          </div>
        </template>
      </CarouselNavigation>
    </template>
  </Carousel>
</template>

<script setup>
import { ref } from "vue";
import {
  Carousel,
  Slide,
  Navigation as CarouselNavigation,
} from "vue3-carousel";

import Button from "primevue/button";

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 5000,
};

const slides = ref([
  {
    title: "Modern Design",
    description:
      "Experience cutting-edge design solutions that blend form and function seamlessly.",
    image:
      "https://images.unsplash.com/photo-1675798891288-07fe456fc998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80",
  },
  {
    title: "Innovative Technology",
    description:
      "Discover the latest technological advancements driving business success.",
    image:
      "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
  },
  {
    title: "Premium Quality",
    description:
      "Exceptional craftsmanship and attention to detail in every product.",
    image:
      "https://images.unsplash.com/photo-1675798891288-07fe456fc998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80",
  },
]);
</script>
<style scoped>
.btn.custom {
  background-color: var(--primary-color);
  transition: all 0.1s ease-out;
}
.btn.custom:hover {
  background-color: var(--secondary-color);
}
.slide-image {
  object-fit: cover;
  object-position: center;
}

.slide-title {
  font-size: 2rem;
}

.h-500 {
  height: 500px;
}

.content-overlay {
  transition: opacity 0.3s;
}

.slide-content {
  z-index: 2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .h-500 {
    height: 400px;
  }
}

@media (max-width: 576px) {
  .h-500 {
    height: 300px;
  }
}

@media (min-width: 768px) {
  .slide-title {
    font-size: 3.5rem;
  }
  .slide-description {
    font-size: 1.2rem;
  }
}
@media (min-width: 992px) {
  .slide-title {
    font-size: 4.5rem;
  }
  .slide-description {
    font-size: 1.5rem;
  }
}

#navigator-prev-btn:hover {
  background: none;
}
#navigator-next-btn:hover {
  background: none;
}
</style>
