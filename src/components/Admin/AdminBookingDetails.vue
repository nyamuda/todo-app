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
          <TitleSection title="Booking Details" />
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
              <div v-if="booking.status?.name == 'cancelled'">
                <!-- Title -->
                <div class="d-flex align-items-center mb-2">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  <strong>Cancellation Details:</strong>
                </div>

                <!-- Cancellation Details Row -->
                <div class="row ms-4 mt-3">
                  <div class="col-md-12">
                    <p>
                      <!--The user who cancelled the booking -- Admin or Client -->
                      <i class="fas fa-user-slash me-1"></i
                      ><strong>Cancelled By:</strong>
                      {{ whoCancelledBooking.name }}
                      <Tag
                        rounded
                        severity="info"
                        :value="
                          whoCancelledBooking.role == 'Admin'
                            ? 'Admin'
                            : 'Client'
                        "
                        :icon="
                          whoCancelledBooking.role == 'Admin'
                            ? 'fas fa-user-tie'
                            : 'fa-regular fa-user'
                        "
                      />
                    </p>
                  </div>
                  <div class="col-md-12">
                    <p>
                      <i class="fas fa-calendar-times me-1"></i
                      ><strong>Cancelled On:</strong>
                      {{
                        dateFormat(
                          booking.cancelDetails?.cancelledAt,
                          "dddd, mmmm dS, yyyy, h:MM TT"
                        )
                      }}
                    </p>
                  </div>
                  <div class="col-md-12">
                    <p>
                      <i class="fas fa-ban me-1"></i>
                      <strong>Cancellation Reason:</strong>
                      {{ booking.cancelDetails?.cancelReason }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- <p v-if="booking?.status.name == 'cancelled'">
								<i class="fas fa-user-xmark me-1"></i
								><strong>Cancelled By:</strong>
								<Chip :label="booking?." />
							</p>
							<p v-if="booking?.status.name == 'cancelled'">
								<i class="fas fa-ban me-1"></i
								><strong>Cancellation Reason:</strong>
								{{ booking.cancelReason }}
							</p> -->
              <p v-if="booking.additionalNotes">
                <i class="fas fa-sticky-note me-1"></i
                ><strong>Additional Notes:</strong>
                {{ booking.additionalNotes }}
              </p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Feedback & Rating -->
      <Card v-if="booking.status.name == 'completed'" class="mt-4">
        <template #title>
          <p class="h4 mb-3 d-flex align-items-center">
            <i class="fas fa-comment-alt me-1"></i>Client Feedback
          </p>
        </template>
        <template #content>
          <div v-if="booking.feedback">
            <Rating class="mb-2" v-model="booking.feedback.rating" readonly />
            <p>
              <i class="fas fa-comment me-1"></i><strong>Comment:</strong>
              {{ booking.feedback?.content }}
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
        <!-- Button to confirm a booking -->
        <Button
          v-if="booking?.status.name === 'pending'"
          :label="
            isChangingBookingStatus == 'confirmed'
              ? 'Confirming booking...'
              : 'Confirm Booking'
          "
          icon="far fa-calendar-check"
          severity="info"
          @click="confirmBooking(booking.id)"
          size="small"
          :disable="isChangingBookingStatus == 'confirmed'"
          :loading="isChangingBookingStatus == 'confirmed'"
        />
        <!-- Button to mark booking as en route-->
        <Button
          v-if="booking?.status.name === 'confirmed'"
          :label="
            isChangingBookingStatus == 'en route'
              ? 'Marking as en route...'
              : 'Mark as En Route'
          "
          icon="fas fa-road"
          severity="contrast"
          @click="enRouteBooking(booking.id)"
          size="small"
          :disabled="isChangingBookingStatus == 'en route'"
          :loading="isChangingBookingStatus == 'en route'"
        />
        <!-- Button to complete a booking -->
        <Button
          v-if="booking?.status.name === 'en route'"
          :label="
            isChangingBookingStatus == 'completed'
              ? 'Completing booking...'
              : 'Complete Booking'
          "
          icon="fas fa-circle-check"
          severity="success"
          @click="completeBooking(booking.id)"
          size="small"
          :disabled="isChangingBookingStatus == 'completed'"
          :loading="isChangingBookingStatus == 'completed'"
        />

        <!-- Button to cancel a booking -->
        <CancelBooking
          v-if="
            booking?.status.name !== 'cancelled' &&
            booking?.status.name !== 'completed'
          "
          :booking-id="booking.id"
          :callMethodAfterSuccess="getBooking"
          cancel-button-severity="warn"
        />

        <!-- Button to update a booking -->
        <router-link :to="'/admin/bookings/' + id + '/update'">
          <Button
            v-if="
              booking?.status.name !== 'cancelled' &&
              booking?.status.name !== 'completed'
            "
            label="Edit Booking"
            icon="fas fa-edit"
            variant="outlined"
            severity="contrast"
            @click="editBooking"
            size="small"
        /></router-link>
        <!-- Button to delete a booking -->
        <Button
          :loading="isDeletingBooking"
          :disabled="isDeletingBooking"
          label="Delete Booking"
          icon="fas fa-trash"
          severity="danger"
          @click="deleteBooking(booking.id)"
          size="small"
        />
      </div>
    </div>
    <!-- No Booking Details Start -->
    <ItemNotFound
      v-else
      :title="itemNotFound.title"
      :message="itemNotFound.message"
    />
    <!-- No Booking Details End -->
  </div>
  <!--Confirm dialog-->
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import { useStore } from "vuex";
import Skeleton from "primevue/skeleton";
import { Tag } from "primevue";
import dateFormat from "dateformat";
import Rating from "primevue/rating";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ItemNotFound from "../Common/Elements/ItemNotFound.vue";
import CancelBooking from "../Bookings/CancelBooking.vue";
import TitleSection from "../Common/Elements/TitleSection.vue";

//toast
const toast = useToast();
// Access the store
const store = useStore();
//The route
const router = useRouter();
const confirmDialog = useConfirm();

let id = ref(null);
let isGettingBooking = ref(false);
let isDeletingBooking = ref(false);
let changingStatusTo = ref(null); // the status that the booking is currently being updated to

//for showing the loader on a button depending on which status the booking is being changed to
let isChangingBookingStatus = computed(() => {
  let status = changingStatusTo.value;
  return status == "en route"
    ? "en route"
    : status == "confirmed"
    ? "confirmed"
    : status == "completed"
    ? "completed"
    : null;
});
let booking = ref(null);
//user who cancelled the booking if the booking was cancelled
let whoCancelledBooking = computed(
  () => booking.value?.cancelDetails?.cancelledByUser
);
//message to show if the item is not found
const itemNotFound = ref({
  title: "No Booking Details Available",
  message:
    " The booking information could not be found. It may have been removed or does not exist.",
});

onMounted(async () => {
  //get the route parameter
  id.value = router.currentRoute.value.params.id;
  //get booking details from the API
  getBooking();
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
      //show loading button
      changingStatusTo.value = "confirmed";
      //change the status of the booking
      //by changing the status to "confirmed"
      let statusUpdate = {
        statusName: "confirmed",
      };
      store
        .dispatch("admin/changeBookingStatus", {
          bookingId: id,
          statusUpdate,
        })
        .then((message) => {
          //success message
          toast.add({
            severity: "success",
            summary: "Booking Confirmed",
            detail: message,
            life: 5000,
          });
          //update the status of the current booking without refreshing the page
          booking.value.status.name = statusUpdate.statusName;

          //stop loading button
          changingStatusTo.value = null;
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Confirm Failed",
            detail: message,
            life: 10000,
          });
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
      //show loading button
      changingStatusTo.value = "en route";
      // Change the status of the booking
      // by updating the status to "en route"
      let statusUpdate = {
        statusName: "en route",
      };
      store
        .dispatch("admin/changeBookingStatus", {
          bookingId: id,
          statusUpdate,
        })
        .then((message) => {
          //success message
          toast.add({
            severity: "success",
            summary: "En Route",
            detail: message,
            life: 5000,
          });
          //update the status of the current booking without refreshing the page
          booking.value.status.name = statusUpdate.statusName;

          //stop loading button
          changingStatusTo.value = null;
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Action Failed",
            detail: message,
            life: 10000,
          });
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
      //show loading button
      changingStatusTo.value = "completed";
      // Change the status of the booking
      // by updating the status to "completed"
      let statusUpdate = {
        statusName: "completed",
      };
      store
        .dispatch("admin/changeBookingStatus", {
          bookingId: id,
          statusUpdate,
        })
        .then((message) => {
          //success message
          toast.add({
            severity: "success",
            summary: "Booking Completed",
            detail: message,
            life: 5000,
          });
          //update the status of the current booking without refreshing the page
          booking.value.status.name = statusUpdate.statusName;

          //stop loading button
          changingStatusTo.value = null;
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Completion Failed",
            detail: message,
            life: 10000,
          });
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
        .then((message) => {
          isDeletingBooking.value = false;
          //success message
          toast.add({
            severity: "success",
            summary: "Booking Deleted",
            detail: message,
            life: 5000,
          });
          router.push("/admin/bookings");
        })
        .catch((message) => {
          isDeletingBooking.value = false;
          toast.add({
            severity: "error",
            summary: "Delete Failed",
            detail: message,
            life: 10000,
          });
        });
    },
  });
};

let getBooking = () => {
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
        toast.add({
          severity: "error",
          summary: "Fetch Failed",
          detail: message,
          life: 10000,
        });
        isGettingBooking.value = false;
      });
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
