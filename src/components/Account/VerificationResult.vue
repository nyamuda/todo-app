<template>
  <div>
    <!--If the verification link has expired-->
    <div
      v-if="hasTokenExpired"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-danger fa-4x"></i>
        <h4 class="mt-2 text-danger">Verification Link Expired</h4>
        <p class="text-muted">Your email verification link has expired.</p>
        <p class="text-muted">Please request a new verification link.</p>

        <Button
          @click="requestVerificationLink"
          :label="
            isSendingVerificationLink
              ? 'Sending verification link...'
              : 'Request new link'
          "
          icon="fas fa-sync-alt"
          :disabled="isSendingVerificationLink"
          :loading="isSendingVerificationLink"
        />
      </div>
    </div>
    <!--If the verification link is valid-->
    <div v-else class="text-center">
      <div v-if="verificationStatus == 'success'">
        <p><i class="far fa-check-circle fa-5x text-success"></i></p>
        <h2>Thank You!</h2>
        <p>Your email address has been successfully verified.</p>
        <router-link :to="'/' + attemptedUrl"
          ><a class="btn btn-primary">Continue</a></router-link
        >
      </div>

      <div v-else-if="verificationStatus == 'fail'">
        <p><i class="fas fa-times fa-5x text-danger"></i></p>

        <h2>Verification Failed</h2>
        <p>
          Sorry, an unexpected error occurred during the verification process.
          Please try again later.
        </p>
      </div>

      <div v-else>
        <div class="d-flex align-bookings-center justify-content-center">
          <div
            class="spinner-border me-1"
            role="status"
            style="width: 3rem; height: 3rem"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="ms-1 fw-bold">
            Please wait while we verify your email.
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Verification Dialog Start-->
  <ConfirmDialog group="verification">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="d-flex flex-column align-items-start p-3 bg-light rounded">
        <span class="fw-bold fs-3 d-block mb-2 mt-2">{{ message.header }}</span>
        <p class="mb-3">{{ message.message }}</p>
        <div class="w-100">
          <!-- Email input -->

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
        <div class="d-flex align-items-center justify-content-end mt-3 w-100">
          <Button
            class="me-3"
            label="Cancel"
            severity="secondary"
            @click="rejectCallback"
          ></Button>
          <Button
            :disabled="v$.email.$error"
            label="Send verification link"
            severity="success"
            @click="acceptCallback"
          ></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <!--Verification Dialog End-->
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { isJwtExpired } from "jwt-check-expiration";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import { jwtDecode } from "jwt-decode";

const route = useRouter();
// Access the store
const store = useStore();
const confirmDialog = useConfirm();
const toast = useToast();

//check if the verification token has expired or not
let hasTokenExpired = ref(true);
//email from the provided JWT token
let tokenEmail = ref("");
let verificationStatus = computed(
  () => store.state.account.emailVerificationStatus
);
let attemptedUrl = computed(() => store.state.account.attemptedUrl);
let isSendingVerificationLink = computed(
  () => store.state.account.isSendingVerificationLink
);

onMounted(() => {
  try {
    //get the token provided in the URL from
    //when the user clicks the verify button in their confirmation email
    let providedToken = route.currentRoute.value.query.token ?? "";
    if (providedToken) {
      //Decode the token
      let decodedToken = jwtDecode(providedToken);
      // Extract the claims (email) from the token
      const email =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      tokenEmail.value = email;

      //check if the token has expired or not
      hasTokenExpired.value = isJwtExpired(providedToken.value);
      //throw an exception if the token has expired
      if (hasTokenExpired.value) throw new Error();

      //verify the authenticity of the token on the backend
      store.dispatch("account/verifyUser", { token: providedToken });
    }
  } catch {
    hasTokenExpired.value = true;

    //if the token has an email claim
    //save that email to the verificationForm in case the user requests
    //to resend the email verification link
    verificationForm.value.email = tokenEmail.value;
  }
});

//form validation with Vuelidate start
const verificationForm = ref({
  email: "",
});

const rules = {
  email: {
    required,
    email,
  },
};

const v$ = useVuelidate(rules, verificationForm);
//form validation with Vuelidate end

//request email verification email
let requestVerificationLink = () => {
  //show form errors
  v$.value.$touch();

  //show dialog
  confirmDialog.require({
    group: "verification",
    message:
      "Enter your email below, and we'll send you a new verification link.",
    header: "Resend Email Verification Link",
    accept: () => {
      //send the email verification link to the the provided email address
      store
        .dispatch("account/sendEmailVerificationLink", verificationForm.value)
        .then((message) => {
          //success message
          toast.add({
            severity: "success",
            summary: "Link Sent",
            detail: message,
          });
        })
        .catch((message) => {
          toast.add({
            severity: "error",
            summary: "Verification Failed",
            detail: message,
            life: 20000,
          });
        });
    },
  });
};
</script>
