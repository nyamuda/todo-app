<template>
  <div class="add-booking-container container m-auto">
    <h2 class="add-booking-title text-start">Update Booking</h2>
    <Message severity="info" :closable="true" class="mb-4">
      <i class="fas fa-info-circle me-2"></i>You can update your booking while
      it’s in the <strong>'Pending'</strong> status. Once confirmed or en route,
      updates are locked, but you may still cancel if needed.
    </Message>
    <!--For guest users start-->
    <form
      @submit.prevent="submitForm"
      class="add-booking-form needs-validation"
    >
      <!-- Vehicle type input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="updateVehicleType"
            v-model="v$.vehicleType.$model"
            :invalid="v$.vehicleType.$error"
            :disabled="disableUpdates"
          />
          <label for="updateVehicleType">Vehicle type</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.vehicleType.$error"
          variant="simple"
        >
          <div v-for="error of v$.vehicleType.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Location input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="updateLocation"
            v-model="v$.location.$model"
            :invalid="v$.location.$error"
            :disabled="disableUpdates"
          />
          <label for="updateLocation">Location</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.location.$error"
          variant="simple"
        >
          <div v-for="error of v$.location.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>
      <div class="row gap-3 gap-lg-0">
        <!-- Service type input -->
        <div class="form-group col-md-6">
          <FloatLabel variant="on">
            <Select
              class="w-100"
              id="updateServiceType"
              v-model="v$.serviceTypeId.$model"
              :options="services"
              optionLabel="name"
              optionValue="id"
              :invalid="v$.serviceTypeId.$error"
              :disabled="disableUpdates"
            />
            <label for="updateServiceType">Service type</label>
          </FloatLabel>
          <Message
            size="small"
            severity="error"
            v-if="v$.serviceTypeId.$error"
            variant="simple"
          >
            <div v-for="error of v$.serviceTypeId.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
        <!-- Date and time -->
        <div class="form-group col-md-6">
          <FloatLabel variant="on">
            <DatePicker
              class="w-100"
              id="updateScheduledAt"
              v-model="v$.scheduledAt.$model"
              showTime
              hourFormat="12"
              :invalid="v$.scheduledAt.$error"
              fluid
              showIcon
              iconDisplay="input"
              :disabled="disableUpdates"
            />
            <label for="updateScheduledAt">Date and time</label>
          </FloatLabel>
          <Message
            size="small"
            severity="error"
            v-if="v$.scheduledAt.$error"
            variant="simple"
          >
            <div v-for="error of v$.scheduledAt.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
      </div>

      <!-- Additional notes input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <Textarea
            id="updateAdditionalNotes"
            v-model="v$.additionalNotes.$model"
            :invalid="v$.additionalNotes.$error"
            rows="5"
            class="w-100"
            style="resize: none"
            :disabled="disableUpdates"
          />
          <label for="updateAdditionalNotes">Additional notes</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.additionalNotes.$error"
          variant="simple"
        >
          <div v-for="error of v$.additionalNotes.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <Button
        type="submit"
        :label="isUpdatingBooking ? 'Saving changes...' : 'Update booking'"
        icon="fas fa-edit"
        :loading="isUpdatingBooking"
        @click="load"
        :disabled="v$.$errors.length > 0 || isUpdatingBooking || disableUpdates"
      />
    </form>
    <!--For guest users end-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import "@vuepic/vue-datepicker/dist/main.css";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Select from "primevue/select";
import { Message } from "primevue";
import DatePicker from "primevue/datepicker";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Textarea from "primevue/textarea";

//toast
const toast = useToast();
// Access the store
const store = useStore();
//The route
const route = useRouter();
let id = ref(null);

//show loading button or not
let isUpdatingBooking = computed(() => store.state.bookings.isUpdatingBooking);
//available car wash services
let services = computed(() => store.state.services.services);
let status = ref(null);
//Check if the booking has "Pending" status
//since users can only update a booking when its status is 'pending'
//if the status is not pending, the form fields will be disabled
let disableUpdates = computed(() => (status.value == "pending" ? false : true));

onMounted(() => {
  v$._value.$touch();

  //get the route parameter
  id.value = route.currentRoute.value.params.id;

  //populate the form with the service data
  if (id.value) {
    store
      .dispatch("bookings/getBooking", id.value)
      .then((booking) => {
        bookingForm.value.vehicleType = booking.vehicleType;
        bookingForm.value.serviceTypeId = booking.serviceType.id;
        bookingForm.value.location = booking.location;
        bookingForm.value.scheduledAt = booking.scheduledAt;
        bookingForm.value.additionalNotes = booking.additionalNotes;
        //the status of the booking
        status.value = booking.status.name;
      })
      .catch((message) => toast.error(message));
  }
  //get all available car wash services
  store.dispatch("services/getServices");
});

// Form data
const bookingForm = ref({
  vehicleType: "",
  serviceTypeId: "",
  location: "",
  scheduledAt: "",
  additionalNotes: "",
});

//form validation with Vuelidate start
const rules = {
  vehicleType: { required },
  serviceTypeId: { required },
  location: { required },
  scheduledAt: { required },
  additionalNotes: {},
};

const v$ = useVuelidate(rules, bookingForm.value);
//form validation with Vuelidate end
// Submit form
const submitForm = () => {
  store.dispatch("bookings/updateBooking", {
    booking: bookingForm.value,
    id: id.value,
  });
};
</script>

<style scoped></style>
