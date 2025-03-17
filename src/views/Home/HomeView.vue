<template>
  <div class="home">
    <HeroSection />
    <div class="container">
      <AboutUsSection />
    </div>
    <FactsSection />
    <div class="container">
      <ServicesSection />
      <ChooseUsSection />
    </div>
  </div>
</template>

<script setup>
import HeroSection from "@/components/Home/HeroSection.vue";
import AboutUsSection from "@/components/Home/AboutUsSection.vue";
import ServicesSection from "@/components/Home/ServicesSection.vue";
import FactsSection from "@/components/Home/FactsSection.vue";
import ChooseUsSection from "@/components/Home/ChooseUsSection.vue";
</script>
