<template>
  <div class="container mx-auto">
    <TitleSection
      title="All Bookings"
      subtitle="Review past and upcoming bookings"
      align-items="center"
    />

    <div class="d-flex justify-content-end mt-3">
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
          <Column field="vehicleType" header="Vehicle Type">
            <template #body>
              <Skeleton></Skeleton>
            </template>
          </Column>
          <Column field="serviceType" header="Service Type">
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

          <Column field="actions" header="Actions">
            <template #body>
              <Skeleton></Skeleton>
            </template>
          </Column>
        </DataTable>
        <!--Skeleton table end-->
        <!--Table start-->
        <DataTable v-else :value="bookings">
          <Column field="vehicleType" header="Vehicle Type"></Column>
          <Column field="serviceType" header="Service Type">
            <template #body="slotProps">
              <!--Service type name and price-->
              <span>{{ slotProps.data.serviceType.name }}</span
              ><span>
                ({{ formatCurrency(slotProps.data.serviceType.price) }})</span
              >
            </template>
          </Column>

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

          <Column field="id" header="Actions">
            <template #body="slotProps">
              <div class="d-flex justify-content-start align-items-center">
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

                <!--Button to add feedback-->
                <SendFeedback
                  v-if="
                    doesBookingRequireFeedback(
                      slotProps.data.status.name,
                      slotProps.data?.feedback?.rating
                    )
                  "
                  :booking-id="slotProps.data.id"
                />

                <!--Cancel Booking Button-->
                <CancelBooking
                  v-if="slotProps.data.status.name != 'cancelled'"
                  :booking-id="slotProps.data.id"
                  :callMethodAfterSuccess="getAllBookings"
                />
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
          end-label="That’s all your bookings for now"
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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Tag } from "primevue";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { useStore } from "vuex";
import dateFormat from "dateformat";
import { useToast } from "primevue/usetoast";
import LoadMoreButton from "../Common/Elements/LoadMoreButton.vue";
import EmptyList from "../Common/Elements/EmptyList.vue";
import TitleSection from "../Common/Elements/TitleSection.vue";
import SendFeedback from "./SendBookingFeedback.vue";
import CancelBooking from "./CancelBooking.vue";
import { formatCurrency } from "@/helpers/helpers";
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

let bookings = computed(() => store.state.bookings.bookings);
let isGettingBookings = computed(() => store.state.bookings.isGettingBookings);

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

onMounted(() => {
  //get all bookings
  getAllBookings();

  //get all statuses
  getBookingStatuses();
});
//get all bookings
let getAllBookings = () => {
  store
    .dispatch("bookings/getBookings")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Bookings Error",
        detail: message,
        life: 5000,
      });
    });
};
//get all booking statuses
let getBookingStatuses = () => {
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
};
//Filter bookings by status
let filterBookings = () => {
  const filterValue = filterBookingsBy.value.toLowerCase();
  store.dispatch("bookings/getBookings", filterValue);
};
//load more bookings depending on whether
//the current list is for all, completed or uncompleted bookings
let loadMoreBookings = () => {
  store
    .dispatch("bookings/loadMoreBookings", filterBookingsBy.value)
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

//are there more bookings currently being loaded
let isLoadingMoreBookings = computed(
  () => store.state.bookings.isLoadingMoreBookings
);

//are there still more bookings that can be loaded
let hasMoreBookings = computed(
  () => store.state.bookings.bookingsPageInfo.hasMore
);

//Severity of the pills
const getSeverity = (status) => {
  let value = status ? status.toLowerCase() : "";
  switch (value) {
    case "completed":
      return "success";
    case "confirmed":
      return "info";
    case "pending":
      return "warn";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

//Icons for pills
const getIcons = (status) => {
  let value = status ? status.toLowerCase() : "";
  switch (value) {
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
//Does the booking require feedback or not
let doesBookingRequireFeedback = (status, rating) => {
  //if the rating is null
  //then the booking requires feedback
  if (!rating && status.toLowerCase() == "completed") {
    return true;
  }
  return false;
};
</script>

<style>
.booking-list {
  animation: fadeIn 0.5s ease-in-out;
}
.modal {
  animation: fadeIn 0.3s ease-in-out;
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
