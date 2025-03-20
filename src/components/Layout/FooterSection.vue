<template>
  <!-- Footer -->
  <footer class="text-center text-lg-start bg-body-tertiary text-muted">
    <!-- Section: Social media -->
    <section
      class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom"
    >
      <!-- Left -->
      <div class="me-5 d-none d-lg-block">
        <span>Get connected with us on social networks:</span>
      </div>
      <!-- Left -->

      <!-- Right -->
      <div>
        <a href="" class="me-4 text-reset">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="" class="me-4 text-reset">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="" class="me-4 text-reset">
          <i class="fab fa-google"></i>
        </a>
        <a href="" class="me-4 text-reset">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="" class="me-4 text-reset">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="" class="me-4 text-reset">
          <i class="fab fa-github"></i>
        </a>
      </div>
      <!-- Right -->
    </section>
    <!-- Section: Social media -->

    <!-- Section: Links  -->
    <section class="">
      <div class="container text-center text-md-start mt-5">
        <!-- Grid row -->
        <div class="row mt-3">
          <!-- Grid column -->
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <!-- Content -->
            <h6 class="text-uppercase fw-bold mb-4">
              <i class="fas fa-gem me-3"></i>Company name
            </h6>
            <p>
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
                  :to="'/services/' + service.id + '/details'"
                  class="text-reset"
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
            <div class="d-flex justify-content-start align-items-start gap-2">
              <div><i class="fas fa-home"></i></div>
              <div>{{ company?.address }}</div>
            </div>
            <div
              class="d-flex justify-content-start align-items-start gap-2 my-2"
            >
              <div><i class="fas fa-phone"></i></div>
              <div>{{ company?.phone }}</div>
            </div>
            <div class="d-flex justify-content-start align-items-start gap-2">
              <div><i class="fas fa-envelope"></i></div>
              <div>{{ company?.email }}</div>
            </div>
          </div>
          <!-- Grid column -->
        </div>
        <!-- Grid row -->
      </div>
    </section>
    <!-- Section: Links  -->

    <!-- Copyright -->
    <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05)">
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

let store = useStore();

let company = computed(() => store.state.company.companyFacts.company);
let services = computed(() => store.state.services.services);
</script>

<style scoped>
footer {
  margin-top: 5rem;
}
</style>
