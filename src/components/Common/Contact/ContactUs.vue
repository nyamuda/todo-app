<template>
  <div class="m-auto">
    <!-- Contact Start -->
    <div class="">
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
            <div class="p-md-4 h-100 d-flex align-bookings-center">
              <form @submit.prevent="submitForm">
                <div class="row g-3">
                  <!--Name field-->
                  <div class="col-12">
                    <div class="form-group">
                      <FloatLabel variant="on">
                        <InputText
                          class="w-100"
                          id="contactName"
                          v-model="v$.name.$model"
                          :invalid="v$.name.$error"
                        />
                        <label for="contactName">Your Name</label>
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
                  </div>
                  <!--Email field-->
                  <div class="col-12">
                    <div class="form-group">
                      <FloatLabel variant="on">
                        <InputText
                          class="w-100"
                          id="contactEmail"
                          v-model="v$.email.$model"
                          :invalid="v$.email.$error"
                          type="email"
                        />
                        <label for="contactEmail">Email</label>
                      </FloatLabel>
                      <Message
                        size="small"
                        severity="error"
                        v-if="v$.email.$error"
                        variant="simple"
                      >
                        <div
                          v-for="error of v$.email.$errors"
                          :key="error.$uid"
                        >
                          <div>{{ error.$message }}</div>
                        </div>
                      </Message>
                    </div>
                  </div>
                  <!--Message field-->
                  <div class="col-12">
                    <div class="form-group">
                      <FloatLabel variant="on">
                        <Textarea
                          id="contactMessage"
                          v-model="v$.message.$model"
                          :invalid="v$.message.$error"
                          rows="5"
                          class="w-100"
                          style="resize: none"
                        />
                        <label for="contactMessage">Message</label>
                      </FloatLabel>
                      <Message
                        size="small"
                        severity="error"
                        v-if="v$.message.$error"
                        variant="simple"
                      >
                        <div
                          v-for="error of v$.message.$errors"
                          :key="error.$uid"
                        >
                          <div>{{ error.$message }}</div>
                        </div>
                      </Message>
                    </div>
                  </div>

                  <!--Submit button-->
                  <div class="col-12">
                    <Button
                      fluid
                      type="submit"
                      :label="isContactingUs ? 'Sending message...' : 'Send'"
                      icon="fas fa-paper-plane"
                      :loading="isContactingUs"
                      :disabled="v$.$errors.length > 0 || isContactingUs"
                    />
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
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import { Message } from "primevue";

const router = useRouter();
const toast = useToast();
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
let isContactingUs = computed(() => store.state.account.isContactingUs);
let submitForm = () => {
  const isFormCorrect = v$._value.$validate;
  if (isFormCorrect) {
    store
      .dispatch("account/contactUs", contactForm.value)
      .then((message) => {
        toast.add({
          severity: "success",
          summary: "Email Sent",
          detail: message,
          life: 10000,
        });
        router.push("/");
      })
      .catch((message) => {
        toast.add({
          severity: "error",
          summary: "Error Sending Email",
          detail: message,
          life: 10000,
        });
      });
  }
};
</script>
