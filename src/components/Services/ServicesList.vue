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
        <div
          class="card shadow-sm h-100"
          @mouseenter="displayPopover($event, service)"
          @mouseleave="hidePopover(service.id)"
        >
          <div class="row g-0">
            <!-- Image Section -->
            <div class="col-md-4">
              <img
                :src="
                  service.image?.url ||
                  'https://primefaces.org/cdn/primevue/images/usercard.png'
                "
                alt="Car wash service"
                class="img-fluid rounded-start"
                style="height: 100%; object-fit: cover"
              />
            </div>

            <!-- Content Section -->
            <div class="col-md-8">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">{{ service.name }}</h5>

                <!-- Star Rating & Review Count -->
                <p class="text-muted mb-1">
                  <span class="text-warning">
                    <i class="fas fa-star"></i>
                  </span>
                  ({{ service.feedback.length }} reviews)
                </p>

                <!-- Price & Duration -->
                <p class="card-text text-muted mb-1">
                  {{ formatCurrency(service.price) }}
                </p>
                <p class="card-text text-muted mb-2">
                  <i class="fas fa-clock"></i> Duration:
                  {{ service.duration }} minutes
                </p>

                <!-- Features (Max 4) -->
                <ul class="list-unstyled mb-2">
                  <li
                    v-for="(feature, index) in service.features.slice(0, 4)"
                    :key="index"
                  >
                    <i class="fas fa-check-circle text-success"></i>
                    {{ feature.name }}
                  </li>
                </ul>

                <!-- Recent Customer Quote (Mobile Only) -->
                <p class="text-muted small d-lg-none">
                  <i class="fas fa-quote-left"></i>
                  {{ service.feedback[0]?.content }}...
                </p>

                <!-- Buttons -->
                <div class="mt-auto d-flex gap-3">
                  <Button
                    size="small"
                    icon="fas fa-info-circle"
                    label="Details"
                    severity="secondary"
                    outlined
                    fluid
                  />
                  <Button size="small" label="Book Now" fluid />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popover for Full Overview & Customer Quote -->
      <Popover ref="op">
        <div v-if="selectedService" class="p-1">
          <p class="h3">{{ selectedService.name }}</p>
          <p class="text-muted">{{ selectedService.overview }}</p>
          <!-- Features (Max 4) -->
          <ul class="list-unstyled mb-2">
            <li
              v-for="(feature, index) in selectedService?.features?.slice(0, 4)"
              :key="index"
            >
              <i class="fas fa-check"></i>
              {{ feature.name }}
            </li>
          </ul>
          <Divider />
          <p class="fst-italic">
            <i class="fas fa-quote-left"></i>
            {{ selectedService.feedback[0]?.content }}
          </p>
          <p class="fw-bold mb-0">- Tatenda</p>
        </div>
      </Popover>
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
import { computed, onMounted, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { Skeleton } from "primevue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import Popover from "primevue/popover";
import Divider from "primevue/divider";

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
//Service information to show on hover with a popover
const selectedService = ref();
//The ref of the the popover
const op = ref();

const displayPopover = async (event, service) => {
  op.value?.hide();

  if (selectedService.value?.id === service.id) {
    selectedService.value = null;
  } else {
    selectedService.value = service;

    await nextTick(); // Ensure DOM updates before showing popover
    op.value?.show(event);
  }
};

const hidePopover = () => {
  op.value?.hide();
  selectedService.value = null; // Reset selection to allow re-triggering
};

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
