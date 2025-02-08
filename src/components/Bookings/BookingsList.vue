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
          <Column field="location" header="Location">
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
          <Column field="additionalNotes" header="Additional Notes">
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
          <Column field="location" header="Location"></Column>
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
          <Column field="additionalNotes" header="Additional Notes"></Column>
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
                <Button
                  v-else-if="
                    doesBookingRequireFeedback(
                      slotProps.data.status.name,
                      slotProps.data?.feedback?.rating
                    )
                  "
                  size="small"
                  label="Feedback"
                  icon="fas fa-star"
                  severity="info"
                  aria-label="Rate service"
                  @click="sendFeedback(slotProps.data.id)"
                />
                <!--Cancel Booking Button-->
                <Button
                  v-else
                  :disabled="slotProps.data.status.name == 'cancelled'"
                  size="small"
                  label="Cancel"
                  icon="fa-solid fa-xmark"
                  severity="danger"
                  aria-label="Cancel"
                  @click="cancelBooking(slotProps.data.id)"
                />
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

  <!--Cancel Dialog Start-->
  <ConfirmDialog group="cancel">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="d-flex flex-column align-items-start p-4 bg-light rounded">
        <span class="fw-bold fs-3 d-block mb-2 mt-2">{{ message.header }}</span>
        <p class="mb-3">{{ message.message }}</p>
        <div class="w-100">
          <FloatLabel variant="in">
            <Textarea
              class="w-100"
              id="cancelReason"
              :invalid="v$.cancelReason.$error"
              v-model="v$.cancelReason.$model"
              rows="3"
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
            raised
            class="me-3"
            label="Never mind"
            size="small"
            severity="contrast"
            @click="rejectCallback"
          ></Button>
          <Button
            raised
            :disabled="v$.cancelReason.$error"
            label="Yes, cancel booking"
            severity="danger"
            size="small"
            @click="acceptCallback"
          ></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <!--Cancel Dialog End-->
  <!--Feedback Dialog Start-->
  <ConfirmDialog group="feedback">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="d-flex flex-column align-items-start p-4 bg-light rounded">
        <span class="fw-bold fs-3 d-block mb-2 mt-2">{{ message.header }}</span>
        <p class="mb-3">{{ message.message }}</p>
        <div class="mb-2">
          <Rating
            class="mb-1"
            :invalid="v2$.rating.$error"
            v-model="v2$.rating.$model"
          />
          <Message
            v-if="v2$.rating.$error"
            severity="error"
            size="small"
            variant="simple"
            ><div v-for="error of v2$.rating.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div></Message
          >
        </div>
        <div class="w-100">
          <FloatLabel variant="in">
            <Textarea
              class="w-100"
              id="bookingFeedback"
              v-model="v2$.content.$model"
              rows="3"
            />
            <label for="bookingFeedback">Share your thoughts</label>
          </FloatLabel>
        </div>
        <div class="d-flex align-items-center justify-content-end mt-2 w-100">
          <Button
            raised
            class="me-3"
            label="Cancel"
            variant="outlined"
            severity="contrast"
            size="small"
            @click="rejectCallback"
          ></Button>
          <Button
            raised
            :disabled="v2$.rating.$error"
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
  <!--Dialogs Section Start-->
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
import Skeleton from "primevue/skeleton";
import Rating from "primevue/rating";
import { FloatLabel } from "primevue";
import ProgressSpinner from "primevue/progressspinner";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, numeric, helpers } from "@vuelidate/validators";
import { useStore } from "vuex";
import dateFormat from "dateformat";

//table row skeletons
const rowSkeletons = ref(new Array(10));
// Access the store
const store = useStore();

let filterBookingsBy = ref("all");

const confirmDialog = useConfirm();
let bookings = computed(() => store.state.bookings.bookings);
let statuses = computed(() => store.state.statuses.statuses);
let isGettingBookings = computed(() => store.state.bookings.isGettingBookings);
let isUpdatingBooking = computed(() => store.state.bookings.isUpdatingBooking);
//the selected booking ID for canceling or any other action
let selectedBookingId = ref(null);

onMounted(async () => {
  //get all bookings
  store.dispatch("bookings/getBookings");

  //get all booking statuses
  store.dispatch("statuses/getStatuses");
});

//Form validation with Vuelidate start
//cancel reason data
const reasonToCancelForm = ref({
  cancelReason: "",
});
const feedbackForm = ref({
  content: "",
  rating: null,
});
const cancelRules = {
  cancelReason: { required, minLengthValue: minLength(5) },
};
//rules for the booking feedback form
const feedbackRules = {
  content: {},
  rating: {
    required: helpers.withMessage("Rating is required", required),
    numeric,
  },
};

//for cancellation
const v$ = useVuelidate(cancelRules, reasonToCancelForm.value);
//for feedback
const v2$ = useVuelidate(feedbackRules, feedbackForm.value);

//cancel a booking
let cancelBooking = (id) => {
  //show text area errors
  v$.value.$touch();
  selectedBookingId.value = id;
  //show dialog
  confirmDialog.require({
    group: "cancel",
    message: "Are you sure you want to cancel this booking?",
    header: "Cancel Booking",
    accept: () => {
      //change the status of the booking
      //by changing the status to "cancelled"
      let statusUpdate = {
        statusName: "cancelled",
        cancelReason: reasonToCancelForm.value.cancelReason,
      };

      //save the updated booking
      store.dispatch("bookings/changeBookingStatus", {
        bookingId: id,
        statusUpdate,
      });
    },
    reject: () => {
      console.log(`Delete booking with ${id} cancelled`);
    },
  });
};

//Rate a booking
let sendFeedback = (id) => {
  //show text area errors
  v2$.value.$touch();
  //show dialog
  confirmDialog.require({
    group: "feedback",
    message:
      "Let us know how we did. Your rating and comments are appreciated.",
    header: "How Was Your Car Wash?",
    accept: () => {
      let feedback = {
        content: feedbackForm.value.content,
        rating: feedbackForm.value.rating,
        bookingId: id,
      };
      //send the feedback
      store.dispatch("bookings/addFeedback", { feedback });
    },
    reject: () => {
      console.log(`Delete booking with ${id} cancelled`);
    },
  });
};
//Form validation with Vuelidate end

let filterBookings = () => {
  const filterValue = filterBookingsBy.value.toLowerCase();
  if (filterValue == "completed") {
    store.dispatch("bookings/getCompletedBookings");
  } else if (filterValue == "cancelled") {
    store.dispatch("bookings/getCancelledBookings");
  } else if (filterValue == "pending") {
    store.dispatch("bookings/getPendingBookings");
  } else {
    store.dispatch("bookings/getBookings");
  }
};
//load more bookings depending on whether
//the current list is for all, completed or uncompleted bookings
let loadMoreBookings = () => {
  store.dispatch("bookings/loadMoreBookings", filterBookingsBy.value);
};
//is an booking being marked as complete
// let isCompletingBooking = computed(
//   () => store.state.bookings.isCompletingBooking
// );

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

//format number into a monetary value
let formatCurrency = (amount, currency = "ZAR", locale = "en-ZA") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
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
