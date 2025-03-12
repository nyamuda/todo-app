<template>
  <div class="mt-5">
    <TitleSection subtitle="Why Choose Us" title="Precision in Training" />
    <div class="row flex-row flex-lg-row-reverse">
      <!-- Image section -->
      <div class="col-lg-6 d-flex align-items-center justify-content-center">
        <img
          src="@/assets/img/illustrations/illustration_1.png"
          class="img-fluid car-illustration"
          alt="Car image"
        />
      </div>
      <!-- Content section -->
      <div class="col-lg-6 text-start mt-2 mt-lg-0">
        <p>
          We provide access to a team of accomplished instructors who impart not
          only license-focused training but also a comprehensive understanding
          of driving for a lifetime.
        </p>
        <div class="row row-cols-1 row-cols-lg-2">
          <div class="">
            <div class="">
              <h5 class="">
                <i class="fas fa-check icon"></i>
                <span class="fw-bold ms-2">Seasoned Instructors</span>
              </h5>
              <p class="">
                Under our expert guidance, you'll master driving and gain
                unwavering road confidence
              </p>
            </div>
          </div>
          <div class="">
            <div class="">
              <h5 class="">
                <i class="fas fa-check icon"></i>
                <span class="fw-bold ms-2">Affordable fee</span>
              </h5>
              <p class="">
                We offer training that's both high in quality and friendly on
                your wallet.
              </p>
            </div>
          </div>
          <div class="">
            <div class="">
              <h5 class="">
                <i class="fas fa-check icon"></i>
                <span class="fw-bold ms-2">Exam-Centric Approach</span>
              </h5>
              <p class="">
                Our lessons are carefully designed to maximize your readiness
                for parking and road exams.
              </p>
            </div>
          </div>
          <div class="">
            <div class="">
              <h5 class="">
                <i class="fas fa-check icon"></i>
                <span class="fw-bold ms-2">Timing Excellence</span>
              </h5>
              <p class="">
                We take pride in our instructors, who value and respect your
                time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleSection from "../Elements/TitleSection.vue";
</script>
