<template>
  <div class="home">
    <HeroSection />
    <div class="container">
      <AboutUsSection />
      <ServicesSection />
    </div>
  </div>
</template>

<script setup>
import HeroSection from "@/components/Common/Home/HeroSection.vue";
import AboutUsSection from "@/components/Common/Home/AboutUsSection.vue";
import ServicesSection from "@/components/Common/Home/ServicesSection.vue";
</script>
