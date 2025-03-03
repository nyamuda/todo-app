<template>
  <div>
    <div class="container">
      <!-- Service Name -->
      <Skeleton width="40%" height="2.5rem" class="mb-2" />

      <!-- Rating Skeleton -->
      <div class="d-flex align-items-center mb-2">
        <Skeleton width="20%" height="1rem" class="me-2" />
        <Skeleton width="5%" height="1rem" />
      </div>

      <!-- Service Overview -->
      <Skeleton width="100%" height="2rem" class="mb-2" />

      <!-- Image Skeleton -->
      <Skeleton width="100%" height="250px" class="mb-4 service-image" />

      <div class="row">
        <!-- Description Skeleton -->
        <div class="col-md-8">
          <Skeleton width="30%" height="2rem" class="mb-2" />
          <Skeleton width="100%" height="6rem" />
        </div>

        <!-- Price & Duration Skeleton -->
        <div class="col-md-4 bg-light p-3" style="height: fit-content">
          <Skeleton width="50%" height="2rem" class="mb-3" />
          <div class="bg-white p-3 d-flex align-items-center gap-2 mb-3">
            <Skeleton width="20px" height="20px" />
            <div>
              <Skeleton width="80px" height="1rem" class="mb-1" />
              <Skeleton width="50px" height="1.5rem" />
            </div>
          </div>
          <Skeleton width="100%" height="2.5rem" />
        </div>

        <!-- Features Skeleton -->
        <div class="col-12 mt-5">
          <Skeleton width="20%" height="2rem" class="mb-2" />
          <div class="row col-md-6">
            <div
              class="col-md-6 d-flex align-items-center gap-2 mb-2"
              v-for="i in 4"
              :key="i"
            >
              <Skeleton width="20px" height="20px" />
              <Skeleton width="70%" height="1.5rem" />
            </div>
          </div>
        </div>

        <!-- Ratings & Reviews -->
        <div class="col-12 mt-5">
          <Skeleton width="30%" height="2rem" class="mb-2" />
          <Skeleton width="70%" height="1rem" class="mb-3" />

          <div class="row row-cols-1 row-cols-md-2 g-5">
            <!-- Rating Skeleton -->
            <div class="col-md-4 d-flex flex-column align-items-start">
              <Skeleton width="50px" height="2.5rem" class="mb-1" />
              <Skeleton width="100px" height="1.5rem" class="mb-1" />
              <Skeleton width="70%" height="1rem" class="mb-2" />
              <Divider />
              <Skeleton width="100%" height="100px" />
            </div>

            <!-- Reviews Skeleton -->
            <div class="col-md-8 d-flex flex-column gap-2">
              <div v-for="i in 3" :key="i" class="p-2 border rounded">
                <Skeleton width="50%" height="1.5rem" class="mb-1" />
                <Skeleton width="100%" height="3rem" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import Divider from "primevue/divider";
</script>
