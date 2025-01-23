<template>
  <div class="mt-5">
    <div v-if="isAuthenticated">
      <BookLoggedInUser />
    </div>
    <div v-else>
      <BookGuestUser />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import BookLoggedInUser from "@/components/BookingItems/BookLoggedInUser.vue";
import BookGuestUser from "@/components/BookingItems/BookGuestUser.vue";
const store = useStore();
let isAuthenticated = computed(() => store.state.account.isAuthenticated);
</script>
