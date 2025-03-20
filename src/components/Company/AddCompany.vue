<template>
  <div class="container m-auto">
    <TitleSection title="Company details" />
    <div class="row mt-2">
      <!-- Message section -->
      <div class="col-md-4">
        <p class="mb-3">
          The details you enter here will be visible to customers. Keep them
          accurate and up-to-date.
        </p>
        <Message v-if="!company?.id && !isGettingCompany" severity="warn"
          >No company details have been added yet. This information helps
          customers connect with your business.</Message
        >
      </div>

      <div class="col-md-8">
        <!--Form start-->
        <form
          @submit.prevent="submitForm"
          class="needs-validation"
          v-if="!isGettingCompany"
        >
          <div class="row">
            <!-- Name input -->
            <div class="form-group mb-3 col-md-8">
              <FloatLabel variant="on">
                <InputText
                  class="w-100"
                  id="companyName"
                  v-model="v$.name.$model"
                  :invalid="v$.name.$error"
                  :disabled="disableField"
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
                  id="dateFounded"
                  v-model="v$.dateFounded.$model"
                  :invalid="v$.dateFounded.$error"
                  fluid
                  view="month"
                  dateFormat="mm/yy"
                  showIcon
                  iconDisplay="input"
                  :disabled="disableField"
                />
                <label for="dateFounded">Founded on</label>
              </FloatLabel>
              <Message
                size="small"
                severity="error"
                v-if="v$.dateFounded.$error"
                variant="simple"
              >
                <div v-for="error of v$.dateFounded.$errors" :key="error.$uid">
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
                  :disabled="disableField"
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
                  :disabled="disableField"
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
                :disabled="disableField"
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
          <div class="row">
            <!-- Facebook input -->
            <div class="form-group mb-3 col-md-4">
              <FloatLabel variant="on">
                <InputText
                  class="w-100"
                  id="companyFacebook"
                  v-model="v$.facebookUrl.$model"
                  :invalid="v$.facebookUrl.$error"
                  type="url"
                  :disabled="disableField"
                />
                <label for="companyFacebook">Facebook URL</label>
              </FloatLabel>
              <Message
                size="small"
                severity="error"
                v-if="v$.facebookUrl.$error"
                variant="simple"
              >
                <div v-for="error of v$.facebookUrl.$errors" :key="error.$uid">
                  <div>{{ error.$message }}</div>
                </div>
              </Message>
            </div>

            <!-- LinkedIn input -->
            <div class="form-group mb-3 col-md-4">
              <FloatLabel variant="on">
                <InputText
                  class="w-100"
                  id="companyLinkedIn"
                  v-model="v$.linkedInUrl.$model"
                  :invalid="v$.linkedInUrl.$error"
                  type="url"
                  :disabled="disableField"
                />
                <label for="companyLinkedIn">LinkedIn URL</label>
              </FloatLabel>
              <Message
                size="small"
                severity="error"
                v-if="v$.linkedInUrl.$error"
                variant="simple"
              >
                <div v-for="error of v$.linkedInUrl.$errors" :key="error.$uid">
                  <div>{{ error.$message }}</div>
                </div>
              </Message>
            </div>

            <!-- Instagram input -->
            <div class="form-group mb-3 col-md-4">
              <FloatLabel variant="on">
                <InputText
                  class="w-100"
                  id="companyInstagram"
                  v-model="v$.instagramUrl.$model"
                  :invalid="v$.instagramUrl.$error"
                  type="url"
                  :disabled="disableField"
                />
                <label for="companyInstagram">Instagram URL</label>
              </FloatLabel>
              <Message
                size="small"
                severity="error"
                v-if="v$.instagramUrl.$error"
                variant="simple"
              >
                <div v-for="error of v$.instagramUrl.$errors" :key="error.$uid">
                  <div>{{ error.$message }}</div>
                </div>
              </Message>
            </div>
          </div>

          <!-- Opening hours input -->
          <div class="form-group mb-3">
            <IftaLabel>
              <InputText
                class="w-100"
                id="companyOpeningHours"
                v-model="v$.openingHours.$model"
                :invalid="v$.openingHours.$error"
                :disabled="disableField"
                placeholder="E.g. Monday - Friday: 08.00 AM - 05.00 PM"
                type="text"
              />
              <label for="companyOpeningHours">Company opening hours</label>
            </IftaLabel>
            <Message
              size="small"
              severity="error"
              v-if="v$.openingHours.$error"
              variant="simple"
            >
              <div v-for="error of v$.openingHours.$errors" :key="error.$uid">
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
              severity="danger"
              label="Discard changes"
              :disabled="isAddingOrUpdatingCompany"
            />
            <!-- Save changes form -->
            <Button
              v-if="isInEditMode"
              icon="fas fa-pencil-alt"
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
              @click="editForm"
              icon="fas fa-pencil-alt"
              severity="info"
              label="Edit details"
              :disabled="isGettingCompany"
            />
          </div>
        </form>
        <!--Form end-->
        <!-- Progress spinner start -->
        <div class="d-flex justify-content-center" v-else>
          <ProgressSpinner />
        </div>
        <!-- Progress spinner end -->
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
import ProgressSpinner from "primevue/progressspinner";
import IftaLabel from "primevue/iftalabel";

