<template>
  <div class="m-auto">
    <!-- Contact Start -->
    <div class="container-xxl py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <h6 class="text-primary text-uppercase mb-2">Contact Us</h6>
            <h1 class="display-6 mb-4">We’re Here to Help</h1>
            <p class="mb-4">
              Have any questions or need assistance with your tasks? Feel free
              to reach out to us. Our team is here to help you manage your tasks
              effectively and stay productive.
            </p>
            <p class="mb-4">
              You can use the contact form below to send us a message. We're
              available for inquiries regarding task management, technical
              support, or feedback about the app.
            </p>
          </div>
          <div class="col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div class="bg-light p-5 h-100 d-flex align-items-center">
              <form>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="">
                      <label for="name">Your Name</label>
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        id="name"
                        v-model="v$.name.$model"
                        :class="{
                          'is-invalid': v$.name.$error,
                          'is-valid': !v$.name.$error,
                        }"
                      />

                      <div class="invalid-feedback" v-if="v$.name.$error">
                        <div v-for="error of v$.name.$errors" :key="error.$uid">
                          <div>{{ error.$message }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="">
                      <label for="email">Your Email</label>
                      <input
                        type="email"
                        class="form-control form-control-lg"
                        id="email"
                        v-model="v$.email.$model"
                        :class="{
                          'is-invalid': v$.email.$error,
                          'is-valid': !v$.email.$error,
                        }"
                      />

                      <div class="invalid-feedback" v-if="v$.email.$error">
                        <div
                          v-for="error of v$.email.$errors"
                          :key="error.$uid"
                        >
                          <div>{{ error.$message }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="">
                      <label for="message">Message</label>
                      <textarea
                        class="form-control"
                        id="message"
                        rows="5"
                        v-model="v$.message.$model"
                      ></textarea>
                    </div>
                  </div>
                  <div class="col-12">
                    <button
                      v-if="isContactingUs"
                      disabled
                      class="btn btn-primary w-100 py-3"
                      type="submit"
                    >
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending message...
                    </button>
                    <button
                      v-else
                      :disabled="v$.$errors.length > 0"
                      @click.prevent="submitForm"
                      class="btn btn-primary w-100 py-3"
                      type="submit"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Contact End -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
//Vuelidate for login form validation
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

// Access the store
const store = useStore();

onMounted(() => {
  v$._value.$touch();
});

//form validation with Vuelidate start
const contactForm = ref({
  name: "",
  email: "",
  message: "",
});

const rules = {
  name: { required, minLengthValue: minLength(3) },
  email: { required, email },
  message: {},
};

const v$ = useVuelidate(rules, contactForm);
//form validation with Vuelidate end
let isContactingUs = computed(() => store.state.isContactingUs);
let submitForm = async () => {
  const isFormCorrect = v$._value.$validate;
  if (isFormCorrect) {
    store.dispatch("account/contactUs", contactForm.value);
  }
};
</script>
