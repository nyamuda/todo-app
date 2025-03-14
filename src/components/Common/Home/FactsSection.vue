<template>
  <div class="row mt-5 bg-secondary p-5 g-3 w-100">
    <div class="col-md-6 col-lg-3">
      <div class="card text-light bg-secondary">
        <div class="card-body">
          <div
            class="card-text d-flex flex-column align-items-center text-center"
          >
            <span><i class="fas fa-users fa-3x"></i></span>
            <span class="display-4 fw-bold mt-2 mb-1 text-primary">{{
              companyFacts.totalHappyCustomers
            }}</span>
            <span class="fs-5 fw-bold">Happy customers</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="card text-light bg-secondary">
        <div class="card-body">
          <div
            class="card-text d-flex flex-column align-items-center text-center"
          >
            <span><i class="fas fa-car fa-3x"></i></span>
            <span class="display-4 fw-bold mt-2 mb-1 text-primary">{{
              companyFacts.totalCompletedBookings
            }}</span>
            <span class="fs-5 fw-bold">Cars Washed</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="card text-light bg-secondary">
        <div class="card-body">
          <div
            class="card-text d-flex flex-column align-items-center text-center"
          >
            <span><i class="fas fa-award fa-3x"></i></span>
            <span class="display-4 fw-bold mt-2 mb-1 text-primary">{{
              companyFacts.totalYearsInService
            }}</span>
            <span class="fs-5 fw-bold">Years of Service</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="card text-light bg-secondary">
        <div class="card-body">
          <div
            class="card-text d-flex flex-column align-items-center text-center"
          >
            <span><i class="fas fa-star fa-3x"></i></span>
            <span class="display-4 fw-bold mt-2 mb-1 text-primary">{{
              companyFacts.overallRating
            }}</span>
            <span class="fs-5 fw-bold">Satisfaction Rating</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

let store = useStore();

let companyFacts = computed(() => store.state.company.companyFacts);
</script>

<style scoped>
.card {
  border-width: 1px !important;
  border-style: solid !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
