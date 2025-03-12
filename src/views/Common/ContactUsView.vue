<template>
  <div class="container-fluid custom mt-5">
    <TitleSection />
    <p class="mb-4">
      Have any questions or need assistance with your tasks? Feel free to reach
      out to us. Our team is here to help you manage your tasks effectively and
      stay productive.
    </p>
    <p class="mb-4">
      You can use the contact form below to send us a message. We're available
      for inquiries regarding task management, technical support, or feedback
      about the app.
    </p>
    <div class="row row-cols-1 row-cols-md-2">
      <div class="col-md-8">
        <ContactUsItem />
      </div>

      <div class="col-md-4 d-flex align-items-center">
        <img src="" alt="" class="img-fluid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ContactUsItem from "@/components/Common/Contact/ContactUsItem.vue";
import TitleSection from "@/components/Common/Elements/TitleSection.vue";
</script>
