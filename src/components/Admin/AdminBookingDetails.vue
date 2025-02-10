<template>
  <div v-if="isGettingBooking">
    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
  </div>
  <div v-else>
    <div v-if="booking">
      <!-- Booking Details Card -->
      <Card class="">
        <template #title>
          <p class="h1 mb-3">
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
              <p v-if="booking.notes">
                <i class="fas fa-sticky-note me-1"></i
                ><strong>Additional Notes:</strong>
                {{ booking.additionalNotes }}
              </p>
              <p v-if="booking?.status.name === 'cancelled'">
                <i class="fas fa-ban me-1"></i
                ><strong>Cancellation Reason:</strong>
                {{ booking.cancelReason }}
              </p>
            </div>
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
          @click="confirmBooking"
          size="small"
        />

        <Button
          v-if="booking?.status.name === 'confirmed'"
          label="Mark as En Route"
          icon="fas fa-road"
          severity="contrast"
          @click="markEnRoute"
          size="small"
        />

        <Button
          v-if="booking?.status.name !== 'cancelled'"
          label="Cancel Booking"
          icon="fas fa-times-circle"
          severity="warn"
          @click="cancelBooking"
          size="small"
        />

        <Button
          label="Edit Booking"
          icon="fas fa-edit"
          variant="outlined"
          severity="contrast"
          @click="editBooking"
          size="small"
        />

        <Button
          label="Delete Booking"
          icon="fas fa-trash"
          severity="danger"
          @click="deleteBooking"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import ProgressBar from "primevue/progressbar";
import { Tag } from "primevue";
import dateFormat from "dateformat";

//toast
const toast = useToast();
// Access the store
const store = useStore();
//The route
const route = useRouter();

let id = ref(null);
let isGettingBooking = ref(false);
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

// Button action handlers (implement logic here)
const confirmBooking = () => {
  // Logic to confirm booking and send email
};

const markEnRoute = () => {
  // Logic to mark en route and send email
};

const cancelBooking = () => {
  // Logic to cancel booking, ask for reason, and send email
};

const editBooking = () => {
  // Logic to edit the booking
};

const deleteBooking = () => {
  // Logic to delete booking
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
</script>

<style scoped>
.p-card {
  border-radius: 10px;
}

.btn {
  min-width: 160px;
}
</style>
