<template>
  <div class="">
    <form class="status-form m-auto" @submit.prevent="submitForm">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">Update status</h3>
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
        :label="isUpdatingStatus ? 'Please wait...' : 'Update status'"
        icon="fas fa-plus"
        :loading="isUpdatingStatus"
        :disabled="v$.$errors.length > 0 || isUpdatingStatus"
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
//The route
const router = useRouter();
let id = ref(null);

onMounted(async () => {
  v$._value.$touch();

  //get the route parameter
  id.value = router.currentRoute.value.params.id;

  //populate the form with the status data
  if (id.value) {
    store
      .dispatch("statuses/getStatus", id.value)
      .then((status) => {
        formData.value.name = status.name;
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Fetch Failed",
          detail: message,
          life: 10000,
        });
      });
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
      .dispatch("statuss/updateStatus", {
        id: id.value,
        updatedStatus: formData.value,
      })
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Status Update",
          detail: message,
          life: 5000,
        });
        router.push("/statuses");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail: message,
          life: 10000,
        });
      });
  }
};
let isUpdatingStatus = computed(() => store.state.statuses.isUpdatingStatus);
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
