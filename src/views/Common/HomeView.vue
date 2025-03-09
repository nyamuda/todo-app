<template>
  <div class="home">
    <CarouselSection />
    <HeroSection />
    <AboutUsSection />
    <ServicesSection />
  </div>
</template>

<script setup>
import HeroSection from "@/components/Common/Home/HeroSection.vue";
import AboutUsSection from "@/components/Common/Home/AboutUsSection.vue";
import ServicesSection from "@/components/Common/Home/ServicesSection.vue";
import CarouselSection from "@/components/Common/Home/CarouselSection.vue";
</script>
