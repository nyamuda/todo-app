<template>
  <form @submit.prevent="submitForm" class="register-form m-auto">
    <h3 class="fw-normal mb-3" style="letter-spacing: 1px">Sign up</h3>
    <!-- <OauthItem />

    <div class="d-flex align-items-center my-1">
      <hr class="flex-grow-1" />
      <p class="text-center fw-bold mx-3 mb-0">Or</p>
      <hr class="flex-grow-1" />
    </div> -->

    <!-- Name input -->
    <div class="mb-3">
      <label for="registerName" class="form-label">Name</label>
      <input
        type="text"
        id="registerName"
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
    <div class="mb-3">
      <label for="registerEmail" class="form-label">Email address</label>
      <input
        type="email"
        id="registerEmail"
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
    <div class="mb-3">
      <label for="registerPhone" class="form-label">Phone Number</label>
      <input
        type="tel"
        id="registerPhone"
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

    <!-- Password input -->
    <div class="form-outline mb-3">
      <label for="registerPassword" class="form-label">Password</label>
      <input
        type="password"
        id="registerPassword"
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

    <!-- Submit button -->
    <button
      v-if="isRegistering"
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
      type="submit"
      class="btn btn-primary btn-block mb-2 w-100"
    >
      Sign up
    </button>
  </form>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
//import OauthItem from "./OauthItem.vue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";

// Access the store
const store = useStore();

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
    store.dispatch("account/registerUser", registrationForm.value);
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
