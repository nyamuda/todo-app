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
                <i class="fas fa-user me-1"></i><strong>Name:</strong>
                {{ booking.user ? booking.user.name : booking.guestUser.name }}
              </p>
              <p>
                <i class="fas fa-envelope me-1"></i><strong>Email:</strong>
                {{
                  booking.user ? booking.user.email : booking.guestUser.email
                }}
              </p>
              <p>
                <i class="fas fa-phone me-1"></i><strong>Phone:</strong>
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
                      {{
                        whoCancelledBooking.role == "Admin"
                          ? "Admin"
                          : whoCancelledBooking.name
                      }}
                      <Tag
                        rounded
                        severity="info"
                        :value="
                          whoCancelledBooking.role == 'Admin'
                            ? 'Support Team'
                            : 'Yourself'
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
            <i class="fas fa-comment-alt me-1"></i>Your Feedback
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
              <i class="fas fa-info-circle me-1"></i>You haven't provided any
              feedback yet. Help us improve our services by sharing your
              experience.
            </p>
          </div>
        </template>
      </Card>

      <!-- Action Buttons -->
      <div
        class="mt-4 d-flex flex-column flex-lg-row justify-content-end gap-2"
      >
        <!--Button to add feedback-->
        <SendFeedback
          :booking-id="booking.id"
          v-if="
            doesBookingRequireFeedback(
              booking.status.name,
              booking.feedback?.rating
            )
          "
        />
        <CancelBooking
          v-if="
            booking?.status.name !== 'cancelled' &&
            booking?.status.name !== 'completed'
          "
          :booking-id="booking.id"
        />
        <Button
          v-if="
            booking?.status.name !== 'cancelled' &&
            booking?.status.name !== 'completed'
          "
          :label="
            isChangingBookingStatus == 'cancelled'
              ? 'Cancelling booking...'
              : 'Cancel Booking'
          "
          icon="fas fa-times-circle"
          severity="danger"
          @click="cancelBooking(booking.id)"
          size="small"
          :loading="isChangingBookingStatus == 'cancelled'"
          :disabled="isChangingBookingStatus == 'cancelled'"
        />

        <router-link :to="'/bookings/' + id + '/update'">
          <Button
            v-if="
              booking?.status.name !== 'cancelled' &&
              booking?.status.name !== 'completed'
            "
            label="Edit Booking"
            icon="fas fa-edit"
            variant="outlined"
            severity="contrast"
            size="small"
          />
        </router-link>
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
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { FloatLabel } from "primevue";
import Textarea from "primevue/textarea";
import { Message } from "primevue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ItemNotFound from "../Common/Elements/ItemNotFound.vue";
import SendFeedback from "./SendBookingFeedback.vue";
import CancelBooking from "./CancelBooking.vue";

const store = useStore();
const router = useRouter();
const toast = useToast();

const confirmDialog = useConfirm();

let id = ref(null);
let isGettingBooking = ref(false);
let changingStatusTo = ref(null); // the status that the booking is currently being updated to
//message to show if the item is not found
const itemNotFound = ref({
  title: "No Booking Details Available",
  message:
    " The booking information could not be found. It may have been removed or does not exist.",
});

//for showing the loader on a button depending on which status the booking is being changed to
let isChangingBookingStatus = computed(() => {
  let status = changingStatusTo.value;
  return status == "cancelled" ? "cancelled" : null;
});
let booking = ref(null);
//user who cancelled the booking if the booking was cancelled
let whoCancelledBooking = computed(
  () => booking.value?.cancelDetails?.cancelledByUser
);

onMounted(async () => {
  //get the route parameter
  id.value = router.currentRoute.value.params.id;
  //get booking details from the API
  getBooking();
});

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
let cancelBooking = (bookingId) => {
  //show text area errors
  v$.value.$touch();
  //show dialog
  confirmDialog.require({
    group: "cancel",
    message: "Are you sure you want to cancel this booking?",
    header: "Cancel Booking",
    accept: () => {
      //show loading button
      changingStatusTo.value = "cancelled";
      //change the status of the booking
      //by changing the status to "cancelled"
      let statusUpdate = {
        statusName: "cancelled",
        cancelReason: reasonToCancelForm.value.cancelReason,
      };
      store
        .dispatch("bookings/changeBookingStatus", {
          bookingId,
          statusUpdate,
        })
        .then((message) => {
          //success message
          toast.add({
            severity: "success",
            summary: "Booking Cancelled",
            detail: message,
            life: 5000,
          });
          //stop loading button
          changingStatusTo.value = null;

          //get the updated booking
          getBooking();
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Cancel Failed",
            detail: message,
            life: 10000,
          });
        });
    },
  });
};
//Form validation with Vuelidate end

let getBooking = () => {
  //get the booking details from the API
  if (id.value) {
    isGettingBooking.value = true;
    store
      .dispatch("bookings/getBooking", id.value)
      .then((data) => {
        booking.value = data;
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Fetch Failed",
          detail: message,
          life: 10000,
        });
      })
      .finally(() => {
        isGettingBooking.value = false;
      });
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

<style scoped>
.p-card {
  border-radius: 10px;
}

.btn {
  min-width: 160px;
}
</style>
