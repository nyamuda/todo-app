<template>
  <div class="">
    <form class="feature-form m-auto" @submit.prevent="submitForm">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">
        Add car wash feature
      </h3>

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
        :label="isCreatingFeature ? 'Please wait...' : 'Add feature'"
        icon="fas fa-plus"
        :loading="isCreatingFeature"
        :disabled="v$.$errors.length > 0 || isCreatingFeature"
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
      .dispatch("features/addFeature", formData.value)
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Feature Added",
          detail: message,
          life: 5000,
        });
        router.push("/");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Adding Feature Failed",
          detail: message,
          life: 10000,
        });
      });
  }
};

let isCreatingFeature = computed(() => store.state.features.isCreatingFeature);
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
