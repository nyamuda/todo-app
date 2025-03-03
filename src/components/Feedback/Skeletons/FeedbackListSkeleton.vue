<template>
  <div class="row row-cols-1 row-cols-md-2 g-5">
    <!-- Rating Skeleton -->
    <div class="col-md-4 d-flex flex-column align-items-start">
      <Skeleton width="20%" height="1.9rem" class="mb-1" />
      <Skeleton width="50%" height="1rem" class="mb-1" />
      <Skeleton width="70%" height="1rem" class="mb-2" />
      <Divider />
      <Skeleton width="100%" height="100px" />
    </div>

    <!-- Reviews Skeleton -->
    <div class="col-md-8 d-flex flex-column gap-2">
      <div v-for="i in 3" :key="i" class="p-2">
        <Skeleton width="50%" height="1rem" class="mb-1" />
        <Skeleton width="35%" height="1rem" class="mb-1" />
        <div class="mt-3">
          <Skeleton width="100%" height="3.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Skeleton from "primevue/skeleton";
import Divider from "primevue/divider";
</script>
