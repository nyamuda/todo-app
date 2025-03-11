<template>
  <section class="hero">
    <CarouselSection />
    <!--Info cards mobile-->
    <InfoCards class="d-flex d-md-none" />
    <!-- Info cards desktop -->
    <InfoCards class="container d-none d-md-flex" />
  </section>
</template>

<script setup>
import InfoCards from "./InfoCards.vue";
import CarouselSection from "./CarouselSection.vue";
</script>

<style scoped></style>
