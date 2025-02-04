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
        <label for="guestName" class="form-label">Name</label>
        <input
          type="text"
          id="guestName"
          class="form-control"
          v-model="v$.name.$model"
          :class="{
            'is-invalid': v$.name.$error,
            'is-valid': !v$.name.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.name.$error">
          <div v-for="error of v$.name.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <!-- Email input -->
      <div class="form-group">
        <label for="guestEmail" class="form-label">Email address</label>
        <input
          type="email"
          id="guestEmail"
          class="form-control"
          v-model="v$.email.$model"
          :class="{
            'is-invalid': v$.email.$error,
            'is-valid': !v$.email.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.email.$error">
          <div v-for="error of v$.email.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <!-- Phone input -->
      <div class="form-group">
        <label for="guestPhone" class="form-label">Phone number</label>
        <input
          type="tel"
          id="guestPhone"
          class="form-control"
          v-model="v$.phone.$model"
          :class="{
            'is-invalid': v$.phone.$error,
            'is-valid': !v$.phone.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.phone.$error">
          <div v-for="error of v$.phone.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <!-- Location input -->
      <div class="form-group">
        <label for="guestLocation" class="form-label">Location</label>
        <input
          type="text"
          id="guestLocation"
          class="form-control"
          v-model="v$.location.$model"
          :class="{
            'is-invalid': v$.location.$error,
            'is-valid': !v$.location.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.location.$error">
          <div v-for="error of v$.location.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <!-- Vehicle type input -->
      <div class="form-group">
        <label for="guestVehicleType" class="form-label"> Vehicle type</label>
        <input
          type="text"
          id="guestVehicleType"
          class="form-control"
          v-model="v$.vehicleType.$model"
          :class="{
            'is-invalid': v$.vehicleType.$error,
            'is-valid': !v$.vehicleType.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.vehicleType.$error">
          <div v-for="error of v$.vehicleType.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <!-- Service type input -->
        <div class="form-group col-md-6">
          <label for="guestServiceType" class="form-label">Service type</label>
          <Select
            id="guestServiceType"
            v-model="v$.serviceTypeId.$model"
            :options="services"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a service"
            :invalid="v$.serviceTypeId.$error"
          />
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
          <label for="guestDate" class="form-label">Date and time</label>
          <DatePicker
            id="guestDate"
            v-model="v$.scheduledAt.$model"
            showTime
            hourFormat="12"
            :invalid="v$.scheduledAt.$error"
            fluid
            showIcon
            iconDisplay="input"
          />
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
        <label for="guestNotes" class="form-label">Additional notes</label>
        <textarea
          id="guestNotes"
          class="form-input"
          rows="3"
          v-model="v$.additionalNotes.$model"
          :class="{
            'is-invalid': v$.additionalNotes.$error,
            'is-valid': !v$.additionalNotes.$error,
          }"
        ></textarea>
        <div class="invalid-feedback" v-if="v$.additionalNotes.$error">
          <div v-for="error of v$.additionalNotes.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <button
        v-if="isCreatingBooking"
        type="submit"
        class="submit-button"
        disabled
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Please wait...
      </button>
      <button
        v-else
        type="submit"
        class="btn btn-primary submit-button"
        :disabled="v$.$errors.length > 0"
      >
        Book car wash
      </button>
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
  store.dispatch("bookings/addGuestBooking", guestUserForm.value);
};

//show loading button or not
let isCreatingBooking = computed(() => store.state.bookings.isCreatingBooking);
//available car wash services
let services = computed(() => store.state.services.services);
</script>

<style scoped></style>
