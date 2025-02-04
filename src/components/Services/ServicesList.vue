<template>
  <div>
    <h1 class="display-6 mb-4">Car wash services</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/services/add">
        <button type="button" class="btn btn-primary">Add service</button>
      </router-link>
    </div>
    <div class="card mt-4" v-if="services.length > 0 || isGettingServices">
      <!--Skeleton table start-->
      <DataTable :value="rowSkeletons" v-if="isGettingServices">
        <Column field="name" header="Name">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column field="price" header="Price">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>

        <Column field="actions" header="Actions">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
      </DataTable>
      <!--Skeleton table end-->
      <!--Table Start-->
      <DataTable :value="services" v-else>
        <Column field="name" header="Name"></Column>
        <Column field="price" header="Price"></Column>
        <Column field="id" header="Actions">
          <template #body="slotProps">
            <Button
              icon="fas fa-trash"
              severity="contrast"
              variant="text"
              rounded
              aria-label="delete"
              @click="deleteService(slotProps.data.id)"
            />
            <Button
              icon="fas fa-pen"
              severity="contrast"
              variant="text"
              rounded
              aria-label="delete"
              @click="updateService(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
      <!--Table End-->
    </div>
    <!--No Services Start-->
    <div
      v-else
      class="d-flex justify-content-center align-bookings-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
    >
      <div class="mb-2">
        <!-- Font Awesome Icon for no bookings -->
        <i class="fas fa-0 fa-3x text-primary"></i>
      </div>
      <p class="fs-4 text-muted mb-2">
        There are no available car wash services at the moment.
      </p>
      <p class="text-muted">
        Add a service and let clients start booking car wash sessions.
      </p>
    </div>

    <!--No Service End-->
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { Skeleton } from "primevue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue";
import { useRouter } from "vue-router";

let store = useStore();
let route = useRouter();

onMounted(async () => {
  store.dispatch("services/getServices");
});

let services = computed(() => store.state.services.services);
let rowSkeletons = new Array(4);
let isGettingServices = computed(() => store.state.services.isGettingServices);

let deleteService = (id) => {
  store.dispatch("services/deleteService", id);
};
let updateService = (id) => {
  route.push(`services/update/${id}`);
};
</script>
