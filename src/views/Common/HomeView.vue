<template>
  <div class="home">
    <HeroSection />
    <div class="container">
      <AboutUsSection />
    </div>
    <StatisticsSection />
    <div class="container">
      <ChooseUsSection />
      <ServicesSection />
    </div>
  </div>
</template>

<script setup>
import HeroSection from "@/components/Common/Home/HeroSection.vue";
import AboutUsSection from "@/components/Common/Home/AboutUsSection.vue";
import ServicesSection from "@/components/Common/Home/ServicesSection.vue";
import StatisticsSection from "@/components/Common/Home/StatisticsSection.vue";
import ChooseUsSection from "@/components/Common/Home/ChooseUsSection.vue";
</script>
