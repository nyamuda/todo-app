<template>
  <div class="add-booking-container container m-auto">
    <h2 class="add-booking-title text-start">Book a car wash session</h2>

    <!--For member users start-->
    <form
      @submit.prevent="submitForm"
      class="add-booking-form needs-validation"
    >
      <!-- Vehicle type input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="bookingVehicleType"
            v-model="v$.vehicleType.$model"
            :invalid="v$.vehicleType.$error"
          />
          <label for="bookingVehicleType">Vehicle type</label>
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
            id="bookingLocation"
            v-model="v$.location.$model"
            :invalid="v$.location.$error"
          />
          <label for="bookingLocation">Location</label>
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
              id="bookingServiceType"
              v-model="v$.serviceTypeId.$model"
              :options="services"
              optionLabel="name"
              optionValue="id"
              :invalid="v$.serviceTypeId.$error"
            />
            <label for="bookingServiceType">Service type</label>
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
              id="bookingScheduledAt"
              v-model="v$.scheduledAt.$model"
              showTime
              hourFormat="12"
              :invalid="v$.scheduledAt.$error"
              fluid
              showIcon
              iconDisplay="input"
            />
            <label for="bookingScheduledAt">Date and time</label>
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
            id="bookingAdditionalNotes"
            v-model="v$.additionalNotes.$model"
            :invalid="v$.additionalNotes.$error"
            rows="5"
            class="w-100"
            style="resize: none"
          />
          <label for="bookingAdditionalNotes">Additional notes</label>
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
        :label="isCreatingBooking ? 'Creating booking...' : 'Book car wash'"
        icon="fas fa-plus"
        :loading="isCreatingBooking"
        :disabled="v$.$errors.length > 0 || isCreatingBooking"
        severity="primary"
      />
    </form>
    <!--For member users end-->
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
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const store = useStore();
const toast = useToast();
const router = useRouter();

onMounted(async () => {
  v$._value.$touch();

  //get all available car wash services
  await store.dispatch("services/getServices");

  // Get the service type ID from the query parameter and ensure it's a number
  const queryServiceTypeId = Number(
    router.currentRoute.value.query.serviceTypeId
  );
  //populate the form with the service type with the given ID
  if (queryServiceTypeId) {
    bookingForm.value.serviceTypeId = queryServiceTypeId;
  }
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
  store
    .dispatch("bookings/addBooking", { booking: bookingForm.value })
    .then((message) => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: message,
        life: 5000,
      });
      router.push("/bookings");
    })
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Booking Failed",
        detail: message,
        life: 10000,
      });
    });
};

//show loading button or not
let isCreatingBooking = computed(
  () => store.state.bookings.isCreatingMemberBooking
);
//available car wash services
let services = computed(() => store.state.services.services);
</script>

<style scoped></style>
