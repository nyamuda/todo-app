<template>
  <!--Service card skeleton start-->
  <div class="card shadow-sm h-100">
    <div class="row g-0">
      <!-- Image Skeleton -->
      <div class="col-md-4">
        <Skeleton
          class="w-100 h-100 rounded-start d-none d-md-block"
          style="height: 180px"
        />
        <img
          src="https://placehold.co/600x400?text=Fetching+data..."
          alt="Placeholder image"
          class="img-fluid rounded-start d-md-none"
          style="height: 100%; object-fit: cover"
        />
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

          <!-- Star Rating & Review Count -->
          <div class="text-muted mb-1 d-flex align-items-center">
            <Skeleton width="40%" height="1rem" class="me-2" />
            <Skeleton width="10%" height="1rem" />
          </div>

          <!-- Price & Duration -->
          <div class="mb-3 d-flex flex-column gap-2 mt-2">
            <Skeleton width="30%" height="1rem" />
            <Skeleton width="50%" height="1rem" />
          </div>
          <!-- Overview -->
          <div class="mb-3 d-flex flex-column gap-2 mt-2">
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
          </div>
          <!-- Features (Mobile Only) -->
          <ul class="list-unstyled mb-2 row d-md-none">
            <li class="col-6 my-2" v-for="index in 4" :key="index">
              <Skeleton width="100%" height="1rem" />
            </li>
          </ul>

          <!-- Recent Feedback (Mobile Only) -->
          <div class="d-md-none mb-3">
            <Skeleton width="100%" height="6rem" />
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
