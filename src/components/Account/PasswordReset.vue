<template>
  <div class="">
    <!--If the reset link has expired-->
    <div
      v-if="hasTokenExpired"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-danger fa-4x"></i>
        <h4 class="mt-2 text-danger">Reset Link Expired</h4>
        <p class="text-muted">
          The password reset link has expired or is invalid.
        </p>
        <p class="text-muted">Please request a new password reset link.</p>
        <router-link to="/email/password/send">
          <Button label=" Request new link" icon="fas fa-sync-alt" />
        </router-link>
      </div>
    </div>
    <!--Password reset form-->
    <form
      v-else
      class="reset-password-form m-auto"
      @submit.prevent="submitForm"
    >
      <div class="text-start">
        <h2 class="fw-bold">Reset Your Password</h2>
        <p>Enter your new password.</p>
      </div>
      <!-- Password input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-lock" />
            <InputText
              fluid
              id="resetPassword"
              v-model="v$.password.$model"
              :invalid="v$.password.$error"
              type="password"
            />
          </IconField>
          <label for="resetPassword">Password</label>
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

      <!-- Password confirm input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <IconField>
            <InputIcon class="fas fa-lock" />
            <InputText
              fluid
              id="resetPasswordConfirm"
              v-model="v$.passwordConfirm.$model"
              :invalid="v$.passwordConfirm.$error"
              type="password"
            />
          </IconField>
          <label for="resetPasswordConfirm">Confirm Password</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.passwordConfirm.$error"
          variant="simple"
        >
          <div v-for="error of v$.passwordConfirm.$errors" :key="error.$uid">
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
        :label="
          isResettingPassword ? 'Resetting password...' : 'Submit new password'
        "
        :loading="isResettingPassword"
        :disabled="v$.$errors.length > 0 || isResettingPassword"
      />
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
import { Message } from "primevue";
import { isJwtExpired } from "jwt-check-expiration";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
// Access the store
const store = useStore();

//provided token from the URL
let providedToken = ref("");

//check if the reset token has expired or not
let hasTokenExpired = ref(true);

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
const rules = {
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

const v$ = useVuelidate(rules, resetPasswordForm);
//form validation with Vuelidate end

onMounted(() => {
  try {
    //validate the password reset form
    v$._value.$touch();

    //get the token provided in the URL from
    //when the user clicks the reset button in their confirmation email
    providedToken.value = router.currentRoute.value.query.token ?? "";

    //check if the token is valid has expired or not
    hasTokenExpired.value = isJwtExpired(providedToken.value);
  } catch {
    hasTokenExpired.value = true;
  }
});

let isResettingPassword = computed(
  () => store.state.account.isResettingPassword
);

let submitForm = async () => {
  const isFormCorrect = await v$._value.$validate();
  if (isFormCorrect && providedToken.value) {
    store
      .dispatch("account/resetPassword", {
        token: providedToken.value,
        password: resetPasswordForm.value.password,
      })
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Password Reset",
          detail: message,
        });
        router.push(store.state.account.attemptedUrl);
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Reset Failed",
          detail: message,
          life: 10000,
        });
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
