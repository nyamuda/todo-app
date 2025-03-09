<template>
  <Carousel
    :value="products"
    :numVisible="3"
    :numScroll="3"
    :responsiveOptions="responsiveOptions"
  >
    <template #item="slotProps">
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
              {{ slotProps.data.name }}
            </h5>
            <p class="sentence container d-none d-md-block">
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
    </template>
  </Carousel>
</template>

<script setup>
import { ref } from "vue";
import Carousel from "primevue/carousel";
//import { Button } from "primevue/button";

const products = ref([
  {
    title: "Your Roadmap to Success Starts Here",
    description:
      "Begin your journey toward becoming a skilled and responsible driver.",
  },
  {
    title: "Drive With Experts",
    description:
      "Learn the art of driving from the ground up with the guidance of our experienced experts.",
  },
  {
    title: "  Pass Your Driving Test With Ease",
    description: "We lead you from learner to licensed driver.",
  },
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

<style scoped>
.carousel {
  position: relative;
  z-index: 1;
}

.cards {
  position: relative;
  z-index: 2;
  margin-top: -3rem !important;
}

.card {
  border-radius: 0;
}

.icon {
  color: #333333;
}

.carousel-caption h5 {
  text-transform: capitalize;
}

.caption-bold {
  color: #f2ba11;
}

.display-4 {
  font-family: "Merriweather Sans", sans-serif;
}

.carousel-item.active {
  position: relative;
}

.main-title {
  font-size: 2rem;
}

.btn-container {
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .main-title {
    font-size: 3.5rem;
  }
  .sentence {
    font-size: 1.2rem;
  }
}
@media (min-width: 992px) {
  .main-title {
    font-size: 4.5rem;
  }
  .sentence {
    font-size: 1.5rem;
  }
}
.carousel-item {
  transition: all 0.5s ease-out;
}

.carousel-item img {
  -o-object-fit: cover;
  object-fit: cover;
}

.the_slide {
  width: 100%;
  height: 24rem;
  -o-object-fit: cover;
  object-fit: cover;
}

@media (min-width: 728px) {
  .the_slide {
    height: 25rem;
  }
}
@media (min-width: 1024px) {
  .the_slide {
    height: 30rem;
  }
}
</style>
