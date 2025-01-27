<template>
  <div class="container mx-auto">
    <h1 class="display-6 mb-4">Bookings</h1>

    <div class="d-flex justify-content-end">
      <div class="me-2">
        <Select
          style="width: 12rem"
          placeholder="Filter bookings"
          checkmark
          v-model="filterBookingsBy"
          :options="filters"
          @change="filterBookings"
          size="small"
        />
      </div>
      <router-link to="/bookings/add">
        <button type="button" class="btn btn-primary">Add Booking</button>
      </router-link>
    </div>

    <!--Bookings Table Start-->
    <div v-if="bookings.length > 0 || hasMoreBookings">
      <div class="table-responsive">
        <table class="table table-striped mt-3 placeholder-glow">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Show placeholders while loading -->
            <template v-if="isGettingBookings">
              <tr v-for="n in 5" :key="n">
                <td><span class="placeholder col-6"></span></td>
                <td><span class="placeholder col-8"></span></td>
                <td><span class="placeholder col-4"></span></td>
                <td><span class="placeholder col-3"></span></td>
                <td><span class="placeholder col-6"></span></td>
              </tr>
            </template>
            <!-- Show bookings once loaded -->
            <template v-else>
              <tr
                class="booking-list"
                v-for="(booking, index) in bookings"
                :key="index"
              >
                <td>{{ booking.title }}</td>
                <td>{{ booking.description }}</td>
                <td>{{ booking.dueDate }}</td>
                <td>
                  <span
                    v-bind:class="{
                      'text-success': booking.isCompleted,
                      'text-danger': !booking.isCompleted,
                    }"
                  >
                    {{ booking.isCompleted ? "Completed" : "Pending" }}
                  </span>
                </td>
                <td>
                  <div
                    class="d-flex justify-content-start align-bookings-center flex-nowrap"
                  >
                    <button
                      v-if="
                        isCompletingBooking &&
                        pendingUpdateBookingId == booking.id
                      "
                      class="btn btn-success btn-sm me-2"
                      disabled
                    >
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Please wait...
                    </button>
                    <button
                      v-else
                      :disabled="booking.isCompleted"
                      class="btn btn-success btn-sm me-2 text-nowrap"
                      @click="markCompleted(booking.id)"
                    >
                      Mark Completed
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="confirmDelete(booking.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!--Load more bookings start-->
      <div class="d-grid gap-2 col-md-3 mx-auto mt-3 mt-md-2">
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
  <!--Bookings Table End-->

  <!--Cancel Dialog Start-->
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="d-flex flex-column align-items-start p-4 bg-light rounded">
        <span class="fw-bold fs-3 d-block mb-2 mt-2">{{ message.header }}</span>
        <p class="mb-3">{{ message.message }}</p>
        <div class="d-flex flex-column align-items-start">
          <FloatLabel variant="in">
            <Textarea
              id="cancelReason"
              :invalid="v$.cancelReason.$error"
              v-model="v$.cancelReason.$model"
              rows="3"
              cols="40"
            />
            <label for="cancelReason">Please provide a reason</label>
          </FloatLabel>

          <Message
            v-if="v$.cancelReason.$error"
            severity="error"
            size="small"
            variant="simple"
            ><div v-for="error of v$.cancelReason.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div></Message
          >
        </div>
        <div class="d-flex align-items-center justify-content-end mt-2 w-100">
          <Button
            class="me-3"
            label="Never mind"
            variant="outlined"
            severity="contrast"
            size="small"
            @click="rejectCallback"
          ></Button>
          <Button
            :disabled="v$.cancelReason.$error"
            label="Yes, cancel booking"
            severity="warn"
            size="small"
            @click="acceptCallback"
          ></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <!--Cancel Dialog End-->
  <!--Feedback Dialog Start-->
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="d-flex flex-column align-items-start p-4 bg-light rounded">
        <span class="fw-bold fs-3 d-block mb-2 mt-2">{{ message.header }}</span>
        <p class="mb-3">{{ message.message }}</p>
        <Rating class="mb-2" v-model="value" />
        <div class="d-flex flex-column align-items-start">
          <FloatLabel variant="in">
            <Textarea
              id="bookingFeedback"
              v-model="bookingFeedback.content"
              rows="3"
              cols="50"
            />
            <label for="bookingFeedback">Share your thoughts</label>
          </FloatLabel>
        </div>
        <div class="d-flex align-items-center justify-content-end mt-2 w-100">
          <Button
            class="me-3"
            label="Cancel"
            variant="outlined"
            severity="contrast"
            size="small"
            @click="rejectCallback"
          ></Button>
          <Button
            label="Send feedback"
            severity="primary"
            size="small"
            @click="acceptCallback"
          ></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <!--Feedback Dialog End-->
  <div class="card container">
    <DataTable :value="bookings">
      <Column field="vehicleType" header="Vehicle Type"></Column>
      <Column field="serviceType" header="Service Type"></Column>
      <Column field="location" header="Location"></Column>
      <Column field="scheduledAt" header="Scheduled At"></Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag
            :icon="getIcons(slotProps.data.status)"
            rounded
            :value="slotProps.data.status"
            :severity="getSeverity(slotProps.data.status)"
          />
        </template>
      </Column>
      <Column field="additionalNotes" header="Additional Notes"></Column>
      <Column field="id" header="Actions">
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.status.toLowerCase() == 'completed'"
            size="small"
            label="Feedback"
            icon="fas fa-star"
            severity="info"
            aria-label="Rate service"
            @click="sendFeedback(slotProps.data.id)"
          />
          <Button
            v-else
            :disabled="slotProps.data.status.toLowerCase() == 'cancelled'"
            size="small"
            label="Cancel"
            icon="fa-solid fa-xmark"
            severity="danger"
            aria-label="Cancel"
            @click="cancelBooking(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { Tag } from "primevue";
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import Textarea from "primevue/textarea";
import { Message } from "primevue";
import Rating from "primevue/rating";
import { FloatLabel } from "primevue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useStore } from "vuex";

