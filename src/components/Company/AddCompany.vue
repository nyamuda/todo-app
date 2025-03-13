<template>
  <div class="add-booking-container container m-auto">
    <h2 class="add-booking-title text-start">Add company information</h2>

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
            id="companyName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
          <label for="companyName">Company name</label>
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
            id="companyEmail"
            v-model="v$.email.$model"
            :invalid="v$.email.$error"
            type="email"
          />
          <label for="companyEmail">Company email</label>
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
            id="companyPhone"
            v-model="v$.phone.$model"
            :invalid="v$.phone.$error"
            type="tel"
          />
          <label for="companyPhone">Company phone number</label>
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

      <!-- Address input -->
      <div class="form-group">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="companyAddress"
            v-model="v$.address.$model"
            :invalid="v$.address.$error"
          />
          <label for="companyAddress">Company Address</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.address.$error"
          variant="simple"
        >
          <div v-for="error of v$.address.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Year founded input -->
      <div class="form-group col-md-6">
        <FloatLabel variant="on">
          <DatePicker
            class="w-100"
            id="yearFounded"
            v-model="v$.yearFounded.$model"
            :invalid="v$.yearFounded.$error"
            fluid
            showIcon
            iconDisplay="input"
          />
          <label for="yearFounded">Year company was founded</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.yearFounded.$error"
          variant="simple"
        >
          <div v-for="error of v$.yearFounded.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
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
        :label="isCreatingCompany ? 'Creating booking...' : 'Book car wash'"
        icon="fas fa-plus"
        :loading="isCreatingCompany"
        :disabled="v$.$errors.length > 0 || isCreatingCompany"
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

onMounted(() => {
  //show form errors
  v$._value.$touch();
});

// Form data
const companyForm = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  yearFounded: "",
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
  address: { required },
  yearFounded: { required },
};

const v$ = useVuelidate(rules, companyForm.value);
//form validation with Vuelidate end
// Submit form
const submitForm = () => {
  store
    .dispatch("company/addCompany", { booking: companyForm.value })
    .then((message) => {
      toast.add({
        severity: "success",
        summary: "Booking Created",
        detail: message,
        life: 20000,
      });
      router.push("/");
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
let isCreatingCompany = computed(() => store.state.company.isCreatingCompany);
</script>

<style scoped></style>
