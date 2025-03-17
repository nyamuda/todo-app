<template>
  <div class="container mx-auto">
    <TitleSection
      title="Client Bookings"
      subtitle="Review past and upcoming bookings"
      align-items="center"
    />

    <div class="d-flex justify-content-end">
      <div class="me-2">
        <Select
          style="width: 12rem"
          placeholder="Filter bookings"
          checkmark
          v-model="filterBookingsBy"
          :options="statuses"
          @change="filterBookings"
        />
      </div>
      <router-link to="/bookings/add">
        <Button
          label="Create new booking"
          icon="fas fa-plus"
          severity="primary"
        />
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

          <Column field="vehicleType" header="Vehicle Type">
            <template #body>
              <Skeleton></Skeleton>
            </template>
          </Column>
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

          <Column field="vehicleType" header="Vehicle Type"></Column>
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
              <Rating :modelValue="slotProps.data.feedback?.rating" readonly />
            </template>
          </Column>

          <Column field="id" header="Actions">
            <template #body="slotProps">
              <div class="d-flex justify-content-center align-items-center">
                <!--Button to see more details-->
                <router-link :to="'bookings/' + slotProps.data.id + '/details'">
                  <Button
                    label="More details"
                    severity="contrast"
                    variant="outlined"
                    size="small"
                    icon="fas fa-info"
                    class="no-wrap-btn me-2"
                /></router-link>
              </div>
            </template>
          </Column>
        </DataTable>
        <!--Table end-->
      </div>
      <!--Load more bookings start-->
      <div class="d-grid gap-2 col-md-3 mx-auto mt-3">
        <LoadMoreButton
          :onClick="loadMoreBookings"
          :has-more="hasMoreBookings"
          :is-loading="isLoadingMoreBookings"
          label="Load more bookings"
        />
      </div>
      <!--Load more bookings end-->
    </div>

    <!--No Bookings  Start-->
    <EmptyList
      v-else
      :title="noBookingsMessage.title"
      :message="noBookingsMessage.message"
    />
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
import EmptyList from "../Common/Elements/EmptyList.vue";
import Dialog from "primevue/dialog";
import Skeleton from "primevue/skeleton";
import Rating from "primevue/rating";
import LoadMoreButton from "../Common/Elements/LoadMoreButton.vue";
import { useStore } from "vuex";
import dateFormat from "dateformat";
import { useToast } from "primevue/usetoast";
import TitleSection from "../Common/Elements/TitleSection.vue";
import { getBookingFilterNoItemsMessage } from "@/helpers/helpers";
//table row skeletons
const rowSkeletons = ref(new Array(10));

const store = useStore();
const toast = useToast();

let filterBookingsBy = ref("all");
//no bookings custom message based on the filter
let noBookingsMessage = computed(() =>
  getBookingFilterNoItemsMessage(filterBookingsBy.value)
);

let bookings = computed(() => store.state.admin.bookings);

//since statuses are used to filter bookings,
//fetch all the status names and include the "All" value as well
//to allow the user to view all bookings
let statuses = computed(() => {
  let statusNames = ["All"];
  //get the status names and push them into the statusNames array
  store.state.statuses.statuses.forEach((status) => {
    let name = status.name;
    //capitalize the first letter of the name
    statusNames.push(`${name[0].toUpperCase()}${name.slice(1)}`);
  });
  return statusNames;
});

let isGettingBookings = computed(() => store.state.admin.isGettingBookings);

//selected user to see more details about the user
let selectedUser = ref(null);
let showSelectedUser = ref(false);

onMounted(async () => {
  //get all bookings
  store
    .dispatch("admin/getBookings")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Bookings Error",
        detail: message,
        life: 5000,
      });
    });

  //get all booking statuses
  store
    .dispatch("statuses/getStatuses")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 5000,
      });
    });
});

let filterBookings = () => {
  const filterValue = filterBookingsBy.value.toLowerCase();
  store.dispatch("admin/getBookings", filterValue);
};
//load more bookings depending on whether
//the current list is for all, completed or uncompleted bookings
let loadMoreBookings = () => {
  store
    .dispatch("admin/loadMoreBookings", filterBookingsBy.value)
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Load Failed",
        detail: message,
        life: 5000,
      });
    });
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
