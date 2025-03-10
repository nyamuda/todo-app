<template>
  <div class="container row row-cols-1 row-cols-lg-3 m-auto cards">
    <div class="col mb-3">
      <div class="card shadow-lg">
        <div
          class="card-body d-flex flex-column flex-lg-row justify-content-center align-items-center"
        >
          <i class="fas fa-car-alt fa-4x icon"></i>
          <div
            class="d-flex flex-column align-items-center align-items-lg-start ms-0 ms-lg-2 justify-content-center"
          >
            <h5 class="card-title fw-bold">Code 8</h5>
            <p class="card-text mt-n1">Car</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col mb-3">
      <div class="card shadow-lg">
        <div
          class="card-body d-flex flex-column flex-lg-row justify-content-center align-items-center"
        >
          <i class="fas fa-truck-moving fa-4x icon"></i>
          <div
            class="d-flex flex-column align-items-center align-items-lg-start ms-0 ms-lg-2 justify-content-center"
          >
            <h5 class="card-title fw-bold">Code 10</h5>
            <p class="card-text mt-n1">Truck</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col mb-3">
      <div class="card shadow-lg">
        <div
          class="card-body d-flex flex-column flex-lg-row justify-content-center align-items-center"
        >
          <i class="fas fa-book-open fa-4x icon"></i>
          <div
            class="d-flex flex-column align-items-center align-items-lg-start ms-0 ms-lg-2 justify-content-center"
          >
            <h5 class="card-title fw-bold">K53</h5>
            <p class="card-text mt-n1">Learners License</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.cards {
  position: relative;
  z-index: 2;
  margin-top: -3rem !important;
}
</style>
