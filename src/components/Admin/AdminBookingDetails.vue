<template>
  <!--Details skeleton start-->
  <div v-if="isGettingBooking">
    <Card>
      <template #title>
        <Skeleton width="30%" height="2.5rem" class="mb-3" />
      </template>
      <template #content>
        <div class="row">
          <!-- Left Column -->
          <div class="col-md-6">
            <p>
              <Skeleton width="80%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="70%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="60%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="50%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="50%" height="1.5rem" />
            </p>
          </div>

          <!-- Right Column -->
          <div class="col-md-6">
            <p>
              <Skeleton width="80%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="70%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="20%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="90%" height="1.5rem" />
            </p>
            <p>
              <Skeleton width="90%" height="1.5rem" />
            </p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Skeleton for Feedback & Rating -->
    <Card class="mt-4">
      <template #title>
        <p class="h4 mb-3 d-flex align-items-center">
          <Skeleton width="40%" height="1.5rem" />
        </p>
      </template>

      <template #content>
        <Skeleton width="100%" height="20px" class="mb-2"></Skeleton>
        <Skeleton width="80%" height="20px" class="mb-2"></Skeleton>
        <div class="d-flex align-items-center">
          <Skeleton width="120px" height="20px"></Skeleton>
        </div>
      </template>
    </Card>

    <!-- Skeleton for Action Buttons -->
    <div class="mt-4 d-flex flex-column flex-lg-row justify-content-end gap-2">
      <Skeleton width="120px" height="2rem" />
      <Skeleton width="120px" height="2rem" />
      <Skeleton width="120px" height="2rem" />
      <Skeleton width="120px" height="2rem" />
      <Skeleton width="120px" height="2rem" />
    </div>
  </div>
  <!--Details skeleton end-->
  <div v-else>
    <div v-if="booking">
      <!-- Booking Details Card -->
      <Card class="">
        <template #title>
          <p class="h1 mb-3 d-flex align-items-center">
            <i class="fas fa-calendar-check me-1 text-primary"></i>
            Booking Details
          </p>
        </template>

        <template #content>
          <div class="row">
            <!-- Left Column -->
            <div class="col-md-6">
              <p>
                <i class="fas fa-user me-1"></i><strong>Client Name:</strong>
                {{ booking.user ? booking.user.name : booking.guestUser.name }}
              </p>
              <p>
                <i class="fas fa-envelope me-1"></i
                ><strong>Client Email:</strong>
                {{
                  booking.user ? booking.user.email : booking.guestUser.email
                }}
              </p>
              <p>
                <i class="fas fa-phone me-1"></i><strong>Client Phone:</strong>
                {{
                  booking.user ? booking.user.phone : booking.guestUser.phone
                }}
              </p>
              <p>
                <i class="fas fa-car me-1"></i><strong>Vehicle Type:</strong>
                {{ booking.vehicleType }}
              </p>
              <p>
                <i class="fas fa-cogs me-1"></i><strong>Service Type:</strong>
                {{ booking.serviceType.name }}
              </p>
            </div>

            <!-- Right Column -->
            <div class="col-md-6">
              <p>
                <i class="fas fa-map-marker-alt me-1"></i
                ><strong>Vehicle Location:</strong> {{ booking.location }}
              </p>
              <p>
                <i class="fas fa-calendar-alt me-1"></i>
                <strong>Scheduled At:</strong>
                {{
                  dateFormat(
                    booking.scheduledAt,
                    "dddd, mmmm dS, yyyy, h:MM TT"
                  )
                }}
              </p>
              <p>
                <i class="fas fa-info-circle me-1"></i><strong>Status:</strong>
                <Tag
                  :icon="getIcons(booking.status?.name)"
                  rounded
                  :value="booking.status?.name"
                  :severity="getSeverity(booking.status?.name)"
                  class="ms-2"
                />
              </p>
              <p v-if="booking.additionalNotes">
                <i class="fas fa-sticky-note me-1"></i
                ><strong>Additional Notes:</strong>
                {{ booking.additionalNotes }}
              </p>
              <p v-if="booking?.status.name == 'cancelled'">
                <i class="fas fa-ban me-1"></i
                ><strong>Cancellation Reason:</strong>
                {{ booking.cancelReason }}
              </p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Feedback & Rating -->
      <Card v-if="booking.status.name != 'cancelled'" class="mt-4">
        <template #title>
          <p class="h4 mb-3 d-flex align-items-center">
            <i class="fas fa-star text-warning me-1"></i> Client Feedback
          </p>
        </template>
        <template #content>
          <div v-if="booking.feedback">
            <p>
              <i class="fas fa-comment me-1"></i><strong>Feedback:</strong>
              {{ booking.feedback?.content }}
            </p>
            <p>
              <i class="fas fa-star me-1 text-warning"></i
              ><strong>Rating:</strong>
              <Rating :value="booking.feedback.rating" readonly />
            </p>
          </div>
          <div v-else>
            <p class="text-muted">
              <i class="fas fa-info-circle me-1"></i>No feedback provided yet.
            </p>
          </div>
        </template>
      </Card>

      <!-- Action Buttons -->
      <div
        class="mt-4 d-flex flex-column flex-lg-row justify-content-end gap-2"
      >
        <Button
          v-if="booking?.status.name === 'pending'"
          label="Confirm Booking"
          icon="far fa-calendar-check"
          severity="info"
          @click="confirmBooking(booking.id)"
          size="small"
        />

        <Button
          v-if="booking?.status.name === 'confirmed'"
          label="Mark as En Route"
          icon="fas fa-road"
          severity="contrast"
          @click="enRouteBooking(booking.id)"
          size="small"
        />
        <Button
          v-if="booking?.status.name === 'en route'"
          label="Complete"
          icon="fas fa-circle-check"
          severity="success"
          @click="completeBooking(booking.id)"
          size="small"
        />

        <Button
          v-if="booking?.status.name !== 'cancelled'"
          label="Cancel Booking"
          icon="fas fa-times-circle"
          severity="warn"
          @click="cancelBooking(booking.id)"
          size="small"
        />

        <Button
          v-if="booking?.status.name !== 'cancelled'"
          label="Edit Booking"
          icon="fas fa-edit"
          variant="outlined"
          severity="contrast"
          @click="editBooking"
          size="small"
        />

        <Button
          :loading="isDeletingBooking"
          label="Delete Booking"
          icon="fas fa-trash"
          severity="danger"
          @click="deleteBooking(booking.id)"
          size="small"
        />
      </div>
    </div>
  </div>
  <!--Confirm dialog-->
  <ConfirmDialog></ConfirmDialog>
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
            class="me-3"
            label="Never mind"
            size="small"
            severity="contrast"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import Skeleton from "primevue/skeleton";
