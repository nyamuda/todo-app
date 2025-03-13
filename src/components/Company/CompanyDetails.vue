<template>
 <!-- Company information available -->
  <div v-if="company" class="card p-4 shadow-sm border-0">
    <h5 class="card-title text-primary mb-3">
      <i class="fas fa-building"></i> Our Company
    </h5>
    <ul class="list-unstyled mb-0">
      <li class="mb-2">
        <i class="fas fa-map-marker-alt text-danger"></i>
        <strong>Address:</strong> 123 Main Street, City, Country
      </li>
      <li class="mb-2">
        <i class="fas fa-phone-alt text-success"></i>
        <strong>Phone:</strong> +1 (555) 123-4567
      </li>
      <li class="mb-2">
        <i class="fas fa-envelope text-warning"></i>
        <strong>Email:</strong> info@company.com
      </li>
      <li class="mb-2">
        <i class="fas fa-calendar-alt text-info"></i>
        <strong>Founded:</strong> 2005
      </li>
    </ul>
  </div>
  <!-- Company information not available -->
  <div class="card p-4 text-center border-0 bg-warning bg-opacity-25 shadow-sm">
    <h5 class="text-warning">
      <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
    </h5>
    <p class="mb-3 text-dark fw-bold">
      Company information is missing! Please add company details.
    </p>
    <a href="/admin/company/create" class="btn btn-warning fw-bold">
      <i class="fas fa-plus-circle me-2"></i> Create Company Info
    </a>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

let store = useStore();

onMounted(async () => {
  //get company information to display
  await store.dispatch("company/getCompanies");
});

//
let company = computed(() => {
  //get the company information from an array
  let companies = store.state.companies;
  if (companies.length > 0) {
    return companies[0];
  } else {
    return null;
  }
});
</script>
