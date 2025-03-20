<template>
  <div class="row flex-row flex-lg-row-reverse mt-5">
    <!-- Image section -->
    <div class="row gx-2 col-lg-6 d-flex mb-5 mb-lg-0">
      <div class="col-6 align-self-start">
        <img
          src="https://images.unsplash.com/photo-1565689876697-e467b6c54da2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Car wash image"
          class="img-fluid rounded"
        />
      </div>
      <div class="col-6 align-self-end">
        <img
          src="https://images.unsplash.com/photo-1558683139-3ee31dae2261?q=80&w=1370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Car wash image"
          class="img-fluid rounded"
        />
      </div>
    </div>
    <!-- Information section -->
    <div class="col-lg-6 d-flex flex-column align-items-start">
      <TitleSection
        subtitle="About us"
        title="Premium Car Care for a Lasting Shine"
      />
      <p>
        Sparkle Auto Wash is a trusted mobile car wash service dedicated to
        delivering high-quality vehicle cleaning at your convenience. Whether
        you need a quick wash or full detailing, we bring professional-grade
        services to your doorstep.
      </p>
      <div
        class="d-flex flex-column-reverse flex-lg-row align-items-start align-items-lg-center mb-4 w-100"
      >
        <div
          class="fact-block d-flex flex-column text-center text-lg-start bg-secondary p-3 mt-3 mt-lg-0 rounded-2 rounded-lg-0"
        >
          <p class="display-3 fw-bold mb-0 text-light">
            {{ companyFacts.totalCompletedBookings }}
          </p>
          <div class="fs-5 fw-bold text-light">
            <p class="mb-0">Cars Washed & Shining</p>
          </div>
        </div>
        <div class="d-flex flex-column align-items-start gap-3 ms-lg-3">
          <div class="d-flex align-items-center">
            <i class="fa-solid fa-circle-check me-2 fs-5 text-primary"></i
            ><span>Premium Hand Wash</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="fa-solid fa-circle-check me-2 fs-5 text-primary"></i
            ><span>Exterior & Interior Detailing</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="fa-solid fa-circle-check me-2 fs-5 text-primary"></i
            ><span>Leather Conditioning</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="fa-solid fa-circle-check me-2 fs-5 text-primary"></i
            ><span>Paint Protection & Waxing</span>
          </div>
        </div>
      </div>
      <div
        class="d-flex flex-column flex-lg-row justify-content-start justify-content-lg-between w-100 gap-3"
      >
        <div v-if="companyFacts.company?.phone" class="card border-0">
          <div class="d-flex justify-content-start align-items-center">
            <span class="rounded-circle bg-primary text-light">
              <i class="fas fa-phone-flip p-3 p-lg-2 p-xl-3"></i>
            </span>
            <div
              class="d-flex flex-column align-items-start ms-3 justify-content-start"
            >
              <p class="card-title text-muted mb-0">Have any questions?</p>
              <p class="card-text fw-bold h5">
                {{ companyFacts.company?.phone }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="companyFacts.company?.email" class="card border-0">
          <div class="d-flex justify-content-start align-items-center">
            <span class="rounded-circle bg-primary text-light">
              <i class="fas fa-envelope p-3 p-lg-2 p-xl-3"></i>
            </span>
            <div
              class="d-flex flex-column align-items-start ms-3 justify-content-start"
            >
              <p class="card-title text-muted mb-0">Email us</p>
              <p class="card-text fw-bold h5">
                {{ companyFacts.company?.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import TitleSection from "../Common/Elements/TitleSection.vue";
import { useStore } from "vuex";

let store = useStore();

let companyFacts = computed(() => store.state.company.companyFacts);
</script>

<style scoped>
.fact-block {
  width: 100%;
}

@media (min-width: 992px) {
  .fact-block {
    width: auto;
  }
}
</style>
