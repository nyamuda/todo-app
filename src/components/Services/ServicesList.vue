<template>
  <div>
    <h1 class="display-6 mb-4">Car wash services</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/services/add">
        <button type="button" class="btn btn-primary">Add service</button>
      </router-link>
    </div>
    <div class="card" v-if="services.length > 0 || isGettingServices">
      <!--Skeleton table start-->
      <DataTable :value="rowSkeletons" v-if="isGettingBookings">
        <Column field="name" header="Name">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column field="price" header="Actions">
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
        <Column field="actions" header="Actions"></Column>
      </DataTable>
      <!--Table End-->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

let store = useStore();
let services = computed(() => store.state.services.services);
let rowSkeletons = new Array(4);
let isGettingServices = computed(() => store.state.services.isGettingServices);
</script>
