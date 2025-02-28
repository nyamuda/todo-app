<template>
  <!--Service card skeleton start-->
  <div class="card shadow-sm h-100">
    <div class="row g-0">
      <!-- Image Skeleton -->
      <div class="col-md-4">
        <Skeleton class="w-100 h-100 rounded-start" style="height: 180px" />
      </div>

      <!-- Content Section -->
      <div class="col-md-8">
        <div class="card-body d-flex flex-column">
          <!-- Title & Badge -->
          <div
            class="d-flex justify-content-between align-items-center flex-wrap-reverse"
          >
            <Skeleton width="60%" height="1.5rem" class="mb-2" />
            <Skeleton width="20%" height="1.5rem" class="mb-2" />
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end gap-2">
            <Skeleton shape="circle" size="2rem" />
            <Skeleton shape="circle" size="2rem" />
          </div>

          <!-- Star Rating & Review Count -->
          <div class="text-muted mb-1 d-flex align-items-center">
            <Skeleton width="40%" height="1rem" class="me-2" />
            <Skeleton width="10%" height="1rem" />
          </div>

          <!-- Price & Duration -->
          <Skeleton width="30%" height="1rem" class="mb-1" />
          <Skeleton width="50%" height="1rem" class="mb-2" />

          <!-- Features (Mobile Only) -->
          <ul class="list-unstyled mb-2 row d-md-none">
            <li class="col-6" v-for="index in 4" :key="index">
              <Skeleton width="80px" height="1rem" />
            </li>
          </ul>

          <!-- Recent Feedback (Mobile Only) -->
          <div class="d-md-none bg-light p-3 rounded mb-3">
            <Skeleton width="100%" height="2rem" />
          </div>

          <!-- Buttons -->
          <div class="mt-auto d-flex gap-3">
            <Skeleton height="2rem" fluid />
            <Skeleton height="2rem" fluid />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Service card skeleton end-->
</template>

<script setup>
import { Skeleton } from "primevue";
</script>
