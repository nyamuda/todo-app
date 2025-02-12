<template>
  <div class="container mx-auto">
    <h1 class="display-6 mb-4">Bookings</h1>

    <div class="d-flex justify-content-end">
      <div class="me-2">
        <Select
          style="width: 12rem"
          placeholder="Filter bookings"
          checkmark
          optionLabel="name"
          optionValue="name"
          v-model="filterBookingsBy"
          :options="statuses"
          @change="filterBookings"
          size="small"
        />
      </div>
      <router-link to="/bookings/add">
        <button type="button" class="btn btn-primary">Add Booking</button>
      </router-link>
    </div>

    <!--Table section start-->
    <div
      class="mt-4"
      v-if="bookings.length > 0 || hasMoreBookings || isGettingBookings"
    >
      <div class="card">
        <!--Skeleton table start-->
        <DataTable :value="rowSkeletons" v-if="isGettingBookings">
          <Column field="user" header="Client Details">
            <template #body>
              <Skeleton></Skeleton>
            </template>
          </Column>

          <!-- <Column field="location" header="Location">
						<template #body>
							<Skeleton></Skeleton>
						</template>
					</Column> -->
          <Column field="scheduledAt" header="Scheduled At">
            <template #body>
              <Skeleton></Skeleton>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body>
              <Skeleton></Skeleton>
            </template>
          </Column>
          <Column field="feedback" header="Feedback">
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
        <!--Table start-->
        <DataTable v-else :value="bookings">
          <Column field="user" header="Client Details">
            <template #body="slotProps">
              <!--Client/User information-->
              <Button
                type="button"
                :label="
                  slotProps.data.user
                    ? slotProps.data.user?.name
                    : slotProps.data.guestUser?.name
                "
                :icon="
                  slotProps.data.user ? 'fas fa-user-check' : 'fas fa-user'
                "
                :badge="slotProps.data.user ? 'Member' : 'Guest'"
                :badgeSeverity="slotProps.data.user ? 'success' : 'warn'"
                variant="outlined"
                severity="secondary"
                class="no-wrap-btn"
                @click="
                  showUserInfo(
                    slotProps.data.user
                      ? slotProps.data.user
                      : slotProps.data.guestUser
                  )
                "
              />
            </template>
          </Column>

          <!-- <Column field="location" header="Location"></Column> -->
          <Column field="scheduledAt" header="Scheduled At">
            <!--Format the date-->
            <template #body="slotProps">
              {{
                dateFormat(
                  slotProps.data.scheduledAt,
                  "dddd, mmmm dS, yyyy, h:MM TT"
                )
              }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <Tag
                :icon="getIcons(slotProps.data.status.name)"
                rounded
                :value="slotProps.data.status.name"
                :severity="getSeverity(slotProps.data.status.name)"
              />
            </template>
          </Column>
          <Column field="feedback" header="Feedback">
            <template #body="slotProps">
              <Rating :value="slotProps.data.feedback?.rating" readonly />
            </template>
          </Column>

          <Column field="id" header="Actions">
            <template #body="slotProps">
              <div class="d-flex justify-content-center align-items-center">
                <!--Spinner if an action is in progress-->
                <ProgressSpinner
                  v-if="
                    isUpdatingBooking && slotProps.data.id == selectedBookingId
                  "
                  style="width: 32px; height: 32px"
                  strokeWidth="8"
                  fill="transparent"
                  animationDuration=".5s"
                  aria-label="Custom ProgressSpinner"
                />
                <!--Button to add feedback-->
                <div v-else>
                  <router-link
                    :to="'bookings/' + slotProps.data.id + '/details'"
                  >
                    <Button
                      label="More details"
                      severity="secondary"
                      size="small"
                      icon="fas fa-info"
                      class="no-wrap-btn"
                  /></router-link>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
        <!--Table end-->
      </div>
      <!--Load more bookings start-->
      <div class="d-grid gap-2 col-md-3 mx-auto mt-3">
        <button
          :class="{
            'btn btn-secondary': !hasMoreBookings,
            'btn btn-primary': hasMoreBookings,
          }"
          @click="loadMoreBookings"
          :disabled="isLoadingMoreBookings || !hasMoreBookings"
        >
          <span
            v-if="isLoadingMoreBookings"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isLoadingMoreBookings ? "Loading..." : "Load more" }}
        </button>
      </div>
      <!--Load more bookings end-->
    </div>

    <!--No Bookings  Start-->
    <div
      v-else
      class="d-flex justify-content-center align-bookings-center flex-column text-center py-5 bg-light rounded-3 shadow-sm mt-5"
    >
      <div class="mb-2">
        <!-- Font Awesome Icon for no bookings -->
        <i class="fas fa-car fa-3x text-primary"></i>
      </div>
      <p class="fs-4 text-muted mb-2">You have no bookings at the moment.</p>
      <p class="text-muted">
        Don't wait! Book a car wash now and let us handle the rest.
      </p>
    </div>

    <!--No Bookings End-->
  </div>

  <!--Dialogs Section Start-->

  <!--User details dialog start-->
  <Dialog
    v-model:visible="showSelectedUser"
    modal
    header="Client Information"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div>
      <p>
        <i class="fas fa-user"></i> <strong>Name:</strong>
        {{ selectedUser.name }}
      </p>
      <p>
        <i class="fas fa-envelope"></i> <strong>Email:</strong>
        {{ selectedUser.email }}
      </p>
      <p>
        <i class="fas fa-phone"></i> <strong>Phone:</strong>
        {{ selectedUser.phone }}
      </p>
      <!-- <p><i class="fas fa-check-circle mr-2"></i> <strong>Total Completed Bookings:</strong> {{ selectedUser.completedBookings }}</p> -->
    </div>
  </Dialog>

  <!--User details dialog end-->

  <!--Dialogs Section End-->
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Tag } from "primevue";
import Button from "primevue/button";

