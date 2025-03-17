<template>
  <div>
    <!-- Cancel button -->
    <Button
      :label="isCancelling ? 'Cancelling...' : 'Cancel Booking'"
      icon="fas fa-times-circle"
      severity="danger"
      @click="cancelBooking(booking.id)"
      size="small"
      :loading="isCancelling"
      :disabled="isCancelling"
    />
    <!--Cancel Dialog Start-->
    <ConfirmDialog group="cancel">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="d-flex flex-column align-items-start p-4 bg-light rounded">
          <span class="fw-bold fs-3 d-block mb-2 mt-2">{{
            message.header
          }}</span>
          <p class="mb-3">{{ message.message }}</p>
          <div class="w-100">
            <FloatLabel variant="on">
              <Textarea
                class="w-100"
                id="cancelReason"
                :invalid="v$.cancelReason.$error"
                v-model="v$.cancelReason.$model"
                rows="4"
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import { FloatLabel } from "primevue";
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import Textarea from "primevue/textarea";
import { Message } from "primevue";
import { useToast } from "primevue/usetoast";
import { useStore } from "vuex";

let props = defineProps({
  bookingId: {
    type: String,
    required: true,
  },
  //method to call after a success
  callMethodAfterSuccess: {
    type: Function,
    required: true,
  },
});

const toast = useToast();
const store = useStore();
const confirmDialog = useConfirm();

let isCancelling = ref(false);

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
      isCancelling.value = true;
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
          //when the request is a success, call a certain method
          props.callMethodAfterSuccess();
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Cancel Failed",
            detail: message,
            life: 10000,
          });
        })
        .finally(() => (isCancelling.value = false));
    },
  });
};
//Form validation with Vuelidate end
</script>
