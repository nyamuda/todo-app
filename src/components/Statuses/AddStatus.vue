<template>
  <div class="">
    <form @submit.prevent="submitForm" class="status-form m-auto">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">
        Add booking status
      </h3>
      <!-- <OauthBooking />
      <div class="d-flex align-bookings-center my-1">
        <hr class="flex-grow-1" />
        <p class="text-center fw-bold mx-3 mb-0">Or</p>
        <hr class="flex-grow-1" />
      </div> -->

      <!-- Name input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="statusName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
          <label for="statusName">Status name</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.name.$error"
          variant="simple"
        >
          <div v-for="error of v$.name.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Submit button -->
      <Button
        fluid
        type="submit"
        :label="isCreatingStatus ? 'Please wait...' : 'Add status'"
        icon="fas fa-plus"
        :loading="isCreatingStatus"
        :disabled="v$.$errors.length > 0 || isCreatingStatus"
        size="small"
      />
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import { Message } from "primevue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

// Access the store
const store = useStore();
const toast = useToast();
const router = useRouter();

onMounted(() => {
  v$._value.$touch();
});

//form validation with Vuelidate start
const formData = ref({
  name: "",
});

const rules = {
  name: { required },
};

const v$ = useVuelidate(rules, formData.value);
//form validation with Vuelidate end

let submitForm = async () => {
  const isFormCorrect = await v$._value.$validate();
  if (isFormCorrect) {
    store
      .dispatch("statuses/addStatus", formData.value)
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Status Added",
          detail: message,
          life: 5000,
        });
        router.push("/statuses");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Adding Status Failed",
          detail: message,
          life: 10000,
        });
      });
  }
};
let isCreatingStatus = computed(() => store.state.statuses.isCreatingStatus);
</script>

<style scoped>
a {
  text-decoration: none;
}
@media (min-width: 768px) {
  .status-form {
    max-width: 30rem;
  }
}
</style>
