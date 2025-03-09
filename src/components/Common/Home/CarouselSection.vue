<template>
  <div class="">
    <Carousel
      :value="slides"
      :autoplayInterval="3000"
      :circular="true"
      :numVisible="1"
      :numScroll="1"
      :showNavigators="false"
    >
      <template #item="slotProps">
        <div class="slide-container position-relative">
          <!-- Image Container -->
          <div class="slide-image-container overflow-hidden h-500">
            <img
              :src="slotProps.data.image"
              :alt="slotProps.data.title"
              class="slide-image w-100 h-100"
            />
          </div>

          <!-- Overlay Content -->
          <div
            class="slide-content position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
          >
            <div
              class="content-overlay bg-dark opacity-50 position-absolute w-100 h-100"
            ></div>

            <div
              class="content-text position-relative text-white text-center p-4 w-100"
            >
              <div class="container">
                <h2 class="display-4 fw-bold mb-4">
                  {{ slotProps.data.title }}
                </h2>
                <p class="lead mb-5 mx-auto max-width-600">
                  {{ slotProps.data.description }}
                </p>
                <div
                  class="d-flex flex-column flex-md-row flex-wrap justify-content-center btn-container"
                >
                  <a
                    class="btn custom text-light btn-lg m-2 px-3 px-md-5 py-md-3"
                    routerLink="/booking"
                    role="button"
                    >Book Now</a
                  >
                  <a
                    class="btn btn-light btn-lg m-2 px-3 px-md-5 py-md-3"
                    routerLink="/courses"
                    role="button"
                    >Our Courses</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Carousel from "primevue/carousel";

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
    image: "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
  },
  {
    title: "Premium Quality",
    description:
      "Exceptional craftsmanship and attention to detail in every product.",
    image: "/images/slide3.jpg",
  },
]);
</script>
<style scoped>
.slide-image {
  object-fit: cover;
  object-position: center;
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

.max-width-600 {
  max-width: 600px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .h-500 {
    height: 400px;
  }

  h2.display-4 {
    font-size: 2.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .h-500 {
    height: 300px;
  }

  h2.display-4 {
    font-size: 2rem;
  }

  p.lead {
    font-size: 1rem;
  }
}
</style>
