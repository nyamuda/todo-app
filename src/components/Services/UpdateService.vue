<template>
  <div class="">
    <form class="service-form m-auto" @submit.prevent="submitForm">
      <h3 class="fw-normal mb-3" style="letter-spacing: 1px">
        Update car wash service
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
      <!-- Features input -->
      <div class="mb-3">
        <FloatLabel variant="on">
          <MultiSelect
            id="serviceFeatures"
            v-model="v$.featureIds.$model"
            :options="features"
            display="chip"
            showClear
            optionLabel="name"
            optionValue="id"
            filter
            fluid
            :invalid="v$.featureIds.$error"
          />
          <label for="serviceFeatures">Features</label>
        </FloatLabel>
        <Message
          size="small"
          severity="error"
          v-if="v$.featureIds.$error"
          variant="simple"
        >
          <div v-for="error of v$.featureIds.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </div>
        </Message>
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
          v-if="imageUrl"
          :src="imageUrl"
          alt="Car wash service image"
          width="250"
          preview
        />
      </div>

      <!-- Submit button -->
      <Button
        fluid
        class="mb-2"
        icon="fas fa-pen"
        size="small"
        type="submit"
        :label="
          isUpdatingServiceOrUploadingImage == 'uploading'
            ? 'Uploading new image, please wait...'
            : isUpdatingServiceOrUploadingImage == 'updating'
            ? 'Updating the service details...'
            : 'Update service'
        "
        :loading="isUpdatingServiceOrUploadingImage != null"
        :disabled="v$.$errors.length > 0 || isUpdatingServiceOrUploadingImage"
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
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, helpers, requiredIf } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import MultiSelect from "primevue/multiselect";

const store = useStore();
const router = useRouter();
const toast = useToast();

//Show the loader by showing the current stage of the process
//uploading image or adding the service
let isUpdatingServiceOrUploadingImage = ref(null);
let features = computed(() => store.state.features.features);
//ID of the service to be updated
let id = ref(null);

//Uploaded image src (just for preview)
const imageUrl = ref(null);
//ID of the current image(the one saved on the database)
const currentImageId = ref(null);

onMounted(() => {
  //show validation errors
  v$._value.$touch();

  //get the ID of the service from the route parameter
  id.value = router.currentRoute.value.params.id;

  //get information about the service with the given ID
  getService(id.value);

  //get all service features
  getAllFeatures();
});

//form validation with Vuelidate start
const serviceForm = ref({
  name: "",
  price: 0,
  overview: "",
  description: "",
  imageFile: null,
  duration: 0,
  featureIds: [],
});

//Image required error message
let imageRequiredError = "An image is required. Please select a file.";
//at least one service feature required
let featuresLengthError = "Please select at least one feature";
const rules = {
  name: { required },
  price: {
    required,
    numeric,
  },
  duration: { required },
  overview: { required },
  description: { required },
  //image file is required => if the imageUrl is empty
  //image file not required => if the imageUrl is not empty
  imageFile: {
    required: helpers.withMessage(
      imageRequiredError,
      requiredIf(() => !imageUrl.value)
    ),
  },
  featureIds: {
    required: helpers.withMessage(featuresLengthError, required),
  },
};

const v$ = useVuelidate(rules, serviceForm.value);
//form validation with Vuelidate end

//Update the service
let submitForm = async () => {
  try {
    const isFormCorrect = await v$._value.$validate();
    if (isFormCorrect) {
      //First, check if a new image has been uploaded
      //if there is a new image uploaded, delete the old image using its ID
      //and then upload the new added image
      if (serviceForm.value.imageFile) {
        //show the loader
        isUpdatingServiceOrUploadingImage.value = "uploading";

        //delete the old image
        await store.dispatch("images/deleteImage", currentImageId.value);

        //upload the new one
        let imageFormData = new FormData();
        imageFormData.append("File", serviceForm.value.imageFile);
        imageFormData.append("Category", "services");

        //upload the new image and get the uploaded image information
        //such the public URL of the image, the ID etc
        let uploadedImageInfo = await store.dispatch(
          "images/uploadImage",
          imageFormData
        );
        //save the ID of the new image
        currentImageId.value = uploadedImageInfo.id;
      }

      //Second, save the updated service along with its image information -> the ID
      let updatedService = {
        name: serviceForm.value.name,
        price: serviceForm.value.price,
        overview: serviceForm.value.overview,
        description: serviceForm.value.description,
        duration: serviceForm.value.duration,
        imageId: currentImageId.value,
        featureIds: serviceForm.value.featureIds,
      };
      //show the loader
      isUpdatingServiceOrUploadingImage.value = "updating";

      let message = await store.dispatch("services/updateService", {
        id: id.value,
        updatedService,
      });
      //success message
      toast.add({
        severity: "success",
        summary: "Service Updated",
        detail: message,
        life: 3000,
      });
      router.push("/services");
    }
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error Updating Service",
      detail: err,
    });
  } finally {
    //show loader
    isUpdatingServiceOrUploadingImage.value = null;
  }
};
//Service image upload
function onFileSelect(event) {
  const file = event.files[0];
  if (!file) return;

  serviceForm.value.imageFile = file; // Store the actual file,

  const reader = new FileReader();
  reader.onload = async (e) => {
    imageUrl.value = e.target.result; // Store preview URL
  };

  reader.readAsDataURL(file);
}

//Get all the information about the service
let getService = (id) => {
  store
    //populate the form with the service information
    .dispatch("services/getService", id)
    .then((service) => {
      console.log(service);
      serviceForm.value.name = service.name;
      serviceForm.value.price = service.price;
      serviceForm.value.duration = service.duration;
      serviceForm.value.overview = service.overview;
      serviceForm.value.description = service.description;

      //get feature IDs and save them to the form data
      serviceForm.value.featureIds = getFeatureIds(service.features);

      //save the image ID
      currentImageId.value = service.image.id;

      //save the image url
      imageUrl.value = service.image.url;
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

//get all car wash service features
//that can be added to the service
let getAllFeatures = () => {
  //get all service features
  //since, we're getting all features,
  //set the page and pageSize query parameter all to 0
  let pageInfo = {
    page: 0,
    pageSize: 0,
    hasMore: false,
  };
  //mutate the state
  store.commit("features/updatePageInfo", pageInfo);
  //get the features
  store
    .dispatch("features/getFeatures")
    .then()
    .catch((message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
      });
    });
};

//get an array of service feature Ids from an array of features
let getFeatureIds = (features) => {
  return features.reduce((ids, feature) => {
    ids.push(feature.id);
    return ids;
  }, []);
};
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
