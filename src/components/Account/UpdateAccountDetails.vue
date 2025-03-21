<template>
  <form @submit.prevent="submitForm">
    <!-- Name input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-user" />
          <InputText
            fluid
            :disabled="!isInEditMode"
            id="registerName"
            v-model="v$.name.$model"
            :invalid="v$.name.$error"
          />
        </IconField>
        <label for="registerName">Name</label>
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

    <!-- Email input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-envelope" />
          <InputText
            :disabled="!isInEditMode"
            id="registerEmail"
            class="w-100"
            v-model="v$.email.$model"
            :invalid="v$.email.$error"
            type="email"
          />
        </IconField>
        <label for="registerEmail">Email</label>
      </FloatLabel>
      <Message
        size="small"
        severity="error"
        v-if="v$.email.$error"
        variant="simple"
      >
        <div v-for="error of v$.email.$errors" :key="error.$uid">
          <div>{{ error.$message }}</div>
        </div>
      </Message>
    </div>

    <!-- Phone input -->
    <div class="form-group mb-3">
      <FloatLabel variant="on">
        <IconField>
          <InputIcon class="fas fa-phone" />
          <InputText
            fluid
            :disabled="!isInEditMode"
            id="registerPhone"
            v-model="v$.phone.$model"
            :invalid="v$.phone.$error"
            type="tel"
          />
        </IconField>
        <label for="registerPhone">Phone number</label>
      </FloatLabel>
      <Message
        size="small"
        severity="error"
        v-if="v$.phone.$error"
        variant="simple"
      >
        <div v-for="error of v$.phone.$errors" :key="error.$uid">
          <div>{{ error.$message }}</div>
        </div>
      </Message>
    </div>

    <!-- Action buttons -->
    <div
      class="d-flex align-items-center justify-content-end justify-content-md-start gap-2"
    >
      <!-- Discard changes button -->
      <Button
        v-if="isInEditMode"
        @click="discardChanges"
        icon="fas fa-times"
        size="small"
        severity="danger"
        label="Discard changes"
      />
      <!-- Save changes form -->
      <Button
        v-if="isInEditMode"
        icon="fas fa-pencil-alt"
        size="small"
        type="submit"
        severity="primary"
        :label="isUpdatingAccount ? 'Saving changes...' : 'Save changes'"
        :loading="isUpdatingAccount"
        :disabled="v$.$errors.length > 0 || isUpdatingAccount"
      />
      <!-- Edit account button -->
      <Button
        v-else
        @click="isInEditMode = true"
        icon="fas fa-pencil-alt"
        size="small"
        severity="info"
        label="Edit details"
      />
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
//import OauthBooking from "./OauthBooking.vue";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useToast } from "primevue/usetoast";

// Access the store
const store = useStore();
const toast = useToast();
let user = ref(null);

onMounted(() => {
  //show validation errors
  v$._value.$touch();

  //get the user details
  //and populate the form with those details
  getUserDetails();
});

//is form in edit mode or not
//if not, the form fields are disabled
let isInEditMode = ref(false);

let isUpdatingAccount = computed(() => store.state.account.isUpdatingAccount);

//form validation with Vuelidate start
const userForm = ref({
  name: "",
  email: "",
  phone: "",
});

let phoneRule = helpers.regex(/^(\+27|0)[6-8][0-9]{8}$/);
let phoneErrorMessage = "The phone number you entered is invalid";
const rules = {
  name: { required, minLengthValue: minLength(3) },
  email: { required, email },
  phone: {
    required,
    phoneRule: helpers.withMessage(phoneErrorMessage, phoneRule),
  },
};

const v$ = useVuelidate(rules, userForm);
//form validation with Vuelidate end

//discard changes made by the user
//by populating the form with the original data
let discardChanges = () => {
  populateForm(user.value);

  //disable form inputs
  isInEditMode.value = false;
};

let submitForm = async () => {
  const isFormCorrect = v$._value.$validate;
  if (isFormCorrect) {
    store
      .dispatch("account/updateAccount", {
        id: user.value.id,
        updatedDetails: userForm.value,
      })
      .then(async (message) => {
        toast.add({
          severity: "success",
          summary: "Account Updated",
          detail: message,
          life: 5000,
        });
        //turn off edit mode
        isInEditMode.value = false;

        //update the user state
        user.value.name = userForm.value.name;
        user.value.email = userForm.value.email;
        user.value.phone = userForm.value.phone;

        //since the user details have been update
        //the current access token is now outdated
        //make a request to get a new access token with the updated user details
        try {
          await store.dispatch("account/refreshToken");
        } catch (ex) {
          console.log(ex);
        }
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
//get user detauls
//and populate the form with the user details
let getUserDetails = () => {
  store
    .dispatch("account/getUserDetails")
    .then((data) => {
      //populate the form with the user details
      populateForm(data);

      //save the user data
      user.value = data;
    })
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 10000,
      });
    });
};

//populate the form with user data
let populateForm = ({ name, email, phone }) => {
  userForm.value.name = name;
  userForm.value.email = email;
  userForm.value.phone = phone;
};
</script>

<style scoped>
@media (min-width: 768px) {
  .register-form {
    max-width: 30rem;
  }
}
</style>
