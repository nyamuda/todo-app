<template>
  <div>
    <!--Feedback Dialog Start-->
    <ConfirmDialog group="feedback">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="d-flex flex-column align-items-start p-4 bg-light rounded">
          <span class="fw-bold fs-3 d-block mb-2 mt-2">{{
            message.header
          }}</span>
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
            <FloatLabel variant="on">
              <Textarea
                class="w-100"
                id="bookingFeedback"
                v-model="v2$.content.$model"
                rows="5"
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
  </div>
</template>

<script>
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

const toast = useToast();

const store = useStore();
const confirmDialog = useConfirm();
let isSendingFeedback = computed(() => store.state.bookings.isSendingFeedback);

//Form validation with Vuelidate start

const feedbackForm = ref({
  content: "",
  rating: null,
});
//rules for the booking feedback form
const feedbackRules = {
  content: {},
  rating: {
    required: helpers.withMessage("Rating is required", required),
    numeric,
  },
};

//for feedback
const v2$ = useVuelidate(feedbackRules, feedbackForm.value);

//Rate a service
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
      store
        .dispatch("bookings/addFeedback", { feedback })
        .then((message) => {
          toast.add({
            severity: "success",
            summary: "Feedback Sent",
            detail: message,
            life: 5000,
          });
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Feedback Failed",
            detail: message,
            life: 10000,
          });
        });
    },
  });
};
//Form validation with Vuelidate end
</script>
