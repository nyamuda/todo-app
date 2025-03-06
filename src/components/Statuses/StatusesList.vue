<template>
  <div>
    <h1 class="display-6 mb-4">Booking statuses</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/statuses/add">
        <Button label="Add new status" icon="fas fa-plus" size="small" />
      </router-link>
    </div>
    <div class="card mt-4" v-if="statuses.length > 0 || isGettingStatuses">
      <!--Skeleton table start-->
      <DataTable :value="rowSkeletons" v-if="isGettingStatuses">
        <Column field="name" header="Name">
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
      <DataTable :value="statuses" v-else>
        <Column field="name" header="Name"></Column>

        <Column field="id" header="Actions">
          <template #body="slotProps">
            <Button
              icon="fas fa-pen"
              severity="contrast"
              variant="text"
              rounded
              label="Update status"
              aria-label="update"
              @click="updateStatus(slotProps.data.id)"
            />
            <Button
              icon="fas fa-trash"
              severity="danger"
              variant="text"
              label="Delete status"
              rounded
              aria-label="delete"
              @click="deleteStatus(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
      <!--Table End-->
    </div>
    <!--No Statuses Start-->
    <div
      v-else
      class="d-flex justify-content-center align-bookings-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
    >
      <div class="mb-2">
        <!-- Font Awesome Icon for no bookings -->
        <i class="fas fa-0 fa-3x text-primary"></i>
      </div>
      <p class="fs-4 text-muted mb-2">
        There are no available statuses at the moment.
      </p>
      <p class="text-muted">
        Add a status and let clients start booking car wash sessions.
      </p>
    </div>
    <!--No Status End-->
    <!--Delete confirmation dialog start-->
    <ConfirmDialog></ConfirmDialog>
    <!--Delete confirmation dialog end-->
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { Skeleton } from "primevue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const confirm = useConfirm();

let store = useStore();
let route = useRouter();

onMounted(async () => {
  store.dispatch("statuses/getStatuses");
});

let statuses = computed(() => store.state.statuses.statuses);
let rowSkeletons = new Array(4);
let isGettingStatuses = computed(() => store.state.statuses.isGettingStatuses);

let deleteStatus = (id) => {
  confirm.require({
    message: "Do you want to delete this status?",
    header: "Delete Status",
    icon: "fas fa-circle-info",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      store.dispatch("statuses/deleteStatus", id);
    },
    reject: () => {},
  });
};
let updateStatus = (id) => {
  route.push(`statuses/update/${id}`);
};
</script>
