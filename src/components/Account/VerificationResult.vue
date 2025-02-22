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
        <p class="text-muted">Please request a new verification email.</p>
        <router-link to="/email/password/send">
          <Button label=" Request new link" icon="fas fa-sync-alt" />
        </router-link>
      </div>
    </div>
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
          <div class="ms-1 fw-bold">Verifying...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { isJwtExpired } from "jwt-check-expiration";
const route = useRouter();
// Access the store
const store = useStore();

//check if the verification token has expired or not
let hasTokenExpired = ref(true);

onMounted(() => {
  try {
    //get the token provided in the URL from
    //when the user clicks the verify button in their confirmation email
    let providedToken = route.currentRoute.value.query.token ?? "";
    if (providedToken) {
      //verify the authenticity of the token
      store.dispatch("account/verifyUser", { token: providedToken });
    }
    //check if the token is valid or has expired or not 
    hasTokenExpired.value = isJwtExpired(providedToken.value);
  } catch {}
});

let verificationStatus = computed(
  () => store.state.account.emailVerificationStatus
);
let attemptedUrl = computed(() => store.state.account.attemptedUrl);
</script>
