<template>
  <div class="">
    <form class="feature-form m-auto">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">Update feature</h3>
      <!-- <OauthBooking />-->
      <!-- <div class="d-flex align-bookings-center my-1">
        <hr class="flex-grow-1" />
        <p class="text-center fw-bold mx-3 mb-0">Or</p>
        <hr class="flex-grow-1" />
      </div> -->

      <!-- Name input -->
      <div class="mb-3">
        <label for="featureName" class="form-label">Feature name</label>
        <input
          type="email"
          id="featureName"
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

      <!-- Submit button -->
      <button
        v-if="isUpdatingFeature"
        type="submit"
        class="btn btn-primary btn-block mb-2 w-100"
        disabled
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Updating...
      </button>
      <button
        v-else
        :disabled="v$.$errors.length > 0"
        @click.prevent="submitForm"
        type="submit"
        class="btn btn-primary btn-block mb-2 w-100"
      >
        Update feature
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//import OauthBooking from "./OauthBooking.vue";
//Vuelidate for form validation
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useToast } from "vue-toastification";

//toast
const toast = useToast();
// Access the store
const store = useStore();
//The route
const route = useRouter();
let id = ref(null);

onMounted(async () => {
  v$._value.$touch();

  //get the route parameter
  id.value = route.currentRoute.value.params.id;

  //populate the form with the feature data
  if (id.value) {
    store
      .dispatch("features/getFeature", id.value)
      .then((feature) => {
        formData.value.name = feature.name;
      })
      .catch((message) => toast.error(message));
  }
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
    store.dispatch("features/updateFeature", {
      id: id.value,
      updatedFeature: formData.value,
    });
  }
};
let isUpdatingFeature = computed(() => store.state.features.isUpdatingFeature);
</script>

<style scoped>
a {
  text-decoration: none;
}
@media (min-width: 768px) {
  .feature-form {
    max-width: 30rem;
  }
}
</style>
