<template>
  <div class="card m-auto text-center forgot-form">
    <div class="card-header h5 text-white bg-dark">Password Reset</div>
    <div class="card-body">
      <h3><i class="fa fa-lock fa-4x"></i></h3>
      <h2 class="text-center">Forgot Password?</h2>
      <p>Please enter your email address.</p>
      <p>We'll send you a link to reset your password.</p>
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group mb-3">
          <input
            id="emailInput"
            placeholder="email address"
            class="form-control"
            type="email"
            required
            v-model="email"
          />
        </div>
        <!-- Submit button -->
        <button
          v-if="isSendingPasswordResetLink"
          type="submit"
          class="btn btn-dark btn-block mb-2 w-100"
          disabled
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Sending reset link...
        </button>
        <button v-else type="submit" class="btn btn-dark btn-block mb-2 w-100">
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

let email = ref("");
let submitForm = async () => {
  if (email.value) {
    store.dispatch("sendPasswordResetLink", { email: email.value });
  }
};
let isSendingPasswordResetLink = computed(
  () => store.state.isSendingPasswordLink
);
</script>

<style scoped>
@media (min-width: 512px) {
  .forgot-form {
    max-width: 28rem;
  }
}
</style>
