<template>
  <div class="container mt-5">
    <TitleSection subtitle="Contact us" title="We’re Here to Help" />

    <!--Contact us section start-->
    <section class="mb-4">
      <!--Section description-->
      <p class="text-start mb-5">
        Have any questions or need assistance? Feel free to reach out with any
        questions or concerns you may have. We strive to provide prompt
        responses, typically within 24 hours on business days.
      </p>

      <div class="row">
        <!--Grid column-->
        <div class="col-md-9 mb-md-0 mb-5">
          <ContactUsItem />
        </div>
        <!--Grid column-->

        <!--Grid column-->
        <div class="col-md-3 text-center">
          <ul class="list-unstyled mb-0">
            <li>
              <i class="fas fa-map-marker-alt fa-2x"></i>
              <p>123 Street, Cape Town, South Africa</p>
            </li>

            <li>
              <i class="fas fa-phone mt-4 fa-2x"></i>
              <p>+27 81 589 6615</p>
            </li>

            <li>
              <i class="fas fa-envelope mt-4 fa-2x"></i>
              <p>ptnrlab@gmail.com</p>
            </li>
          </ul>
        </div>
        <!--Grid column-->
      </div>
    </section>
    <!--Contact us section end-->
  </div>
</template>

<script setup>
import ContactUsItem from "@/components/Common/Contact/ContactUsItem.vue";
import TitleSection from "@/components/Common/Elements/TitleSection.vue";
</script>
