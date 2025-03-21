<template>
  <!-- Footer -->
  <footer class="text-center text-lg-start bg-secondary-light text-light">
    <!-- Section: Links  -->
    <section class="pb-4">
      <div class="container text-center text-md-start mt-5">
        <!-- Grid row -->
        <div class="row mt-3">
          <!-- Grid column -->
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <!-- Content -->
            <h6 class="text-uppercase fw-bold mb-4">
              {{ company?.name }}
            </h6>
            <p class="text-light">
              Here you can use rows and columns to organize your footer content.
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Car Wash Services</h6>

            <div v-for="service in services.slice(0, 3)" :key="service.id">
              <p>
                <router-link
                  class="footer-links text-light"
                  :to="'/services/' + service.id + '/details'"
                  >{{ service.name }}</router-link
                >
              </p>
            </div>
          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
            <div
              class="d-flex justify-content-center justify-content-md-start align-items-start gap-2 text-light"
            >
              <div><i class="fas fa-home"></i></div>
              <div>{{ company?.address }}</div>
            </div>
            <div
              class="d-flex justify-content-center justify-content-md-start align-items-start gap-2 my-2 text-light"
            >
              <div><i class="fas fa-phone"></i></div>
              <div>{{ company?.phone }}</div>
            </div>
            <div
              class="d-flex justify-content-center justify-content-md-start align-items-start gap-2 text-light"
            >
              <div><i class="fas fa-envelope"></i></div>
              <div>{{ company?.email }}</div>
            </div>
            <!-- Section: Social media -->
            <section
              class="d-flex justify-content-center justify-content-md-start align-items-start gap-2 text-light mt-3"
            >
              <Button severity="primary" rounded icon="fab fa-facebook-f" />
              <Button severity="primary" rounded icon="fab fa-instagram" />
              <Button severity="primary" rounded icon="fab fa-linkedin-in" />
            </section>
            <!-- Section: Social media -->
          </div>
          <!-- Grid column -->
        </div>
        <!-- Grid row -->
      </div>
    </section>
    <!-- Section: Links  -->

    <!-- Copyright -->
    <div class="text-center p-4 bg-secondary">
      © 2025 Copyright:
      <a class="text-reset fw-bold" href="https://mdbootstrap.com/"
        >Prioritia</a
      >
    </div>
    <!-- Copyright -->
  </footer>
  <!-- Footer -->
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Button from "primevue/button";

let store = useStore();

let company = computed(() => store.state.company.companyFacts.company);
let services = computed(() => store.state.services.services);
</script>

<style scoped>
footer {
  margin-top: 5rem;
}
.footer-links {
  text-decoration: none;
}
</style>
