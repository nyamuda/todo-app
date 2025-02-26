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
      <div class="row">
        <!-- Duration input -->

        <div class="col-md-7 mb-3">
          <FloatLabel variant="on">
            <InputNumber
              v-model="v$.duration.$model"
              inputId="serviceDuration"
              :invalid="v$.duration.$error"
              prefix="Takes about "
              suffix=" minutes"
              fluid
            />
            <label for="serviceDuration">Duration</label>
          </FloatLabel>
          <Message
            size="small"
            severity="error"
            v-if="v$.duration.$error"
            variant="simple"
          >
            <div v-for="error of v$.duration.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </Message>
        </div>

        <!-- Price input -->
        <div class="col-md-5 mb-3">
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
      </div>
      <!-- Overview input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <Textarea
            id="serviceOverview"
            v-model="v$.overview.$model"
            :invalid="v$.overview.$error"
            rows="2"
            class="w-100"
            style="resize: none"
          />
          <label for="serviceOverview">Short summary</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.overview.$error"
          variant="simple"
        >
          <div v-for="error of v$.overview.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
      </div>

      <!-- Description input -->
      <div class="form-group mb-3">
        <FloatLabel variant="on">
          <Textarea
            id="serviceDescription"
            v-model="v$.description.$model"
            :invalid="v$.description.$error"
            rows="5"
            class="w-100"
            style="resize: none"
          />
          <label for="serviceDescription">Full description</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.description.$error"
          variant="simple"
        >
          <div v-for="error of v$.description.$errors" :key="error.$uid">
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
          severity="secondary"
          choose-icon="fas fa-image"
          choose-label="Select image"
          class="p-button-outlined p-button-secondary mb-2"
        />
        <Message
          size="small"
          severity="error"
          v-if="v$.imageFile.$error"
          variant="simple"
        >
          <div v-for="error of v$.imageFile.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
        <Image
          v-if="src"
          :src="src"
          alt="Car wash service image"
          width="250"
          preview
        />
      </div>

      <!-- Submit button -->
      <Button
        fluid
        class="mb-2"
        size="small"
        type="submit"
        :label="
          isAddingServiceOrUploadingImage == 'uploading'
            ? 'Uploading image, please wait...'
            : isAddingServiceOrUploadingImage == 'adding'
            ? 'Saving the service details...'
            : 'Create new service'
        "
        :loading="isAddingServiceOrUploadingImage"
        :disabled="v$.$errors.length > 0 || isAddingServiceOrUploadingImage"
      />
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import FileUpload from "primevue/fileupload";
import Image from "primevue/image";
import { Message } from "primevue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, helpers } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const store = useStore();
const router = useRouter();
const toast = useToast();

//Show the loader by showing the current stage of the process
//uploading image or adding the service
let isAddingServiceOrUploadingImage = ref(null);

//image src
const src = ref(null);

onMounted(() => {
  v$._value.$touch();
});

//form validation with Vuelidate start
const serviceForm = ref({
  name: "",
  price: 0,
  overview: "",
  description: "",
  imageFile: null,
  duration: 0,
});

//Image required error message
let imageRequiredError = "An image is required. Please select a file.";
const rules = {
  name: { required },
  price: {
    required,
    numeric,
  },
  duration: { required },
  overview: { required },
  description: { required },
  imageFile: { required: helpers.withMessage(imageRequiredError, required) },
};

const v$ = useVuelidate(rules, serviceForm.value);
//form validation with Vuelidate end

//Add the service
let submitForm = async () => {
  try {
    const isFormCorrect = await v$._value.$validate();
    if (isFormCorrect) {
      //First, upload the image
      //show the loader
      isAddingServiceOrUploadingImage.value = "uploading";
      let imageFormData = new FormData();
      imageFormData.append("File", serviceForm.value.imageFile);
      imageFormData.append("Category", "services");

      //upload the image and get the uploaded image information
      //such the public URL of the image, the ID etc
      let uploadedImageInfo = await store.dispatch(
        "images/uploadImage",
        imageFormData
      );
      //Second, save the service along with its image information -> the ID
      let payload = {
        name: serviceForm.value.name,
        price: serviceForm.value.price,
        overview: serviceForm.value.overview,
        description: serviceForm.value.description,
        duration: serviceForm.value.duration,
        imageId: uploadedImageInfo.id,
      };
      //show the loader
      isAddingServiceOrUploadingImage.value = "adding";
      let message = await store.dispatch("services/addService", payload);
      //success message
      toast.add({
        severity: "success",
        summary: "Service Added",
        detail: message,
        life: 3000,
      });
      router.push("/services");
    }
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error Adding",
      detail: err,
    });
  } finally {
    //show loader
    isAddingServiceOrUploadingImage.value = null;
  }
};
//Service image upload
function onFileSelect(event) {
  const file = event.files[0];
  if (!file) return;

  serviceForm.value.imageFile = file; // Store the actual file,

  const reader = new FileReader();
  reader.onload = async (e) => {
    src.value = e.target.result; // Store preview URL
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
    max-width: 35rem;
  }
}
</style>
