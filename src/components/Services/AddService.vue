<template>
  <div class="">
    <form class="service-form m-auto">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">
        Add car wash service
      </h3>
      <!-- <OauthBooking />
      <div class="d-flex align-bookings-center my-1">
        <hr class="flex-grow-1" />
        <p class="text-center fw-bold mx-3 mb-0">Or</p>
        <hr class="flex-grow-1" />
      </div> -->

      <!-- Name input -->
      <div class="mb-3">
        <label for="serviceName" class="form-label">Service name</label>
        <input
          type="email"
          id="serviceName"
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

      <!-- Price input -->
      <div class="form-outline mb-3">
        <label for="servicePrice" class="form-label">Price</label>
        <input
          type="number"
          id="servicePrice"
          class="form-control"
          v-model="v$.price.$model"
          :class="{
            'is-invalid': v$.price.$error,
            'is-valid': !v$.price.$error,
          }"
        />
        <div class="invalid-feedback" v-if="v$.price.$error">
          <div v-for="error of v$.price.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <button
        v-if="isCreatingService"
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
        Add service
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import FileUpload from "primevue/fileupload";
//import OauthBooking from "./OauthBooking.vue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const store = useStore();
const router = useRouter();
const toast = useToast();

onMounted(() => {
  v$._value.$touch();
});

//form validation with Vuelidate start
const formData = ref({
  name: "",
  price: 0,
});

const rules = {
  name: { required },
  price: {
    required,
    numeric,
  },
};

const v$ = useVuelidate(rules, formData.value);
//form validation with Vuelidate end

let submitForm = async () => {
  const isFormCorrect = await v$._value.$validate();
  if (isFormCorrect) {
    store
      .dispatch("services/addService", formData.value)
      .then((message) => {
        //success message
        toast.add({
          severity: "success",
          summary: "Service Added",
          detail: message,
          life: 3000,
        });
        router.push("/admin/services");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Error Adding",
          detail: message,
        });
      });
  }
};
let isCreatingService = computed(() => store.state.services.isCreatingService);
</script>

<style scoped>
a {
  text-decoration: none;
}
@media (min-width: 768px) {
  .service-form {
    max-width: 30rem;
  }
}
</style>
