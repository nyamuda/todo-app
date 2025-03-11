<template>
  <div class="row row-cols-1 row-cols-lg-3 m-auto info-cards">
    <div class="col mb-3">
      <div class="card shadow">
        <div class="card-body d-flex justify-content-start align-items-center">
          <i class="fas fa-car fa-4x icon text-primary"></i>
          <div
            class="d-flex flex-column align-items-start ms-3 justify-content-center"
          >
            <h5 class="card-title fw-bold">Basic Wash</h5>
            <p class="card-text mt-n1">Exterior hand wash & dry</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col mb-3">
      <div class="card shadow">
        <div class="card-body d-flex justify-content-start align-items-center">
          <i class="fas fa-broom fa-4x icon text-primary"></i>
          <div
            class="d-flex flex-column align-items-start ms-3 justify-content-center"
          >
            <h5 class="card-title fw-bold">Full Interior Cleaning</h5>
            <p class="card-text mt-n1">Vacuum, dashboard polish & windows</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col mb-3">
      <div class="card shadow">
        <div class="card-body d-flex justify-content-start align-items-center">
          <i class="fas fa-spray-can fa-4x icon text-primary"></i>
          <div
            class="d-flex flex-column align-items-start ms-3 justify-content-center"
          >
            <h5 class="card-title fw-bold">Premium Detail</h5>
            <p class="card-text mt-n1">
              Full wash, wax, and deep interior clean
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.info-cards {
  position: relative;
  z-index: 2;
  margin-top: 5rem !important;
}

@media (min-width: 992px) {
  .info-cards {
    margin-top: -3rem !important;
  }
}
</style>
