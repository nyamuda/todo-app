<template>
  <div class="">
    <form class="login-form m-auto">
      <!-- <OauthItem />
      <div class="d-flex align-items-center my-1">
        <hr class="flex-grow-1" />
        <p class="text-center fw-bold mx-3 mb-0">Or</p>
        <hr class="flex-grow-1" />
      </div> -->

      <!-- Email input -->
      <div class="mb-3">
        <label for="loginEmail" class="form-label">Email address</label>
        <input
          type="email"
          id="loginEmail"
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

      <!-- Password input -->
      <div class="form-outline mb-3">
        <label for="loginPassword" class="form-label">Password</label>
        <input
          type="password"
          id="loginPassword"
          class="form-control"
          v-model="v$.password.$model"
          :class="{
            'is-invalid': v$.password.$error,
            'is-valid': !v$.password.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.password.$error">
          <div v-for="error of v$.password.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
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
      <button
        v-if="isLoggingIn"
        type="submit"
        class="btn btn-primary btn-block mb-2 w-100"
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
        :disabled="v$.$errors.length > 0"
        @click.prevent="submitForm"
        type="submit"
        class="btn btn-primary btn-block mb-2 w-100"
      >
        Sign in
      </button>

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
//import OauthItem from "./OauthItem.vue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";

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
  "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters.";
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
