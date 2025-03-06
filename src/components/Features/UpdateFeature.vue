<template>
  <div class="">
    <form class="feature-form m-auto" @submit.prevent="submitForm">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">Update feature</h3>
      <!-- <OauthBooking />-->
      <!-- <div class="d-flex align-bookings-center my-1">
        <hr class="flex-grow-1" />
        <p class="text-center fw-bold mx-3 mb-0">Or</p>
        <hr class="flex-grow-1" />
      </div> -->

      <!-- Name input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="featureName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
          <label for="featureName">Feature name</label>
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
        :label="isUpdatingFeature ? 'Please wait...' : 'Add feature'"
        icon="fas fa-plus"
        :loading="isUpdatingFeature"
        :disabled="v$.$errors.length > 0 || isUpdatingFeature"
        size="small"
      />
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import { Message } from "primevue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";

//toast
const toast = useToast();
// Access the store
const store = useStore();
//The router
const router = useRouter();
let id = ref(null);

onMounted(async () => {
  v$._value.$touch();

  //get the route parameter
  id.value = router.currentRoute.value.params.id;

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
    store
      .dispatch("features/updateFeature", {
        id: id.value,
        updatedFeature: formData.value,
      })
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Update Success",
          detail: message,
          life: 5000,
        });
        router.push("/features");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Updated Failed",
          detail: message,
          life: 10000,
        });
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