const store = useStore();
const toast = useToast();

onMounted(() => {
  getCompanyDetailsAndPopulateForm();
});

let company = ref(null);
//show loading button or not
let isAddingOrUpdatingCompany = computed(
  () => store.state.company.isAddingOrUpdatingCompany
);
//is fetching company information for display
let isGettingCompany = computed(() => store.state.company.isGettingCompany);

//is form in edit mode or not
//if not, the form fields are disabled
let isInEditMode = ref(false);
//disable form field or not
let disableField = computed(() => !isInEditMode.value);

//discard changes made
//by populating the form with the original data
let discardChanges = () => {
  if (company.value) {
    populateForm(company.value);
  }

  //disable form inputs
  isInEditMode.value = false;
};

//edit the form
let editForm = () => {
  isInEditMode.value = true;
  //show validation errors
  v$._value.$touch();

  console.log(disableField);
};

// Form data
const companyForm = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  dateFounded: null,
  linkedInUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  openingHours: "",
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
  dateFounded: { required },
  linkedInUrl: {},
  instagramUrl: {},
  facebookUrl: {},
  openingHours: {},
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
      await addCompany();
    }
    //if company ID is not null
    //then the company details have already been created
    //which means we need to update the company details
    else if (company.value?.id) {
      await updateCompany();
    } else {
      throw new Error(
        "An unexpected error occurred while saving the company details."
      );
    }
  } catch (ex) {
    toast.add({
      severity: "error",
      summary: "Error Occurred",
      detail: ex,
      life: 10000,
    });
  }
};

//get company details and populate the form with those details
let getCompanyDetailsAndPopulateForm = () => {
  store
    .dispatch("company/getCompany")
    .then((companyData) => {
      //populate the form with company info
      if (companyData) {
        populateForm(companyData);
      }
      //store company info
      company.value = companyData;
    })
    .catch(() => {});
};

//populate the form with company data
let populateForm = ({
  name,
  email,
  phone,
  dateFounded,
  address,
  linkedInUrl,
  facebookUrl,
  instagramUrl,
  openingHours,
}) => {
  companyForm.value.name = name;
  companyForm.value.email = email;
  companyForm.value.phone = phone;
  companyForm.value.dateFounded = dateFounded;
  companyForm.value.address = address;
  companyForm.value.linkedInUrl = linkedInUrl;
  companyForm.value.facebookUrl = facebookUrl;
  companyForm.value.instagramUrl = instagramUrl;
  companyForm.value.openingHours = openingHours;
};

//Add company details
let addCompany = async () => {
  let message = await store.dispatch("company/addCompany", {
    company: companyForm.value,
  });
  toast.add({
    severity: "success",
    summary: "Company Added",
    detail: message,
    life: 5000,
  });
  isInEditMode.value = false;
};
//Update company details
let updateCompany = async () => {
  let message = await store.dispatch("company/updateCompany", {
    updatedCompany: companyForm.value,
    id: company.value.id,
  });
  toast.add({
    severity: "success",
    summary: "Update Success",
    detail: message,
    life: 5000,
  });
  isInEditMode.value = false;
};
</script>

<style scoped></style>
