<template>
  <div class="add-booking-container container m-auto">
    <h2 class="add-booking-title text-start">Book a car wash session</h2>

    <!--For guest users start-->
    <form
      @submit.prevent="submitForm"
      class="add-booking-form needs-validation"
    >
      <!-- Name input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="bookingName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
          <label for="bookingName">Name</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.name.$error"
          variant="simple"
        >
          <div v-for="error of v$.name.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Email input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="bookingEmail"
            v-model="v$.email.$model"
            :invalid="v$.email.$error"
            type="email"
          />
          <label for="bookingEmail">Email</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.email.$error"
          variant="simple"
        >
          <div v-for="error of v$.email.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Phone input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="bookingPhone"
            v-model="v$.phone.$model"
            :invalid="v$.phone.$error"
            type="tel"
          />
          <label for="bookingPhone">Phone</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.phone.$error"
          variant="simple"
        >
          <div v-for="error of v$.phone.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

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
      />
    </form>
    <!--For guest users end-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import Select from "primevue/select";
import { Message } from "primevue";
import DatePicker from "primevue/datepicker";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Textarea from "primevue/textarea";

const store = useStore();

onMounted(() => {
  v$._value.$touch();
});

// Form data
const guestUserForm = ref({
  name: "",
  email: "",
  phone: "",
  vehicleType: "",
  serviceTypeId: "",
  location: "",
  scheduledAt: "",
  additionalNotes: "",
});

//form validation with Vuelidate start

let phoneRule = helpers.regex(/^(\+27|0)[6-8][0-9]{8}$/);
let phoneErrorMessage = "The phone number you entered is invalid.";
const rules = {
  name: { required, minLengthValue: minLength(3) },
  email: { required, email },
  phone: {
    required,
    phoneRule: helpers.withMessage(phoneErrorMessage, phoneRule),
  },
  vehicleType: { required },
  serviceTypeId: { required },
  location: { required },
  scheduledAt: { required },
  additionalNotes: {},
};

const v$ = useVuelidate(rules, guestUserForm.value);
//form validation with Vuelidate end
// Submit form
const submitForm = () => {
  store.dispatch("bookings/addGuestBooking", { booking: guestUserForm.value });
};

//show loading button or not
let isCreatingBooking = computed(() => store.state.bookings.isCreatingBooking);
//available car wash services
let services = computed(() => store.state.services.services);
</script>

<style scoped></style>
