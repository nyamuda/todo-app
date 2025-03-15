<template>
  <!-- Company information available -->
  <div v-if="company" class="card p-4 shadow-sm border-0">
    <div class="d-flex justify-content-end">
      <router-link to="/company/update">
        <Button label="Create company infor" icon="fas fa-plus" size="small" />
      </router-link>
      <router-link to="/company/add">
        <Button label="Create company infor" icon="fas fa-plus" size="small" />
      </router-link>
    </div>
    <h5 class="card-title text-primary mb-3">
      <i class="fas fa-building"></i> Company information
    </h5>
    <ul class="list-unstyled mb-0">
      <li class="mb-2">
        <i class="fas fa-map-marker-alt text-danger"></i>
        <strong>Address:</strong> {{ company.name }}
      </li>
      <li class="mb-2">
        <i class="fas fa-phone-alt text-success"></i>
        <strong>Phone:</strong> {{ company.phone }}
      </li>
      <li class="mb-2">
        <i class="fas fa-envelope text-warning"></i>
        <strong>Email:</strong>{{ company.email }}
      </li>
      <li class="mb-2">
        <i class="fas fa-calendar-alt text-info"></i>
        <strong>Founded:</strong> {{ company.yearFounded }}
      </li>
    </ul>
  </div>
  <!-- Company information not available -->
  <div v-else>
    <div class="text-end">
      <router-link to="/company/add">
        <Button
          label="Create company information"
          icon="fas fa-plus"
          size="small"
          severity="primary"
        />
      </router-link>
    </div>
    <EmptyList
      title="No information available"
      message="Company information is missing! Please add company details."
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import Button from "primevue/button";
import EmptyList from "../Common/Elements/EmptyList.vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
let store = useStore();

onMounted(async () => {
  //get company information to display
  await store
    .dispatch("company/getCompanies")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Fetch Failed",
        detail: message,
        life: 10000,
      });
    });
});

//
let company = computed(() => {
  //get the company information from an array
  let companies = store.state.company;
  if (companies.length > 0) {
    return companies[0];
  } else {
    return null;
  }
});
</script>
