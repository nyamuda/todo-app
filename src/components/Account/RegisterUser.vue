<template>
  <form @submit.prevent="submitForm" class="register-form m-auto">
    <h3 class="fw-normal mb-3" style="letter-spacing: 1px">Sign up</h3>
    <!-- <OauthBooking />

		<div class="d-flex align-bookings-center my-1">
			<hr class="flex-grow-1" />
			<p class="text-center fw-bold mx-3 mb-0">Or</p>
			<hr class="flex-grow-1" />
		</div> -->

    <!-- Name input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-user" />
          <InputText
            fluid
            id="registerName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
        </IconField>
        <label for="registerName">Name</label>
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
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-envelope" />
          <InputText
            id="registerEmail"
            class="w-100"
            v-model="v$.email.$model"
            :invalid="v$.email.$error"
            type="email"
          />
        </IconField>
        <label for="registerEmail">Email</label>
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

    <!-- Password input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-lock" />
          <InputText
            fluid
            id="registerPassword"
            v-model="v$.password.$model"
            :invalid="v$.password.$error"
            type="password"
          />
        </IconField>
        <label for="registerPassword">Password</label>
      </FloatLabel>
      <Message
        size="small"
        severity="error"
        v-if="v$.password.$error"
        variant="simple"
      >
        <div v-for="error of v$.password.$errors" :key="error.$uid">
          <div>{{ error.$message }}</div>
        </div>
      </Message>
    </div>

    <!-- Phone input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-phone" />
          <InputText
            fluid
            id="registerPhone"
            v-model="v$.phone.$model"
            :invalid="v$.phone.$error"
            type="tel"
          />
        </IconField>
        <label for="registerPhone">Phone number</label>
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

    <!-- Submit button -->
    <Button
      fluid
      class="mb-2"
      size="small"
      type="submit"
      severity="primary"
      :label="isRegistering ? 'Please wait...' : 'Sign up'"
      :loading="isRegistering"
      :disabled="v$.$errors.length > 0 || isRegistering"
    />
  </form>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
//import OauthBooking from "./OauthBooking.vue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

// Access the store
const store = useStore();
const toast = useToast();
const router = useRouter();

onMounted(() => {
  v$._value.$touch();
});

//form validation with Vuelidate start
const registrationForm = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
});
const passwordRule = helpers.regex(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);
let phoneRule = helpers.regex(/^(\+27|0)[6-8][0-9]{8}$/);
let passwordErrorMessage =
  "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters";
let phoneErrorMessage = "The phone number you entered is invalid";
const rules = {
  name: { required, minLengthValue: minLength(3) },
  email: { required, email },
  phone: {
    required,
    phoneRule: helpers.withMessage(phoneErrorMessage, phoneRule),
  },
  password: {
    required,
    passwordRule: helpers.withMessage(passwordErrorMessage, passwordRule),
  },
};

const v$ = useVuelidate(rules, registrationForm);
//form validation with Vuelidate end

let submitForm = async () => {
  const isFormCorrect = v$._value.$validate;
  if (isFormCorrect) {
    store
      .dispatch("account/registerUser", registrationForm.value)
      .then(() => {
        router.push("/email/verify");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Registration Failed",
          detail: message,
          life: 20000,
        });
      });
  }
};
let isRegistering = computed(() => store.state.account.isRegistering);
</script>

<style scoped>
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