// Access the store
const store = useStore();
let filterBookingsBy = ref("all");
let filters = ref(["All", "Completed", "Cancelled", "Pending"]);
const cancelDialog = useConfirm();
const feedbackDialog = useConfirm();
let bookings = computed(() => store.getters["bookings/formatAndGetBookings"]);
let isGettingBookings = computed(() => store.state.bookings.isGettingBookings);
let bookingFeedback = ref({
  content: "",
  rating: "",
});

onMounted(async () => {
  //get all bookings
  store.dispatch("bookings/getBookings");
});

//Form validation with Vuelidate start
//cancel reason data
const reasonToCancelForm = ref({
  cancelReason: "",
});
const rules = {
  cancelReason: { required, minLengthValue: minLength(5) },
};
const v$ = useVuelidate(rules, reasonToCancelForm.value);

//cancel a booking
let cancelBooking = (id) => {
  //show text area errors
  v$.value.$touch();
  //show dialog
  cancelDialog.require({
    group: "headless",
    message: "Are you sure you want to cancel this booking?",
    header: "Cancel Booking",
    icon: "fas fa-circle-exclamation",
    accept: () => {
      console.log(`Delete booking with ${id} confirmed`);
    },
    reject: () => {
      console.log(`Delete booking with ${id} cancelled`);
    },
  });
};
//Form validation with Vuelidate end

//Rate a booking
let sendFeedback = (id) => {
  //show dialog
  feedbackDialog.require({
    group: "headless",
    message:
      "Let us know how we did. Your rating and comments are appreciated.",
    header: "How Was Your Car Wash?",
    accept: () => {
      console.log(`Delete booking with ${id} confirmed`);
    },
    reject: () => {
      console.log(`Delete booking with ${id} cancelled`);
    },
  });
};

let filterBookings = () => {
  alert(filterBookingsBy.value);
  // if (filterBookingsBy.value == "completed") {
  //   store.dispatch("bookings/getCompletedBookings");
  // } else if (filterBookingsBy.value == "cancelled") {
  //   store.dispatch("bookings/getCancelledBookings");
  // } else if (filterBookingsBy.value == "pending") {
  //   store.dispatch("bookings/getPendingBookings");
  // } else {
  //   store.dispatch("bookings/getBookings");
  // }
};
//load more bookings depending on whether
//the current list is for all, completed or uncompleted bookings
let loadMoreBookings = () => {
  store.dispatch("bookings/loadMoreBookings", filterBookingsBy.value);
};
//is an booking being marked as complete
let isCompletingBooking = computed(
  () => store.state.bookings.isCompletingBooking
);

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
  let value = status.toLowerCase();
  switch (value) {
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
  let value = status.toLowerCase();
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
      return "secondary";
  }
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
