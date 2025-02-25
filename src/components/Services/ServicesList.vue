<template>
  <div>
    <h1 class="display-6 mb-4">Car wash services</h1>
    <div class="d-flex justify-content-end">
      <router-link to="/services/add">
        <button type="button" class="btn btn-primary">Add service</button>
      </router-link>
    </div>

    <div class="row">
      <div v-for="service in services" :key="service.id" class="col-md-6 mb-4">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img
                :src="
                  service.image?.url
                    ? service.image.url
                    : 'https://primefaces.org/cdn/primevue/images/usercard.png'
                "
                alt="Car wash service"
                class="img-fluid rounded-start"
                style="height: 100%; object-fit: cover"
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ service.name }}</h5>
                <p class="card-text">
                  <small class="text-muted">{{
                    formatCurrency(service.price)
                  }}</small>
                </p>
                <p class="card-text">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Inventore sed consequuntur error repudiandae numquam deserunt
                  quisquam repellat libero asperiores earum nam nobis, culpa
                  ratione quam perferendis esse, cupiditate neque quas!
                </p>
                <div class="d-flex gap-4 mt-1">
                  <Button
                    size="small"
                    icon="fas fa-info"
                    label="More details"
                    severity="secondary"
                    outlined
                    fluid
                  />
                  <Button size="small" label="Book" fluid />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <Card class="w-100">
          <template #header>
            <Image
              :src="
                service.image?.url
                  ? service.image.url
                  : 'https://primefaces.org/cdn/primevue/images/usercard.png'
              "
              alt="service header"
              height="250"
            />
          </template>
          <template #title>{{ service.name }}</template>
          <template #subtitle> {{ formatCurrency(service.price) }}</template>
          <template #content>
            <p class="m-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Inventore sed consequuntur error repudiandae numquam deserunt
              quisquam repellat libero asperiores earum nam nobis, culpa ratione
              quam perferendis esse, cupiditate neque quas!
            </p>
          </template>
          <template #footer>
            <div class="d-flex gap-4 mt-1">
              <Button
                size="small"
                label="Cancel"
                severity="secondary"
                outlined
                fluid
              />
              <Button size="small" label="Save" fluid />
            </div>
          </template>
        </Card> -->
      </div>
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
        <Column field="price" header="Price">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="id" header="Actions">
          <template #body="slotProps">
            <Button
              icon="fas fa-pen"
              severity="contrast"
              variant="text"
              rounded
              aria-label="update"
              @click="updateService(slotProps.data.id)"
            />
            <Button
              icon="fas fa-trash"
              severity="danger"
              variant="text"
              rounded
              aria-label="delete"
              @click="deleteService(slotProps.data.id)"
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
// import Image from "primevue/image";

// import Card from "primevue/card";

const confirm = useConfirm();

let store = useStore();
let route = useRouter();

onMounted(async () => {
  store.dispatch("services/getServices");
});

let services = computed(() => store.state.services.services);
let rowSkeletons = new Array(4);
let isGettingServices = computed(() => store.state.services.isGettingServices);

let deleteService = (id) => {
  confirm.require({
    message: "Do you want to delete this service?",
    header: "Delete Car Wash Service",
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
      store.dispatch("services/deleteService", id);
    },
    reject: () => {},
  });
};
let updateService = (id) => {
  route.push(`/admin/services/update/${id}`);
};

//format number into a monetary value
let formatCurrency = (amount, currency = "ZAR", locale = "en-ZA") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};
</script>
