<template>
  <div class="">
    <form class="login-form m-auto" @submit.prevent="submitForm">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">Sign in</h3>
      <!-- <OauthBooking />
			<div class="d-flex align-bookings-center my-1">
				<hr class="flex-grow-1" />
				<p class="text-center fw-bold mx-3 mb-0">Or</p>
				<hr class="flex-grow-1" />
			</div> -->

      <!-- Email input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-envelope" />
            <InputText
              id="loginEmail"
              class="w-100"
              v-model="v$.email.$model"
              :invalid="v$.email.$error"
            />
          </IconField>
          <label for="loginEmail">Email</label>
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
              id="loginPassword"
              v-model="v$.password.$model"
              :invalid="v$.password.$error"
              type="password"
            />
          </IconField>
          <label for="loginPassword">Password</label>
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

      <!-- 2 column grid layout -->
      <div class="row mb-3">
        <div class="col-md-6 d-flex justify-content-center">
          <!-- Checkbox -->
          <div class="form-check mb-3 mb-md-0">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="loginCheck"
              v-model="loginForm.rememberMe"
            />
            <label class="form-check-label" for="loginCheck">
              Remember me
            </label>
          </div>
        </div>

        <div class="col-md-6 d-flex justify-content-center">
          <!-- Simple link -->
          <router-link to="/email/password/send">Forgot password?</router-link>
        </div>
      </div>

      <!-- Submit button -->
      <Button
        fluid
        class="mb-2"
        size="small"
        type="submit"
        :label="isLoggingIn ? 'Please wait...' : 'Sign in'"
        :loading="isLoggingIn"
        :disabled="v$.$errors.length > 0 || isLoggingIn"
      />

      <!-- Register buttons -->
      <div class="text-center">
        <p>
          Don't have an account?
          <router-link to="/account/register">Register here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
//import OauthBooking from "./OauthBooking.vue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

// Access the store
const store = useStore();

onMounted(() => {
  v$._value.$touch();
});

//form validation with Vuelidate start
const loginForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});
const passwordRule = helpers.regex(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);
let passwordErrorMessage =
  "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters";
const rules = {
  email: { required, email },
  password: {
    required,
    passwordRule: helpers.withMessage(passwordErrorMessage, passwordRule),
  },
};

const v$ = useVuelidate(rules, loginForm.value);
//form validation with Vuelidate end

let submitForm = async () => {
  const isFormCorrect = await v$._value.$validate();
  if (isFormCorrect) {
    store.dispatch("account/loginUser", loginForm.value);
  }
};
let isLoggingIn = computed(() => store.state.account.isLoggingIn);
</script>

<style scoped>
a {
  text-decoration: none;
}
@media (min-width: 768px) {
  .login-form {
    max-width: 30rem;
  }
}
</style>
