<template>
  <Carousel
    :value="products"
    :numVisible="3"
    :numScroll="3"
    :responsiveOptions="responsiveOptions"
  >
    <template #item="slotProps">
      <div
        class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4"
      >
        <div class="mb-4">
          <div class="relative mx-auto">
            <img
              :src="
                'https://primefaces.org/cdn/primevue/images/product/' +
                slotProps.data.image
              "
              :alt="slotProps.data.name"
              class="w-full rounded"
            />
            <Tag
              :value="slotProps.data.inventoryStatus"
              :severity="getSeverity(slotProps.data.inventoryStatus)"
              class="absolute"
              style="left: 5px; top: 5px"
            />
          </div>
        </div>
        <div class="mb-4 font-medium">{{ slotProps.data.name }}</div>
        <div class="flex justify-between items-center">
          <div class="mt-0 font-semibold text-xl">
            ${{ slotProps.data.price }}
          </div>
          <span>
            <Button icon="pi pi-heart" severity="secondary" outlined />
            <Button icon="pi pi-shopping-cart" class="ml-2" />
          </span>
        </div>
      </div>
    </template>
  </Carousel>
  <div class="carousel-item">
    <div class="bg-image">
      <img
        src="https://images.unsplash.com/photo-1582639510494-c80b5de9f148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80"
        class="the_slide w-100"
        alt="Carousel image"
      />

      <div
        class="mask text-light d-flex flex-column justify-content-center text-center"
        style="background-color: rgba(0, 0, 0, 0.6)"
      >
        <h5 class="main-title fw-bold">
          Your Roadmap to Success
          <span class="caption-bold">Starts Here</span>
        </h5>
        <p class="sentence container d-none d-md-block">
          Begin your journey toward becoming a skilled and responsible driver.
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
</template>

<script setup>
import { ref } from "vue";
import Carousel from "primevue/carousel";

const products = ref([
  { title: "Your Roadmap to Success", description: "Begin your journey toward becoming a skilled and responsible driver." },
  { title: "", description: "" },
  { title: "", description: "" },
]);

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>
