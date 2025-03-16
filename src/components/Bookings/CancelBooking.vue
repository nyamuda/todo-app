<template>
  <div></div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, helpers } from "@vuelidate/validators";
import Rating from "primevue/rating";
import { FloatLabel } from "primevue";
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import Textarea from "primevue/textarea";
import { Message } from "primevue";
import { useToast } from "primevue/usetoast";
import { useStore } from "vuex";

defineProps({
  bookingId: {
    type: String,
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