import Dialog from "primevue/dialog";
import Skeleton from "primevue/skeleton";
import Rating from "primevue/rating";
import ProgressSpinner from "primevue/progressspinner";

import { useStore } from "vuex";
import dateFormat from "dateformat";

//table row skeletons
const rowSkeletons = ref(new Array(10));
// Access the store
const store = useStore();

let filterBookingsBy = ref("all");

let bookings = computed(() => store.state.admin.bookings);
let statuses = computed(() => {
  let fetchedStatuses = store.state.statuses.statuses;
  //since statuses are to filter bookings
  //include the "all" value when filtering bookings
  //to show all bookings
  return fetchedStatuses.push("all");
});
let isGettingBookings = computed(() => store.state.admin.isGettingBookings);
let isUpdatingBooking = computed(() => store.state.admin.isUpdatingBooking);
//the selected booking ID for canceling or any other action
let selectedBookingId = ref(null);
//selected user to see more details about the user
let selectedUser = ref(null);
let showSelectedUser = ref(false);

onMounted(async () => {
  //get all bookings
  store.dispatch("admin/getBookings");

  //get all booking statuses
  store.dispatch("statuses/getStatuses");
});

let filterBookings = () => {
  const filterValue = filterBookingsBy.value;
  store.dispatch("admin/getBookings", filterValue);
};
//load more bookings depending on whether
//the current list is for all, completed or uncompleted bookings
let loadMoreBookings = () => {
  store.dispatch("admin/loadMoreBookings", filterBookingsBy.value);
};
//is an booking being marked as complete
// let isCompletingBooking = computed(
//   () => store.state.bookings.isCompletingBooking
// );

//are there more bookings currently being loaded
let isLoadingMoreBookings = computed(
  () => store.state.admin.isLoadingMoreBookings
);

//are there still more bookings that can be loaded
let hasMoreBookings = computed(
  () => store.state.admin.bookingsPageInfo.hasMore
);

//Severity of the pills
const getSeverity = (status) => {
  let value = status ? status.toLowerCase() : "";
  switch (value) {
    case "en route":
      return "secondary";
    case "completed":
      return "success"; // Green
    case "confirmed":
      return "info"; // Blue
    case "pending":
      return "warn"; // Yellow
    case "cancelled":
      return "danger"; // Red
    default:
      return "secondary";
  }
};

//Icons for pills
const getIcons = (status) => {
  let value = status ? status.toLowerCase() : "";
  switch (value) {
    case "en route":
      return "fas fa-road";
    case "completed":
      return "fas fa-check-circle";
    case "confirmed":
      return "fas fa-calendar-check";
    case "pending":
      return "fas fa-hourglass-half";
    case "cancelled":
      return "fas fa-times-circle";
    default:
      return "";
  }
};

let showUserInfo = (user) => {
  selectedUser.value = user;
  showSelectedUser.value = true;
};
</script>

<style>
.booking-list {
  animation: fadeIn 0.5s ease-in-out;
}
.modal {
  animation: fadeIn 0.3s ease-in-out;
}
.no-wrap-btn {
  white-space: nowrap;
}
/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
