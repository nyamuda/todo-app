<template>
  <div>
    <h1 class="display-6 mb-4">Car wash services</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/bookings/add">
        <button type="button" class="btn btn-primary">Add service</button>
      </router-link>
    </div>
    <div class="card">
      <DataTable :value="serviceTypes">
        <Column field="name" header="Name"></Column>
        <Column field="price" header="Price"></Column>
        <Column field="actions" header="Actions"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

let store = useStore();
let serviceTypes = computed(() => store.state.bookings.serviceTypes);
</script>