import { Tag } from "primevue";
import dateFormat from "dateformat";
import Rating from "primevue/rating";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { FloatLabel } from "primevue";
import Textarea from "primevue/textarea";
import { Message } from "primevue";

//toast
const toast = useToast();
// Access the store
const store = useStore();
//The route
const route = useRouter();
const confirmDialog = useConfirm();

let id = ref(null);
let isGettingBooking = ref(false);
let isDeletingBooking = ref(false);
let booking = ref(null);

onMounted(async () => {
  //get the route parameter
  id.value = route.currentRoute.value.params.id;

  //get the booking details from the API
  if (id.value) {
    isGettingBooking.value = true;
    store
      .dispatch("bookings/getBooking", id.value)
      .then((data) => {
        booking.value = data;
        isGettingBooking.value = false;
      })
      .catch((message) => {
        toast.error(message);
        isGettingBooking.value = false;
      });
  }
});

const editBooking = () => {
  // Logic to edit the booking
};

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

//Confirm a pending booking
const confirmBooking = (id) => {
  confirmDialog.require({
    message: "Are you sure you want to confirm this booking?",
    header: "Confirm Booking",
    icon: "fas fa-triangle-exclamation",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
      size: "small",
    },
    acceptProps: {
      label: "Confirm booking",
      severity: "info",
      size: "small",
    },
    accept: () => {
      //change the status of the booking
      //by changing the status to "confirmed"
      let statusUpdate = {
        statusName: "confirmed",
      };
      store.dispatch("admin/changeBookingStatus", {
        bookingId: id,
        statusUpdate,
      });
    },
  });
};

// Mark a confirmed booking as en route
const enRouteBooking = (id) => {
  confirmDialog.require({
    message:
      "Are you sure you want to mark this booking as en route? This will notify the client that you are on your way.",
    header: "Mark as En Route",
    icon: "fas fa-road",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
      size: "small",
    },
    acceptProps: {
      label: "Mark as En Route",
      severity: "contrast",
      size: "small",
    },
    accept: () => {
      // Change the status of the booking
      // by updating the status to "en route"
      let statusUpdate = {
        statusName: "en route",
      };
      store.dispatch("admin/changeBookingStatus", {
        bookingId: id,
        statusUpdate,
      });
    },
  });
};
// Mark an en route booking as completed
const completeBooking = (id) => {
  confirmDialog.require({
    message: "Are you sure you want to mark this booking as completed?",
    header: "Complete Booking",
    icon: "fas fa-check-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
      size: "small",
    },
    acceptProps: {
      label: "Mark as Completed",
      severity: "success",
      size: "small",
    },
    accept: () => {
      // Change the status of the booking
      // by updating the status to "completed"
      let statusUpdate = {
        statusName: "completed",
      };
      store.dispatch("admin/changeBookingStatus", {
        bookingId: id,
        statusUpdate,
      });
    },
  });
};
// Delete a booking
const deleteBooking = (id) => {
  confirmDialog.require({
    message: "Are you sure you want to delete this booking?",
    header: "Delete Booking",
    icon: "fas fa-trash",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
      size: "small",
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
      size: "small",
    },
    accept: () => {
      isDeletingBooking.value = true;
      // Dispatch action to delete booking
      store
        .dispatch("admin/deleteBooking", id)
        .then((response) => {
          isDeletingBooking.value = false;
          toast.success(response);
          route.push("/admin/bookings");
        })
        .catch((ex) => {
          isDeletingBooking.value = false;
          toast.error(ex);
        });
    },
  });
};

//Form validation with Vuelidate start
//cancel reason data
const reasonToCancelForm = ref({
  cancelReason: "",
});

const cancelRules = {
  cancelReason: { required, minLengthValue: minLength(5) },
};

//for cancellation
const v$ = useVuelidate(cancelRules, reasonToCancelForm.value);

//cancel a booking
let cancelBooking = (id) => {
  //show text area errors
  v$.value.$touch();
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
      store.dispatch("admin/changeBookingStatus", {
        bookingId: id,
        statusUpdate,
      });
    },
  });
};
//Form validation with Vuelidate end
</script>

<style scoped>
.p-card {
  border-radius: 10px;
}

.btn {
  min-width: 160px;
}
</style>
