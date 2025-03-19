<template>
  <div class="container m-auto">
    <TitleSection title="Company details" />
    <div class="row mt-3">
      <!-- Message section -->
      <div class="col-md-4">
        <Message v-if="!company?.id" severity="warn"
          >No company details have been added yet. This information helps
          customers connect with your business.</Message
        >
        <p class="mt-3">
          The details you enter here will be visible to customers. Keep them
          accurate and up-to-date.
        </p>
      </div>

      <div class="col-md-8">
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
                  :disabled="!isInEditMode"
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
                  :disabled="!isInEditMode"
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
                  :disabled="!isInEditMode"
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
                  :disabled="!isInEditMode"
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
                :disabled="!isInEditMode"
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
              :label="
                isAddingOrUpdatingCompany ? 'Saving changes...' : 'Save changes'
              "
              :loading="isAddingOrUpdatingCompany"
              :disabled="v$.$errors.length > 0 || isAddingOrUpdatingCompany"
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
        <!--Form end-->
      </div>
    </div>
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
import TitleSection from "../Common/Elements/TitleSection.vue";

const store = useStore();
const toast = useToast();

let company = ref(null);
//show loading button or not
let isAddingOrUpdatingCompany = computed(
  () => store.state.company.isAddingOrUpdatingCompany
);

//is form in edit mode or not
//if not, the form fields are disabled
let isInEditMode = ref(false);

onMounted(() => {
  //show form errors
  v$._value.$touch();

  getCompanyDetailsAndPopulateForm();
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
const submitForm = async () => {
  try {
    //if company ID is null,
    // then the company details have not be added to the database yet
    //which means we need create a new record of the company to the database
    if (!company.value?.id) {
      addCompany();
    }
    //if company ID is not null
    //then the company details have already been created
    //which means we need to update the company details
    else if (company.value?.id) {
      updateCompany();
    } else {
      throw new Error(
        "An unexpected error occurred while saving the company details"
      );
    }
  } catch (ex) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: ex.message,
      life: 10000,
    });
  } finally {
    isInEditMode.value = false;
  }
};

//discard changes made
//by populating the form with the original data
let discardChanges = () => {
  populateForm(company.value);

  //disable form inputs
  isInEditMode.value = false;
};

//get company details and populate the form with those details
let getCompanyDetailsAndPopulateForm = () => {
  store
    .dispatch("company/getCompany")
    .then((companyData) => {
      //populate the form with company info
      populateForm(companyData);
      //store company info
      company.value = companyData;
    })
    .catch(() => {});
};

//populate the form with company data
let populateForm = ({ name, email, phone, yearFounded, address }) => {
  companyForm.value.name = name;
  companyForm.value.email = email;
  companyForm.value.phone = phone;
  companyForm.value.yearFounded = yearFounded;
  companyForm.value.address = address;
};

//Add company details
let addCompany = async () => {
  let message = await store.dispatch("company/addCompany", {
    company: companyForm.value,
  });
  toast.add({
    severity: "success",
    summary: "Company Information Created",
    detail: message,
    life: 5000,
  });
};
//Update company details
let updateCompany = async () => {
  let message = await store.dispatch("company/updateCompany", {
    updatedCompany: companyForm.value,
    id: company.value.id,
  });
  toast.add({
    severity: "success",
    summary: "Company Information Created",
    detail: message,
    life: 5000,
  });
};
</script>

<style scoped></style>
