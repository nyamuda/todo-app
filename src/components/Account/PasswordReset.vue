<template>
  <div class="">
    <form class="reset-password-form m-auto">
      <div class="text-start">
        <h2 class="fw-bold">Reset Your Password</h2>
        <p>Enter your new password.</p>
      </div>
      <!-- Password input -->
      <div class="form-outline mb-3">
        <label for="resetPassword" class="form-label">Password</label>
        <input
          type="password"
          id="resetPassword"
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

      <!-- Password confirm input -->
      <div class="form-outline mb-3">
        <label for="confirmResetPassword" class="form-label"
          >Confirm Password</label
        >
        <input
          type="password"
          id="confirmResetPassword"
          class="form-control"
          v-model="v$.passwordConfirm.$model"
          :class="{
            'is-invalid': v$.passwordConfirm.$error,
            'is-valid': !v$.passwordConfirm.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.passwordConfirm.$error">
          <div v-for="error of v$.passwordConfirm.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <button
        v-if="isResettingPassword"
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
        Change password
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
const route = useRouter();
// Access the store
const store = useStore();

//provided token from the URL
let providedToken = ref("");

//form validation with Vuelidate start
const resetPasswordForm = ref({
  password: "",
  passwordConfirm: "",
});
const passwordRule = helpers.regex(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);
let passwordErrorMessage =
  "Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters";
let passwordNotMatching = "The passwords you entered do not match";
const rules = () => {
  return {
    password: {
      required,
      passwordRule: helpers.withMessage(passwordErrorMessage, passwordRule),
    },
    passwordConfirm: {
      required,
      sameAsPassword: helpers.withMessage(
        passwordNotMatching,
        sameAs(resetPasswordForm.value.password)
      ),
    },
  };
};

const v$ = useVuelidate(rules, resetPasswordForm.value);
//form validation with Vuelidate end

onMounted(() => {
  v$._value.$touch();
  //get the token provided in the URL from
  //when the user clicks the reset button in their confirmation email
  providedToken.value = route.currentRoute.value.query.token ?? "";
});

let isResettingPassword = computed(
  () => store.state.account.isResettingPassword
);

let submitForm = async () => {
  const isFormCorrect = await v$._value.$validate();
  if (isFormCorrect && providedToken.value) {
    store.dispatch("account/resetPassword", {
      token: providedToken.value,
      password: resetPasswordForm.value.password,
    });
  }
};
</script>

<style scoped>
@media (min-width: 512px) {
  .reset-password-form {
    max-width: 28rem;
  }
}
</style>
