<template>
  <div class="mt-5">
    <div v-if="isAuthenticated">
      <AddMemberBooking />
    </div>
    <div v-else>
      <AddGuestBooking />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import AddMemberBooking from "@/components/Bookings/AddMemberBooking.vue";
import AddGuestBooking from "@/components/Bookings/AddGuestBooking.vue";
const store = useStore();
let isAuthenticated = computed(() => store.state.account.isAuthenticated);

onMounted(() => {
  //get all available car wash services
  store.dispatch("services/getServices");
});
</script>
