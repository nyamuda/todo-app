<template>
  <div class="card m-auto text-center forgot-form">
    <div class="card-header h5 bg-light">Password Reset</div>
    <div class="card-body">
      <h3><i class="fa fa-lock fa-4x text-muted"></i></h3>
      <h2 class="text-center">Forgot Password?</h2>
      <p>Please enter your email address.</p>
      <p>We'll send you a link to reset your password.</p>
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group mb-3">
          <!-- Email input -->
          <div class="form-group">
            <FloatLabel variant="on">
              <InputText
                class="w-100"
                id="forgotEmail"
                v-model="email"
                type="email"
                required
              />
              <label for="forgotEmail">Email</label>
            </FloatLabel>
          </div>
        </div>
        <!-- Submit button -->
        <Button
          fluid
          size="small"
          type="submit"
          :label="
            isSendingPasswordResetLink ? 'Sending reset link...' : 'Submit'
          "
          icon="fas fa-paper-plane"
          :loading="isSendingPasswordResetLink"
          :disabled="isSendingPasswordResetLink"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const store = useStore();
const router = useRouter();
const toast = useToast();

let email = ref("");
let submitForm = async () => {
  if (email.value) {
    store
      .dispatch("account/sendPasswordResetLink", { email: email.value })
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Email Sent",
          detail: message,
          life: 5000,
        });
        router.push("/email/password/sent");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: message,
          life: 10000,
        });
      });
  }
};
let isSendingPasswordResetLink = computed(
  () => store.state.account.isSendingPasswordLink
);
</script>

<style scoped>
@media (min-width: 512px) {
  .forgot-form {
    max-width: 28rem;
  }
}
</style>
