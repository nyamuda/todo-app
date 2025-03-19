<template>
  <div class="container m-auto">
    <TitleSection subtitle="Company details" />
    <!--Form start-->
    <form @submit.prevent="submitForm" class="needs-validation">
      <div class="row">
        <!-- Name input -->
        <div class="form-group mb-3 col-md-8">
          <FloatLabel variant="on">
            <InputText
              class="w-100"
              id="companyName"
              v-model="v$.name.$model"
              :invalid="v$.name.$error"
            />
            <label for="companyName">Company name</label>
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

        <!-- Year founded input -->
        <div class="form-group mb-3 col-md-4">
          <FloatLabel variant="on">
            <DatePicker
              class="w-100"
              id="yearFounded"
              v-model="v$.yearFounded.$model"
              :invalid="v$.yearFounded.$error"
              fluid
              view="year"
              dateFormat="yy"
              showIcon
              iconDisplay="input"
            />
            <label for="yearFounded">Year company was founded</label>
          </FloatLabel>
          <Message
            size="small"
            severity="error"
            v-if="v$.yearFounded.$error"
            variant="simple"
          >
            <div v-for="error of v$.yearFounded.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>
      </div>

      <div class="row">
        <!-- Email input -->
        <div class="form-group mb-3 col-md-6">
          <FloatLabel variant="on">
            <InputText
              class="w-100"
              id="companyEmail"
              v-model="v$.email.$model"
              :invalid="v$.email.$error"
              type="email"
            />
            <label for="companyEmail">Company email</label>
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
        <div class="form-group mb-3 col-md-6">
          <FloatLabel variant="on">
            <InputText
              class="w-100"
              id="companyPhone"
              v-model="v$.phone.$model"
              :invalid="v$.phone.$error"
              type="tel"
            />
            <label for="companyPhone">Company phone number</label>
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
      </div>
      <!-- Address input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <InputText
            class="w-100"
            id="companyAddress"
            v-model="v$.address.$model"
            :invalid="v$.address.$error"
          />
          <label for="companyAddress">Company Address</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.address.$error"
          variant="simple"
        >
          <div v-for="error of v$.address.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <Button
        type="submit"
        :label="
          isCreatingCompany
            ? 'Creating information...'
            : 'Create company information'
        "
        icon="fas fa-plus"
        :loading="isCreatingCompany"
        :disabled="v$.$errors.length > 0 || isCreatingCompany"
      />
    </form>
    <!--Form end-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import { Message } from "primevue";
import DatePicker from "primevue/datepicker";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import TitleSection from "../Common/Elements/TitleSection.vue";

const store = useStore();
const toast = useToast();
const router = useRouter();

//show loading button or not
let isCreatingCompany = computed(() => store.state.company.isCreatingCompany);

onMounted(() => {
  //show form errors
  v$._value.$touch();
});

// Form data
const companyForm = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  yearFounded: null,
});

//form validation with Vuelidate start

let phoneRule = helpers.regex(/^(\+27|0)[6-8][0-9]{8}$/);
let phoneErrorMessage = "The phone number you entered is invalid.";
const rules = {
  name: { required, minLengthValue: minLength(3) },
  email: { required, email },
  phone: {
    required,
    phoneRule: helpers.withMessage(phoneErrorMessage, phoneRule),
  },
  address: { required },
  yearFounded: { required },
};

const v$ = useVuelidate(rules, companyForm.value);
//form validation with Vuelidate end
// Submit form
const submitForm = () => {
  store
    .dispatch("company/addCompany", { company: companyForm.value })
    .then((message) => {
      toast.add({
        severity: "success",
        summary: "Company Information Created",
        detail: message,
        life: 5000,
      });
      router.push("/company");
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

//get company details and populate the form with those details
let getCompanyDetailsAndPopulateForm = () => {
  store
    .dispatch("company/getCompany")
    .then((company) => {
      companyForm.value.name = company.name;
      companyForm.value.email = company.email;
      companyForm.value.phone = company.phone;
      companyForm.value.yearFounded = company.yearFounded;
      companyForm.value.address = company.address;
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
</script>

<style scoped></style>
