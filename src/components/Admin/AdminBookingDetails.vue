<template>
  <div class="">
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
              <i class="fas fa-car me-1"></i> <strong>Vehicle Type:</strong>
              {{ booking.vehicleType }}
            </p>
            <p>
              <i class="fas fa-cogs me-1"></i> <strong>Service Type:</strong>
              {{ booking.serviceType }}
            </p>
            <p>
              <i class="fas fa-envelope me-1"></i>
              <strong>Client Email:</strong>
              {{ booking.email }}
            </p>
            <p>
              <i class="fas fa-phone me-1"></i> <strong>Client Phone:</strong>
              {{ booking.phone }}
            </p>
          </div>

          <!-- Right Column -->
          <div class="col-md-6">
            <p>
              <i class="fas fa-map-marker-alt me-1"></i>
              <strong>Vehicle Location:</strong> {{ booking.location }}
            </p>
            <p>
              <i class="fas fa-calendar-alt me-1"></i>
              <strong>Scheduled At:</strong>
              {{ formatDate(booking.scheduledAt) }}
            </p>
            <p>
              <i class="fas fa-info-circle me-1"></i> <strong>Status:</strong>
              <Badge :value="booking.status" :class="statusBadgeClass" />
            </p>
            <p v-if="booking.notes">
              <i class="fas fa-sticky-note me-1"></i>
              <strong>Additional Notes:</strong> {{ booking.notes }}
            </p>
            <p v-if="booking.status === 'cancelled'">
              <i class="fas fa-ban me-1"></i>
              <strong>Cancellation Reason:</strong>
              {{ booking.cancellationReason }}
            </p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Action Buttons -->
    <div class="mt-4 d-flex flex-column flex-lg-row justify-content-end gap-2">
      <Button
        v-if="booking.status === 'pending'"
        label="Confirm Booking"
        icon="far fa-calendar-check"
        severity="info"
        @click="confirmBooking"
      />

      <Button
        v-if="booking.status === 'pending'"
        label="Mark as En Route"
        icon="fas fa-road"
        severity="contrast"
        @click="markEnRoute"
      />

      <Button
        v-if="booking.status !== 'cancelled'"
        label="Cancel Booking"
        icon="fas fa-times-circle"
        severity="warn"
        @click="cancelBooking"
      />

      <Button
        label="Edit Booking"
        icon="fas fa-edit"
        variant="outlined"
        severity="contrast"
        @click="editBooking"
      />

      <Button
        label="Delete Booking"
        icon="fas fa-trash"
        severity="danger"
        @click="deleteBooking"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";

const booking = ref({
  vehicleType: "Sedan",
  serviceType: "Full Wash",
  email: "client@example.com",
  phone: "+1234567890",
  location: "123 Main St, Cityville",
  scheduledAt: "2025-02-10T15:30:00Z",
  status: "pending", // Options: pending, confirmed, enroute, cancelled
  notes: "Please be careful with the paint",
  cancellationReason: "",
});

// Format date for better readability
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

// Dynamic status badge class
const statusBadgeClass = computed(() => {
  switch (booking.value.status) {
    case "pending":
      return "badge bg-warning text-dark";
    case "confirmed":
      return "badge bg-primary";
    case "enroute":
      return "badge bg-info";
    case "cancelled":
      return "badge bg-danger";
    default:
      return "badge bg-secondary";
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
</script>

<style scoped>
.p-card {
  border-radius: 10px;
}

.btn {
  min-width: 160px;
}
</style>
