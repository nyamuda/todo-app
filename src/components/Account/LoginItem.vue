<template>
  <div class="">
    <form class="login-form m-auto">
      <div class="text-center mb-3">
        <p>Sign in with:</p>
        <button
          @click="loginWithGoogle"
          type="button"
          class="login-with-google-btn py-2"
        >
          Sign in with Google
        </button>
      </div>

      <p class="text-center">or:</p>

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
          <a href="#!">Forgot password?</a>
        </div>
      </div>

      <!-- Submit button -->
      <button
        @click="submitForm"
        type="submit"
        class="btn btn-primary btn-block mb-2 w-100"
      >
        Sign in
      </button>

      <!-- Register buttons -->
      <div class="text-center">
        <p>Not a member? <a href="#!">Register</a></p>
      </div>
    </form>
  </div>
  <h1>{{ loginForm.rememberMe }}</h1>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";

// Access the store
const store = useStore();

const route = useRouter();
let code = ref("");

onMounted(() => {
  code.value = route.currentRoute.value.query.code ?? "no code";
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
  email: { required, email, $autoDirty: true },
  password: {
    required,
    passwordRule: helpers.withMessage(passwordErrorMessage, passwordRule),
    $autoDirty: true,
  },
};

const v$ = useVuelidate(rules, loginForm);
//form validation with Vuelidate end

let loginWithGoogle = () => {
  window.location.href = store.getters.googleLoginUrl;
};

let submitForm = async () => {
  const isFormCorrect = await this.v$.$validate();
  if (isFormCorrect) {
    console.log("hey there");
  }
};
</script>

<style>
.login-form {
  @media (min-width: 768px) {
    max-width: 30rem;
  }
}
</style>
