<template>
  <div class="">
    <form class="service-form m-auto" @submit.prevent="submitForm">
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
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="serviceName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
          <label for="serviceName">Service name</label>
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

      <!-- Price input -->
      <div class="mb-3">
        <FloatLabel variant="on">
          <InputNumber
            v-model="v$.price.$model"
            inputId="servicePrice"
            mode="currency"
            currency="ZAR"
            locale="en-ZA"
            :invalid="v$.price.$error"
            fluid
          />
          <label for="servicePrice">Price</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.price.$error"
          variant="simple"
        >
          <div v-for="error of v$.price.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!--Image upload section-->
      <div class="d-flex flex-column align-items-start gap-1 mb-3">
        <p style="font-size: 0.9rem" class="fst-italic text-muted mb-0">
          Max file size is 5MB
        </p>
        <FileUpload
          mode="basic"
          @select="onFileSelect"
          accept="image/*"
          customUpload
          show-cancel-button="true"
          severity="secondary"
          choose-icon="fas fa-image"
          choose-label="Select image"
          class="p-button-outlined p-button-secondary mb-2"
        />
        <Image v-if="src" :src="src" alt="Service image" width="250" preview />
      </div>

      <!-- Submit button -->
      <Button
        fluid
        class="mb-2"
        size="small"
        type="submit"
        :label="isCreatingService ? 'Please wait...' : 'Add service'"
        :loading="isCreatingService"
        :disabled="v$.$errors.length > 0 || isCreatingService"
      />
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import FileUpload from "primevue/fileupload";
import Image from "primevue/image";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";

import InputNumber from "primevue/inputnumber";

import { useVuelidate } from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const store = useStore();
const router = useRouter();
const toast = useToast();

let isCreatingService = computed(() => store.state.services.isCreatingService);

//image src
const src = ref(null);

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

//Service image upload
function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  reader.readAsDataURL(file);
}
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
